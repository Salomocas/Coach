import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import nodemailer, { type Transporter } from 'nodemailer';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

interface SMTPConfig {
  host?: string;
  port?: number;
  secure?: boolean;
  user?: string;
  pass?: string;
  fromName?: string;
  fromEmail?: string;
}

// In-memory or fallback cache for runtime custom SMTP config (if configured by coach via UI)
let customRuntimeSMTP: SMTPConfig | null = null;

function getActiveSMTPConfig(reqBodyConfig?: SMTPConfig): {
  configured: boolean;
  transporter: Transporter | null;
  fromAddress: string;
  details: {
    host: string;
    port: number;
    secure: boolean;
    user: string;
    fromEmail: string;
    fromName: string;
    source: 'custom_request' | 'runtime_saved' | 'env_vars' | 'unconfigured';
  };
} {
  const host = reqBodyConfig?.host || customRuntimeSMTP?.host || process.env.SMTP_HOST || '';
  const port = Number(reqBodyConfig?.port || customRuntimeSMTP?.port || process.env.SMTP_PORT || 587);
  const secure = (reqBodyConfig?.secure !== undefined) 
    ? Boolean(reqBodyConfig.secure) 
    : (customRuntimeSMTP?.secure !== undefined)
      ? Boolean(customRuntimeSMTP.secure)
      : (process.env.SMTP_SECURE === 'true' || port === 465);
  const user = reqBodyConfig?.user || customRuntimeSMTP?.user || process.env.SMTP_USER || '';
  const pass = reqBodyConfig?.pass || customRuntimeSMTP?.pass || process.env.SMTP_PASS || '';
  const fromName = reqBodyConfig?.fromName || customRuntimeSMTP?.fromName || process.env.SMTP_FROM_NAME || 'Coach Cunha';
  const fromEmail = reqBodyConfig?.fromEmail || customRuntimeSMTP?.fromEmail || process.env.SMTP_FROM_EMAIL || user || 'noreply@coachcunha.pt';

  const source = reqBodyConfig?.host 
    ? 'custom_request' 
    : (customRuntimeSMTP?.host ? 'runtime_saved' : (process.env.SMTP_HOST ? 'env_vars' : 'unconfigured'));

  if (!host || !user || !pass) {
    return {
      configured: false,
      transporter: null,
      fromAddress: `"${fromName}" <${fromEmail}>`,
      details: { host, port, secure, user, fromEmail, fromName, source }
    };
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass
    },
    // Useful fallback for self-signed certificates or test servers
    tls: {
      rejectUnauthorized: false
    }
  });

  return {
    configured: true,
    transporter,
    fromAddress: `"${fromName}" <${fromEmail}>`,
    details: { host, port, secure, user, fromEmail, fromName, source }
  };
}

// -------------------------------------------------------------
// API ENDPOINTS FOR SMTP & EMAIL DELIVERY
// -------------------------------------------------------------

// 1. Get SMTP Status (without leaking passwords)
app.get('/api/smtp/status', (req: Request, res: Response) => {
  const active = getActiveSMTPConfig();
  res.json({
    configured: active.configured,
    source: active.details.source,
    host: active.details.host || null,
    port: active.details.port,
    secure: active.details.secure,
    user: active.details.user ? `${active.details.user.substring(0, 3)}***` : null,
    fromEmail: active.details.fromEmail,
    fromName: active.details.fromName
  });
});

// 2. Test SMTP Connection
app.post('/api/smtp/verify-connection', async (req: Request, res: Response) => {
  try {
    const config = getActiveSMTPConfig(req.body);
    if (!config.configured || !config.transporter) {
      return res.status(400).json({
        success: false,
        message: 'Serviço SMTP não está configurado. Preenche o Servidor Host, Utilizador e Palavra-passe.'
      });
    }

    await config.transporter.verify();
    
    // If the user sent test credentials and requested to save in runtime:
    if (req.body.saveToRuntime) {
      customRuntimeSMTP = {
        host: req.body.host,
        port: Number(req.body.port),
        secure: Boolean(req.body.secure),
        user: req.body.user,
        pass: req.body.pass,
        fromName: req.body.fromName,
        fromEmail: req.body.fromEmail
      };
    }

    res.json({
      success: true,
      message: 'Conexão ao servidor SMTP validada com sucesso! Pronto a enviar e-mails.'
    });
  } catch (error: any) {
    console.error('[SMTP VERIFY ERROR]:', error);
    res.status(500).json({
      success: false,
      message: `Erro na autenticação SMTP: ${error.message || 'Falha de ligação ao servidor'}`
    });
  }
});

// 3. Save SMTP Runtime settings (from Coach Panel or Settings Modal)
app.post('/api/smtp/config', (req: Request, res: Response) => {
  try {
    const { host, port, secure, user, pass, fromName, fromEmail } = req.body;
    customRuntimeSMTP = {
      host: host ? String(host).trim() : undefined,
      port: port ? Number(port) : 587,
      secure: Boolean(secure),
      user: user ? String(user).trim() : undefined,
      pass: pass ? String(pass).trim() : undefined,
      fromName: fromName ? String(fromName).trim() : 'Coach Cunha',
      fromEmail: fromEmail ? String(fromEmail).trim() : undefined
    };

    res.json({
      success: true,
      message: 'Configurações SMTP guardadas no servidor.'
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// 4. Send Verification Code Email (Used on Sign-Up)
app.post('/api/smtp/send-verification-code', async (req: Request, res: Response) => {
  const { to, code, name } = req.body;

  if (!to || !code) {
    return res.status(400).json({
      success: false,
      message: 'Destinatário (to) e Código (code) são obrigatórios.'
    });
  }

  const active = getActiveSMTPConfig();

  // If no SMTP is configured in server env or runtime, reply with unconfigured flag
  if (!active.configured || !active.transporter) {
    return res.json({
      success: false,
      smtpConfigured: false,
      code,
      message: 'Serviço SMTP não está configurado no servidor. O código foi gerado e está pronto a preencher.'
    });
  }

  try {
    const recipientName = name ? String(name).trim() : 'Atleta';
    const recipientEmail = String(to).trim().toLowerCase();

    const mailOptions = {
      from: active.fromAddress,
      to: recipientEmail,
      subject: `Código de Confirmação: ${code} - Coach Cunha`,
      text: `Olá ${recipientName},\n\nO teu código de verificação para a plataforma Coach Cunha é: ${code}\n\nIntroduz este código no ecrã de registo para validar a tua conta.\n\nCom os melhores cumprimentos,\nCoach Cunha & Equipa`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0a0a0a; color: #ffffff; margin: 0; padding: 20px; }
            .container { max-width: 520px; margin: 0 auto; background: #141414; border: 1px solid #27272a; border-radius: 16px; overflow: hidden; }
            .header { background: #000000; padding: 28px 24px; text-align: center; border-bottom: 2px solid #eab308; }
            .brand { font-size: 20px; font-weight: 900; letter-spacing: 2px; color: #ffffff; text-transform: uppercase; }
            .brand span { color: #eab308; }
            .content { padding: 32px 24px; text-align: center; }
            .title { font-size: 20px; font-weight: 700; margin-bottom: 12px; color: #ffffff; }
            .subtitle { font-size: 14px; color: #a1a1aa; line-height: 1.5; margin-bottom: 24px; }
            .code-box { background: #09090b; border: 2px dashed #eab308; border-radius: 12px; padding: 18px; margin: 20px auto; max-width: 280px; }
            .code { font-family: monospace; font-size: 32px; font-weight: 900; letter-spacing: 8px; color: #eab308; display: block; }
            .validity { font-size: 12px; color: #71717a; margin-top: 16px; }
            .footer { background: #0c0c0d; padding: 16px; text-align: center; font-size: 11px; color: #52525b; border-top: 1px solid #1f1f23; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="brand">COACH <span>CUNHA</span></div>
            </div>
            <div class="content">
              <h1 class="title">Validação da tua Conta</h1>
              <p class="subtitle">Olá <strong>${recipientName}</strong>, bem-vindo à equipa! Para ativares o teu acesso, introduz o código de segurança abaixo no ecrã de registo:</p>
              
              <div class="code-box">
                <span class="code">${code}</span>
              </div>

              <p class="validity">Este código expira em 15 minutos. Se não solicitaste este registo, podes ignorar esta mensagem com total segurança.</p>
            </div>
            <div class="footer">
              &copy; ${new Date().getFullYear()} Coach Cunha Team &bull; Todos os direitos reservados.
            </div>
          </div>
        </body>
        </html>
      `
    };

    const info = await active.transporter.sendMail(mailOptions);
    console.log(`[SMTP SUCCESS] E-mail enviado com sucesso para ${recipientEmail}! MessageID: ${info.messageId}`);

    return res.json({
      success: true,
      smtpConfigured: true,
      messageId: info.messageId,
      message: `Código enviado com sucesso para a tua caixa de correio: ${recipientEmail}`
    });
  } catch (err: any) {
    console.error('[SMTP SEND ERROR]:', err);
    return res.status(500).json({
      success: false,
      smtpConfigured: true,
      code,
      message: `Falha no envio por SMTP: ${err.message || 'Erro desconhecido'}`
    });
  }
});

// -------------------------------------------------------------
// VITE DEV SERVER OR STATIC PRODUCTION BUILD
// -------------------------------------------------------------
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile('dist/index.html', { root: '.' });
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`> Full-stack server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
