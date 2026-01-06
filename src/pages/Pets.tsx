"use client";

import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { PetCard } from '@/components/pets/PetCard';
import { PetDetailModal } from '@/components/pets/PetDetailModal';
import { NewPetPanel } from '@/components/dashboard/panels/NewPetPanel';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, PawPrint } from 'lucide-react';
import { mockPets } from '@/data/mockData';
import { Pet } from '@/types';
import { cn } from '@/lib/utils';

const speciesFilters = ['all', 'dog', 'cat', 'bird', 'rabbit', 'hamster', 'other'] as const;

export default function Pets() {
  const [search, setSearch] = useState('');
  const [selectedSpecies, setSelectedSpecies] = useState<typeof speciesFilters[number]>('all');
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [showPetDetail, setShowPetDetail] = useState(false);
  const [showNewPetModal, setShowNewPetModal] = useState(false);

  const filteredPets = mockPets.filter((pet) => {
    const matchesSearch =
      pet.name.toLowerCase().includes(search.toLowerCase()) ||
      pet.breed.toLowerCase().includes(search.toLowerCase()) ||
      pet.ownerName.toLowerCase().includes(search.toLowerCase());
    const matchesSpecies = selectedSpecies === 'all' || pet.species === selectedSpecies;
    return matchesSearch && matchesSpecies;
  });

  const handlePetClick = (pet: Pet) => {
    setSelectedPet(pet);
    setShowPetDetail(true);
  };

  return (
    <>
      <MainLayout
        title="Pets"
        subtitle={`${mockPets.length} registered pets`}
        action={{ label: 'Add Pet', onClick: () => setShowNewPetModal(true) }}
      >
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by name, breed, or owner..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {speciesFilters.map((species) => (
            <Button
              key={species}
              variant={selectedSpecies === species ? 'default' : 'secondary'}
              size="sm"
              onClick={() => setSelectedSpecies(species)}
              className="capitalize"
            >
              {species === 'all' ? 'All Species' : species}
            </Button>
          ))}
        </div>
      </div>

        {/* Pets Grid */}
        {filteredPets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPets.map((pet, index) => (
              <PetCard 
                key={pet.id} 
                pet={pet} 
                delay={index * 50} 
                onClick={() => handlePetClick(pet)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-muted-foreground">
            <PawPrint className="h-16 w-16 mx-auto mb-4 opacity-30" />
            <h3 className="text-lg font-medium text-foreground mb-1">No pets found</h3>
            <p>Try adjusting your search or filter criteria</p>
          </div>
        )}
      </MainLayout>

      {/* Modals */}
      <PetDetailModal 
        pet={selectedPet}
        open={showPetDetail}
        onOpenChange={setShowPetDetail}
      />
      <NewPetPanel 
        open={showNewPetModal}
        onOpenChange={setShowNewPetModal}
      />
    </>
  );
}
