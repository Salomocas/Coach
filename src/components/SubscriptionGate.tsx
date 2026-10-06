import React, { useState } from 'react';
import { 
  Lock, 
  CreditCard, 
  CheckCircle2, 
  ShieldCheck, 
  Zap, 
  Smartphone, 
  Building2,
  Calendar,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface SubscriptionGateProps {
  onSuccess?: () => void;
}

export const SubscriptionGate: React.FC<SubscriptionGateProps> = ({ onSuccess }) => {
  const { currentUser, renewSubscription } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'quarterly' | 'semiannual'>('monthly');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'mbway' | 'multibanco'>('mbway');
  const [phone, setPhone] = useState('923 456 789');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const plans = [
    {
      id: 'monthly',
      name: 'Mensalidade VIP',
      price: '49€',
      period: '/mês',
      description: 'Acompanhamento contínuo individual com treino e nutrição personalizados.',
      features: [
        'Acesso total à app e biblioteca de vídeos',
        'Plano de treino semanal com registo de cargas',
        'Ementa nutricional e cálculo de macros',
        'Chat direto diário com Coach Sérgio Cunha',
        'Renovação mensal automática sem fidelização'
      ],
      popular: false
    },
    {
      id: 'quarterly',
      name: 'Trimestral Performance',
      price: '129€',
      period: '/3 meses',
      saving: 'Poupe 18€',
      description: 'O plano recomendado para transformações físicas visíveis e sustentáveis.',
      features: [
        'Tudo incluído no plano Mensal',
        'Reavaliações físicas quinzenais com fotos',
        'Ajuste prioritário de ementas e cargas',
        'Recomendações avançadas de suplementação',
        'Suporte direto de resposta rápida'
      ],
      popular: true
    },
    {
      id: 'semiannual',
      name: 'Semestral Elite',
      price: '239€',
      period: '/6 meses',
      saving: 'Poupe 55€',
      description: 'Compromisso a médio prazo para atletas com objetivos competitivos ou desafiantes.',
      features: [
        'Tudo incluído nos planos anteriores',
        'Periodização avançada de força e hipertrofia',
        'Consultoria de recuperação e mobilidade',
        'Contacto direto prioritário 7 dias/semana'
      ],
      popular: false
    }
  ];

  const handlePay = async () => {
    setIsProcessing(true);
    // Simulate real gateway confirmation
    setTimeout(async () => {
      const planObj = plans.find(p => p.id === selectedPlan);
      await renewSubscription(planObj ? planObj.name : 'Acompanhamento VIP');
      setIsProcessing(false);
      setShowSuccess(true);
      setTimeout(() => {
        if (onSuccess) onSuccess();
      }, 1200);
    }, 1000);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        
        {/* Glow backdrop */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-8">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-500 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-7 h-7" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Acesso Reservado a Alunos com Mensalidade Ativa
          </h2>
          <p className="text-neutral-400 text-sm mt-2">
            Olá, <strong className="text-neutral-200">{currentUser?.displayName}</strong>. A tua subscrição com o Personal Trainer Sérgio Cunha encontra-se pendente de regularização para aceder aos planos de treino e nutrição.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {plans.map((p) => {
            const isSelected = selectedPlan === p.id;
            return (
              <div
                key={p.id}
                onClick={() => setSelectedPlan(p.id as any)}
                className={`relative p-5 rounded-2xl cursor-pointer border transition-all ${
                  isSelected 
                    ? 'bg-neutral-800 border-amber-500 ring-2 ring-amber-500/30' 
                    : 'bg-neutral-950/60 border-neutral-800 hover:border-neutral-700'
                }`}
              >
                {p.popular && (
                  <span className="absolute -top-3 right-4 bg-amber-500 text-black text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    Mais Popular
                  </span>
                )}
                {p.saving && !p.popular && (
                  <span className="absolute -top-3 right-4 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {p.saving}
                  </span>
                )}

                <div className="font-bold text-white text-base">{p.name}</div>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-white">{p.price}</span>
                  <span className="text-xs text-neutral-400">{p.period}</span>
                </div>
                <p className="text-xs text-neutral-400 mt-2 min-h-[32px]">{p.description}</p>

                <ul className="mt-4 space-y-2 border-t border-neutral-800/80 pt-4 text-xs">
                  {p.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2 text-neutral-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Payment Methods and Action */}
        <div className="bg-neutral-950/80 border border-neutral-800 rounded-2xl p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-5">
            <div>
              <h4 className="font-bold text-white text-sm">Método de Pagamento Automático</h4>
              <p className="text-xs text-neutral-400">Processamento encriptado e ativação em tempo real</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('mbway')}
                className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition ${
                  paymentMethod === 'mbway' 
                    ? 'bg-amber-500 text-black border-amber-500' 
                    : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white'
                }`}
              >
                <Smartphone className="w-4 h-4" />
                MB WAY
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition ${
                  paymentMethod === 'card' 
                    ? 'bg-amber-500 text-black border-amber-500' 
                    : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                Cartão
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('multibanco')}
                className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition ${
                  paymentMethod === 'multibanco' 
                    ? 'bg-amber-500 text-black border-amber-500' 
                    : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white'
                }`}
              >
                <Building2 className="w-4 h-4" />
                Multibanco
              </button>
            </div>
          </div>

          {paymentMethod === 'mbway' && (
            <div className="mb-5 bg-neutral-900 p-4 rounded-xl border border-neutral-800 flex items-center gap-3">
              <Smartphone className="w-5 h-5 text-amber-500" />
              <div className="flex-1">
                <label className="text-[11px] text-neutral-400 block">Número de Telemóvel MB WAY</label>
                <input 
                  type="text" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="9xx xxx xxx"
                  className="bg-transparent text-white font-mono text-sm focus:outline-none w-full"
                />
              </div>
              <span className="text-[11px] text-neutral-500">Notificação na app MB WAY</span>
            </div>
          )}

          {paymentMethod === 'multibanco' && (
            <div className="mb-5 bg-neutral-900 p-4 rounded-xl border border-neutral-800 text-xs text-neutral-300 grid grid-cols-3 gap-2">
              <div>
                <span className="text-[10px] text-neutral-500 block">Entidade</span>
                <span className="font-mono font-bold text-white">21234</span>
              </div>
              <div>
                <span className="text-[10px] text-neutral-500 block">Referência</span>
                <span className="font-mono font-bold text-white">982 716 331</span>
              </div>
              <div>
                <span className="text-[10px] text-neutral-500 block">Valor</span>
                <span className="font-mono font-bold text-amber-400">
                  {plans.find(p => p.id === selectedPlan)?.price}
                </span>
              </div>
            </div>
          )}

          {/* Pay Button */}
          <button
            onClick={handlePay}
            disabled={isProcessing || showSuccess}
            className="w-full py-3.5 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all disabled:opacity-50"
          >
            {isProcessing ? (
              <span>A processar autorização segura...</span>
            ) : showSuccess ? (
              <span className="flex items-center gap-2 text-black">
                <CheckCircle2 className="w-4 h-4" />
                Subscrição Ativada com Sucesso! A redirecionar...
              </span>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                <span>Subscrever & Desbloquear Acesso Completo ao Treino</span>
              </>
            )}
          </button>

          <div className="flex items-center justify-center gap-4 mt-4 text-[11px] text-neutral-500">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              Encriptação SSL 256-bit
            </span>
            <span>•</span>
            <span>Cancela a qualquer momento</span>
            <span>•</span>
            <span>Coach Sérgio Cunha</span>
          </div>
        </div>

      </div>
    </div>
  );
};
