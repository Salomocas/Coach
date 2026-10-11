import { 
  Exercise, 
  WorkoutPlan, 
  NutritionPlan, 
  NutritionTemplate, 
  ProgressLog, 
  Message, 
  UserProfile, 
  Meal,
  DailyWorkoutTemplate,
  WeeklyWorkoutTemplate,
  DailyMealTemplate,
  WeeklyMealTemplate,
  CustomMetricDefinition,
  MealAdherenceLog
} from './types';

export const COACH_PROFILE: UserProfile = {
  uid: 'coach-sergio-cunha',
  email: 'sgpmcunha@gmail.com',
  displayName: 'Sérgio Cunha',
  photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  role: 'coach',
  subscriptionStatus: 'active',
  subscriptionPlan: 'Plano Treinador Pro',
  phone: '+351 912 345 678',
  createdAt: '2026-01-01',
};

export const ADMIN_PROFILE: UserProfile = {
  uid: 'admin-super-master',
  email: 'admin@cunhaproject.com',
  displayName: 'Administrador Master',
  photoURL: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
  role: 'admin',
  subscriptionStatus: 'active',
  subscriptionPlan: 'Super Administrador (Acesso Total)',
  phone: '+351 900 000 001',
  createdAt: '2026-01-01',
};

export const INITIAL_CLIENTS: UserProfile[] = [
  {
    uid: 'client-ricardo-silva',
    email: 'ricardo.silva@exemplo.pt',
    displayName: 'Ricardo Silva',
    photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    role: 'client',
    subscriptionStatus: 'active',
    subscriptionPlan: 'Acompanhamento VIP Mensal',
    subscriptionValidUntil: '2026-11-06',
    coachId: 'coach-sergio-cunha',
    phone: '+351 923 456 789',
    goals: 'Hipertrofia muscular com redução de massa gorda (-5kg de gordura, +2kg massa magra).',
    heightCm: 178,
    initialWeightKg: 84.5,
    currentWeightKg: 79.8,
    createdAt: '2026-08-15',
  },
  {
    uid: 'client-marta-pereira',
    email: 'marta.pereira@exemplo.pt',
    displayName: 'Marta Pereira',
    photoURL: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    role: 'client',
    subscriptionStatus: 'active',
    subscriptionPlan: 'Acompanhamento Trimestral',
    subscriptionValidUntil: '2026-12-15',
    coachId: 'coach-sergio-cunha',
    phone: '+351 934 567 890',
    goals: 'Tonificação geral, aumento de glúteos e melhoria da capacidade cardiovascular.',
    heightCm: 165,
    initialWeightKg: 63.0,
    currentWeightKg: 60.5,
    createdAt: '2026-09-01',
  },
  {
    uid: 'client-diogo-costa',
    email: 'diogo.costa@exemplo.pt',
    displayName: 'Diogo Costa',
    photoURL: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    role: 'client',
    subscriptionStatus: 'expired',
    subscriptionPlan: 'Acompanhamento VIP Mensal',
    subscriptionValidUntil: '2026-10-01',
    coachId: 'coach-sergio-cunha',
    phone: '+351 915 678 123',
    goals: 'Preparação para prova de atletismo e ganho de força explosiva.',
    heightCm: 182,
    initialWeightKg: 77.0,
    currentWeightKg: 76.2,
    createdAt: '2026-07-10',
  }
];

export const INITIAL_EXERCISES: Exercise[] = [
  {
    id: 'ex-supino-reto',
    coachId: 'coach-sergio-cunha',
    name: 'Supino Reto com Barra',
    category: 'Peito',
    muscleGroup: 'Peitoral Maior, Deltoide Anterior, Tríceps',
    videoUrl: 'https://www.youtube.com/watch?v=rT7DgCr-3pg',
    imageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=600&q=80',
    instructions: 'Deita-te no banco com os olhos alinhados com a barra. Pega na barra com pegada ligeiramente mais larga que os ombros. Retrai as omoplatas, desce a barra de forma controlada até à linha média do peito e empurra com força mantendo os cotovelos a ~45 graus.',
    equipment: 'Barra Olímpica e Banco Plano',
    createdAt: '2026-08-01',
  },
  {
    id: 'ex-agachamento-livre',
    coachId: 'coach-sergio-cunha',
    name: 'Agachamento Livre com Barra',
    category: 'Pernas',
    muscleGroup: 'Quadríceps, Glúteos, Isquiotibiais, Core',
    videoUrl: 'https://www.youtube.com/watch?v=bEv6CCg2BC8',
    imageUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=600&q=80',
    instructions: 'Posiciona a barra no trapézio superior. Pés afastados à largura dos ombros, ligeiramente apontados para fora. Inspira e cria pressão intra-abdominal. Desce quebrando a anca e joelhos em simultâneo até passar os 90 graus. Sobe empurrando o chão através de todo o pé.',
    equipment: 'Rack de Agachamento e Barra',
    createdAt: '2026-08-01',
  },
  {
    id: 'ex-puxada-polia',
    coachId: 'coach-sergio-cunha',
    name: 'Puxada Aberta na Polia Alta',
    category: 'Costas',
    muscleGroup: 'Grande Dorsal, Redondo Maior, Bíceps',
    videoUrl: 'https://www.youtube.com/watch?v=CAwf7n6Luuc',
    imageUrl: 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?auto=format&fit=crop&w=600&q=80',
    instructions: 'Senta-te na máquina ajustando o rolo nas coxas. Pegada larga pronada. Inclina ligeiramente o tronco para trás (~15 graus). Puxa a barra em direção à parte superior do peito puxando os cotovelos para baixo e para trás. Controla a fase excêntrica até alongar totalmente o dorsal.',
    equipment: 'Máquina de Polia Alta / Lat Pulldown',
    createdAt: '2026-08-02',
  },
  {
    id: 'ex-elevacao-lateral',
    coachId: 'coach-sergio-cunha',
    name: 'Elevação Lateral com Halteres',
    category: 'Ombros',
    muscleGroup: 'Deltoide Lateral',
    videoUrl: 'https://www.youtube.com/watch?v=3VcKaXpzqRo',
    imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=600&q=80',
    instructions: 'Em pé, com os pés à largura da anca e halteres ao lado do corpo. Mantém uma leve flexão nos cotovelos. Eleva os halteres para os lados no plano da omoplata até à altura dos ombros. Foca em liderar o movimento com os cotovelos sem usar balanço do tronco.',
    equipment: 'Halteres',
    createdAt: '2026-08-03',
  },
  {
    id: 'ex-hip-thrust',
    coachId: 'coach-sergio-cunha',
    name: 'Hip Thrust com Barra',
    category: 'Pernas',
    muscleGroup: 'Glúteo Máximo, Isquiotibiais',
    videoUrl: 'https://www.youtube.com/watch?v=SEdqd1n0cvg',
    imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=600&q=80',
    instructions: 'Apoia a parte inferior das omoplatas na borda do banco. Coloca a barra almofadada sobre a cintura pélvica. Pés apoiados firmemente no chão formando 90 graus no topo do movimento. Eleva a anca até alinhar com o tronco, contraindo fortemente os glúteos por 1 segundo no topo.',
    equipment: 'Banco Plano e Barra com Protetor',
    createdAt: '2026-08-03',
  },
  {
    id: 'ex-peso-morto-romeno',
    coachId: 'coach-sergio-cunha',
    name: 'Peso Morto Romeno (RDL)',
    category: 'Pernas',
    muscleGroup: 'Isquiotibiais, Glúteos, Eretores da Espinha',
    videoUrl: 'https://www.youtube.com/watch?v=jEy_czb3RKA',
    imageUrl: 'https://images.unsplash.com/photo-1534367507873-d2d7e24c797f?auto=format&fit=crop&w=600&q=80',
    instructions: 'Inicia em pé segurando a barra com pegada pronada. Joelhos ligeiramente destravados. Empurra a anca para trás mantendo a coluna totalmente neutra e a barra próxima das pernas. Desce até sentir um forte alongamento nos isquiotibiais e retorna estendendo a anca.',
    equipment: 'Barra Olímpica',
    createdAt: '2026-08-04',
  },
  {
    id: 'ex-triceps-corda',
    coachId: 'coach-sergio-cunha',
    name: 'Tríceps na Polia com Corda',
    category: 'Braços',
    muscleGroup: 'Tríceps Braquial (Cabeça Lateral e Medial)',
    videoUrl: 'https://www.youtube.com/watch?v=vB5OHsJ3EME',
    imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=600&q=80',
    instructions: 'Prende o acessório de corda na polia alta. Fixa os cotovelos junto às costelas. Estende os braços para baixo separando as pontas da corda na parte inferior da contração. Controla o retorno até o antebraço ultrapassar os 90 graus sem mover os cotovelos.',
    equipment: 'Polia com Corda',
    createdAt: '2026-08-05',
  },
  {
    id: 'ex-biceps-inclinado',
    coachId: 'coach-sergio-cunha',
    name: 'Curl Bíceps no Banco Inclinado',
    category: 'Braços',
    muscleGroup: 'Bíceps Braquial (Cabeça Longa)',
    videoUrl: 'https://www.youtube.com/watch?v=soxrZlIl35U',
    imageUrl: 'https://images.unsplash.com/photo-1581009137042-c552e485697a?auto=format&fit=crop&w=600&q=80',
    instructions: 'Regula o banco a ~60 graus de inclinação. Deita-te com os braços totalmente estendidos na vertical para maximizar o alongamento do bíceps. Flexiona os cotovelos supinando as mãos até à contração total no topo. Desce de forma controlada em 3 segundos.',
    equipment: 'Banco Inclinado e Halteres',
    createdAt: '2026-08-05',
  }
];

export const INITIAL_WORKOUT_PLAN: WorkoutPlan = {
  id: 'workout-ricardo-sem-1',
  clientId: 'client-ricardo-silva',
  clientName: 'Ricardo Silva',
  coachId: 'coach-sergio-cunha',
  title: 'Mesociclo 2: Hipertrofia & Força Funcional',
  weekNumber: 1,
  weekStartDate: '2026-10-05',
  weekEndDate: '2026-10-11',
  status: 'active',
  notes: 'Foco na progressão de carga e cadência controlada (3s na descida). Descanso de 90 a 120s entre séries nos exercícios compostos. Não hesites em registar o peso de cada série para podermos avaliar!',
  createdAt: '2026-10-05',
  days: [
    {
      dayOfWeek: 'Segunda-feira',
      dayIndex: 0,
      name: 'Treino A - Peito, Deltoide Anterior e Tríceps',
      isRestDay: false,
      focusArea: 'Peito & Tríceps',
      exercises: [
        {
          exerciseId: 'ex-supino-reto',
          exerciseName: 'Supino Reto com Barra',
          sets: [
            { setNumber: 1, reps: '10', targetWeightKg: 70, restSeconds: 120, completed: true, loggedWeightKg: 70 },
            { setNumber: 2, reps: '8', targetWeightKg: 75, restSeconds: 120, completed: true, loggedWeightKg: 75 },
            { setNumber: 3, reps: '8', targetWeightKg: 75, restSeconds: 120, completed: true, loggedWeightKg: 75 },
            { setNumber: 4, reps: '6-8', targetWeightKg: 80, restSeconds: 150, completed: false, loggedWeightKg: 77.5 }
          ],
          notes: 'Aquecimento prévio com barra vazia. Manter escápulas travadas no banco.',
          videoUrl: 'https://www.youtube.com/watch?v=rT7DgCr-3pg',
          imageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=600&q=80',
          muscleGroup: 'Peitoral Maior'
        },
        {
          exerciseId: 'ex-elevacao-lateral',
          exerciseName: 'Elevação Lateral com Halteres',
          sets: [
            { setNumber: 1, reps: '12', targetWeightKg: 12, restSeconds: 75, completed: false },
            { setNumber: 2, reps: '12', targetWeightKg: 12, restSeconds: 75, completed: false },
            { setNumber: 3, reps: '10-12', targetWeightKg: 14, restSeconds: 90, completed: false },
            { setNumber: 4, reps: '15 (Drop set)', targetWeightKg: 10, restSeconds: 60, completed: false }
          ],
          notes: 'Sem balanço lombar. Paragem de 1 segundo no pico da contração.',
          videoUrl: 'https://www.youtube.com/watch?v=3VcKaXpzqRo',
          imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=600&q=80',
          muscleGroup: 'Deltoide Lateral'
        },
        {
          exerciseId: 'ex-triceps-corda',
          exerciseName: 'Tríceps na Polia com Corda',
          sets: [
            { setNumber: 1, reps: '12', targetWeightKg: 25, restSeconds: 60, completed: false },
            { setNumber: 2, reps: '12', targetWeightKg: 25, restSeconds: 60, completed: false },
            { setNumber: 3, reps: '10', targetWeightKg: 30, restSeconds: 75, completed: false }
          ],
          notes: 'Abrir bem a corda no final para ativar a cabeça lateral do tríceps.',
          videoUrl: 'https://www.youtube.com/watch?v=vB5OHsJ3EME',
          imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=600&q=80',
          muscleGroup: 'Tríceps'
        }
      ]
    },
    {
      dayOfWeek: 'Terça-feira',
      dayIndex: 1,
      name: 'Treino B - Costas, Deltoide Posterior e Bíceps',
      isRestDay: false,
      focusArea: 'Costas & Bíceps',
      exercises: [
        {
          exerciseId: 'ex-puxada-polia',
          exerciseName: 'Puxada Aberta na Polia Alta',
          sets: [
            { setNumber: 1, reps: '10', targetWeightKg: 60, restSeconds: 90, completed: false },
            { setNumber: 2, reps: '10', targetWeightKg: 65, restSeconds: 90, completed: false },
            { setNumber: 3, reps: '8', targetWeightKg: 70, restSeconds: 90, completed: false },
            { setNumber: 4, reps: '8', targetWeightKg: 70, restSeconds: 90, completed: false }
          ],
          notes: 'Puxar com as costas e não com os braços.',
          videoUrl: 'https://www.youtube.com/watch?v=CAwf7n6Luuc',
          imageUrl: 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?auto=format&fit=crop&w=600&q=80',
          muscleGroup: 'Grande Dorsal'
        },
        {
          exerciseId: 'ex-biceps-inclinado',
          exerciseName: 'Curl Bíceps no Banco Inclinado',
          sets: [
            { setNumber: 1, reps: '12', targetWeightKg: 14, restSeconds: 75, completed: false },
            { setNumber: 2, reps: '10', targetWeightKg: 16, restSeconds: 75, completed: false },
            { setNumber: 3, reps: '10', targetWeightKg: 16, restSeconds: 75, completed: false }
          ],
          notes: 'Alongamento máximo no fundo do movimento.',
          videoUrl: 'https://www.youtube.com/watch?v=soxrZlIl35U',
          imageUrl: 'https://images.unsplash.com/photo-1581009137042-c552e485697a?auto=format&fit=crop&w=600&q=80',
          muscleGroup: 'Bíceps Braquial'
        }
      ]
    },
    {
      dayOfWeek: 'Quarta-feira',
      dayIndex: 2,
      name: 'Descanso Ativo & Mobilidade',
      isRestDay: true,
      focusArea: 'Recuperação Ativa',
      exercises: []
    },
    {
      dayOfWeek: 'Quinta-feira',
      dayIndex: 3,
      name: 'Treino C - Pernas Completo (Ênfase Quadríceps)',
      isRestDay: false,
      focusArea: 'Membros Inferiores',
      exercises: [
        {
          exerciseId: 'ex-agachamento-livre',
          exerciseName: 'Agachamento Livre com Barra',
          sets: [
            { setNumber: 1, reps: '8', targetWeightKg: 90, restSeconds: 150, completed: false },
            { setNumber: 2, reps: '8', targetWeightKg: 95, restSeconds: 150, completed: false },
            { setNumber: 3, reps: '6', targetWeightKg: 100, restSeconds: 180, completed: false },
            { setNumber: 4, reps: '6', targetWeightKg: 100, restSeconds: 180, completed: false }
          ],
          notes: 'Descer com segurança e profundidade. Manter calcanhares colados no chão.',
          videoUrl: 'https://www.youtube.com/watch?v=bEv6CCg2BC8',
          imageUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=600&q=80',
          muscleGroup: 'Quadríceps'
        },
        {
          exerciseId: 'ex-peso-morto-romeno',
          exerciseName: 'Peso Morto Romeno (RDL)',
          sets: [
            { setNumber: 1, reps: '10', targetWeightKg: 80, restSeconds: 120, completed: false },
            { setNumber: 2, reps: '10', targetWeightKg: 85, restSeconds: 120, completed: false },
            { setNumber: 3, reps: '8', targetWeightKg: 90, restSeconds: 120, completed: false }
          ],
          notes: 'Foco total no alongamento dos posteriores de coxa.',
          videoUrl: 'https://www.youtube.com/watch?v=jEy_czb3RKA',
          imageUrl: 'https://images.unsplash.com/photo-1534367507873-d2d7e24c797f?auto=format&fit=crop&w=600&q=80',
          muscleGroup: 'Isquiotibiais'
        }
      ]
    },
    {
      dayOfWeek: 'Sexta-feira',
      dayIndex: 4,
      name: 'Treino D - Ombros, Posterior e Core',
      isRestDay: false,
      focusArea: 'Ombros & Glúteos',
      exercises: [
        {
          exerciseId: 'ex-hip-thrust',
          exerciseName: 'Hip Thrust com Barra',
          sets: [
            { setNumber: 1, reps: '12', targetWeightKg: 110, restSeconds: 120, completed: false },
            { setNumber: 2, reps: '10', targetWeightKg: 120, restSeconds: 120, completed: false },
            { setNumber: 3, reps: '10', targetWeightKg: 130, restSeconds: 150, completed: false }
          ],
          notes: 'Pausa de 1 segundo de contração no topo.',
          videoUrl: 'https://www.youtube.com/watch?v=SEdqd1n0cvg',
          imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=600&q=80',
          muscleGroup: 'Glúteos'
        },
        {
          exerciseId: 'ex-elevacao-lateral',
          exerciseName: 'Elevação Lateral com Halteres',
          sets: [
            { setNumber: 1, reps: '15', targetWeightKg: 12, restSeconds: 60, completed: false },
            { setNumber: 2, reps: '15', targetWeightKg: 12, restSeconds: 60, completed: false },
            { setNumber: 3, reps: '12', targetWeightKg: 14, restSeconds: 75, completed: false }
          ],
          notes: 'Controle excêntrico estrito.',
          videoUrl: 'https://www.youtube.com/watch?v=3VcKaXpzqRo',
          imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=600&q=80',
          muscleGroup: 'Deltoides'
        }
      ]
    },
    {
      dayOfWeek: 'Sábado',
      dayIndex: 5,
      name: 'Cardio HIIT / Zona 2 & Abdominais',
      isRestDay: false,
      focusArea: 'Condicionamento',
      exercises: []
    },
    {
      dayOfWeek: 'Domingo',
      dayIndex: 6,
      name: 'Descanso Total & Preparação Semanal',
      isRestDay: true,
      focusArea: 'Recuperação',
      exercises: []
    }
  ]
};

export const INITIAL_NUTRITION_PLAN: NutritionPlan = {
  id: 'nutrition-ricardo-sem-1',
  clientId: 'client-ricardo-silva',
  clientName: 'Ricardo Silva',
  coachId: 'coach-sergio-cunha',
  title: 'Ementa Semanal - Recomposição & Alta Proteína (2350 kcal)',
  weekStartDate: '2026-10-05',
  weekEndDate: '2026-10-11',
  dailyCalories: 2350,
  notes: 'Ingestão de pelo menos 3 a 3.5 litros de água por dia. Sal marinho com moderação em todas as refeições para reposição de eletrólitos nos treinos pesados. Se treinares de manhã, troca o lanche pelo pós-treino.',
  createdAt: '2026-10-05',
  days: [
    {
      dayOfWeek: 'Segunda-feira',
      dayIndex: 0,
      totalCalories: 2350,
      totalProtein: 180,
      totalCarbs: 230,
      totalFat: 65,
      waterIntakeLiters: 3.5,
      notes: 'Dia de treino de Peito. Consumir hidratos 2 horas antes da sessão.',
      meals: [
        {
          id: 'meal-d0-1',
          name: 'Pequeno-Almoço',
          time: '08:00',
          description: 'Papas de aveia proteicas com fruta e canela',
          calories: 520,
          proteinG: 42,
          carbsG: 65,
          fatG: 12,
          foods: [
            { item: 'Flocos de aveia finos', quantity: '70g' },
            { item: 'Whey Protein Isolado (baunilha ou chocolate)', quantity: '35g' },
            { item: 'Bagas vermelhas ou mirtilos', quantity: '80g' },
            { item: 'Manteiga de amendoim 100% natural', quantity: '15g' },
            { item: 'Café preto ou chá verde', quantity: '1 chávena' }
          ]
        },
        {
          id: 'meal-d0-2',
          name: 'Almoço',
          time: '13:00',
          description: 'Peito de frango grelhado com arroz basmati e vegetais ao vapor',
          calories: 680,
          proteinG: 55,
          carbsG: 75,
          fatG: 18,
          foods: [
            { item: 'Peito de frango ou peru grelhado', quantity: '180g (pesado cru)' },
            { item: 'Arroz basmati ou jasmim cozido', quantity: '200g' },
            { item: 'Azeite virgem extra', quantity: '1 colher de sobremesa (10ml)' },
            { item: 'Brócolos e cenoura ao vapor', quantity: '150g' },
            { item: 'Salada mista com folhas verdes', quantity: 'À vontade' }
          ]
        },
        {
          id: 'meal-d0-3',
          name: 'Lanche',
          time: '17:00',
          description: 'Iogurte grego ligeiro com banana e nozes',
          calories: 410,
          proteinG: 30,
          carbsG: 50,
          fatG: 10,
          foods: [
            { item: 'Iogurte grego 0% ou Skyr natural', quantity: '200g' },
            { item: 'Banana média madura', quantity: '1 unidade (~100g)' },
            { item: 'Miolo de noz picado', quantity: '15g' },
            { item: 'Canela do Ceilão em pó', quantity: 'A gosto' }
          ]
        },
        {
          id: 'meal-d0-4',
          name: 'Jantar',
          time: '20:30',
          description: 'Lombo de salmão com batata-doce assada e espargos',
          calories: 610,
          proteinG: 48,
          carbsG: 40,
          fatG: 24,
          foods: [
            { item: 'Lombo de salmão fresco', quantity: '160g' },
            { item: 'Batata-doce assada no forno', quantity: '180g' },
            { item: 'Espargos verdes salteados', quantity: '120g' },
            { item: 'Gotas de limão e ervas aromáticas', quantity: 'A gosto' }
          ]
        }
      ]
    },
    {
      dayOfWeek: 'Terça-feira',
      dayIndex: 1,
      totalCalories: 2350,
      totalProtein: 180,
      totalCarbs: 230,
      totalFat: 65,
      waterIntakeLiters: 3.5,
      notes: 'Manter a mesma rotina de horários para estabilizar a saciedade e insulina.',
      meals: [
        {
          id: 'meal-d1-1',
          name: 'Pequeno-Almoço',
          time: '08:00',
          description: 'Omelete de claras e ovos inteiros com pão de centeio integral',
          calories: 510,
          proteinG: 40,
          carbsG: 45,
          fatG: 16,
          foods: [
            { item: 'Ovos inteiros classe L', quantity: '2 unidades' },
            { item: 'Claras de ovo pasteurizadas', quantity: '150ml' },
            { item: 'Pão de centeio 100% integral', quantity: '2 fatias (70g)' },
            { item: 'Espinafres salteados na omelete', quantity: '50g' }
          ]
        },
        {
          id: 'meal-d1-2',
          name: 'Almoço',
          time: '13:00',
          description: 'Carne de vaca magra picada com batata branca e feijão verde',
          calories: 690,
          proteinG: 54,
          carbsG: 75,
          fatG: 18,
          foods: [
            { item: 'Carne de vaca picada < 5% gordura', quantity: '180g' },
            { item: 'Batata cozida com casca', quantity: '250g' },
            { item: 'Feijão verde e curgete grelhada', quantity: '150g' },
            { item: 'Azeite virgem extra', quantity: '1 colher sobremesa' }
          ]
        },
        {
          id: 'meal-d1-3',
          name: 'Lanche',
          time: '17:00',
          description: 'Batido anabólico com aveia e fruta',
          calories: 420,
          proteinG: 35,
          carbsG: 55,
          fatG: 8,
          foods: [
            { item: 'Whey Protein', quantity: '35g' },
            { item: 'Bebida de amêndoa sem açúcar', quantity: '250ml' },
            { item: 'Farinha de aveia', quantity: '40g' },
            { item: 'Morangos congelados', quantity: '100g' }
          ]
        },
        {
          id: 'meal-d1-4',
          name: 'Jantar',
          time: '20:30',
          description: 'Filetes de pescada ou robalo no forno com quinoa real',
          calories: 590,
          proteinG: 50,
          carbsG: 50,
          fatG: 15,
          foods: [
            { item: 'Robalo ou dourada fresca', quantity: '200g' },
            { item: 'Quinoa cozida', quantity: '160g' },
            { item: 'Tomate cereja e rúcula com azeite', quantity: '1 prato generoso' }
          ]
        }
      ]
    },
    {
      dayOfWeek: 'Quarta-feira',
      dayIndex: 2,
      totalCalories: 2350,
      totalProtein: 180,
      totalCarbs: 230,
      totalFat: 65,
      waterIntakeLiters: 3.0,
      notes: 'Dia sem treino intenso: manter hidratação e horários consistentes.',
      meals: [
        {
          id: 'meal-d2-1',
          name: 'Pequeno-Almoço',
          time: '08:00',
          description: 'Papas de aveia proteicas com canela e nozes',
          calories: 510,
          proteinG: 40,
          carbsG: 60,
          fatG: 12,
          foods: [
            { item: 'Flocos de aveia finos', quantity: '70g' },
            { item: 'Whey Protein Isolado', quantity: '35g' },
            { item: 'Banana média', quantity: '1 unidade' }
          ]
        },
        {
          id: 'meal-d2-2',
          name: 'Almoço',
          time: '13:00',
          description: 'Peito de peru grelhado com batata-doce e legumes salteados',
          calories: 680,
          proteinG: 55,
          carbsG: 70,
          fatG: 16,
          foods: [
            { item: 'Bife de peru grelhado', quantity: '180g' },
            { item: 'Batata-doce assada', quantity: '220g' },
            { item: 'Curgete e cogumelos frescos', quantity: '150g' }
          ]
        },
        {
          id: 'meal-d2-3',
          name: 'Lanche',
          time: '17:00',
          description: 'Iogurte natural Skyr com frutos secos e maçã fatiada',
          calories: 420,
          proteinG: 32,
          carbsG: 48,
          fatG: 11,
          foods: [
            { item: 'Iogurte Skyr natural', quantity: '200g' },
            { item: 'Maçã reineta ou gala', quantity: '1 unidade' },
            { item: 'Amêndoas torradas sem sal', quantity: '20g' }
          ]
        },
        {
          id: 'meal-d2-4',
          name: 'Jantar',
          time: '20:30',
          description: 'Salmão fresco com arroz basmati e espinafres ao vapor',
          calories: 600,
          proteinG: 48,
          carbsG: 45,
          fatG: 22,
          foods: [
            { item: 'Posta de salmão grelhado', quantity: '160g' },
            { item: 'Arroz basmati cozido', quantity: '150g' },
            { item: 'Espinafres salteados com azeite e alho', quantity: '100g' }
          ]
        }
      ]
    },
    {
      dayOfWeek: 'Quinta-feira',
      dayIndex: 3,
      totalCalories: 2400,
      totalProtein: 185,
      totalCarbs: 250,
      totalFat: 65,
      waterIntakeLiters: 3.5,
      notes: 'Dia de Pernas: refeição pós-treino rica em hidratos de carbono complexos.',
      meals: [
        {
          id: 'meal-d3-1',
          name: 'Pequeno-Almoço',
          time: '08:00',
          description: 'Omelete de ovos com tosta de centeio e queijo fresco magro',
          calories: 520,
          proteinG: 42,
          carbsG: 45,
          fatG: 16,
          foods: [
            { item: 'Ovos inteiros biológicos', quantity: '2 unidades' },
            { item: 'Claras de ovo pasteurizadas', quantity: '120ml' },
            { item: 'Pão de centeio integral', quantity: '2 fatias' }
          ]
        },
        {
          id: 'meal-d3-2',
          name: 'Almoço',
          time: '13:00',
          description: 'Carne magra picada com arroz integral e feijão preto',
          calories: 710,
          proteinG: 56,
          carbsG: 80,
          fatG: 18,
          foods: [
            { item: 'Carne de novilho magra', quantity: '180g' },
            { item: 'Arroz integral cozido', quantity: '200g' },
            { item: 'Feijão preto cozido', quantity: '80g' }
          ]
        },
        {
          id: 'meal-d3-3',
          name: 'Lanche',
          time: '17:00',
          description: 'Batido de proteína com aveia e morangos',
          calories: 430,
          proteinG: 36,
          carbsG: 55,
          fatG: 8,
          foods: [
            { item: 'Whey Protein isolado', quantity: '35g' },
            { item: 'Farinha de aveia integral', quantity: '45g' },
            { item: 'Morangos frescos', quantity: '100g' }
          ]
        },
        {
          id: 'meal-d3-4',
          name: 'Jantar',
          time: '20:30',
          description: 'Dourada no forno com batata cozida e brócolos',
          calories: 610,
          proteinG: 50,
          carbsG: 48,
          fatG: 16,
          foods: [
            { item: 'Dourada média grelhada', quantity: '220g' },
            { item: 'Batata branca cozida', quantity: '200g' },
            { item: 'Brócolos cozidos ao vapor', quantity: '150g' }
          ]
        }
      ]
    },
    {
      dayOfWeek: 'Sexta-feira',
      dayIndex: 4,
      totalCalories: 2350,
      totalProtein: 180,
      totalCarbs: 230,
      totalFat: 65,
      waterIntakeLiters: 3.5,
      notes: 'Manter disciplina ao jantar após o treino de sexta.',
      meals: [
        {
          id: 'meal-d4-1',
          name: 'Pequeno-Almoço',
          time: '08:00',
          description: 'Papas de aveia proteicas com fruta vermelha e café preto',
          calories: 520,
          proteinG: 42,
          carbsG: 65,
          fatG: 12,
          foods: [
            { item: 'Flocos de aveia', quantity: '70g' },
            { item: 'Whey Protein Isolado', quantity: '35g' },
            { item: 'Mirtilos frescos', quantity: '80g' }
          ]
        },
        {
          id: 'meal-d4-2',
          name: 'Almoço',
          time: '13:00',
          description: 'Peito de frango grelhado com massa integral e legumes',
          calories: 690,
          proteinG: 54,
          carbsG: 75,
          fatG: 18,
          foods: [
            { item: 'Peito de frango em tiras', quantity: '180g' },
            { item: 'Massa espiral 100% integral', quantity: '80g (pesado cru)' },
            { item: 'Molho de tomate caseiro com manjericão', quantity: '100g' }
          ]
        },
        {
          id: 'meal-d4-3',
          name: 'Lanche',
          time: '17:00',
          description: 'Iogurte grego magro com banana e canela',
          calories: 410,
          proteinG: 30,
          carbsG: 50,
          fatG: 10,
          foods: [
            { item: 'Iogurte grego 0%', quantity: '200g' },
            { item: 'Banana média', quantity: '1 unidade' },
            { item: 'Nozes partidas', quantity: '15g' }
          ]
        },
        {
          id: 'meal-d4-4',
          name: 'Jantar',
          time: '20:30',
          description: 'Lombo de salmão fresco com batata-doce e espargos',
          calories: 610,
          proteinG: 48,
          carbsG: 40,
          fatG: 24,
          foods: [
            { item: 'Lombo de salmão fresco grelhado', quantity: '160g' },
            { item: 'Batata-doce assada', quantity: '180g' },
            { item: 'Espargos verdes salteados', quantity: '120g' }
          ]
        }
      ]
    },
    {
      dayOfWeek: 'Sábado',
      dayIndex: 5,
      totalCalories: 2350,
      totalProtein: 175,
      totalCarbs: 220,
      totalFat: 65,
      waterIntakeLiters: 3.0,
      notes: 'Fim de semana controlado: evitar opções calóricas fora da ementa.',
      meals: [
        {
          id: 'meal-d5-1',
          name: 'Pequeno-Almoço',
          time: '09:00',
          description: 'Panquecas proteicas de aveia e clara de ovo',
          calories: 520,
          proteinG: 42,
          carbsG: 55,
          fatG: 14,
          foods: [
            { item: 'Farinha de aveia integral', quantity: '60g' },
            { item: 'Claras de ovo', quantity: '150ml' },
            { item: 'Ovo inteiro', quantity: '1 unidade' }
          ]
        },
        {
          id: 'meal-d5-2',
          name: 'Almoço',
          time: '13:30',
          description: 'Bife de vaca magro grelhado com arroz basmati e salada mista',
          calories: 680,
          proteinG: 52,
          carbsG: 70,
          fatG: 20,
          foods: [
            { item: 'Bife do lombo ou vazia magra', quantity: '180g' },
            { item: 'Arroz basmati cozido', quantity: '180g' },
            { item: 'Salada mista com azeite virgem', quantity: '1 prato generoso' }
          ]
        },
        {
          id: 'meal-d5-3',
          name: 'Lanche',
          time: '17:30',
          description: 'Batido de proteína com fruta e tosta integral',
          calories: 410,
          proteinG: 32,
          carbsG: 50,
          fatG: 8,
          foods: [
            { item: 'Whey Protein isolado', quantity: '35g' },
            { item: 'Tosta 100% integral com queijo quark', quantity: '2 unidades' }
          ]
        },
        {
          id: 'meal-d5-4',
          name: 'Jantar',
          time: '21:00',
          description: 'Filetes de pescada cozida com ovo e legumes ao vapor',
          calories: 590,
          proteinG: 48,
          carbsG: 38,
          fatG: 18,
          foods: [
            { item: 'Pescada fresca cozida', quantity: '200g' },
            { item: 'Ovo cozido', quantity: '1 unidade' },
            { item: 'Couve-flor e cenoura ao vapor', quantity: '200g' }
          ]
        }
      ]
    },
    {
      dayOfWeek: 'Domingo',
      dayIndex: 6,
      totalCalories: 2300,
      totalProtein: 175,
      totalCarbs: 210,
      totalFat: 65,
      waterIntakeLiters: 3.0,
      notes: 'Preparação dos tupperwares para a próxima semana e descanso ativo.',
      meals: [
        {
          id: 'meal-d6-1',
          name: 'Pequeno-Almoço',
          time: '09:00',
          description: 'Omelete de ovos inteiros e claras com pão de centeio',
          calories: 510,
          proteinG: 40,
          carbsG: 45,
          fatG: 16,
          foods: [
            { item: 'Ovos inteiros', quantity: '2 unidades' },
            { item: 'Claras pasteurizadas', quantity: '120ml' },
            { item: 'Pão de centeio integral', quantity: '2 fatias' }
          ]
        },
        {
          id: 'meal-d6-2',
          name: 'Almoço',
          time: '13:30',
          description: 'Frango assado sem pele com batata assada e feijão verde',
          calories: 680,
          proteinG: 54,
          carbsG: 70,
          fatG: 18,
          foods: [
            { item: 'Peito de frango assado', quantity: '180g' },
            { item: 'Batata assada com ervas', quantity: '220g' },
            { item: 'Feijão verde salteado', quantity: '150g' }
          ]
        },
        {
          id: 'meal-d6-3',
          name: 'Lanche',
          time: '17:00',
          description: 'Iogurte Skyr com maçã e canela',
          calories: 390,
          proteinG: 30,
          carbsG: 48,
          fatG: 8,
          foods: [
            { item: 'Iogurte Skyr natural', quantity: '200g' },
            { item: 'Maçã aos cubos', quantity: '1 unidade' }
          ]
        },
        {
          id: 'meal-d6-4',
          name: 'Jantar',
          time: '20:30',
          description: 'Robalo grelhado com quinoa e salada de tomate',
          calories: 580,
          proteinG: 48,
          carbsG: 40,
          fatG: 16,
          foods: [
            { item: 'Filete de robalo fresco', quantity: '200g' },
            { item: 'Quinoa cozida', quantity: '150g' },
            { item: 'Salada de tomate cereja com orégãos', quantity: '1 taça' }
          ]
        }
      ]
    }
  ]
};

export const INITIAL_MARTA_WORKOUT_PLAN: WorkoutPlan = {
  id: 'workout-marta-sem-1',
  clientId: 'client-marta-pereira',
  clientName: 'Marta Pereira',
  coachId: 'coach-sergio-cunha',
  title: 'Mesociclo de Tonificação & Foco em Glúteos (Semana 1)',
  weekNumber: 1,
  weekStartDate: '2026-10-05',
  weekEndDate: '2026-10-11',
  status: 'active',
  notes: 'Foco na ativação máxima de glúteos e posterior de coxa. Cadência lenta na fase excêntrica.',
  createdAt: '2026-10-05',
  days: [
    {
      dayOfWeek: 'Segunda-feira',
      dayIndex: 0,
      name: 'Treino A - Foco em Glúteos e Isquiotibiais',
      isRestDay: false,
      focusArea: 'Glúteos & Posteriores',
      exercises: [
        {
          exerciseId: 'ex-hip-thrust',
          exerciseName: 'Hip Thrust com Barra',
          sets: [
            { setNumber: 1, reps: '12', targetWeightKg: 80, restSeconds: 90, completed: false },
            { setNumber: 2, reps: '12', targetWeightKg: 85, restSeconds: 90, completed: false },
            { setNumber: 3, reps: '10', targetWeightKg: 90, restSeconds: 120, completed: false },
          ],
          notes: 'Pausa de 2 segundos no pico de contração.',
          videoUrl: 'https://www.youtube.com/watch?v=SEdqd1n0cvg',
          imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=600&q=80',
          muscleGroup: 'Glúteos'
        },
        {
          exerciseId: 'ex-peso-morto-romeno',
          exerciseName: 'Peso Morto Romeno (RDL)',
          sets: [
            { setNumber: 1, reps: '12', targetWeightKg: 45, restSeconds: 90, completed: false },
            { setNumber: 2, reps: '10', targetWeightKg: 50, restSeconds: 90, completed: false },
            { setNumber: 3, reps: '10', targetWeightKg: 50, restSeconds: 90, completed: false },
          ],
          notes: 'Alongar os isquiotibiais com costas retas.',
          videoUrl: 'https://www.youtube.com/watch?v=jEy_czb3RKA',
          imageUrl: 'https://images.unsplash.com/photo-1534367507873-d2d7e24c797f?auto=format&fit=crop&w=600&q=80',
          muscleGroup: 'Isquiotibiais'
        }
      ]
    },
    {
      dayOfWeek: 'Terça-feira',
      dayIndex: 1,
      name: 'Treino B - Membros Superiores & Core',
      isRestDay: false,
      focusArea: 'Dorsal, Ombros & Abdómen',
      exercises: [
        {
          exerciseId: 'ex-puxada-polia',
          exerciseName: 'Puxada Aberta na Polia Alta',
          sets: [
            { setNumber: 1, reps: '12', targetWeightKg: 35, restSeconds: 75, completed: false },
            { setNumber: 2, reps: '10', targetWeightKg: 40, restSeconds: 75, completed: false },
            { setNumber: 3, reps: '10', targetWeightKg: 40, restSeconds: 90, completed: false },
          ],
          notes: 'Puxar com as costas, sem curvar o pescoço.',
          videoUrl: 'https://www.youtube.com/watch?v=CAwf7n6Luuc',
          imageUrl: 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?auto=format&fit=crop&w=600&q=80',
          muscleGroup: 'Costas'
        }
      ]
    },
    {
      dayOfWeek: 'Quarta-feira',
      dayIndex: 2,
      name: 'Descanso Ativo / Caminhada Zona 2',
      isRestDay: true,
      focusArea: 'Recuperação',
      exercises: []
    },
    {
      dayOfWeek: 'Quinta-feira',
      dayIndex: 3,
      name: 'Treino C - Quadríceps e Panturrilhas',
      isRestDay: false,
      focusArea: 'Quadríceps',
      exercises: [
        {
          exerciseId: 'ex-agachamento-livre',
          exerciseName: 'Agachamento Livre com Barra',
          sets: [
            { setNumber: 1, reps: '12', targetWeightKg: 40, restSeconds: 90, completed: false },
            { setNumber: 2, reps: '10', targetWeightKg: 45, restSeconds: 90, completed: false },
            { setNumber: 3, reps: '8', targetWeightKg: 50, restSeconds: 120, completed: false },
          ],
          notes: 'Profundidade máxima mantendo o calcanhar firme.',
          videoUrl: 'https://www.youtube.com/watch?v=bEv6CCg2BC8',
          imageUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=600&q=80',
          muscleGroup: 'Pernas'
        }
      ]
    },
    {
      dayOfWeek: 'Sexta-feira',
      dayIndex: 4,
      name: 'Treino D - Full Body Tonificação & HIIT',
      isRestDay: false,
      focusArea: 'Cardio & Resistência',
      exercises: []
    },
    {
      dayOfWeek: 'Sábado',
      dayIndex: 5,
      name: 'Descanso ou Alongamento',
      isRestDay: true,
      focusArea: 'Mobilidade',
      exercises: []
    },
    {
      dayOfWeek: 'Domingo',
      dayIndex: 6,
      name: 'Descanso Total de Domingo',
      isRestDay: true,
      focusArea: 'Recuperação & Planeamento',
      exercises: []
    }
  ]
};

export const INITIAL_MARTA_NUTRITION_PLAN: NutritionPlan = {
  id: 'nutrition-marta-sem-1',
  clientId: 'client-marta-pereira',
  clientName: 'Marta Pereira',
  coachId: 'coach-sergio-cunha',
  title: 'Ementa de Tonificação & Definição Feminina (1900 kcal)',
  weekNumber: 1,
  weekStartDate: '2026-10-05',
  weekEndDate: '2026-10-11',
  dailyCalories: 1900,
  notes: 'Consumo de pelo menos 2.8L de água diários. Hidratos de carbono concentrados no pequeno-almoço e pré-treino.',
  createdAt: '2026-10-05',
  days: [
    {
      dayOfWeek: 'Segunda-feira',
      dayIndex: 0,
      totalCalories: 1900,
      totalProtein: 140,
      totalCarbs: 180,
      totalFat: 50,
      waterIntakeLiters: 3.0,
      notes: 'Dia de glúteos e pernas.',
      meals: [
        {
          id: 'm-meal-d0-1',
          name: 'Pequeno-Almoço',
          time: '08:30',
          category: 'Pequeno-Almoço',
          description: 'Papas de aveia proteica com bagas e canela',
          calories: 420,
          proteinG: 32,
          carbsG: 50,
          fatG: 9,
          foods: [
            { item: 'Flocos de aveia finos', quantity: '55g' },
            { item: 'Whey Protein Isolado Baunilha', quantity: '30g' },
            { item: 'Mirtilos e morangos', quantity: '70g' },
            { item: 'Manteiga de amêndoa', quantity: '10g' }
          ]
        },
        {
          id: 'm-meal-d0-2',
          name: 'Almoço',
          time: '13:00',
          category: 'Almoço',
          description: 'Peito de frango grelhado com arroz basmati e espinafres',
          calories: 550,
          proteinG: 45,
          carbsG: 55,
          fatG: 14,
          foods: [
            { item: 'Peito de frango grelhado', quantity: '150g' },
            { item: 'Arroz basmati cozido', quantity: '150g' },
            { item: 'Azeite virgem extra', quantity: '8ml' },
            { item: 'Espinafres salteados e tomate', quantity: '150g' }
          ]
        },
        {
          id: 'm-meal-d0-3',
          name: 'Lanche',
          time: '17:00',
          category: 'Lanche',
          description: 'Iogurte Skyr com nozes e maçã',
          calories: 320,
          proteinG: 24,
          carbsG: 35,
          fatG: 8,
          foods: [
            { item: 'Iogurte Skyr natural', quantity: '180g' },
            { item: 'Maçã reineta fatiada', quantity: '1 unidade' },
            { item: 'Miolo de noz', quantity: '12g' }
          ]
        },
        {
          id: 'm-meal-d0-4',
          name: 'Jantar',
          time: '20:30',
          category: 'Jantar',
          description: 'Lombo de salmão com batata-doce e brócolos',
          calories: 510,
          proteinG: 38,
          carbsG: 38,
          fatG: 18,
          foods: [
            { item: 'Salmão fresco', quantity: '140g' },
            { item: 'Batata-doce assada', quantity: '140g' },
            { item: 'Brócolos ao vapor', quantity: '150g' }
          ]
        }
      ]
    },
    {
      dayOfWeek: 'Terça-feira',
      dayIndex: 1,
      totalCalories: 1900,
      totalProtein: 140,
      totalCarbs: 180,
      totalFat: 50,
      waterIntakeLiters: 2.8,
      notes: 'Dia de costas e ombros.',
      meals: [
        {
          id: 'm-meal-d1-1',
          name: 'Pequeno-Almoço',
          time: '08:30',
          category: 'Pequeno-Almoço',
          description: 'Omelete de claras com espinafres e pão torrado integral',
          calories: 410,
          proteinG: 34,
          carbsG: 45,
          fatG: 10,
          foods: [
            { item: 'Claras de ovo com 1 gema', quantity: '150ml + 1 ovo' },
            { item: 'Pão de centeio integral', quantity: '60g' },
            { item: 'Azeite virgem extra', quantity: '5ml' }
          ]
        },
        {
          id: 'm-meal-d1-2',
          name: 'Almoço',
          time: '13:00',
          category: 'Almoço',
          description: 'Bife de peru grelhado com quinoa e cogumelos',
          calories: 540,
          proteinG: 46,
          carbsG: 52,
          fatG: 13,
          foods: [
            { item: 'Peito de peru grelhado', quantity: '160g' },
            { item: 'Quinoa cozida', quantity: '140g' },
            { item: 'Cogumelos frescos salteados', quantity: '100g' }
          ]
        },
        {
          id: 'm-meal-d1-3',
          name: 'Lanche',
          time: '17:00',
          category: 'Lanche',
          description: 'Batido proteico com fruta e sementes de chia',
          calories: 330,
          proteinG: 26,
          carbsG: 36,
          fatG: 8,
          foods: [
            { item: 'Whey Protein Isolado', quantity: '30g' },
            { item: 'Bebida de amêndoa sem açúcar', quantity: '200ml' },
            { item: 'Banana fatiada', quantity: '1 unidade' }
          ]
        },
        {
          id: 'm-meal-d1-4',
          name: 'Jantar',
          time: '20:30',
          category: 'Jantar',
          description: 'Dourada grelhada com batata cozida e feijão verde',
          calories: 500,
          proteinG: 38,
          carbsG: 40,
          fatG: 15,
          foods: [
            { item: 'Filete de dourada fresca', quantity: '170g' },
            { item: 'Batata nova cozida', quantity: '130g' },
            { item: 'Feijão verde cozido', quantity: '120g' }
          ]
        }
      ]
    },
    {
      dayOfWeek: 'Quarta-feira',
      dayIndex: 2,
      totalCalories: 1900,
      totalProtein: 140,
      totalCarbs: 180,
      totalFat: 50,
      waterIntakeLiters: 2.8,
      notes: 'Dia de descanso ativo: mobilidade e caminhada.',
      meals: [
        {
          id: 'm-meal-d2-1',
          name: 'Pequeno-Almoço',
          time: '08:30',
          category: 'Pequeno-Almoço',
          description: 'Papas de aveia proteica com bagas e canela',
          calories: 420,
          proteinG: 32,
          carbsG: 50,
          fatG: 9,
          foods: [
            { item: 'Flocos de aveia finos', quantity: '55g' },
            { item: 'Whey Protein Baunilha', quantity: '30g' },
            { item: 'Bagas frescas', quantity: '60g' }
          ]
        },
        {
          id: 'm-meal-d2-2',
          name: 'Almoço',
          time: '13:00',
          category: 'Almoço',
          description: 'Salmão grelhado com arroz basmati e salada mista',
          calories: 560,
          proteinG: 42,
          carbsG: 50,
          fatG: 18,
          foods: [
            { item: 'Salmão fresco grelhado', quantity: '150g' },
            { item: 'Arroz basmati', quantity: '140g' },
            { item: 'Salada de alface e pepino', quantity: '1 prato' }
          ]
        },
        {
          id: 'm-meal-d2-3',
          name: 'Lanche',
          time: '17:00',
          category: 'Lanche',
          description: 'Iogurte Skyr com nozes e frutos secos',
          calories: 320,
          proteinG: 24,
          carbsG: 35,
          fatG: 8,
          foods: [
            { item: 'Iogurte Skyr natural', quantity: '180g' },
            { item: 'Nozes picadas', quantity: '15g' }
          ]
        },
        {
          id: 'm-meal-d2-4',
          name: 'Jantar',
          time: '20:30',
          category: 'Jantar',
          description: 'Peito de frango assado com legumes salteados',
          calories: 500,
          proteinG: 42,
          carbsG: 35,
          fatG: 14,
          foods: [
            { item: 'Peito de frango assado com ervas', quantity: '160g' },
            { item: 'Curgete e pimentos salteados', quantity: '150g' }
          ]
        }
      ]
    },
    {
      dayOfWeek: 'Quinta-feira',
      dayIndex: 3,
      totalCalories: 1900,
      totalProtein: 140,
      totalCarbs: 180,
      totalFat: 50,
      waterIntakeLiters: 3.0,
      notes: 'Dia de ênfase em posterior de coxa e glúteo.',
      meals: [
        {
          id: 'm-meal-d3-1',
          name: 'Pequeno-Almoço',
          time: '08:30',
          category: 'Pequeno-Almoço',
          description: 'Papas de aveia proteica com canela e nozes',
          calories: 420,
          proteinG: 32,
          carbsG: 50,
          fatG: 9,
          foods: [
            { item: 'Flocos de aveia finos', quantity: '55g' },
            { item: 'Whey Protein Isolado', quantity: '30g' }
          ]
        },
        {
          id: 'm-meal-d3-2',
          name: 'Almoço',
          time: '13:00',
          category: 'Almoço',
          description: 'Bife de vaca magro com batata-doce e brócolos',
          calories: 550,
          proteinG: 46,
          carbsG: 52,
          fatG: 14,
          foods: [
            { item: 'Bife da vazia limpo', quantity: '150g' },
            { item: 'Batata-doce assada', quantity: '150g' },
            { item: 'Brócolos ao vapor', quantity: '120g' }
          ]
        },
        {
          id: 'm-meal-d3-3',
          name: 'Lanche',
          time: '17:00',
          category: 'Lanche',
          description: 'Iogurte Skyr com maçã e canela',
          calories: 310,
          proteinG: 24,
          carbsG: 35,
          fatG: 7,
          foods: [
            { item: 'Skyr natural', quantity: '180g' },
            { item: 'Maçã aos cubos com canela', quantity: '1 unidade' }
          ]
        },
        {
          id: 'm-meal-d3-4',
          name: 'Jantar',
          time: '20:30',
          category: 'Jantar',
          description: 'Lombinho de pescada com arroz e legumes cozidos',
          calories: 510,
          proteinG: 38,
          carbsG: 42,
          fatG: 13,
          foods: [
            { item: 'Filetes de pescada cozida', quantity: '180g' },
            { item: 'Arroz carolino com azeite', quantity: '130g' }
          ]
        }
      ]
    },
    {
      dayOfWeek: 'Sexta-feira',
      dayIndex: 4,
      totalCalories: 1900,
      totalProtein: 140,
      totalCarbs: 180,
      totalFat: 50,
      waterIntakeLiters: 3.0,
      notes: 'Dia de corpo inteiro / HIIT moderado.',
      meals: [
        {
          id: 'm-meal-d4-1',
          name: 'Pequeno-Almoço',
          time: '08:30',
          category: 'Pequeno-Almoço',
          description: 'Panquecas proteicas de aveia e claras com mel',
          calories: 430,
          proteinG: 35,
          carbsG: 52,
          fatG: 9,
          foods: [
            { item: 'Farinha de aveia', quantity: '55g' },
            { item: 'Claras de ovo', quantity: '160ml' },
            { item: 'Mirtilos frescos', quantity: '50g' }
          ]
        },
        {
          id: 'm-meal-d4-2',
          name: 'Almoço',
          time: '13:00',
          category: 'Almoço',
          description: 'Peito de frango com massa integral e molho de tomate caseiro',
          calories: 550,
          proteinG: 45,
          carbsG: 55,
          fatG: 12,
          foods: [
            { item: 'Peito de frango em tiras', quantity: '160g' },
            { item: 'Massa integral cozida', quantity: '140g' }
          ]
        },
        {
          id: 'm-meal-d4-3',
          name: 'Lanche',
          time: '17:00',
          category: 'Lanche',
          description: 'Iogurte Skyr com amêndoas e mirtilos',
          calories: 320,
          proteinG: 24,
          carbsG: 33,
          fatG: 9,
          foods: [
            { item: 'Skyr natural', quantity: '180g' },
            { item: 'Amêndoas laminadas', quantity: '15g' }
          ]
        },
        {
          id: 'm-meal-d4-4',
          name: 'Jantar',
          time: '20:30',
          category: 'Jantar',
          description: 'Robalo assado com puré de batata-doce e espargos',
          calories: 500,
          proteinG: 38,
          carbsG: 38,
          fatG: 15,
          foods: [
            { item: 'Robalo no forno', quantity: '160g' },
            { item: 'Batata-doce amassada', quantity: '130g' }
          ]
        }
      ]
    },
    {
      dayOfWeek: 'Sábado',
      dayIndex: 5,
      totalCalories: 1900,
      totalProtein: 140,
      totalCarbs: 180,
      totalFat: 50,
      waterIntakeLiters: 2.8,
      notes: 'Fim de semana: manter horários de sono e hidratação.',
      meals: [
        {
          id: 'm-meal-d5-1',
          name: 'Pequeno-Almoço',
          time: '09:00',
          category: 'Pequeno-Almoço',
          description: 'Tostas integrais com ovos mexidos e abacate',
          calories: 430,
          proteinG: 28,
          carbsG: 45,
          fatG: 15,
          foods: [
            { item: 'Pão integral de sementes', quantity: '60g' },
            { item: 'Ovos inteiros biológicos', quantity: '2 unidades' },
            { item: 'Abacate fatiado', quantity: '30g' }
          ]
        },
        {
          id: 'm-meal-d5-2',
          name: 'Almoço',
          time: '13:30',
          category: 'Almoço',
          description: 'Peito de peru grelhado com arroz e legumes grelhados',
          calories: 540,
          proteinG: 44,
          carbsG: 52,
          fatG: 12,
          foods: [
            { item: 'Peito de peru', quantity: '160g' },
            { item: 'Arroz basmati', quantity: '140g' }
          ]
        },
        {
          id: 'm-meal-d5-3',
          name: 'Lanche',
          time: '17:30',
          category: 'Lanche',
          description: 'Skyr com banana fatiada e canela',
          calories: 320,
          proteinG: 24,
          carbsG: 38,
          fatG: 6,
          foods: [
            { item: 'Skyr natural', quantity: '180g' },
            { item: 'Banana média', quantity: '1 unidade' }
          ]
        },
        {
          id: 'm-meal-d5-4',
          name: 'Jantar',
          time: '21:00',
          category: 'Jantar',
          description: 'Salmão com batata assada e salada verde',
          calories: 510,
          proteinG: 38,
          carbsG: 38,
          fatG: 17,
          foods: [
            { item: 'Salmão fresco grelhado', quantity: '140g' },
            { item: 'Batata assada com alecrim', quantity: '130g' }
          ]
        }
      ]
    },
    {
      dayOfWeek: 'Domingo',
      dayIndex: 6,
      totalCalories: 1900,
      totalProtein: 140,
      totalCarbs: 180,
      totalFat: 50,
      waterIntakeLiters: 2.8,
      notes: 'Dia de descanso completo. Preparação das marmitas da semana.',
      meals: [
        {
          id: 'm-meal-d6-1',
          name: 'Pequeno-Almoço',
          time: '09:00',
          category: 'Pequeno-Almoço',
          description: 'Papas de aveia proteica com frutos vermelhos',
          calories: 420,
          proteinG: 32,
          carbsG: 50,
          fatG: 9,
          foods: [
            { item: 'Flocos de aveia', quantity: '55g' },
            { item: 'Whey Protein Isolado', quantity: '30g' }
          ]
        },
        {
          id: 'm-meal-d6-2',
          name: 'Almoço',
          time: '13:30',
          category: 'Almoço',
          description: 'Peito de frango assado com batata-doce e salada',
          calories: 550,
          proteinG: 45,
          carbsG: 50,
          fatG: 14,
          foods: [
            { item: 'Peito de frango assado', quantity: '160g' },
            { item: 'Batata-doce assada', quantity: '140g' }
          ]
        },
        {
          id: 'm-meal-d6-3',
          name: 'Lanche',
          time: '17:00',
          category: 'Lanche',
          description: 'Iogurte Skyr com nozes',
          calories: 320,
          proteinG: 24,
          carbsG: 35,
          fatG: 8,
          foods: [
            { item: 'Iogurte Skyr natural', quantity: '180g' },
            { item: 'Miolo de noz', quantity: '12g' }
          ]
        },
        {
          id: 'm-meal-d6-4',
          name: 'Jantar',
          time: '20:30',
          category: 'Jantar',
          description: 'Dourada grelhada com legumes e batata cozida',
          calories: 510,
          proteinG: 38,
          carbsG: 40,
          fatG: 14,
          foods: [
            { item: 'Dourada grelhada', quantity: '160g' },
            { item: 'Batata cozida pequena', quantity: '120g' }
          ]
        }
      ]
    }
  ]
};

export const ALL_INITIAL_WORKOUT_PLANS: WorkoutPlan[] = [
  INITIAL_WORKOUT_PLAN,
  INITIAL_MARTA_WORKOUT_PLAN
];

export const ALL_INITIAL_NUTRITION_PLANS: NutritionPlan[] = [
  INITIAL_NUTRITION_PLAN,
  INITIAL_MARTA_NUTRITION_PLAN
];

export const INITIAL_NUTRITION_TEMPLATES: NutritionTemplate[] = [
  {
    id: 'tmpl-cutting-2000',
    coachId: 'coach-sergio-cunha',
    title: 'Definição Extrema (Cutting) - 2000 kcal',
    description: 'Protocolo de alta proteína (2.2g/kg) com hidratos moderados a baixos para perda de massa gorda preservando massa muscular magra.',
    dailyCalories: 2000,
    macros: { protein: 170, carbs: 160, fat: 55 },
    days: [
      {
        dayOfWeek: 'Segunda-feira',
        dayIndex: 0,
        totalCalories: 2000,
        totalProtein: 170,
        totalCarbs: 160,
        totalFat: 55,
        waterIntakeLiters: 3.5,
        notes: 'Défice calórico controlado. Iniciar com hidratos centrados no pré e pós-treino.',
        meals: [
          {
            id: 'c-meal-1',
            name: 'Pequeno-Almoço',
            time: '08:00',
            category: 'Pequeno-Almoço',
            description: 'Omelete de 4 claras e 1 gema com espinafres e pão de centeio integral',
            calories: 380,
            proteinG: 34,
            carbsG: 35,
            fatG: 10,
            foods: [
              { item: 'Claras de ovo pasteurizadas', quantity: '180ml' },
              { item: 'Ovo inteiro biológico', quantity: '1 unidade' },
              { item: 'Pão de centeio integral', quantity: '1 fatia (50g)' },
              { item: 'Espinafres frescos salteados', quantity: '80g' }
            ]
          },
          {
            id: 'c-meal-2',
            name: 'Almoço',
            time: '13:00',
            category: 'Almoço',
            description: 'Peito de frango grelhado com arroz basmati e brócolos ao vapor',
            calories: 580,
            proteinG: 50,
            carbsG: 55,
            fatG: 14,
            foods: [
              { item: 'Peito de frango grelhado', quantity: '180g' },
              { item: 'Arroz basmati cozido', quantity: '140g' },
              { item: 'Azeite virgem extra', quantity: '8ml' },
              { item: 'Brócolos ao vapor', quantity: '150g' }
            ]
          },
          {
            id: 'c-meal-3',
            name: 'Lanche / Pré-Treino',
            time: '16:30',
            category: 'Lanche',
            description: 'Iogurte Skyr natural com maçã e canela',
            calories: 260,
            proteinG: 25,
            carbsG: 30,
            fatG: 3,
            foods: [
              { item: 'Iogurte Skyr ou Grego 0%', quantity: '200g' },
              { item: 'Maçã verde fatiada', quantity: '1 unidade (120g)' },
              { item: 'Canela de Ceilão', quantity: '1 colher de chá' }
            ]
          },
          {
            id: 'c-meal-4',
            name: 'Jantar',
            time: '20:30',
            category: 'Jantar',
            description: 'Filete de dourada com batata-doce e espargos grelhados',
            calories: 520,
            proteinG: 45,
            carbsG: 35,
            fatG: 16,
            foods: [
              { item: 'Dourada fresca grelhada', quantity: '180g' },
              { item: 'Batata-doce assada', quantity: '140g' },
              { item: 'Espargos e curgete grelhados', quantity: '150g' }
            ]
          },
          {
            id: 'c-meal-5',
            name: 'Ceia',
            time: '22:45',
            category: 'Ceia',
            description: 'Chá verde/camomila e queijo quark 0%',
            calories: 140,
            proteinG: 16,
            carbsG: 5,
            fatG: 1,
            foods: [
              { item: 'Queijo Quark 0%', quantity: '120g' },
              { item: 'Infusão de ervas naturais', quantity: '1 caneca' }
            ]
          }
        ]
      },
      {
        dayOfWeek: 'Terça-feira',
        dayIndex: 1,
        totalCalories: 2000,
        totalProtein: 170,
        totalCarbs: 160,
        totalFat: 55,
        waterIntakeLiters: 3.5,
        notes: 'Manter horários e hidratação regular.',
        meals: [
          {
            id: 'c-meal-t1',
            name: 'Pequeno-Almoço',
            time: '08:00',
            category: 'Pequeno-Almoço',
            description: 'Papas de aveia proteicas e mirtilos',
            calories: 410,
            proteinG: 35,
            carbsG: 45,
            fatG: 8,
            foods: [
              { item: 'Aveia fina', quantity: '50g' },
              { item: 'Whey Protein Isolado', quantity: '35g' },
              { item: 'Mirtilos frescos', quantity: '60g' }
            ]
          },
          {
            id: 'c-meal-t2',
            name: 'Almoço',
            time: '13:00',
            category: 'Almoço',
            description: 'Bife de peru com batata cozida e salada mista',
            calories: 570,
            proteinG: 48,
            carbsG: 55,
            fatG: 12,
            foods: [
              { item: 'Bife de peru grelhado', quantity: '180g' },
              { item: 'Batata cozida com casca', quantity: '180g' },
              { item: 'Salada de alface e pepino com 5ml azeite', quantity: '1 prato' }
            ]
          },
          {
            id: 'c-meal-t3',
            name: 'Lanche',
            time: '16:30',
            category: 'Lanche',
            description: 'Batido proteico com fruta fresca',
            calories: 270,
            proteinG: 32,
            carbsG: 25,
            fatG: 4,
            foods: [
              { item: 'Whey Protein Isolado', quantity: '35g' },
              { item: 'Bebida de amêndoa sem açúcar', quantity: '200ml' },
              { item: 'Morangos', quantity: '80g' }
            ]
          },
          {
            id: 'c-meal-t4',
            name: 'Jantar',
            time: '20:30',
            category: 'Jantar',
            description: 'Lombo de pescada com quinoa e feijão verde',
            calories: 510,
            proteinG: 45,
            carbsG: 30,
            fatG: 14,
            foods: [
              { item: 'Pescada fresca', quantity: '200g' },
              { item: 'Quinoa cozida', quantity: '120g' },
              { item: 'Feijão verde cozido', quantity: '150g' }
            ]
          }
        ]
      },
      {
        dayOfWeek: 'Quarta-feira',
        dayIndex: 2,
        totalCalories: 1950,
        totalProtein: 170,
        totalCarbs: 150,
        totalFat: 55,
        waterIntakeLiters: 3.5,
        notes: 'Dia de descanso ativo.',
        meals: []
      },
      {
        dayOfWeek: 'Quinta-feira',
        dayIndex: 3,
        totalCalories: 2000,
        totalProtein: 170,
        totalCarbs: 160,
        totalFat: 55,
        waterIntakeLiters: 3.5,
        notes: 'Dia de pernas. Foco na recuperação.',
        meals: []
      },
      {
        dayOfWeek: 'Sexta-feira',
        dayIndex: 4,
        totalCalories: 2000,
        totalProtein: 170,
        totalCarbs: 160,
        totalFat: 55,
        waterIntakeLiters: 3.5,
        notes: 'Manter disciplina no fim de semana.',
        meals: []
      },
      {
        dayOfWeek: 'Sábado',
        dayIndex: 5,
        totalCalories: 2000,
        totalProtein: 170,
        totalCarbs: 160,
        totalFat: 55,
        waterIntakeLiters: 3.0,
        notes: 'Manter hidratação.',
        meals: []
      },
      {
        dayOfWeek: 'Domingo',
        dayIndex: 6,
        totalCalories: 1900,
        totalProtein: 170,
        totalCarbs: 140,
        totalFat: 55,
        waterIntakeLiters: 3.0,
        notes: 'Domingo de planeamento e tupperwares.',
        meals: []
      }
    ],
    createdAt: '2026-08-10'
  },
  {
    id: 'tmpl-recomp-2350',
    coachId: 'coach-sergio-cunha',
    title: 'Recomposição Corporal Equilibrada - 2350 kcal',
    description: 'Equilíbrio ideal entre rendimento em treino com cargas pesadas e oxidação lipídica controlada.',
    dailyCalories: 2350,
    macros: { protein: 180, carbs: 230, fat: 65 },
    days: INITIAL_NUTRITION_PLAN.days,
    createdAt: '2026-08-12'
  },
  {
    id: 'tmpl-bulking-2800',
    coachId: 'coach-sergio-cunha',
    title: 'Hipertrofia Limpa (Lean Bulk) - 2800 kcal',
    description: 'Superávit calórico controlado (+300 kcal acima da manutenção) para maximizar ganhos de hipertrofia com mínimo acúmulo de gordura.',
    dailyCalories: 2800,
    macros: { protein: 190, carbs: 340, fat: 75 },
    days: [
      {
        dayOfWeek: 'Segunda-feira',
        dayIndex: 0,
        totalCalories: 2800,
        totalProtein: 190,
        totalCarbs: 340,
        totalFat: 75,
        waterIntakeLiters: 4.0,
        notes: 'Superávit anabólico com alta densidade nutricional.',
        meals: [
          {
            id: 'b-meal-1',
            name: 'Pequeno-Almoço',
            time: '08:00',
            category: 'Pequeno-Almoço',
            description: 'Papas de aveia reforçadas com banana, whey e manteiga de amendoim',
            calories: 680,
            proteinG: 45,
            carbsG: 85,
            fatG: 18,
            foods: [
              { item: 'Aveia integral', quantity: '90g' },
              { item: 'Whey Protein Isolado', quantity: '40g' },
              { item: 'Banana grande fatiada', quantity: '1 unidade' },
              { item: 'Manteiga de amendoim 100%', quantity: '25g' }
            ]
          },
          {
            id: 'b-meal-2',
            name: 'Almoço',
            time: '13:00',
            category: 'Almoço',
            description: 'Carne de vaca picada com arroz basmati, abacate e salada',
            calories: 820,
            proteinG: 55,
            carbsG: 95,
            fatG: 24,
            foods: [
              { item: 'Carne de vaca magra', quantity: '200g' },
              { item: 'Arroz basmati cozido', quantity: '260g' },
              { item: 'Abacate fatiado', quantity: '50g' },
              { item: 'Legumes variados', quantity: '150g' }
            ]
          },
          {
            id: 'b-meal-3',
            name: 'Lanche / Pré-Treino',
            time: '16:45',
            category: 'Lanche',
            description: 'Batido anabólico com aveia e mel',
            calories: 460,
            proteinG: 35,
            carbsG: 65,
            fatG: 8,
            foods: [
              { item: 'Whey Protein', quantity: '35g' },
              { item: 'Farinha de aveia', quantity: '50g' },
              { item: 'Mel de abelha biológico', quantity: '15g' },
              { item: 'Leite magro ou bebida vegetal', quantity: '250ml' }
            ]
          },
          {
            id: 'b-meal-4',
            name: 'Jantar',
            time: '20:30',
            category: 'Jantar',
            description: 'Salmão fresco com batata-doce assada e azeite virgem extra',
            calories: 740,
            proteinG: 45,
            carbsG: 70,
            fatG: 26,
            foods: [
              { item: 'Salmão fresco grelhado', quantity: '200g' },
              { item: 'Batata-doce assada', quantity: '260g' },
              { item: 'Salada mista com azeite', quantity: '1 prato' }
            ]
          }
        ]
      }
    ],
    createdAt: '2026-08-15'
  }
];

export const INITIAL_PROGRESS_LOGS: ProgressLog[] = [
  {
    id: 'prog-1',
    clientId: 'client-ricardo-silva',
    date: '2026-08-15',
    weightKg: 84.5,
    bodyFatPercent: 21.5,
    chestCm: 104,
    waistCm: 92,
    hipsCm: 101,
    armCm: 37.0,
    thighCm: 59.5,
    photoFront: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=400&q=80',
    notes: 'Avaliação inicial com o Coach Sérgio Cunha. Início do plano de recomposição.',
    customValues: { 'metric-antebraço': 31.0, 'metric-supino': 85 },
    createdAt: '2026-08-15'
  },
  {
    id: 'prog-2',
    clientId: 'client-ricardo-silva',
    date: '2026-09-01',
    weightKg: 83.1,
    bodyFatPercent: 19.8,
    chestCm: 104.5,
    waistCm: 89,
    hipsCm: 99.5,
    armCm: 37.5,
    thighCm: 60.0,
    photoFront: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=400&q=80',
    photoSide: 'https://images.unsplash.com/photo-1534367507873-d2d7e24c797f?auto=format&fit=crop&w=400&q=80',
    photoBack: 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?auto=format&fit=crop&w=400&q=80',
    customValues: { 'metric-antebraço': 31.5, 'metric-supino': 90 },
    notes: 'Duas semanas de plano cumpridas a 100%. Redução de 3cm na cintura e aumento de força.',
    createdAt: '2026-09-01'
  },
  {
    id: 'prog-3',
    clientId: 'client-ricardo-silva',
    date: '2026-09-15',
    weightKg: 81.6,
    bodyFatPercent: 18.2,
    chestCm: 105.0,
    waistCm: 87,
    hipsCm: 98.0,
    armCm: 38.0,
    thighCm: 60.5,
    photoFront: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=400&q=80',
    photoSide: 'https://images.unsplash.com/photo-1534367507873-d2d7e24c797f?auto=format&fit=crop&w=400&q=80',
    photoBack: 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?auto=format&fit=crop&w=400&q=80',
    customValues: { 'metric-antebraço': 32.2, 'metric-supino': 95 },
    notes: 'Excelente resposta muscular aos treinos de ombro e peito.',
    createdAt: '2026-09-15'
  },
  {
    id: 'prog-4',
    clientId: 'client-ricardo-silva',
    date: '2026-10-01',
    weightKg: 79.8,
    bodyFatPercent: 16.5,
    chestCm: 106.0,
    waistCm: 84.5,
    hipsCm: 96.5,
    armCm: 38.8,
    thighCm: 61.0,
    muscleMassKg: 40.2,
    visceralFat: 4,
    customValues: { 'metric-antebraço': 33.0, 'metric-supino': 100 },
    notes: 'Meta dos 80kg batida! Definição abdominal nítida e aumento de força geral.',
    createdAt: '2026-10-01'
  },
  {
    id: 'prog-marta-1',
    clientId: 'client-marta-pereira',
    date: '2026-09-01',
    weightKg: 63.0,
    bodyFatPercent: 24.5,
    muscleMassKg: 24.8,
    visceralFat: 3,
    chestCm: 88,
    waistCm: 71,
    hipsCm: 99,
    armCm: 26.5,
    thighCm: 56.0,
    notes: 'Avaliação inicial com foco em tonificação e resistência muscular.',
    createdAt: '2026-09-01'
  },
  {
    id: 'prog-marta-2',
    clientId: 'client-marta-pereira',
    date: '2026-09-18',
    weightKg: 61.8,
    bodyFatPercent: 23.2,
    muscleMassKg: 25.1,
    visceralFat: 3,
    chestCm: 88,
    waistCm: 69,
    hipsCm: 98,
    armCm: 26.8,
    thighCm: 56.5,
    notes: 'Excelente adaptação ao plano de nutrição e treinos de glúteos e core.',
    createdAt: '2026-09-18'
  },
  {
    id: 'prog-marta-3',
    clientId: 'client-marta-pereira',
    date: '2026-10-05',
    weightKg: 60.5,
    bodyFatPercent: 21.9,
    muscleMassKg: 25.5,
    visceralFat: 2,
    chestCm: 88.5,
    waistCm: 67.5,
    hipsCm: 97.5,
    armCm: 27.2,
    thighCm: 57.0,
    notes: 'Resultados consistentes em 5 semanas: redução de 2.5kg de gordura e mais firmeza.',
    createdAt: '2026-10-05'
  },
  {
    id: 'prog-diogo-1',
    clientId: 'client-diogo-costa',
    date: '2026-07-10',
    weightKg: 77.0,
    bodyFatPercent: 15.0,
    muscleMassKg: 38.5,
    visceralFat: 3,
    chestCm: 101,
    waistCm: 82,
    hipsCm: 97,
    armCm: 35.0,
    thighCm: 58.0,
    notes: 'Início de preparação para a prova de atletismo.',
    createdAt: '2026-07-10'
  },
  {
    id: 'prog-diogo-2',
    clientId: 'client-diogo-costa',
    date: '2026-08-15',
    weightKg: 76.5,
    bodyFatPercent: 14.2,
    muscleMassKg: 38.8,
    visceralFat: 2,
    chestCm: 101.5,
    waistCm: 81,
    hipsCm: 96.5,
    armCm: 35.4,
    thighCm: 58.5,
    notes: 'Ganhos notáveis na capacidade aeróbica e recuperação entre séries.',
    createdAt: '2026-08-15'
  },
  {
    id: 'prog-diogo-3',
    clientId: 'client-diogo-costa',
    date: '2026-09-20',
    weightKg: 76.2,
    bodyFatPercent: 13.8,
    muscleMassKg: 39.0,
    visceralFat: 2,
    chestCm: 102.0,
    waistCm: 80,
    hipsCm: 96.0,
    armCm: 35.8,
    thighCm: 58.8,
    notes: 'Manutenção de peso competitivo e aumento de força isométrica.',
    createdAt: '2026-09-20'
  }
];

export const INITIAL_CUSTOM_METRICS: CustomMetricDefinition[] = [
  {
    id: 'metric-antebraço',
    clientId: 'client-ricardo-silva',
    name: 'Perímetro Antebraço',
    unit: 'cm',
    color: '#f97316',
    description: 'Aferição do maior diâmetro do antebraço em flexão',
    createdAt: '2026-08-15'
  },
  {
    id: 'metric-supino',
    clientId: 'client-ricardo-silva',
    name: 'Carga Máx. Supino',
    unit: 'kg',
    color: '#06b6d4',
    description: '1RM ou carga de treino estimada no supino plano',
    createdAt: '2026-08-15'
  },
  {
    id: 'metric-gluteo',
    clientId: 'client-marta-pereira',
    name: 'Perímetro Glúteo',
    unit: 'cm',
    color: '#ec4899',
    description: 'Maior circunferência da anca/glúteo para tonificação',
    createdAt: '2026-09-01'
  }
];

export const INITIAL_MESSAGES: Message[] = [
  {
    id: 'msg-1',
    clientId: 'client-ricardo-silva',
    coachId: 'coach-sergio-cunha',
    senderId: 'coach-sergio-cunha',
    senderRole: 'coach',
    senderName: 'Coach Sérgio Cunha',
    text: 'Olá Ricardo! Bem-vindo à tua plataforma exclusiva de acompanhamento. Já publiquei o teu novo plano de treino e a ementa nutricional para esta semana.',
    read: true,
    createdAt: '2026-10-05 09:30'
  },
  {
    id: 'msg-2',
    clientId: 'client-ricardo-silva',
    coachId: 'coach-sergio-cunha',
    senderId: 'client-ricardo-silva',
    senderRole: 'client',
    senderName: 'Ricardo Silva',
    text: 'Olá Coach Sérgio! Muito obrigado. Estive a ver o treino de peito de hoje, no supino posso aumentar 2.5kg de cada lado se me sentir bem na 3ª série?',
    read: true,
    createdAt: '2026-10-05 10:15'
  },
  {
    id: 'msg-3',
    clientId: 'client-ricardo-silva',
    coachId: 'coach-sergio-cunha',
    senderId: 'coach-sergio-cunha',
    senderRole: 'coach',
    senderName: 'Coach Sérgio Cunha',
    text: 'Com certeza Ricardo! Desde que mantenhas a técnica limpa e a descida controlada em 3 segundos sem saltar a barra do peito, podes progredir a carga. Lembra-te de apontar na app o peso usado em cada série!',
    read: true,
    createdAt: '2026-10-05 10:22'
  },
  {
    id: 'msg-4',
    clientId: 'client-ricardo-silva',
    coachId: 'coach-sergio-cunha',
    senderId: 'client-ricardo-silva',
    senderRole: 'client',
    senderName: 'Ricardo Silva',
    text: 'Perfeito Sérgio, acabei de registar a carga na 1ª e 2ª série com 70kg e 75kg! O vídeo na app ajudou imenso a acertar o ângulo dos cotovelos.',
    read: true,
    createdAt: '2026-10-05 19:40'
  }
];

export const INITIAL_MEAL_LIBRARY: Meal[] = [
  {
    id: 'lib-meal-aveia-whey',
    name: 'Papas de Aveia Anabólicas & Whey',
    time: '08:00',
    category: 'Pequeno-Almoço',
    description: 'Pequeno-almoço rico em hidratos complexos, proteína de alto valor biológico e antioxidantes.',
    calories: 520,
    proteinG: 42,
    carbsG: 65,
    fatG: 12,
    foods: [
      { item: 'Flocos de aveia finos', quantity: '70g' },
      { item: 'Whey Protein Isolado', quantity: '35g' },
      { item: 'Bagas vermelhas ou mirtilos', quantity: '80g' },
      { item: 'Manteiga de amendoim natural', quantity: '15g' },
      { item: 'Canela de Ceilão em pó', quantity: '1 colher de chá' }
    ]
  },
  {
    id: 'lib-meal-omelete-centeno',
    name: 'Omelete de Claras, Ovos & Pão de Centeio',
    time: '08:00',
    category: 'Pequeno-Almoço',
    description: 'Opção rica em micronutrientes, colina e saciedade prolongada.',
    calories: 510,
    proteinG: 40,
    carbsG: 45,
    fatG: 16,
    foods: [
      { item: 'Ovos inteiros classe L', quantity: '2 unidades' },
      { item: 'Claras de ovo pasteurizadas', quantity: '150ml' },
      { item: 'Pão de centeio 100% integral', quantity: '2 fatias (70g)' },
      { item: 'Espinafres frescos salteados', quantity: '50g' }
    ]
  },
  {
    id: 'lib-meal-panquecas-banana',
    name: 'Panquecas Proteicas de Aveia & Banana',
    time: '08:30',
    category: 'Pequeno-Almoço',
    description: 'Panquecas fáceis e saborosas para dias de treino matinal.',
    calories: 490,
    proteinG: 38,
    carbsG: 60,
    fatG: 10,
    foods: [
      { item: 'Farinha de aveia integral', quantity: '60g' },
      { item: 'Whey Protein baunilha', quantity: '30g' },
      { item: 'Claras de ovo', quantity: '120ml' },
      { item: 'Banana média madura', quantity: '1 unidade' }
    ]
  },
  {
    id: 'lib-meal-frango-basmati',
    name: 'Peito de Frango Grelhado, Arroz Basmati & Brócolos',
    time: '13:00',
    category: 'Almoço',
    description: 'O clássico de recomposição corporal: proteína magra, glicogénio limpo e micronutrientes.',
    calories: 680,
    proteinG: 55,
    carbsG: 75,
    fatG: 18,
    foods: [
      { item: 'Peito de frango grelhado', quantity: '180g (pesado cru)' },
      { item: 'Arroz basmati cozido', quantity: '200g' },
      { item: 'Azeite virgem extra', quantity: '1 colher de sobremesa (10ml)' },
      { item: 'Brócolos ao vapor com sal marinho', quantity: '150g' },
      { item: 'Salada de folhas verdes à vontade', quantity: '1 prato' }
    ]
  },
  {
    id: 'lib-meal-vaca-batata',
    name: 'Carne de Vaca Magra & Batata Branca Cozida',
    time: '13:00',
    category: 'Almoço',
    description: 'Refeição densa em ferro, creatina natural e potássio.',
    calories: 690,
    proteinG: 54,
    carbsG: 75,
    fatG: 18,
    foods: [
      { item: 'Carne de vaca picada < 5% gordura', quantity: '180g' },
      { item: 'Batata branca cozida com casca', quantity: '250g' },
      { item: 'Feijão verde ou curgete grelhada', quantity: '150g' },
      { item: 'Azeite virgem extra', quantity: '1 colher de sobremesa' }
    ]
  },
  {
    id: 'lib-meal-salmao-batatadoce',
    name: 'Lombo de Salmão Fresco & Batata-Doce Assada',
    time: '20:30',
    category: 'Jantar',
    description: 'Fonte nobre de ómega-3 para redução da inflamação e absorção de vitaminas lipossolúveis.',
    calories: 610,
    proteinG: 48,
    carbsG: 40,
    fatG: 24,
    foods: [
      { item: 'Lombo de salmão fresco', quantity: '160g' },
      { item: 'Batata-doce assada no forno', quantity: '180g' },
      { item: 'Espargos verdes salteados', quantity: '120g' },
      { item: 'Gotas de limão e orégãos', quantity: 'A gosto' }
    ]
  },
  {
    id: 'lib-meal-robalo-quinoa',
    name: 'Filete de Robalo no Forno com Quinoa Real',
    time: '20:30',
    category: 'Jantar',
    description: 'Jantar leve com digestão fácil para otimizar o sono profundo e GH noturno.',
    calories: 590,
    proteinG: 50,
    carbsG: 50,
    fatG: 15,
    foods: [
      { item: 'Robalo ou dourada fresca', quantity: '200g' },
      { item: 'Quinoa real cozida', quantity: '160g' },
      { item: 'Tomate cereja e rúcula com azeite', quantity: '1 prato generoso' }
    ]
  },
  {
    id: 'lib-meal-iogurte-nozes',
    name: 'Iogurte Grego 0%, Nozes & Banana',
    time: '17:00',
    category: 'Lanche',
    description: 'Lanche prático ou pré-treino de libertação sustentada.',
    calories: 410,
    proteinG: 30,
    carbsG: 50,
    fatG: 10,
    foods: [
      { item: 'Iogurte grego natural 0% ou Skyr', quantity: '200g' },
      { item: 'Banana média fatiada', quantity: '1 unidade (~100g)' },
      { item: 'Miolo de noz picado', quantity: '15g' },
      { item: 'Canela em pó', quantity: 'A gosto' }
    ]
  },
  {
    id: 'lib-meal-batido-recup',
    name: 'Batido Anabólico de Whey, Aveia & Morangos',
    time: '17:00',
    category: 'Pré/Pós-Treino',
    description: 'Absorção rápida para reposição pós-treino ou lanche de trabalho.',
    calories: 420,
    proteinG: 35,
    carbsG: 55,
    fatG: 8,
    foods: [
      { item: 'Whey Protein Isolado', quantity: '35g' },
      { item: 'Bebida vegetal de amêndoa sem açúcar', quantity: '250ml' },
      { item: 'Farinha de aveia micronizada', quantity: '40g' },
      { item: 'Morangos ou frutos vermelhos congelados', quantity: '100g' }
    ]
  },
  {
    id: 'lib-meal-ceia-caseina',
    name: 'Ceia Anticorpos: Queijo Quark 0% & Infusão Calmante',
    time: '22:45',
    category: 'Ceia',
    description: 'Libertação lenta de aminoácidos durante as horas de sono para evitar catabolismo noturno.',
    calories: 130,
    proteinG: 18,
    carbsG: 4,
    fatG: 2,
    foods: [
      { item: 'Queijo Quark 0% ou Caseína Micelar', quantity: '120g' },
      { item: 'Chá de camomila ou melissa sem açúcar', quantity: '1 caneca' }
    ]
  }
];

export const INITIAL_DAILY_WORKOUT_TEMPLATES: DailyWorkoutTemplate[] = [
  {
    id: 'daily-treino-a-peito-triceps',
    coachId: 'coach-sergio-cunha',
    name: 'Treino A - Peito, Deltoide Anterior & Tríceps',
    focusArea: 'Peitoral & Tríceps',
    notes: 'Aquecimento específico nos manguitos rotadores e progressão nas primeiras 2 séries.',
    exercises: [
      {
        exerciseId: 'ex-supino-reto',
        exerciseName: 'Supino Reto com Barra',
        muscleGroup: 'Peitoral Maior',
        videoUrl: 'https://www.youtube.com/watch?v=rT7DgCr-3pg',
        imageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=600&q=80',
        sets: [
          { setNumber: 1, reps: '10', targetWeightKg: 70, restSeconds: 90, completed: false },
          { setNumber: 2, reps: '10', targetWeightKg: 75, restSeconds: 90, completed: false },
          { setNumber: 3, reps: '8-10', targetWeightKg: 80, restSeconds: 120, completed: false }
        ]
      },
      {
        exerciseId: 'ex-elevacao-lateral',
        exerciseName: 'Elevação Lateral com Halteres',
        muscleGroup: 'Deltoide Lateral',
        videoUrl: 'https://www.youtube.com/watch?v=3VcKaXpzqRo',
        imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=600&q=80',
        sets: [
          { setNumber: 1, reps: '12', targetWeightKg: 12, restSeconds: 60, completed: false },
          { setNumber: 2, reps: '12', targetWeightKg: 12, restSeconds: 60, completed: false },
          { setNumber: 3, reps: '10-12', targetWeightKg: 14, restSeconds: 75, completed: false }
        ]
      },
      {
        exerciseId: 'ex-triceps-corda',
        exerciseName: 'Tríceps na Polia com Corda',
        muscleGroup: 'Tríceps',
        videoUrl: 'https://www.youtube.com/watch?v=vB5OHsJ3EME',
        imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=600&q=80',
        sets: [
          { setNumber: 1, reps: '12', targetWeightKg: 25, restSeconds: 60, completed: false },
          { setNumber: 2, reps: '12', targetWeightKg: 25, restSeconds: 60, completed: false },
          { setNumber: 3, reps: '10', targetWeightKg: 30, restSeconds: 60, completed: false }
        ]
      }
    ],
    createdAt: '2026-09-01'
  },
  {
    id: 'daily-treino-b-costas-biceps',
    coachId: 'coach-sergio-cunha',
    name: 'Treino B - Costas, Deltoide Posterior & Bíceps',
    focusArea: 'Costas & Bíceps',
    notes: 'Manter a coluna neutra e focar na contração escapular em cada puxada.',
    exercises: [
      {
        exerciseId: 'ex-puxada-polia',
        exerciseName: 'Puxada Aberta na Polia Alta',
        muscleGroup: 'Costas / Dorsal',
        videoUrl: 'https://www.youtube.com/watch?v=CAwf7n6Luuc',
        imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80',
        sets: [
          { setNumber: 1, reps: '10', targetWeightKg: 60, restSeconds: 90, completed: false },
          { setNumber: 2, reps: '10', targetWeightKg: 65, restSeconds: 90, completed: false },
          { setNumber: 3, reps: '8', targetWeightKg: 70, restSeconds: 90, completed: false }
        ]
      },
      {
        exerciseId: 'ex-curl-halteres',
        exerciseName: 'Bíceps Curl com Halteres (Supinado)',
        muscleGroup: 'Bíceps',
        videoUrl: 'https://www.youtube.com/watch?v=ykJmrZ5v0Oo',
        imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=600&q=80',
        sets: [
          { setNumber: 1, reps: '12', targetWeightKg: 14, restSeconds: 60, completed: false },
          { setNumber: 2, reps: '10', targetWeightKg: 16, restSeconds: 75, completed: false },
          { setNumber: 3, reps: '10', targetWeightKg: 16, restSeconds: 75, completed: false }
        ]
      }
    ],
    createdAt: '2026-09-02'
  },
  {
    id: 'daily-treino-c-pernas-completo',
    coachId: 'coach-sergio-cunha',
    name: 'Treino C - Pernas, Glúteos & Isquiotibiais',
    focusArea: 'Membros Inferiores',
    notes: 'Controlo excêntrico estrito de 3 segundos na descida.',
    exercises: [
      {
        exerciseId: 'ex-agachamento-livre',
        exerciseName: 'Agachamento Livre com Barra',
        muscleGroup: 'Quadríceps & Glúteos',
        videoUrl: 'https://www.youtube.com/watch?v=bEv6CCg2BC8',
        imageUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=600&q=80',
        sets: [
          { setNumber: 1, reps: '10', targetWeightKg: 80, restSeconds: 120, completed: false },
          { setNumber: 2, reps: '8', targetWeightKg: 90, restSeconds: 120, completed: false },
          { setNumber: 3, reps: '6-8', targetWeightKg: 100, restSeconds: 150, completed: false }
        ]
      },
      {
        exerciseId: 'ex-leg-press',
        exerciseName: 'Leg Press 45º Linear',
        muscleGroup: 'Quadríceps',
        videoUrl: 'https://www.youtube.com/watch?v=IZxyjW7MPJQ',
        imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80',
        sets: [
          { setNumber: 1, reps: '12', targetWeightKg: 160, restSeconds: 90, completed: false },
          { setNumber: 2, reps: '10', targetWeightKg: 180, restSeconds: 90, completed: false },
          { setNumber: 3, reps: '10', targetWeightKg: 200, restSeconds: 120, completed: false }
        ]
      }
    ],
    createdAt: '2026-09-03'
  },
  {
    id: 'daily-treino-d-ombros-core',
    coachId: 'coach-sergio-cunha',
    name: 'Treino D - Ombros, Trapézio & Abdómen',
    focusArea: 'Deltoides & Core',
    notes: 'Tensão contínua sem descanso no topo dos movimentos.',
    exercises: [
      {
        exerciseId: 'ex-elevacao-lateral',
        exerciseName: 'Elevação Lateral com Halteres',
        muscleGroup: 'Deltoide Lateral',
        videoUrl: 'https://www.youtube.com/watch?v=3VcKaXpzqRo',
        imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=600&q=80',
        sets: [
          { setNumber: 1, reps: '15', targetWeightKg: 10, restSeconds: 60, completed: false },
          { setNumber: 2, reps: '12', targetWeightKg: 12, restSeconds: 60, completed: false },
          { setNumber: 3, reps: '12', targetWeightKg: 12, restSeconds: 60, completed: false }
        ]
      },
      {
        exerciseId: 'ex-prancha-isometrica',
        exerciseName: 'Prancha Frontal Isométrica',
        muscleGroup: 'Core / Transverso',
        videoUrl: 'https://www.youtube.com/watch?v=ASdvN_XEl_c',
        imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=600&q=80',
        sets: [
          { setNumber: 1, reps: '60s', restSeconds: 45, completed: false },
          { setNumber: 2, reps: '60s', restSeconds: 45, completed: false },
          { setNumber: 3, reps: '45s', restSeconds: 45, completed: false }
        ]
      }
    ],
    createdAt: '2026-09-04'
  }
];

export const INITIAL_WEEKLY_WORKOUT_TEMPLATES: WeeklyWorkoutTemplate[] = [
  {
    id: 'weekly-hipertrofia-4dias',
    coachId: 'coach-sergio-cunha',
    name: 'Mesociclo de Hipertrofia & Força (4 Dias A/B/C/D)',
    description: 'Divisão clássica com descanso ativo a meio da semana e foco na progressão de cargas.',
    days: [
      {
        dayOfWeek: 'Segunda-feira',
        dayIndex: 0,
        dailyWorkoutId: 'daily-treino-a-peito-triceps',
        dailyWorkoutName: 'Treino A - Peito, Deltoide Anterior & Tríceps',
        isRestDay: false,
        exercises: INITIAL_DAILY_WORKOUT_TEMPLATES[0].exercises
      },
      {
        dayOfWeek: 'Terça-feira',
        dayIndex: 1,
        dailyWorkoutId: 'daily-treino-b-costas-biceps',
        dailyWorkoutName: 'Treino B - Costas, Deltoide Posterior & Bíceps',
        isRestDay: false,
        exercises: INITIAL_DAILY_WORKOUT_TEMPLATES[1].exercises
      },
      {
        dayOfWeek: 'Quarta-feira',
        dayIndex: 2,
        isRestDay: true,
        exercises: []
      },
      {
        dayOfWeek: 'Quinta-feira',
        dayIndex: 3,
        dailyWorkoutId: 'daily-treino-c-pernas-completo',
        dailyWorkoutName: 'Treino C - Pernas, Glúteos & Isquiotibiais',
        isRestDay: false,
        exercises: INITIAL_DAILY_WORKOUT_TEMPLATES[2].exercises
      },
      {
        dayOfWeek: 'Sexta-feira',
        dayIndex: 4,
        dailyWorkoutId: 'daily-treino-d-ombros-core',
        dailyWorkoutName: 'Treino D - Ombros, Trapézio & Abdómen',
        isRestDay: false,
        exercises: INITIAL_DAILY_WORKOUT_TEMPLATES[3].exercises
      },
      {
        dayOfWeek: 'Sábado',
        dayIndex: 5,
        isRestDay: true,
        exercises: []
      },
      {
        dayOfWeek: 'Domingo',
        dayIndex: 6,
        isRestDay: true,
        exercises: []
      }
    ],
    createdAt: '2026-09-01'
  },
  {
    id: 'weekly-fullbody-3dias',
    coachId: 'coach-sergio-cunha',
    name: 'Rotina Full Body 3x por Semana',
    description: 'Ideal para alunos com horários apertados ou em fase de retorno.',
    days: [
      {
        dayOfWeek: 'Segunda-feira',
        dayIndex: 0,
        dailyWorkoutId: 'daily-treino-a-peito-triceps',
        dailyWorkoutName: 'Full Body A - Ênfase Empurrar & Pernas',
        isRestDay: false,
        exercises: INITIAL_DAILY_WORKOUT_TEMPLATES[0].exercises
      },
      {
        dayOfWeek: 'Terça-feira',
        dayIndex: 1,
        isRestDay: true,
        exercises: []
      },
      {
        dayOfWeek: 'Quarta-feira',
        dayIndex: 2,
        dailyWorkoutId: 'daily-treino-b-costas-biceps',
        dailyWorkoutName: 'Full Body B - Ênfase Puxar & Posterior',
        isRestDay: false,
        exercises: INITIAL_DAILY_WORKOUT_TEMPLATES[1].exercises
      },
      {
        dayOfWeek: 'Quinta-feira',
        dayIndex: 3,
        isRestDay: true,
        exercises: []
      },
      {
        dayOfWeek: 'Sexta-feira',
        dayIndex: 4,
        dailyWorkoutId: 'daily-treino-c-pernas-completo',
        dailyWorkoutName: 'Full Body C - Pernas & Core',
        isRestDay: false,
        exercises: INITIAL_DAILY_WORKOUT_TEMPLATES[2].exercises
      },
      {
        dayOfWeek: 'Sábado',
        dayIndex: 5,
        isRestDay: true,
        exercises: []
      },
      {
        dayOfWeek: 'Domingo',
        dayIndex: 6,
        isRestDay: true,
        exercises: []
      }
    ],
    createdAt: '2026-09-05'
  }
];

export const INITIAL_DAILY_MEAL_TEMPLATES: DailyMealTemplate[] = [
  {
    id: 'daily-meal-hipertrofia-2400',
    coachId: 'coach-sergio-cunha',
    name: 'Ementa Hipertrofia Limpa - 2400 kcal (160g Prot)',
    meals: INITIAL_MEAL_LIBRARY.slice(0, 4),
    totalCalories: 2380,
    totalProtein: 165,
    totalCarbs: 260,
    totalFat: 68,
    notes: 'Beber 3L de água e espaçar as refeições a cada 3 a 4 horas.',
    createdAt: '2026-09-01'
  },
  {
    id: 'daily-meal-definicao-1900',
    coachId: 'coach-sergio-cunha',
    name: 'Ementa Definição & Défice - 1900 kcal (155g Prot)',
    meals: [INITIAL_MEAL_LIBRARY[0], INITIAL_MEAL_LIBRARY[2], INITIAL_MEAL_LIBRARY[5]],
    totalCalories: 1910,
    totalProtein: 155,
    totalCarbs: 170,
    totalFat: 55,
    notes: 'Priorizar vegetais folhosos verdes no almoço e jantar para saciedade.',
    createdAt: '2026-09-02'
  }
];

export const INITIAL_WEEKLY_MEAL_TEMPLATES: WeeklyMealTemplate[] = [
  {
    id: 'weekly-nutri-hipertrofia',
    coachId: 'coach-sergio-cunha',
    name: 'Plano Semanal Hipertrofia & Rendimento (2400 kcal)',
    description: 'Plano padrão balanceado de alta densidade nutricional para ganho de massa limpa.',
    days: [
      {
        dayOfWeek: 'Segunda-feira',
        dayIndex: 0,
        dailyMealId: 'daily-meal-hipertrofia-2400',
        dailyMealName: 'Ementa Hipertrofia Limpa - 2400 kcal',
        meals: INITIAL_DAILY_MEAL_TEMPLATES[0].meals,
        totalCalories: 2380
      },
      {
        dayOfWeek: 'Terça-feira',
        dayIndex: 1,
        dailyMealId: 'daily-meal-hipertrofia-2400',
        dailyMealName: 'Ementa Hipertrofia Limpa - 2400 kcal',
        meals: INITIAL_DAILY_MEAL_TEMPLATES[0].meals,
        totalCalories: 2380
      },
      {
        dayOfWeek: 'Quarta-feira',
        dayIndex: 2,
        dailyMealId: 'daily-meal-hipertrofia-2400',
        dailyMealName: 'Ementa Hipertrofia Limpa - 2400 kcal',
        meals: INITIAL_DAILY_MEAL_TEMPLATES[0].meals,
        totalCalories: 2380
      },
      {
        dayOfWeek: 'Quinta-feira',
        dayIndex: 3,
        dailyMealId: 'daily-meal-hipertrofia-2400',
        dailyMealName: 'Ementa Hipertrofia Limpa - 2400 kcal',
        meals: INITIAL_DAILY_MEAL_TEMPLATES[0].meals,
        totalCalories: 2380
      },
      {
        dayOfWeek: 'Sexta-feira',
        dayIndex: 4,
        dailyMealId: 'daily-meal-hipertrofia-2400',
        dailyMealName: 'Ementa Hipertrofia Limpa - 2400 kcal',
        meals: INITIAL_DAILY_MEAL_TEMPLATES[0].meals,
        totalCalories: 2380
      },
      {
        dayOfWeek: 'Sábado',
        dayIndex: 5,
        dailyMealId: 'daily-meal-hipertrofia-2400',
        dailyMealName: 'Ementa Hipertrofia Limpa - 2400 kcal',
        meals: INITIAL_DAILY_MEAL_TEMPLATES[0].meals,
        totalCalories: 2380
      },
      {
        dayOfWeek: 'Domingo',
        dayIndex: 6,
        dailyMealId: 'daily-meal-definicao-1900',
        dailyMealName: 'Ementa Dia de Descanso - 1900 kcal',
        meals: INITIAL_DAILY_MEAL_TEMPLATES[1].meals,
        totalCalories: 1910
      }
    ],
    createdAt: '2026-09-01'
  }
];

export const INITIAL_MEAL_ADHERENCE_LOGS: MealAdherenceLog[] = [
  // Ricardo Silva (Segunda-feira) - 4/4 Cumpridas
  { id: 'adh-r-0-1', clientId: 'client-ricardo-silva', dayIndex: 0, dayOfWeek: 'Segunda-feira', mealId: 'meal-d0-1', mealName: 'Pequeno-Almoço', time: '08:00', status: 'completed', date: '2026-10-05' },
  { id: 'adh-r-0-2', clientId: 'client-ricardo-silva', dayIndex: 0, dayOfWeek: 'Segunda-feira', mealId: 'meal-d0-2', mealName: 'Almoço', time: '13:00', status: 'completed', date: '2026-10-05' },
  { id: 'adh-r-0-3', clientId: 'client-ricardo-silva', dayIndex: 0, dayOfWeek: 'Segunda-feira', mealId: 'meal-d0-3', mealName: 'Lanche', time: '17:00', status: 'completed', date: '2026-10-05' },
  { id: 'adh-r-0-4', clientId: 'client-ricardo-silva', dayIndex: 0, dayOfWeek: 'Segunda-feira', mealId: 'meal-d0-4', mealName: 'Jantar', time: '20:30', status: 'completed', date: '2026-10-05' },

  // Ricardo Silva (Terça-feira) - 4/4 Cumpridas
  { id: 'adh-r-1-1', clientId: 'client-ricardo-silva', dayIndex: 1, dayOfWeek: 'Terça-feira', mealId: 'meal-d1-1', mealName: 'Pequeno-Almoço', time: '08:00', status: 'completed', date: '2026-10-06' },
  { id: 'adh-r-1-2', clientId: 'client-ricardo-silva', dayIndex: 1, dayOfWeek: 'Terça-feira', mealId: 'meal-d1-2', mealName: 'Almoço', time: '13:00', status: 'completed', date: '2026-10-06' },
  { id: 'adh-r-1-3', clientId: 'client-ricardo-silva', dayIndex: 1, dayOfWeek: 'Terça-feira', mealId: 'meal-d1-3', mealName: 'Lanche', time: '17:00', status: 'completed', date: '2026-10-06' },
  { id: 'adh-r-1-4', clientId: 'client-ricardo-silva', dayIndex: 1, dayOfWeek: 'Terça-feira', mealId: 'meal-d1-4', mealName: 'Jantar', time: '20:30', status: 'completed', date: '2026-10-06' },

  // Ricardo Silva (Quarta-feira) - 3/4 Cumpridas (1 Falta no Lanche)
  { id: 'adh-r-2-1', clientId: 'client-ricardo-silva', dayIndex: 2, dayOfWeek: 'Quarta-feira', mealId: 'meal-d2-1', mealName: 'Pequeno-Almoço', time: '08:00', status: 'completed', date: '2026-10-07' },
  { id: 'adh-r-2-2', clientId: 'client-ricardo-silva', dayIndex: 2, dayOfWeek: 'Quarta-feira', mealId: 'meal-d2-2', mealName: 'Almoço', time: '13:00', status: 'completed', date: '2026-10-07' },
  { id: 'adh-r-2-3', clientId: 'client-ricardo-silva', dayIndex: 2, dayOfWeek: 'Quarta-feira', mealId: 'meal-d2-3', mealName: 'Lanche', time: '17:00', status: 'missed', missedReason: 'Reunião de trabalho urgente às 17h; aluno não conseguiu realizar o lanche e saltou para o jantar.', date: '2026-10-07' },
  { id: 'adh-r-2-4', clientId: 'client-ricardo-silva', dayIndex: 2, dayOfWeek: 'Quarta-feira', mealId: 'meal-d2-4', mealName: 'Jantar', time: '20:30', status: 'completed', date: '2026-10-07' },

  // Ricardo Silva (Quinta-feira) - 4/4 Cumpridas
  { id: 'adh-r-3-1', clientId: 'client-ricardo-silva', dayIndex: 3, dayOfWeek: 'Quinta-feira', mealId: 'meal-d3-1', mealName: 'Pequeno-Almoço', time: '08:00', status: 'completed', date: '2026-10-08' },
  { id: 'adh-r-3-2', clientId: 'client-ricardo-silva', dayIndex: 3, dayOfWeek: 'Quinta-feira', mealId: 'meal-d3-2', mealName: 'Almoço', time: '13:00', status: 'completed', date: '2026-10-08' },
  { id: 'adh-r-3-3', clientId: 'client-ricardo-silva', dayIndex: 3, dayOfWeek: 'Quinta-feira', mealId: 'meal-d3-3', mealName: 'Lanche', time: '17:00', status: 'completed', date: '2026-10-08' },
  { id: 'adh-r-3-4', clientId: 'client-ricardo-silva', dayIndex: 3, dayOfWeek: 'Quinta-feira', mealId: 'meal-d3-4', mealName: 'Jantar', time: '20:30', status: 'completed', date: '2026-10-08' },

  // Ricardo Silva (Sexta-feira) - 3/4 Cumpridas (1 Falta no Jantar)
  { id: 'adh-r-4-1', clientId: 'client-ricardo-silva', dayIndex: 4, dayOfWeek: 'Sexta-feira', mealId: 'meal-d4-1', mealName: 'Pequeno-Almoço', time: '08:00', status: 'completed', date: '2026-10-09' },
  { id: 'adh-r-4-2', clientId: 'client-ricardo-silva', dayIndex: 4, dayOfWeek: 'Sexta-feira', mealId: 'meal-d4-2', mealName: 'Almoço', time: '13:00', status: 'completed', date: '2026-10-09' },
  { id: 'adh-r-4-3', clientId: 'client-ricardo-silva', dayIndex: 4, dayOfWeek: 'Sexta-feira', mealId: 'meal-d4-3', mealName: 'Lanche', time: '17:00', status: 'completed', date: '2026-10-09' },
  { id: 'adh-r-4-4', clientId: 'client-ricardo-silva', dayIndex: 4, dayOfWeek: 'Sexta-feira', mealId: 'meal-d4-4', mealName: 'Jantar', time: '20:30', status: 'missed', missedReason: 'Treino tardio e cansaço extremo; aluno saltou a refeição completa do jantar e foi dormir sem comer.', date: '2026-10-09' },

  // Ricardo Silva (Sábado) - 3/4 Cumpridas (1 Falta no Almoço)
  { id: 'adh-r-5-1', clientId: 'client-ricardo-silva', dayIndex: 5, dayOfWeek: 'Sábado', mealId: 'meal-d5-1', mealName: 'Pequeno-Almoço', time: '09:00', status: 'completed', date: '2026-10-10' },
  { id: 'adh-r-5-2', clientId: 'client-ricardo-silva', dayIndex: 5, dayOfWeek: 'Sábado', mealId: 'meal-d5-2', mealName: 'Almoço', time: '13:30', status: 'missed', missedReason: 'Almoço em restaurante com família; não foi possível cumprir o cardápio prescrito (ingeriu opção calórica livre).', date: '2026-10-10' },
  { id: 'adh-r-5-3', clientId: 'client-ricardo-silva', dayIndex: 5, dayOfWeek: 'Sábado', mealId: 'meal-d5-3', mealName: 'Lanche', time: '17:30', status: 'completed', date: '2026-10-10' },
  { id: 'adh-r-5-4', clientId: 'client-ricardo-silva', dayIndex: 5, dayOfWeek: 'Sábado', mealId: 'meal-d5-4', mealName: 'Jantar', time: '21:00', status: 'completed', date: '2026-10-10' },

  // Ricardo Silva (Domingo) - 4/4 Cumpridas
  { id: 'adh-r-6-1', clientId: 'client-ricardo-silva', dayIndex: 6, dayOfWeek: 'Domingo', mealId: 'meal-d6-1', mealName: 'Pequeno-Almoço', time: '09:00', status: 'completed', date: '2026-10-11' },
  { id: 'adh-r-6-2', clientId: 'client-ricardo-silva', dayIndex: 6, dayOfWeek: 'Domingo', mealId: 'meal-d6-2', mealName: 'Almoço', time: '13:30', status: 'completed', date: '2026-10-11' },
  { id: 'adh-r-6-3', clientId: 'client-ricardo-silva', dayIndex: 6, dayOfWeek: 'Domingo', mealId: 'meal-d6-3', mealName: 'Lanche', time: '17:00', status: 'completed', date: '2026-10-11' },
  { id: 'adh-r-6-4', clientId: 'client-ricardo-silva', dayIndex: 6, dayOfWeek: 'Domingo', mealId: 'meal-d6-4', mealName: 'Jantar', time: '20:30', status: 'completed', date: '2026-10-11' },

  // Marta Pereira (Segunda-feira) - 4/4 Cumpridas
  { id: 'adh-m-0-1', clientId: 'client-marta-pereira', dayIndex: 0, dayOfWeek: 'Segunda-feira', mealId: 'm-meal-d0-1', mealName: 'Pequeno-Almoço', time: '08:30', status: 'completed', date: '2026-10-05' },
  { id: 'adh-m-0-2', clientId: 'client-marta-pereira', dayIndex: 0, dayOfWeek: 'Segunda-feira', mealId: 'm-meal-d0-2', mealName: 'Almoço', time: '13:00', status: 'completed', date: '2026-10-05' },
  { id: 'adh-m-0-3', clientId: 'client-marta-pereira', dayIndex: 0, dayOfWeek: 'Segunda-feira', mealId: 'm-meal-d0-3', mealName: 'Lanche', time: '17:00', status: 'completed', date: '2026-10-05' },
  { id: 'adh-m-0-4', clientId: 'client-marta-pereira', dayIndex: 0, dayOfWeek: 'Segunda-feira', mealId: 'm-meal-d0-4', mealName: 'Jantar', time: '20:30', status: 'completed', date: '2026-10-05' },

  // Marta Pereira (Terça-feira) - 3/4 Cumpridas (1 Falta no Lanche)
  { id: 'adh-m-1-1', clientId: 'client-marta-pereira', dayIndex: 1, dayOfWeek: 'Terça-feira', mealId: 'm-meal-d1-1', mealName: 'Pequeno-Almoço', time: '08:30', status: 'completed', date: '2026-10-06' },
  { id: 'adh-m-1-2', clientId: 'client-marta-pereira', dayIndex: 1, dayOfWeek: 'Terça-feira', mealId: 'm-meal-d1-2', mealName: 'Almoço', time: '13:00', status: 'completed', date: '2026-10-06' },
  { id: 'adh-m-1-3', clientId: 'client-marta-pereira', dayIndex: 1, dayOfWeek: 'Terça-feira', mealId: 'm-meal-d1-3', mealName: 'Lanche', time: '17:00', status: 'missed', missedReason: 'Consulta médica no final da tarde; não teve oportunidade de lanchar.', date: '2026-10-06' },
  { id: 'adh-m-1-4', clientId: 'client-marta-pereira', dayIndex: 1, dayOfWeek: 'Terça-feira', mealId: 'm-meal-d1-4', mealName: 'Jantar', time: '20:30', status: 'completed', date: '2026-10-06' },

  // Marta Pereira (Quarta a Domingo)
  { id: 'adh-m-2-1', clientId: 'client-marta-pereira', dayIndex: 2, dayOfWeek: 'Quarta-feira', mealId: 'm-meal-d2-1', mealName: 'Pequeno-Almoço', time: '08:30', status: 'completed', date: '2026-10-07' },
  { id: 'adh-m-2-2', clientId: 'client-marta-pereira', dayIndex: 2, dayOfWeek: 'Quarta-feira', mealId: 'm-meal-d2-2', mealName: 'Almoço', time: '13:00', status: 'completed', date: '2026-10-07' },
  { id: 'adh-m-2-3', clientId: 'client-marta-pereira', dayIndex: 2, dayOfWeek: 'Quarta-feira', mealId: 'm-meal-d2-3', mealName: 'Lanche', time: '17:00', status: 'completed', date: '2026-10-07' },
  { id: 'adh-m-2-4', clientId: 'client-marta-pereira', dayIndex: 2, dayOfWeek: 'Quarta-feira', mealId: 'm-meal-d2-4', mealName: 'Jantar', time: '20:30', status: 'completed', date: '2026-10-07' },

  { id: 'adh-m-3-1', clientId: 'client-marta-pereira', dayIndex: 3, dayOfWeek: 'Quinta-feira', mealId: 'm-meal-d3-1', mealName: 'Pequeno-Almoço', time: '08:30', status: 'completed', date: '2026-10-08' },
  { id: 'adh-m-3-2', clientId: 'client-marta-pereira', dayIndex: 3, dayOfWeek: 'Quinta-feira', mealId: 'm-meal-d3-2', mealName: 'Almoço', time: '13:00', status: 'completed', date: '2026-10-08' },
  { id: 'adh-m-3-3', clientId: 'client-marta-pereira', dayIndex: 3, dayOfWeek: 'Quinta-feira', mealId: 'm-meal-d3-3', mealName: 'Lanche', time: '17:00', status: 'completed', date: '2026-10-08' },
  { id: 'adh-m-3-4', clientId: 'client-marta-pereira', dayIndex: 3, dayOfWeek: 'Quinta-feira', mealId: 'm-meal-d3-4', mealName: 'Jantar', time: '20:30', status: 'completed', date: '2026-10-08' },

  { id: 'adh-m-4-1', clientId: 'client-marta-pereira', dayIndex: 4, dayOfWeek: 'Sexta-feira', mealId: 'm-meal-d4-1', mealName: 'Pequeno-Almoço', time: '08:30', status: 'completed', date: '2026-10-09' },
  { id: 'adh-m-4-2', clientId: 'client-marta-pereira', dayIndex: 4, dayOfWeek: 'Sexta-feira', mealId: 'm-meal-d4-2', mealName: 'Almoço', time: '13:00', status: 'completed', date: '2026-10-09' },
  { id: 'adh-m-4-3', clientId: 'client-marta-pereira', dayIndex: 4, dayOfWeek: 'Sexta-feira', mealId: 'm-meal-d4-3', mealName: 'Lanche', time: '17:00', status: 'completed', date: '2026-10-09' },
  { id: 'adh-m-4-4', clientId: 'client-marta-pereira', dayIndex: 4, dayOfWeek: 'Sexta-feira', mealId: 'm-meal-d4-4', mealName: 'Jantar', time: '20:30', status: 'completed', date: '2026-10-09' },

  { id: 'adh-m-5-1', clientId: 'client-marta-pereira', dayIndex: 5, dayOfWeek: 'Sábado', mealId: 'm-meal-d5-1', mealName: 'Pequeno-Almoço', time: '09:00', status: 'completed', date: '2026-10-10' },
  { id: 'adh-m-5-2', clientId: 'client-marta-pereira', dayIndex: 5, dayOfWeek: 'Sábado', mealId: 'm-meal-d5-2', mealName: 'Almoço', time: '13:30', status: 'completed', date: '2026-10-10' },
  { id: 'adh-m-5-3', clientId: 'client-marta-pereira', dayIndex: 5, dayOfWeek: 'Sábado', mealId: 'm-meal-d5-3', mealName: 'Lanche', time: '17:30', status: 'completed', date: '2026-10-10' },
  { id: 'adh-m-5-4', clientId: 'client-marta-pereira', dayIndex: 5, dayOfWeek: 'Sábado', mealId: 'm-meal-d5-4', mealName: 'Jantar', time: '21:00', status: 'completed', date: '2026-10-10' },

  { id: 'adh-m-6-1', clientId: 'client-marta-pereira', dayIndex: 6, dayOfWeek: 'Domingo', mealId: 'm-meal-d6-1', mealName: 'Pequeno-Almoço', time: '09:00', status: 'completed', date: '2026-10-11' },
  { id: 'adh-m-6-2', clientId: 'client-marta-pereira', dayIndex: 6, dayOfWeek: 'Domingo', mealId: 'm-meal-d6-2', mealName: 'Almoço', time: '13:30', status: 'completed', date: '2026-10-11' },
  { id: 'adh-m-6-3', clientId: 'client-marta-pereira', dayIndex: 6, dayOfWeek: 'Domingo', mealId: 'm-meal-d6-3', mealName: 'Lanche', time: '17:00', status: 'completed', date: '2026-10-11' },
  { id: 'adh-m-6-4', clientId: 'client-marta-pereira', dayIndex: 6, dayOfWeek: 'Domingo', mealId: 'm-meal-d6-4', mealName: 'Jantar', time: '20:30', status: 'completed', date: '2026-10-11' }
];
