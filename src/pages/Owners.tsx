import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { OwnerCard } from '@/components/owners/OwnerCard';
import { Input } from '@/components/ui/input';
import { Search, Users } from 'lucide-react';
import { mockOwners } from '@/data/mockData';

export default function Owners() {
  const [search, setSearch] = useState('');

  const filteredOwners = mockOwners.filter((owner) => {
    return (
      owner.name.toLowerCase().includes(search.toLowerCase()) ||
      owner.email.toLowerCase().includes(search.toLowerCase()) ||
      owner.phone.includes(search)
    );
  });

  return (
    <MainLayout
      title="Pet Owners"
      subtitle={`${mockOwners.length} registered owners`}
      action={{ label: 'Add Owner', onClick: () => {} }}
    >
      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by name, email, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Owners Grid */}
      {filteredOwners.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredOwners.map((owner, index) => (
            <OwnerCard key={owner.id} owner={owner} delay={index * 50} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-muted-foreground">
          <Users className="h-16 w-16 mx-auto mb-4 opacity-30" />
          <h3 className="text-lg font-medium text-foreground mb-1">No owners found</h3>
          <p>Try adjusting your search criteria</p>
        </div>
      )}
    </MainLayout>
  );
}
