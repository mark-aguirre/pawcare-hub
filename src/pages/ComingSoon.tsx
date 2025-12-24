import { MainLayout } from '@/components/layout/MainLayout';
import { Construction } from 'lucide-react';

interface ComingSoonProps {
  title: string;
}

export default function ComingSoon({ title }: ComingSoonProps) {
  return (
    <MainLayout title={title} subtitle="Feature in development">
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="rounded-full bg-primary/10 p-6 mb-6 animate-scale-in">
          <Construction className="h-12 w-12 text-primary" />
        </div>
        <h2 className="text-2xl font-semibold text-foreground mb-2 animate-slide-up">
          Coming Soon
        </h2>
        <p className="text-muted-foreground max-w-md animate-slide-up" style={{ animationDelay: '100ms' }}>
          We're working hard to bring you the {title.toLowerCase()} feature. 
          Stay tuned for updates!
        </p>
      </div>
    </MainLayout>
  );
}
