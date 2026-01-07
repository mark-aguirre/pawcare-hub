# API Integration Guide

This document explains how the frontend integrates with the Spring Boot backend API.

## Architecture

The integration follows this pattern:
```
Frontend (Next.js) → Next.js API Routes → Spring Boot Backend
```

## Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# Backend API Configuration
BACKEND_URL=http://localhost:8082
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

### Backend Setup

1. Start the Spring Boot backend on port 8082
2. Ensure PostgreSQL database is running
3. The backend should be accessible at `http://localhost:8082`

## API Routes

Next.js API routes act as a proxy to the backend:

- `/api/pets` - Pet management endpoints
- `/api/owners` - Owner management endpoints  
- `/api/appointments` - Appointment management endpoints

## React Query Hooks

### Pets API

```typescript
import { usePets, useCreatePet, useUpdatePet, useDeletePet } from '@/hooks/use-pets';

// Fetch all pets
const { data: pets, isLoading, error } = usePets();

// Create a new pet
const createPet = useCreatePet();
await createPet.mutateAsync(petData);

// Update a pet
const updatePet = useUpdatePet();
await updatePet.mutateAsync(updatedPetData);

// Delete a pet
const deletePet = useDeletePet();
await deletePet.mutateAsync(petId);
```

### Owners API

```typescript
import { useOwners, useCreateOwner, useUpdateOwner, useDeleteOwner } from '@/hooks/use-owners';

// Similar pattern as pets
const { data: owners } = useOwners();
```

### Appointments API

```typescript
import { useAppointments, useUpcomingAppointments, useTodayAppointments } from '@/hooks/use-appointments';

const { data: appointments } = useAppointments();
const { data: upcoming } = useUpcomingAppointments();
const { data: today } = useTodayAppointments();
```

## Data Types

The TypeScript interfaces have been updated to match the backend entities:

- `Owner` - Updated to use `firstName`, `lastName` instead of `name`
- `Pet` - Updated to use numeric IDs and optional fields
- `Appointment` - Updated to match backend enum values

## Error Handling

- API routes include proper error handling and status codes
- React Query hooks automatically handle loading states and errors
- Toast notifications can be used to display success/error messages

## Example Usage

See `src/components/pets/CreatePetForm.tsx` for a complete example of:
- Using React Query hooks
- Form handling with validation
- Error handling with toast notifications
- Optimistic updates

## Development

1. Start the backend: `cd backend && ./run.bat`
2. Start the frontend: `npm run dev`
3. The frontend will proxy API calls to the backend automatically

## Production Deployment

Update the `BACKEND_URL` environment variable to point to your production backend URL.