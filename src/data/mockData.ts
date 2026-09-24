import type { AdoptionRequest, Pet } from '../types';

export const initialPets: Pet[] = [
  {
    id: 'pet-1',
    name: 'Milo',
    breed: 'Golden Retriever',
    imageUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=400',
    description: 'Friendly, energetic 2-year-old dog who loves outdoor activities.',
  },
  {
    id: 'pet-2',
    name: 'Luna',
    breed: 'Tabby Cat',
    imageUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=400',
    description: 'Calm, affectionate 3-year-old cat looking for a quiet home.',
  },
];

export const initialRequests: AdoptionRequest[] = [
  {
    id: 'req-1',
    applicantName: 'Sarah Jenkins',
    email: 'sarah@example.com',
    petId: 'pet-1',
    petName: 'Milo (Golden Retriever)',
    reason: 'I have a large fenced backyard and work from home.',
    status: 'pending',
    submittedAt: '2026-09-15',
  },
];