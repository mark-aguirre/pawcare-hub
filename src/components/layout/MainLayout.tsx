import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface MainLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function MainLayout({ children, title, subtitle, action }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="ml-64">
        <Header title={title} subtitle={subtitle} action={action} />
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
