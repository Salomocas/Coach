import React, { useState } from 'react';
import { 
  CreditCard, 
  CheckCircle2, 
  AlertCircle, 
  Calendar, 
  Zap, 
  ShieldCheck, 
  Receipt, 
  Download,
  Smartphone,
  Building2,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const ClientSubscriptionView: React.FC = () => {
  const { currentUser, renewSubscription } = useAuth();
  const [isRenewing, setIsRenewing] = useState(false);
  const [successNotice, setSuccessNotice] = useState(false);

  const isActive = currentUser?.subscriptionStatus === 'active';

  const handleManualRenewal = async () => {
    setIsRenewing(true);
    setTimeout(async () => {
      await renewSubscription('Acompanhamento VIP Mensal');
      setIsRenewing(false);
      setSuccessNotice(true);
      setTimeout(() => setSuccessNotice(false), 3000);
    }, 1000);
  };

  const invoices = [
    { id: 'FT-2026-10', date: '2026-10-01', amount: '49,00 €', status: 'Pago', method: 'MB WAY' },
    { id: 'FT-2026-09', date: '2026-09-01', amount: '49,00 €', status: 'Pago', method: 'MB WAY' },
    { id: 'FT-2026-08', date: '2026-08-01', amount: '49,00 €', status: 'Pago', method: 'Cartão de Crédito' },
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      
      {/* Header */}
      <div>
        <span className="text-xs font-semibold text-amber-500 uppercase tracking-wider">
          Gestão de Assinatura & Faturação
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
          Minha Subscrição com o Coach
        </h1>
        <p className="text-xs sm:text-sm text-neutral-400 mt-1">
          Acesso continuado aos serviços de treino, planeamento nutricional e acompanhamento direto do Coach Sérgio Cunha.
        </p>
      </div>

      {successNotice && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Mensalidade renovada com sucesso! A tua assinatura está ativa até ao próximo mês.</span>
        </div>
      )}

      {/* Main Status Card */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2.5">
              <span className={`w-3 h-3 rounded-full ${isActive ? 'bg-emerald-500 shadow-md shadow-emerald-500/50' : 'bg-red-500'}`} />
              <span className="text-xs uppercase font-extrabold tracking-wider text-neutral-400">
                Estado da Assinatura:
              </span>
              <span className={`text-xs font-extrabold px-2 py-0.5 rounded-full ${
                isActive ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'
              }`}>
                {isActive ? 'Ativa & Regularizada' : 'Pendente de Pagamento'}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-white mt-3">
              {currentUser?.subscriptionPlan || 'Acompanhamento VIP Mensal'}
            </h2>
            <p className="text-xs text-neutral-400 mt-1">
              Próxima renovação automática: <strong className="text-white font-mono">{currentUser?.subscriptionValidUntil || '2026-11-06'}</strong>
            </p>
          </div>

          <div className="flex flex-col sm:items-end gap-3">
            <div className="text-left sm:text-right">
              <div className="text-3xl font-extrabold text-white font-mono">49,00 €</div>
              <span className="text-xs text-neutral-400">cobrado mensalmente</span>
            </div>

            <button
              onClick={handleManualRenewal}
              disabled={isRenewing}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-black text-xs font-bold flex items-center gap-2 shadow-lg shadow-amber-500/20 transition"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRenewing ? 'animate-spin' : ''}`} />
              <span>{isActive ? 'Renovar Antecipadamente' : 'Regularizar Mensalidade'}</span>
            </button>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-neutral-800 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="flex items-center gap-2 text-neutral-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Treinos semanais atualizados</span>
          </div>
          <div className="flex items-center gap-2 text-neutral-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Ementa nutricional e cálculo de macros</span>
          </div>
          <div className="flex items-center gap-2 text-neutral-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Chat direto diário com o Sérgio</span>
          </div>
        </div>
      </div>

      {/* Payment Method on file */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-base text-white">Método de Pagamento Preferencial</h3>
            <p className="text-xs text-neutral-400">Usado para a cobrança mensal automática</p>
          </div>
          <ShieldCheck className="w-5 h-5 text-emerald-500" />
        </div>

        <div className="flex items-center justify-between p-4 rounded-2xl bg-neutral-950 border border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white">MB WAY (Débito Direto Autorizado)</div>
              <div className="text-[11px] font-mono text-neutral-400">+351 923 ••• •89</div>
            </div>
          </div>
          <span className="text-[10px] font-bold uppercase px-2.5 py-1 rounded-full bg-neutral-800 text-neutral-300">
            Padrão
          </span>
        </div>
      </div>

      {/* Invoice History */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-base text-white">Recibos & Faturas de Mensalidade</h3>
            <p className="text-xs text-neutral-400">Histórico de pagamentos efetuados</p>
          </div>
          <Receipt className="w-5 h-5 text-amber-500" />
        </div>

        <div className="divide-y divide-neutral-800/80">
          {invoices.map((inv) => (
            <div key={inv.id} className="py-3 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-neutral-950 text-neutral-400">
                  <Receipt className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-white">{inv.id}</div>
                  <div className="text-[11px] text-neutral-500">{inv.date} via {inv.method}</div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="font-mono font-bold text-white">{inv.amount}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20">
                  {inv.status}
                </span>
                <button
                  type="button"
                  title="Descarregar Recibo"
                  className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
