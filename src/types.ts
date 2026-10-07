export type UserRole = 'client' | 'coach';
export type SubscriptionStatus = 'active' | 'pending' | 'expired' | 'trial';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: UserRole;
  subscriptionStatus: SubscriptionStatus;
  subscriptionPlan?: string;
  subscriptionValidUntil?: string;
  coachId?: string;
  phone?: string;
  goals?: string;
  heightCm?: number;
  initialWeightKg?: number;
  currentWeightKg?: number;
  createdAt: string;
  updatedAt?: string;
}

export interface Exercise {
  id: string;
  coachId: string;
  name: string;
  category: 'Peito' | 'Costas' | 'Pernas' | 'Ombros' | 'Braços' | 'Core' | 'Cardio' | 'Mobilidade';
  muscleGroup: string;
  videoUrl?: string;
  imageUrl?: string;
  instructions: string;
  equipment?: string;
  createdAt: string;
}

export interface WorkoutSet {
  setNumber: number;
  reps: string;
  targetWeightKg?: number;
  restSeconds?: number;
  completed?: boolean;
  loggedWeightKg?: number;
  loggedReps?: string;
}

export interface DayExercise {
  exerciseId: string;
  exerciseName: string;
  sets: WorkoutSet[];
  notes?: string;
  videoUrl?: string;
  imageUrl?: string;
  muscleGroup?: string;
}

export interface DayWorkout {
  dayOfWeek: 'Segunda-feira' | 'Terça-feira' | 'Quarta-feira' | 'Quinta-feira' | 'Sexta-feira' | 'Sábado' | 'Domingo';
  dayIndex: number; // 0 to 6
  name: string;
  isRestDay: boolean;
  exercises: DayExercise[];
  focusArea?: string;
}

export interface WorkoutPlan {
  id: string;
  clientId: string;
  clientName: string;
  coachId: string;
  title: string;
  weekNumber?: number;
  weekStartDate: string;
  weekEndDate: string;
  status: 'active' | 'archived' | 'draft';
  days: DayWorkout[];
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface WorkoutLogEntry {
  id: string;
  clientId: string;
  workoutPlanId?: string;
  exerciseId: string;
  exerciseName: string;
  dayOfWeek: string;
  date: string;
  sets: {
    setNumber: number;
    reps: string;
    weightKg: number;
    completed: boolean;
  }[];
  notes?: string;
  completed: boolean;
  createdAt: string;
}

export interface FoodItem {
  item: string;
  quantity: string;
  notes?: string;
}

export interface Meal {
  id: string;
  name: string;
  time: string;
  category?: 'Pequeno-Almoço' | 'Almoço' | 'Lanche' | 'Jantar' | 'Ceia' | 'Pré/Pós-Treino';
  description?: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  foods: FoodItem[];
}

export interface DayNutrition {
  dayOfWeek: 'Segunda-feira' | 'Terça-feira' | 'Quarta-feira' | 'Quinta-feira' | 'Sexta-feira' | 'Sábado' | 'Domingo';
  dayIndex: number;
  meals: Meal[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  waterIntakeLiters: number;
  notes?: string;
}

export interface NutritionPlan {
  id: string;
  clientId: string;
  clientName: string;
  coachId: string;
  title: string;
  weekNumber?: number;
  weekStartDate: string;
  weekEndDate: string;
  dailyCalories: number;
  days: DayNutrition[];
  isTemplate?: boolean;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface NutritionTemplate {
  id: string;
  coachId: string;
  title: string;
  description: string;
  dailyCalories: number;
  macros: {
    protein: number;
    carbs: number;
    fat: number;
  };
  days: DayNutrition[];
  createdAt: string;
}

export interface ProgressLog {
  id: string;
  clientId: string;
  date: string;
  weightKg: number;
  bodyFatPercent?: number;
  chestCm?: number;
  waistCm?: number;
  hipsCm?: number;
  armCm?: number;
  thighCm?: number;
  photoFront?: string;
  photoSide?: string;
  photoBack?: string;
  notes?: string;
  createdAt: string;
}

export interface Message {
  id: string;
  clientId: string;
  coachId: string;
  senderId: string;
  senderRole: UserRole;
  senderName: string;
  text: string;
  read: boolean;
  createdAt: string;
}

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'workout' | 'nutrition' | 'chat' | 'subscription' | 'system';
  read: boolean;
  link?: string;
  createdAt: string;
}

export interface Invoice {
  id: string;
  clientId: string;
  clientName: string;
  amount: number; // 100
  currency: string; // EUR
  description: string;
  paymentMethod: 'stripe' | 'mbway' | 'multibanco' | 'manual';
  status: 'paid' | 'pending' | 'expired';
  last4?: string;
  cardBrand?: string;
  stripePaymentIntentId?: string;
  phone?: string;
  entity?: string;
  reference?: string;
  paidAt?: string;
  createdAt: string;
}

export interface PaymentGatewayConfig {
  provider: 'stripe' | 'ifthenpay' | 'eupago';
  stripePublishableKey?: string;
  stripeSecretKey?: string;
  stripeWebhookSecret?: string;
  mbwayKey?: string;
  multibancoEntity?: string;
  multibancoSubEntity?: string;
  antiPhishingKey?: string;
}
