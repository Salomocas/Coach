/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { LogoProvider } from './context/LogoContext';
import { Navbar } from './components/Navbar';
import { ClientSidebar } from './components/ClientSidebar';
import { CoachSidebar } from './components/CoachSidebar';
import { SubscriptionGate } from './components/SubscriptionGate';
import { EmailVerificationBanner } from './components/EmailVerificationBanner';
import { CoachCunhaLogo } from './components/CoachCunhaLogo';
import { AuthPortalView } from './views/auth/AuthPortalView';

// Client Views
import { ClientCalendarView } from './views/client/ClientCalendarView';
import { ClientNutritionView } from './views/client/ClientNutritionView';
import { ClientChatView } from './views/client/ClientChatView';
import { ClientProgressView } from './views/client/ClientProgressView';
import { ClientSubscriptionView } from './views/client/ClientSubscriptionView';

// Coach Views
import { CoachAthletesView } from './views/coach/CoachAthletesView';
import { CoachReportsView } from './views/coach/CoachReportsView';
import { CoachWorkoutsView } from './views/coach/CoachWorkoutsView';
import { CoachDietView } from './views/coach/CoachDietView';
import { CoachLibraryView } from './views/coach/CoachLibraryView';
import { CoachChatView } from './views/coach/CoachChatView';
import { CoachAssetsView } from './views/coach/CoachAssetsView';

const MainLayout: React.FC = () => {
  const { isCoach, isSubscriptionActive } = useAuth();
  
  // Tab states - Coach defaults straight to athlete management (athletes)
  const [clientTab, setClientTab] = useState<string>('calendar');
  const [coachTab, setCoachTab] = useState<string>('athletes');

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-neutral-950 text-slate-900 dark:text-neutral-100 flex flex-col font-sans selection:bg-amber-500 selection:text-black transition-colors duration-150">
      
      {/* Top Navigation */}
      <Navbar 
        onNavigateClient={(tab) => setClientTab(tab)} 
        onNavigateCoach={(tab) => setCoachTab(tab)} 
      />

      {/* Email Verification Alert Banner for newly registered students */}
      <EmailVerificationBanner />

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
            // COACH & ADMIN VIEWS
            <>
              {coachTab === 'athletes' && (
                <CoachAthletesView onNavigateTab={(tab) => setCoachTab(tab)} />
              )}
              {coachTab === 'reports' && (
                <CoachReportsView />
              )}
              {(coachTab === 'workouts' || coachTab === 'builder-workout') && (
                <CoachWorkoutsView />
              )}
              {(coachTab === 'diet' || coachTab === 'builder-nutrition') && (
                <CoachDietView />
              )}
              {(coachTab === 'library' || coachTab === 'exercises') && (
                <CoachLibraryView />
              )}
              {coachTab === 'chat' && (
                <CoachChatView />
              )}
              {coachTab === 'assets' && (
                <CoachAssetsView />
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

const AppContent: React.FC = () => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-6 text-neutral-100 select-none">
        <CoachCunhaLogo size="hero" />
        <div className="flex items-center gap-2.5 mt-8 text-amber-400 font-extrabold text-xs tracking-widest uppercase">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
          <span>A carregar Coach Cunha Project...</span>
        </div>
      </div>
    );
  }

  // If no user is authenticated, show the full-page dedicated Authentication Portal
  if (!currentUser) {
    return <AuthPortalView />;
  }

  return <MainLayout />;
};

export default function App() {
  return (
    <ThemeProvider>
      <LogoProvider>
        <AuthProvider>
          <DataProvider>
            <AppContent />
          </DataProvider>
        </AuthProvider>
      </LogoProvider>
    </ThemeProvider>
  );
}
