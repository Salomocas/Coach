/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { Navbar } from './components/Navbar';
import { ClientSidebar } from './components/ClientSidebar';
import { CoachSidebar } from './components/CoachSidebar';
import { SubscriptionGate } from './components/SubscriptionGate';

// Client Views
import { ClientCalendarView } from './views/client/ClientCalendarView';
import { ClientNutritionView } from './views/client/ClientNutritionView';
import { ClientChatView } from './views/client/ClientChatView';
import { ClientProgressView } from './views/client/ClientProgressView';
import { ClientSubscriptionView } from './views/client/ClientSubscriptionView';

// Coach Views
import { CoachDashboard } from './views/coach/CoachDashboard';
import { CoachAthletesView } from './views/coach/CoachAthletesView';
import { CoachExercisesView } from './views/coach/CoachExercisesView';
import { CoachWorkoutBuilderView } from './views/coach/CoachWorkoutBuilderView';
import { CoachNutritionBuilderView } from './views/coach/CoachNutritionBuilderView';
import { CoachChatView } from './views/coach/CoachChatView';

const MainLayout: React.FC = () => {
  const { currentUser, isCoach, isSubscriptionActive } = useAuth();
  
  // Tab states
  const [clientTab, setClientTab] = useState<string>('calendar');
  const [coachTab, setCoachTab] = useState<string>('dashboard');

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans selection:bg-amber-500 selection:text-black">
      
      {/* Top Navigation */}
      <Navbar 
        onNavigateClient={(tab) => setClientTab(tab)} 
        onNavigateCoach={(tab) => setCoachTab(tab)} 
      />

      {/* Main Body */}
      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        
        {/* Left Vertical Menu */}
        {isCoach ? (
          <CoachSidebar 
            currentTab={coachTab} 
            onSelectTab={(tab) => setCoachTab(tab)} 
          />
        ) : (
          <ClientSidebar 
            currentTab={clientTab} 
            onSelectTab={(tab) => setClientTab(tab)} 
          />
        )}

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl pb-24 md:pb-8">
          
          {isCoach ? (
            // COACH VIEWS
            <>
              {coachTab === 'dashboard' && (
                <CoachDashboard onNavigateTab={(tab) => setCoachTab(tab)} />
              )}
              {coachTab === 'athletes' && (
                <CoachAthletesView onNavigateTab={(tab) => setCoachTab(tab)} />
              )}
              {coachTab === 'exercises' && (
                <CoachExercisesView />
              )}
              {coachTab === 'builder-workout' && (
                <CoachWorkoutBuilderView />
              )}
              {coachTab === 'builder-nutrition' && (
                <CoachNutritionBuilderView />
              )}
              {coachTab === 'chat' && (
                <CoachChatView />
              )}
            </>
          ) : (
            // CLIENT VIEWS
            <>
              {!isSubscriptionActive && clientTab !== 'subscription' ? (
                // Subscription Gate: prevents entering routines if monthly payment is pending
                <SubscriptionGate onSuccess={() => setClientTab('calendar')} />
              ) : (
                <>
                  {clientTab === 'calendar' && <ClientCalendarView />}
                  {clientTab === 'nutrition' && <ClientNutritionView />}
                  {clientTab === 'chat' && <ClientChatView />}
                  {clientTab === 'progress' && <ClientProgressView />}
                  {clientTab === 'subscription' && <ClientSubscriptionView />}
                </>
              )}
            </>
          )}

        </main>
      </div>

    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <MainLayout />
      </DataProvider>
    </AuthProvider>
  );
}
