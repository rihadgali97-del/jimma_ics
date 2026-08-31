import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { DemoPresentationBar } from '../common/DemoPresentationBar';
import { ToastContainer } from '../ui/ToastContainer';
import { GlobalSearchModal } from '../common/GlobalSearchModal';

export const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 font-sans transition-colors selection:bg-emerald-200 selection:text-emerald-950">
      <Header />
      <main className="flex-1 pb-16">
        <Outlet />
      </main>
      <Footer />
      <DemoPresentationBar />
      <ToastContainer />
      <GlobalSearchModal />
    </div>
  );
};
