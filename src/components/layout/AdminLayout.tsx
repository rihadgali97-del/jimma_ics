import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar';
import { AdminTopNav } from './AdminTopNav';
import { DemoPresentationBar } from '../common/DemoPresentationBar';
import { ToastContainer } from '../ui/ToastContainer';
import { GlobalSearchModal } from '../common/GlobalSearchModal';

export const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-stone-100/70 dark:bg-stone-950 text-stone-900 dark:text-stone-100 font-sans transition-colors">
      {/* Admin Sidebar */}
      <AdminSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area (offset by 288px on large screens) */}
      <div className="lg:pl-72 flex flex-col min-h-screen">
        <AdminTopNav onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-24">
          <Outlet />
        </main>
      </div>

      <DemoPresentationBar />
      <ToastContainer />
      <GlobalSearchModal />
    </div>
  );
};
