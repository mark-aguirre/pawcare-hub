import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Syringe, Calendar, Edit, Trash2 } from 'lucide-react';
import { Vaccination } from '@/types';

interface VaccinationCardProps {
  vaccination: Vaccination;
  onEdit: (vaccination: Vaccination) => void;
  onDelete: (id: string) => void;
}

export function VaccinationCard({ vaccination, onEdit, onDelete }: VaccinationCardProps) {
  return (
    <Card>
      <CardContent className="p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
              vaccination.status === 'OVERDUE' ? 'bg-red-100' :
              vaccination.status === 'SCHEDULED' ? 'bg-blue-100' : 'bg-green-100'
            }`}>
              <Syringe className={`h-4 w-4 ${
                vaccination.status === 'OVERDUE' ? 'text-red-600' :
                vaccination.status === 'SCHEDULED' ? 'text-blue-600' : 'text-green-600'
              }`} />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-base">{vaccination.vaccineType}</h3>
                <Badge variant={
                  vaccination.status === 'ADMINISTERED' ? 'default' :
                  vaccination.status === 'SCHEDULED' ? 'secondary' : 'destructive'
                } className={`text-xs ${
                  vaccination.status === 'ADMINISTERED' ? 'bg-green-100 text-green-700 hover:bg-green-100' :
                  vaccination.status === 'SCHEDULED' ? 'bg-blue-100 text-blue-700 hover:bg-blue-100' :
                  'bg-red-100 text-red-700 hover:bg-red-100'
                }`}>
                  {vaccination.status}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">{vaccination.petName} • {vaccination.veterinarianName}</p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span>Given: {new Date(vaccination.administeredDate).toLocaleDateString()}</span>
                <span className={vaccination.status === 'OVERDUE' ? 'text-red-600 font-medium' : ''}>
                  Due: {new Date(vaccination.nextDueDate).toLocaleDateString()}
                </span>
                {vaccination.batchNumber && <span>Batch: {vaccination.batchNumber}</span>}
              </div>
              {vaccination.notes && (
                <p className="text-xs text-muted-foreground truncate max-w-md">
                  {vaccination.notes}
                </p>
              )}
            </div>
          </div>
          <div className="flex gap-1">
            <Button size="sm" variant="ghost" onClick={() => onEdit(vaccination)}>
              <Edit className="h-3 w-3" />
            </Button>
            <Button size="sm" variant="ghost" onClick={() => onDelete(vaccination.id)}>
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}