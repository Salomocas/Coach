import { Exercise, WorkoutPlan, NutritionPlan, NutritionTemplate, ProgressLog, Message, UserProfile, Meal } from './types';

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
          id: 'meal-1',
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
          id: 'meal-2',
          name: 'Almoço (Refeição Principal)',
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
          id: 'meal-3',
          name: 'Lanche / Pré-Treino',
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
          id: 'meal-4',
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
        },
        {
          id: 'meal-5',
          name: 'Ceia (Opcional)',
          time: '22:45',
          description: 'Infusão calmante com proteína de lenta absorção',
          calories: 130,
          proteinG: 15,
          carbsG: 3,
          fatG: 2,
          foods: [
            { item: 'Caseína Micelar ou Queijo Quark 0%', quantity: '100g' },
            { item: 'Chá de camomila ou valeriana', quantity: '1 caneca quente' }
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
          id: 'meal-t-1',
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
          id: 'meal-t-2',
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
          id: 'meal-t-3',
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
          id: 'meal-t-4',
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
      totalCalories: 2150,
      totalProtein: 180,
      totalCarbs: 180,
      totalFat: 65,
      waterIntakeLiters: 3.0,
      notes: 'Dia sem treino intenso: ligeira redução de hidratos para compensar menor gasto calórico.',
      meals: []
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
      meals: []
    },
    {
      dayOfWeek: 'Sexta-feira',
      dayIndex: 4,
      totalCalories: 2350,
      totalProtein: 180,
      totalCarbs: 230,
      totalFat: 65,
      waterIntakeLiters: 3.5,
      notes: 'Manter disciplina ao jantar.',
      meals: []
    },
    {
      dayOfWeek: 'Sábado',
      dayIndex: 5,
      totalCalories: 2300,
      totalProtein: 175,
      totalCarbs: 220,
      totalFat: 65,
      waterIntakeLiters: 3.0,
      notes: 'Fim de semana controlado.',
      meals: []
    },
    {
      dayOfWeek: 'Domingo',
      dayIndex: 6,
      totalCalories: 2200,
      totalProtein: 175,
      totalCarbs: 200,
      totalFat: 65,
      waterIntakeLiters: 3.0,
      notes: 'Preparação dos tupperwares para a próxima semana!',
      meals: []
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
          id: 'm-meal-1',
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
          id: 'm-meal-2',
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
          id: 'm-meal-3',
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
          id: 'm-meal-4',
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
    photoSide: 'https://images.unsplash.com/photo-1534367507873-d2d7e24c797f?auto=format&fit=crop&w=400&q=80',
    photoBack: 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?auto=format&fit=crop&w=400&q=80',
    notes: 'Avaliação inicial com o Coach Sérgio Cunha. Início do plano de recomposição.',
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
    photoFront: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=400&q=80',
    photoSide: 'https://images.unsplash.com/photo-1534367507873-d2d7e24c797f?auto=format&fit=crop&w=400&q=80',
    photoBack: 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?auto=format&fit=crop&w=400&q=80',
    notes: 'Meta de 80kg batida! Definição abdominal visível e melhoria notória no tónus.',
    createdAt: '2026-10-01'
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

