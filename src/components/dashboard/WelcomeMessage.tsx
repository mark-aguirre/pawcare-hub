import { Heart, Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WelcomeMessageProps {
  userName?: string;
  isFirstTime?: boolean;
}

export function WelcomeMessage({ userName = 'there', isFirstTime = false }: WelcomeMessageProps) {
  if (!isFirstTime) return null;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-primary/10 to-accent/5 p-8 mb-6 animate-slide-up">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/10 to-transparent rounded-bl-full" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-accent/10 to-transparent rounded-tr-full" />
      
      {/* Floating elements */}
      <div className="absolute top-4 right-8 text-primary/20 animate-float">
        <Heart className="h-6 w-6" />
      </div>
      <div className="absolute bottom-6 right-12 text-accent/20 animate-float" style={{ animationDelay: '1s' }}>
        <Sparkles className="h-5 w-5" />
      </div>

      <div className="relative">
        <div className="flex items-center gap-3 mb-4">
          <div className="rounded-2xl bg-gradient-primary p-3 shadow-glow">
            <Heart className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-display font-bold text-foreground">
              Welcome to PawCare, {userName}! 🐾
            </h2>
            <p className="text-muted-foreground">
              Your comprehensive veterinary practice management system
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="flex items-center gap-3 p-4 rounded-xl bg-card/50 border border-border/50">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <div>
              <p className="font-semibold text-sm text-foreground">Schedule Appointments</p>
              <p className="text-xs text-muted-foreground">Manage your daily schedule</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-xl bg-card/50 border border-border/50">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" style={{ animationDelay: '0.5s' }} />
            <div>
              <p className="font-semibold text-sm text-foreground">Track Medical Records</p>
              <p className="text-xs text-muted-foreground">Keep detailed pet health records</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-xl bg-card/50 border border-border/50">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse" style={{ animationDelay: '1s' }} />
            <div>
              <p className="font-semibold text-sm text-foreground">Manage Inventory</p>
              <p className="text-xs text-muted-foreground">Monitor supplies and medications</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button className="bg-gradient-primary hover:shadow-glow transition-all duration-300 group">
            Get Started
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button variant="outline" className="border-primary/20 hover:bg-primary/5">
            Take a Tour
          </Button>
        </div>
      </div>
    </div>
  );
}