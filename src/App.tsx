/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { AboutSection } from './components/AboutSection';
import { ServicesSection } from './components/ServicesSection';
import { ProcessSection } from './components/ProcessSection';
import { ValidationTransparencySection } from './components/ValidationTransparencySection';
import { EstimatorFlow } from './components/EstimatorFlow';
import { ChatbotWidget } from './components/ChatbotWidget';
import { ProjectDossierModal } from './components/ProjectDossierModal';
import { LeadSuccessModal } from './components/LeadSuccessModal';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { HouseVideoModal } from './components/HouseVideoModal';
import { CrmNotificationToast } from './components/CrmNotificationToast';
import { CrmLeadsDrawer } from './components/CrmLeadsDrawer';
import { CalendarScheduleModal } from './components/CalendarScheduleModal';
import { initAuth, googleSignIn, logout, auth } from './lib/firebase';
import { subscribeToFirestoreLeads } from './services/firestoreService';
import { EstimationResult, LeadRecord, ProjectType } from './types';
import { Box, Sparkles, X, ArrowRight, ShieldCheck, MapPin } from 'lucide-react';
import { User } from 'firebase/auth';

export default function App() {
  // Modal states
  const [isEstimatorModalOpen, setIsEstimatorModalOpen] = useState(false);
  const [estimatorInitialStep, setEstimatorInitialStep] = useState(1);
  const [estimatorInitialType, setEstimatorInitialType] = useState<ProjectType>('obra_nueva');

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [dossierResult, setDossierResult] = useState<EstimationResult | null>(null);
  const [leadSuccessResult, setLeadSuccessResult] = useState<EstimationResult | null>(null);
  const [isLeadSuccessOpen, setIsLeadSuccessOpen] = useState(false);
  const [calendarEstimation, setCalendarEstimation] = useState<EstimationResult | null>(null);

  // Auth User State
  const [currentUser, setCurrentUser] = useState<User | null>(auth.currentUser);

  // CRM Leads State (simulating persistent relational database lead repository & synced with Firestore)
  const [leads, setLeads] = useState<LeadRecord[]>(() => {
    try {
      const saved = localStorage.getItem('project3d_leads');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [];
  });
  const [latestLead, setLatestLead] = useState<LeadRecord | null>(null);
  const [isCrmDrawerOpen, setIsCrmDrawerOpen] = useState(false);

  // Listen to Auth and Firestore real-time updates
  useEffect(() => {
    const unsubAuth = initAuth(
      (user) => setCurrentUser(user),
      () => setCurrentUser(null)
    );

    let unsubLeads: (() => void) | undefined;
    try {
      unsubLeads = subscribeToFirestoreLeads((remoteLeads) => {
        if (remoteLeads && remoteLeads.length > 0) {
          setLeads(remoteLeads);
          try {
            localStorage.setItem('project3d_leads', JSON.stringify(remoteLeads));
          } catch {
            // ignore
          }
        }
      });
    } catch (e) {
      console.warn('[Firestore] Fallback local leads:', e);
    }

    return () => {
      unsubAuth();
      if (unsubLeads) unsubLeads();
    };
  }, []);

  const handleSignIn = async () => {
    try {
      const res = await googleSignIn();
      if (res?.user) {
        setCurrentUser(res.user);
      }
    } catch (err: any) {
      console.error('Google Sign In failed:', err);
    }
  };

  const handleSignOut = async () => {
    try {
      await logout();
      setCurrentUser(null);
    } catch (err: any) {
      console.error('Logout error:', err);
    }
  };

  // Lead created trigger callback
  const handleLeadCreated = (lead: LeadRecord) => {
    setLeads((prev) => [lead, ...prev.filter((l) => l.id !== lead.id)]);
    setLatestLead(lead);
  };

  // Smooth scroll handler
  const handleNavigateSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Launch Estimator with specific step
  const handleOpenEstimator = (step: number = 1, type: ProjectType = 'obra_nueva') => {
    setEstimatorInitialStep(step);
    setEstimatorInitialType(type);
    setIsEstimatorModalOpen(true);
  };

  // Handlers for reviews and leads
  const handleRequestProfessionalReview = (result: EstimationResult) => {
    setLeadSuccessResult(result);
    setIsLeadSuccessOpen(true);
  };

  const handleOpenDossier = (result: EstimationResult) => {
    setDossierResult(result);
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans selection:bg-amber-500/20 selection:text-amber-400">
      
      {/* 1. Header */}
      <Header
        onOpenEstimator={() => handleOpenEstimator(1, 'obra_nueva')}
        onNavigateSection={handleNavigateSection}
        onOpenChat={() => setIsChatOpen(true)}
        onOpenCrmDrawer={() => setIsCrmDrawerOpen(true)}
        leadsCount={leads.length}
        currentUser={currentUser}
        onSignIn={handleSignIn}
        onSignOut={handleSignOut}
      />

      <main className="flex-1">
        {/* 2. Hero Section */}
        <Hero
          onStartEstimatorWithStl={() => handleOpenEstimator(3, 'obra_nueva')}
          onOpenChat={() => setIsChatOpen(true)}
          onExploreProjects={() => handleNavigateSection('viviendas')}
          onOpenVideoModal={() => setIsVideoModalOpen(true)}
        />

        {/* 3. Embedded Inline Estimator Highlight Anchor */}
        <section id="calculador" className="py-16 bg-stone-900/60 border-b border-stone-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
              <span className="text-xs font-mono text-amber-500 uppercase tracking-widest">
                Herramienta Paramétrica Online
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Calcula la Estimación de tu Vivienda o Reforma
              </h2>
              <p className="text-stone-400 text-xs sm:text-sm">
                Configura tu proyecto paso a paso, carga tu modelo 3D y obtén un desglose inicial con el 15% de margen preventivo.
              </p>
            </div>

            {/* Inline Estimator Container */}
            <div className="relative">
              <EstimatorFlow
                key={`${estimatorInitialStep}-${estimatorInitialType}`}
                initialStep={estimatorInitialStep}
                initialType={estimatorInitialType}
                onRequestProfessionalReview={handleRequestProfessionalReview}
                onOpenDossier={handleOpenDossier}
                onLeadCreated={handleLeadCreated}
                onOpenCalendarModal={(res) => setCalendarEstimation(res)}
              />
            </div>
          </div>
        </section>

        {/* 4. About Section (Vivero de Empresas de Torrijos) */}
        <AboutSection />

        {/* 5. Services Section (Viviendas Adosadas & Reformas) */}
        <ServicesSection
          onSelectService={(serviceType) => handleOpenEstimator(1, serviceType)}
        />

        {/* 6. Process Section (4 Fases) */}
        <ProcessSection onStartEstimator={() => handleOpenEstimator(1, 'obra_nueva')} />

        {/* 7. Technical Validation & Transparency (15% Margin) */}
        <ValidationTransparencySection
          onRequestReview={() => handleOpenEstimator(1, 'obra_nueva')}
        />

        {/* 8. Contact Section (Torrijos Office & Map Info) */}
        <ContactSection
          onContactSubmitted={() => {
            setIsLeadSuccessOpen(true);
          }}
        />
      </main>

      {/* 9. Footer */}
      <Footer
        onNavigateSection={handleNavigateSection}
        onOpenEstimator={() => handleOpenEstimator(1, 'obra_nueva')}
      />

      {/* Floating Chatbot Widget ("AGENTE PROJECT 3D") */}
      <ChatbotWidget
        isOpen={isChatOpen}
        onToggle={() => setIsChatOpen(!isChatOpen)}
        onOpenEstimator={() => {
          setIsChatOpen(false);
          handleOpenEstimator(1, 'obra_nueva');
        }}
        onRequestContactCall={(leadData) => {
          setIsLeadSuccessOpen(true);
        }}
        onOpenVideoModal={() => {
          setIsVideoModalOpen(true);
        }}
      />

      {/* Estimator Modal (If opened from CTA buttons) */}
      {isEstimatorModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
          <div className="w-full max-w-5xl relative">
            <EstimatorFlow
              initialStep={estimatorInitialStep}
              initialType={estimatorInitialType}
              onClose={() => setIsEstimatorModalOpen(false)}
              onRequestProfessionalReview={(res) => {
                setIsEstimatorModalOpen(false);
                handleRequestProfessionalReview(res);
              }}
              onOpenDossier={(res) => {
                setIsEstimatorModalOpen(false);
                handleOpenDossier(res);
              }}
              onLeadCreated={(lead) => {
                handleLeadCreated(lead);
              }}
              onOpenCalendarModal={(res) => {
                setIsEstimatorModalOpen(false);
                setCalendarEstimation(res);
              }}
            />
          </div>
        </div>
      )}

      {/* Printable / Downloadable Project Dossier Modal */}
      <ProjectDossierModal
        result={dossierResult}
        onClose={() => setDossierResult(null)}
        onOpenCalendarModal={() => {
          if (dossierResult) setCalendarEstimation(dossierResult);
        }}
      />

      {/* Lead Success Confirmation Modal */}
      <LeadSuccessModal
        isOpen={isLeadSuccessOpen}
        result={leadSuccessResult}
        onClose={() => {
          setIsLeadSuccessOpen(false);
          setLeadSuccessResult(null);
        }}
      />

      {/* 3D House Cinematic Walkthrough Video Modal */}
      <HouseVideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        onOpenEstimator={() => handleOpenEstimator(1, 'obra_nueva')}
      />

      {/* Google Calendar Technical Visit Scheduling Modal */}
      <CalendarScheduleModal
        isOpen={!!calendarEstimation}
        onClose={() => setCalendarEstimation(null)}
        estimation={calendarEstimation}
        onSuccess={() => {
          setCalendarEstimation(null);
        }}
      />

      {/* Automated CRM Lead Dual Action Notification Toast */}
      <CrmNotificationToast
        lead={latestLead}
        onClose={() => setLatestLead(null)}
        onOpenCrmDrawer={() => setIsCrmDrawerOpen(true)}
      />

      {/* Internal CRM & Commercial Pipeline Modal/Drawer */}
      <CrmLeadsDrawer
        isOpen={isCrmDrawerOpen}
        onClose={() => setIsCrmDrawerOpen(false)}
        leads={leads}
        onSelectLeadDossier={(lead) => {
          setIsCrmDrawerOpen(false);
          setDossierResult(lead.estimation);
        }}
      />

    </div>
  );
}
