import React, { useState } from 'react';
import { 
  Lock, 
  CreditCard, 
  CheckCircle2, 
  ShieldCheck, 
  Zap, 
  Check, 
  Clock, 
  Building2, 
  Smartphone,
  Sparkles,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../context/AuthContext';
import { 
  FIXED_MONTHLY_FEE, 
  formatCardNumber, 
  formatExpiry, 
  detectCardBrand,
  processStripePayment,
  StripeCardDetails
} from '../services/stripeService';

interface SubscriptionGateProps {
  onSuccess?: () => void;
}

export const SubscriptionGate: React.FC<SubscriptionGateProps> = ({ onSuccess }) => {
  const { currentUser, renewSubscription } = useAuth();
  
  // Payment tab inside Stripe checkout
  const [stripeMethod, setStripeMethod] = useState<'card' | 'mbway' | 'multibanco'>('card');

  // Card form state
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState(currentUser?.displayName || 'Ricardo Silva');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [phone, setPhone] = useState('923 456 789');

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const cardBrand = detectCardBrand(cardNumber);

  // Quick fill with standard Stripe Test Card
  const handleFillTestCard = () => {
    setCardNumber('4242 4242 4242 4242');
    setCardHolder(currentUser?.displayName || 'Ricardo Silva');
    setExpiry('12/28');
    setCvc('123');
    setErrorMessage(null);
  };

  const handlePayWithStripe = async () => {
    setErrorMessage(null);
    setIsProcessing(true);

    try {
      if (stripeMethod === 'card') {
        const cleanNumber = cardNumber.replace(/\s+/g, '');
        if (cleanNumber.length < 15) {
          throw new Error('Por favor introduz os 16 dígitos do cartão.');
        }
        if (!expiry.includes('/') || expiry.length < 5) {
          throw new Error('Validade do cartão inválida. Formato MM/AA.');
        }
        if (cvc.length < 3) {
          throw new Error('Código CVC de 3 dígitos obrigatório.');
        }

        const [expM, expY] = expiry.split('/');
        const details: StripeCardDetails = {
          cardNumber: cleanNumber,
          cardHolder: cardHolder.trim() || 'Titular do Cartão',
          expiryMonth: expM,
          expiryYear: expY,
          cvc: cvc.trim(),
        };

        await processStripePayment(details, currentUser?.uid || 'client', currentUser?.displayName || 'Atleta');
      } else {
        // Stripe local payment method simulation
        await new Promise((r) => setTimeout(r, 1200));
      }

      await renewSubscription(`Acompanhamento VIP Mensal (${FIXED_MONTHLY_FEE}€ - Stripe)`);
      setIsProcessing(false);
      setShowSuccess(true);
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
      
      setTimeout(() => {
        if (onSuccess) onSuccess();
      }, 1500);

    } catch (err: any) {
      setIsProcessing(false);
      setErrorMessage(err.message || 'Erro ao processar pagamento com a Stripe.');
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="max-w-3xl w-full bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden transition-colors">
        
        {/* Glow backdrop */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 dark:bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-8">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-500 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-7 h-7" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Acesso Reservado a Alunos VIP
          </h2>
          <p className="text-slate-500 dark:text-neutral-400 text-xs sm:text-sm mt-2 leading-relaxed">
            Olá, <strong className="text-slate-900 dark:text-white">{currentUser?.displayName}</strong>. Para acederes aos teus treinos, ementa alimentar e chat direto com o Personal Trainer Sérgio Cunha, regulariza a tua mensalidade.
          </p>

          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-700 dark:text-amber-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>O Coach pode também desbloquear o teu acesso manualmente a qualquer momento.</span>
          </div>
        </div>

        {/* Pricing Plan Highlight: 100€ Fixo com Stripe */}
        <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-slate-50 via-slate-50 to-amber-50/30 dark:from-neutral-950 dark:via-neutral-950 dark:to-neutral-900 border border-amber-500/30 dark:border-indigo-500/40 relative overflow-hidden shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-500 dark:text-indigo-400 border border-indigo-500/30 text-[10px] font-extrabold uppercase tracking-wider">
                  Processado via Stripe
                </span>
                <span className="text-xs text-slate-500 dark:text-neutral-400">Mensalidade Oficial</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
                Acompanhamento VIP com Coach Sérgio Cunha
              </h3>
              <p className="text-xs text-slate-500 dark:text-neutral-400 mt-1 max-w-md">
                Treinos individualizados semanais, ementa e cálculo de macronutrientes, biblioteca de vídeos de exercícios e acompanhamento direto.
              </p>
            </div>

            <div className="text-left sm:text-right shrink-0">
              <div className="flex items-baseline gap-1 sm:justify-end">
                <span className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white font-mono tracking-tight">
                  {FIXED_MONTHLY_FEE} €
                </span>
                <span className="text-xs text-slate-500 dark:text-neutral-400 font-semibold">/mês</span>
              </div>
              <span className="text-[11px] text-emerald-500 font-semibold block mt-0.5">
                Cobrança segura • Sem fidelização
              </span>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-200 dark:border-neutral-800/80 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 dark:text-neutral-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Rotinas e cargas revistas ao domingo</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Ementa nutricional ajustada a cada ciclo</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Tira-dúvidas diário no chat com o Sérgio</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Desbloqueio imediato após pagamento ou pelo Coach</span>
            </div>
          </div>
        </div>

        {/* STRIPE CHECKOUT CONTAINER */}
        <div className="bg-slate-50 dark:bg-neutral-950/80 border border-slate-200 dark:border-neutral-800 rounded-2xl p-6 sm:p-7">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">Pagamento Seguro com Stripe</h4>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-neutral-800 text-slate-700 dark:text-neutral-300">
                  Stripe Elements
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-neutral-400">Cartão de Crédito/Débito, MB WAY ou Multibanco</p>
            </div>

            {/* Payment method selector inside Stripe */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setStripeMethod('card')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition cursor-pointer ${
                  stripeMethod === 'card'
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/25'
                    : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white'
                }`}
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Cartão</span>
              </button>

              <button
                type="button"
                onClick={() => setStripeMethod('mbway')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition cursor-pointer ${
                  stripeMethod === 'mbway'
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/25'
                    : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>MB WAY</span>
              </button>

              <button
                type="button"
                onClick={() => setStripeMethod('multibanco')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition cursor-pointer ${
                  stripeMethod === 'multibanco'
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/25'
                    : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Multibanco</span>
              </button>
            </div>
          </div>

          {/* METHOD: CREDIT / DEBIT CARD VIA STRIPE */}
          {stripeMethod === 'card' && (
            <div className="space-y-4">
              
              {/* Quick Fill Test Card Button */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-100 dark:bg-neutral-900/90 border border-slate-200 dark:border-neutral-800 text-xs">
                <span className="text-slate-600 dark:text-neutral-400">Modo de Teste / Sandbox Stripe:</span>
                <button
                  type="button"
                  onClick={handleFillTestCard}
                  className="px-3 py-1 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 font-bold text-[11px] border border-indigo-500/30 transition cursor-pointer flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
                  <span>Usar Cartão de Teste (4242...)</span>
                </button>
              </div>

              {/* Virtual Card Form */}
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-slate-700 dark:text-neutral-300 block mb-1">
                    Número do Cartão *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      maxLength={19}
                      value={cardNumber}
                      onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                      placeholder="4242 4242 4242 4242"
                      className="w-full bg-white dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-xl pl-4 pr-16 py-2.5 text-slate-900 dark:text-white font-mono text-sm focus:border-indigo-500 focus:outline-none"
                    />
                    <div className="absolute right-3.5 top-2.5 text-xs font-bold uppercase text-slate-400 dark:text-neutral-400 font-mono">
                      {cardBrand !== 'generic' ? cardBrand : 'CARTÃO'}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-1">
                    <label className="text-xs text-slate-700 dark:text-neutral-300 block mb-1">
                      Validade (MM/AA) *
                    </label>
                    <input
                      type="text"
                      maxLength={5}
                      value={expiry}
                      onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                      placeholder="12/28"
                      className="w-full bg-white dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white font-mono text-sm focus:border-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-1">
                    <label className="text-xs text-slate-700 dark:text-neutral-300 block mb-1">
                      CVC / CVV *
                    </label>
                    <input
                      type="text"
                      maxLength={4}
                      value={cvc}
                      onChange={(e) => setCvc(e.target.value.replace(/\D/g, ''))}
                      placeholder="123"
                      className="w-full bg-white dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white font-mono text-sm focus:border-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-1">
                    <label className="text-xs text-slate-700 dark:text-neutral-300 block mb-1">
                      Nome no Cartão *
                    </label>
                    <input
                      type="text"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      placeholder="Nome Apelido"
                      className="w-full bg-white dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-white text-xs focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* METHOD: MB WAY VIA STRIPE */}
          {stripeMethod === 'mbway' && (
            <div className="space-y-3">
              <div className="bg-white dark:bg-neutral-900 p-4 rounded-xl border border-slate-200 dark:border-neutral-800 flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-indigo-500 dark:text-indigo-400 shrink-0" />
                <div className="flex-1">
                  <label className="text-[11px] text-slate-500 dark:text-neutral-400 block mb-0.5">Telemóvel MB WAY (via Stripe)</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="9xx xxx xxx"
                    className="w-full bg-transparent text-slate-900 dark:text-white font-mono text-sm focus:outline-none font-bold"
                  />
                </div>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-neutral-400">
                A Stripe enviará uma confirmação de <strong>{FIXED_MONTHLY_FEE},00 €</strong> diretamente para a tua aplicação MB WAY.
              </p>
            </div>
          )}

          {/* METHOD: MULTIBANCO VIA STRIPE */}
          {stripeMethod === 'multibanco' && (
            <div className="space-y-3">
              <div className="bg-white dark:bg-neutral-900 p-4 rounded-xl border border-slate-200 dark:border-neutral-800 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-neutral-400">Entidade Multibanco Stripe:</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">11249</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-neutral-400">Referência Provisória:</span>
                  <span className="font-mono font-bold text-indigo-600 dark:text-indigo-300">928 341 552</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-neutral-400">Montante:</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white">{FIXED_MONTHLY_FEE},00 €</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-neutral-400">
                A referência Multibanco é gerada e reconciliada automaticamente através da Stripe.
              </p>
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Success Banner */}
          {showSuccess && (
            <div className="mt-4 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Pagamento de {FIXED_MONTHLY_FEE},00 € aprovado com sucesso via Stripe! A desbloquear...</span>
            </div>
          )}

          {/* Pay Button */}
          <button
            type="button"
            onClick={handlePayWithStripe}
            disabled={isProcessing || showSuccess}
            className="w-full mt-6 py-4 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition cursor-pointer"
          >
            {isProcessing ? (
              <span>A comunicar com a Stripe...</span>
            ) : showSuccess ? (
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Mensalidade Ativada!</span>
              </span>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                <span>Subscrever {FIXED_MONTHLY_FEE} € / mês com Stripe</span>
              </>
            )}
          </button>

          {/* Trust badges */}
          <div className="flex items-center justify-center gap-4 mt-5 text-[11px] text-neutral-500">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
              Stripe 256-bit SSL Security
            </span>
            <span>•</span>
            <span>PCI Service Provider Level 1</span>
            <span>•</span>
            <span>Coach Sérgio Cunha</span>
          </div>

        </div>

      </div>
    </div>
  );
};
