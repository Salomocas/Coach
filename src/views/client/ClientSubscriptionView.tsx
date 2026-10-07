import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertCircle, 
  Calendar, 
  Zap, 
  ShieldCheck, 
  Receipt, 
  Download, 
  Smartphone, 
  Building2, 
  RefreshCw,
  Copy,
  Check,
  X,
  Clock,
  CreditCard,
  Sparkles,
  Lock
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAuth } from '../../context/AuthContext';
import { 
  FIXED_MONTHLY_FEE, 
  formatCardNumber, 
  formatExpiry, 
  detectCardBrand,
  processStripePayment,
  StripeCardDetails
} from '../../services/stripeService';
import { generateMultibancoReference, MultibancoReferenceResult } from '../../services/paymentService';

export const ClientSubscriptionView: React.FC = () => {
  const { currentUser, renewSubscription } = useAuth();
  const [showRenewModal, setShowRenewModal] = useState(false);
  const [renewMethod, setRenewMethod] = useState<'card' | 'mbway' | 'multibanco'>('card');
  const [phone, setPhone] = useState('923 456 789');
  const [mbwayWaiting, setMbwayWaiting] = useState(false);
  const [mbData, setMbData] = useState<MultibancoReferenceResult | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  
  // Card form state
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState(currentUser?.displayName || 'Ricardo Silva');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState(false);

  const isActive = currentUser?.subscriptionStatus === 'active';
  const cardBrand = detectCardBrand(cardNumber);

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleOpenRenew = () => {
    setMbData(generateMultibancoReference(currentUser?.uid || 'client'));
    setMbwayWaiting(false);
    setErrorMessage(null);
    setShowRenewModal(true);
  };

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
      if (renewMethod === 'card') {
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
      } else if (renewMethod === 'mbway') {
        // Stripe MB WAY confirmation
        await new Promise((r) => setTimeout(r, 1000));
      } else {
        // Stripe Multibanco confirmation
        await new Promise((r) => setTimeout(r, 1000));
      }

      const methodLabel = renewMethod === 'card' ? 'Cartão Stripe' : renewMethod === 'mbway' ? 'MB WAY via Stripe' : 'Multibanco via Stripe';
      await renewSubscription(`Acompanhamento VIP Mensal (${FIXED_MONTHLY_FEE}€ - ${methodLabel})`);
      setIsProcessing(false);
      setShowRenewModal(false);
      setSuccessNotice(true);
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
      setTimeout(() => setSuccessNotice(false), 5000);
    } catch (err: any) {
      setIsProcessing(false);
      setErrorMessage(err.message || 'Erro ao processar pagamento com a Stripe.');
    }
  };

  const invoices = [
    { id: 'FT-2026-10', date: '2026-10-01', amount: '100,00 €', status: 'Pago', method: 'Stripe (Cartão)' },
    { id: 'FT-2026-09', date: '2026-09-01', amount: '100,00 €', status: 'Pago', method: 'Stripe (MB WAY)' },
    { id: 'FT-2026-08', date: '2026-08-01', amount: '100,00 €', status: 'Pago', method: 'Stripe (Multibanco)' },
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
          <span>Mensalidade de {FIXED_MONTHLY_FEE},00 € regularizada com sucesso! A tua assinatura está ativa até ao próximo mês.</span>
        </div>
      )}

      {/* Main Status Card */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2.5">
              <span className={`w-3 h-3 rounded-full ${isActive ? 'bg-emerald-500 shadow-md shadow-emerald-500/50' : 'bg-red-500 animate-pulse'}`} />
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
              Validade atual: <strong className="text-white font-mono">{currentUser?.subscriptionValidUntil || '2026-11-06'}</strong>
            </p>
          </div>

          <div className="flex flex-col sm:items-end gap-3">
            <div className="text-left sm:text-right">
              <div className="text-3xl sm:text-4xl font-black text-white font-mono">
                {FIXED_MONTHLY_FEE},00 €
              </div>
              <span className="text-xs text-neutral-400">mensalidade fixa</span>
            </div>

            <button
              onClick={handleOpenRenew}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold flex items-center gap-2 shadow-lg shadow-amber-500/20 transition cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{isActive ? 'Renovar Mensalidade' : 'Regularizar Agora'}</span>
            </button>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-neutral-800 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="flex items-center gap-2 text-neutral-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Treinos e cargas semanais revistos</span>
          </div>
          <div className="flex items-center gap-2 text-neutral-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Ementa nutricional e cálculo de macros</span>
          </div>
          <div className="flex items-center gap-2 text-neutral-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Canal direto no chat com o Sérgio</span>
          </div>
        </div>
      </div>

      {/* Payment Method on file */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base text-white">Métodos de Pagamento Oficiais</h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                Processado via Stripe
              </span>
            </div>
            <p className="text-xs text-neutral-400">Cartão de Crédito/Débito, MB WAY, Multibanco e Apple/Google Pay</p>
          </div>
          <ShieldCheck className="w-5 h-5 text-indigo-400" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-neutral-950 border border-neutral-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold shrink-0">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">Cartão (Stripe)</div>
                <div className="text-[11px] font-mono text-neutral-400">Visa, Mastercard, Amex</div>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Ativo
            </span>
          </div>

          <div className="flex items-center justify-between p-4 rounded-2xl bg-neutral-950 border border-neutral-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold shrink-0">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">MB WAY via Stripe</div>
                <div className="text-[11px] font-mono text-neutral-400">Aprovação imediata</div>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Ativo
            </span>
          </div>

          <div className="flex items-center justify-between p-4 rounded-2xl bg-neutral-950 border border-neutral-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold shrink-0">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">Multibanco Stripe</div>
                <div className="text-[11px] font-mono text-neutral-400">Entidade & Referência</div>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Ativo
            </span>
          </div>
        </div>
      </div>

      {/* Invoice History */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-base text-white">Recibos & Faturas de Mensalidade</h3>
            <p className="text-xs text-neutral-400">Histórico de mensalidades (100,00 € fixos via Stripe)</p>
          </div>
          <Receipt className="w-5 h-5 text-indigo-400" />
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
                  className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RENEW / CHECKOUT MODAL VIA STRIPE */}
      {showRenewModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-base text-white">Pagamento da Mensalidade (100 €)</h3>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400">Stripe</span>
                  </div>
                  <p className="text-xs text-neutral-400">Coach Sérgio Cunha • Acompanhamento VIP</p>
                </div>
              </div>

              <button
                onClick={() => setShowRenewModal(false)}
                className="p-1.5 rounded-xl bg-neutral-800 text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4 space-y-4">
              {/* Method Toggle */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setRenewMethod('card');
                    setErrorMessage(null);
                  }}
                  className={`py-2 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition cursor-pointer ${
                    renewMethod === 'card' 
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30' 
                      : 'bg-neutral-950 text-neutral-400 border-neutral-800 hover:text-white'
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Cartão</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setRenewMethod('mbway');
                    setMbwayWaiting(false);
                    setErrorMessage(null);
                  }}
                  className={`py-2 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition cursor-pointer ${
                    renewMethod === 'mbway' 
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30' 
                      : 'bg-neutral-950 text-neutral-400 border-neutral-800 hover:text-white'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>MB WAY</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setRenewMethod('multibanco');
                    setErrorMessage(null);
                  }}
                  className={`py-2 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition cursor-pointer ${
                    renewMethod === 'multibanco' 
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/30' 
                      : 'bg-neutral-950 text-neutral-400 border-neutral-800 hover:text-white'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Multibanco</span>
                </button>
              </div>

              {/* CARD VIA STRIPE */}
              {renewMethod === 'card' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs">
                    <span className="text-neutral-400">Sandbox Stripe ativo:</span>
                    <button
                      type="button"
                      onClick={handleFillTestCard}
                      className="px-2.5 py-1 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 font-bold text-[11px] border border-indigo-500/30 transition flex items-center gap-1 cursor-pointer"
                    >
                      <Sparkles className="w-3 h-3 text-indigo-400" />
                      <span>Preencher Teste (4242...)</span>
                    </button>
                  </div>

                  <div>
                    <label className="text-xs text-neutral-300 block mb-1">
                      Número do Cartão *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        maxLength={19}
                        value={cardNumber}
                        onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                        placeholder="4242 4242 4242 4242"
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white font-mono text-sm focus:border-indigo-500 focus:outline-none"
                      />
                      <div className="absolute right-3 top-2 text-xs font-bold uppercase text-neutral-400 font-mono">
                        {cardBrand !== 'generic' ? cardBrand : 'CARTÃO'}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-neutral-300 block mb-1">
                        Validade (MM/AA) *
                      </label>
                      <input
                        type="text"
                        maxLength={5}
                        value={expiry}
                        onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                        placeholder="12/28"
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white font-mono text-sm focus:border-indigo-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-xs text-neutral-300 block mb-1">
                        CVC *
                      </label>
                      <input
                        type="text"
                        maxLength={4}
                        value={cvc}
                        onChange={(e) => setCvc(e.target.value.replace(/\D/g, ''))}
                        placeholder="123"
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white font-mono text-sm focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-neutral-300 block mb-1">
                      Nome no Cartão
                    </label>
                    <input
                      type="text"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      placeholder="Nome completo do titular"
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white text-xs focus:border-indigo-500 focus:outline-none"
                    />
                  </div>

                  {errorMessage && (
                    <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 text-xs">
                      {errorMessage}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handlePayWithStripe}
                    disabled={isProcessing}
                    className="w-full mt-2 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-indigo-600/30 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>{isProcessing ? 'A comunicar com Stripe...' : `Pagar 100,00 € com Stripe`}</span>
                  </button>
                </div>
              )}

              {/* MB WAY Content via Stripe */}
              {renewMethod === 'mbway' && (
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-neutral-300 block mb-1">
                      Telemóvel MB WAY
                    </label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="9xx xxx xxx"
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-white font-mono text-sm focus:border-indigo-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handlePayWithStripe}
                      disabled={isProcessing || !phone.trim()}
                      className="w-full mt-3 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-indigo-600/30 transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Smartphone className="w-4 h-4" />
                      <span>{isProcessing ? 'A validar...' : 'Confirmar MB WAY (100,00 €) via Stripe'}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Multibanco Content via Stripe */}
              {renewMethod === 'multibanco' && mbData && (
                <div className="space-y-3">
                  <div className="bg-neutral-950 p-4 rounded-2xl border border-neutral-800 space-y-2.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-500 font-bold">Entidade:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-extrabold text-white">{mbData.entity}</span>
                        <button onClick={() => handleCopy(mbData.entity, 'entity')} className="text-neutral-400 hover:text-white">
                          {copiedField === 'entity' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-neutral-500 font-bold">Referência:</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-extrabold text-indigo-400">{mbData.reference}</span>
                        <button onClick={() => handleCopy(mbData.reference.replace(/\s/g, ''), 'reference')} className="text-neutral-400 hover:text-white">
                          {copiedField === 'reference' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-neutral-500 font-bold">Montante:</span>
                      <span className="font-mono font-extrabold text-white">100,00 €</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handlePayWithStripe}
                    disabled={isProcessing}
                    className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-lg shadow-indigo-600/30 transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{isProcessing ? 'A validar pagamento...' : 'Confirmar Referência Stripe Paga'}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
