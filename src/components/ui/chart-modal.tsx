'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Maximize2 } from 'lucide-react';
import { ReactNode, useState } from 'react';

interface ExpandableChartProps {
  title: string;
  children: ReactNode;
}

export function ExpandableChart({ title, children }: ExpandableChartProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      <div className="relative">
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2 z-50 bg-background/80 hover:bg-background"
          onClick={() => setIsExpanded(true)}
        >
          <Maximize2 className="h-4 w-4" />
        </Button>
        {children}
      </div>
      
      <Dialog open={isExpanded} onOpenChange={setIsExpanded}>
        <DialogContent className="max-w-[90vw] max-h-[90vh] w-full h-full p-6">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <div className="flex-1 h-[calc(90vh-100px)]">
            {children}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}