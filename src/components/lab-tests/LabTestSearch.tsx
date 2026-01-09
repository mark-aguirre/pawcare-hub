'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useLabTests } from '@/hooks/use-lab-tests';
import { Search, TestTube, Calendar, User, Eye } from 'lucide-react';

interface LabTestSearchProps {
  onSelectTest?: (testId: string) => void;
  compact?: boolean;
}

export function LabTestSearch({ onSelectTest, compact = false }: LabTestSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const { labTests, isLoading } = useLabTests({ autoFetch: true });

  const filteredTests = labTests.filter(test => {
    if (!searchQuery.trim()) return false;
    
    const query = searchQuery.toLowerCase();
    return (
      test.id.toLowerCase().includes(query) ||
      test.petName.toLowerCase().includes(query) ||
      test.testType.toLowerCase().includes(query) ||
      test.veterinarianName.toLowerCase().includes(query)
    );
  }).slice(0, 5); // Limit to 5 results

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'in-progress':
        return 'secondary';
      case 'requested':
        return 'outline';
      case 'cancelled':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const handleTestSelect = (testId: string) => {
    if (onSelectTest) {
      onSelectTest(testId);
    }
    setIsOpen(false);
    setSearchQuery('');
  };

  return (
    <div className={`relative ${compact ? 'w-64' : 'w-full max-w-md'}`}>
      <div className=\"relative\">
        <Search className=\"absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground\" />
        <Input
          placeholder=\"Search lab tests...\"\n          value={searchQuery}\n          onChange={(e) => {\n            setSearchQuery(e.target.value);\n            setIsOpen(e.target.value.trim().length > 0);\n          }}\n          onFocus={() => setIsOpen(searchQuery.trim().length > 0)}\n          onBlur={() => setTimeout(() => setIsOpen(false), 200)}\n          className=\"pl-10\"\n        />\n      </div>\n\n      {isOpen && (\n        <Card className=\"absolute top-full left-0 right-0 z-50 mt-1 max-h-80 overflow-y-auto\">\n          <CardContent className=\"p-2\">\n            {isLoading ? (\n              <div className=\"p-4 text-center text-sm text-muted-foreground\">\n                Searching...\n              </div>\n            ) : filteredTests.length > 0 ? (\n              <div className=\"space-y-1\">\n                {filteredTests.map((test) => (\n                  <div\n                    key={test.id}\n                    className=\"flex items-center justify-between p-3 hover:bg-muted rounded-md cursor-pointer transition-colors\"\n                    onClick={() => handleTestSelect(test.id)}\n                  >\n                    <div className=\"flex items-center gap-3 flex-1 min-w-0\">\n                      <TestTube className=\"h-4 w-4 text-muted-foreground flex-shrink-0\" />\n                      <div className=\"flex-1 min-w-0\">\n                        <div className=\"flex items-center gap-2 mb-1\">\n                          <p className=\"font-medium text-sm truncate\">{test.testType}</p>\n                          <Badge variant={getStatusColor(test.status)} className=\"text-xs\">\n                            {test.status}\n                          </Badge>\n                        </div>\n                        <div className=\"flex items-center gap-4 text-xs text-muted-foreground\">\n                          <div className=\"flex items-center gap-1\">\n                            <User className=\"h-3 w-3\" />\n                            <span className=\"truncate\">{test.petName}</span>\n                          </div>\n                          <div className=\"flex items-center gap-1\">\n                            <Calendar className=\"h-3 w-3\" />\n                            <span>{formatDate(test.requestedDate)}</span>\n                          </div>\n                        </div>\n                      </div>\n                    </div>\n                    <Button size=\"sm\" variant=\"ghost\" className=\"h-8 w-8 p-0\">\n                      <Eye className=\"h-3 w-3\" />\n                    </Button>\n                  </div>\n                ))}\n              </div>\n            ) : searchQuery.trim().length > 0 ? (\n              <div className=\"p-4 text-center text-sm text-muted-foreground\">\n                No lab tests found for \"{searchQuery}\"\n              </div>\n            ) : null}\n          </CardContent>\n        </Card>\n      )}\n    </div>\n  );\n}