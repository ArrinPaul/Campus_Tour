/**
 * Events Store - Manages campus events and calendar markers
 */

import { create } from 'zustand';

export interface CampusEvent {
  id: string;
  title: string;
  description: string;
  date: Date;
  startTime: string;
  endTime: string;
  locationId: string; // ID of the tour location/lab
  locationName: string;
  category: 'academic' | 'cultural' | 'sports' | 'workshop' | 'seminar' | 'other';
  organizer?: string;
  registrationLink?: string;
  isActive: boolean; // Currently happening
  isUpcoming: boolean; // Happening today or soon
}

interface EventsState {
  events: CampusEvent[];

  // Actions
  addEvent: (event: CampusEvent) => void;
  removeEvent: (eventId: string) => void;
  updateEvent: (eventId: string, updates: Partial<CampusEvent>) => void;
  getEventsByLocation: (locationId: string) => CampusEvent[];
  getUpcomingEvents: () => CampusEvent[];
  getActiveEvents: () => CampusEvent[];
  loadMockEvents: () => void;
}

// Mock event data for demonstration
const mockEvents: CampusEvent[] = [
  {
    id: 'evt-1',
    title: 'Campus Orientation',
    description: 'Welcome new students to campus with a guided tour and information session.',
    date: new Date(),
    startTime: '10:00 AM',
    endTime: '12:00 PM',
    locationId: 'gate_to_logo_main_entrance',
    locationName: 'Main Entrance',
    category: 'academic',
    organizer: 'Student Affairs',
    isActive: true,
    isUpcoming: true,
  },
  {
    id: 'evt-2',
    title: 'Tech Workshop: AI & ML',
    description:
      'Learn about the latest developments in Artificial Intelligence and Machine Learning.',
    date: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
    startTime: '02:00 PM',
    endTime: '04:00 PM',
    locationId: 'block1_lab1',
    locationName: 'Computer Lab - Block 1',
    category: 'workshop',
    organizer: 'CS Department',
    registrationLink: 'https://example.com/register',
    isActive: false,
    isUpcoming: true,
  },
  {
    id: 'evt-3',
    title: 'Cultural Festival',
    description:
      'Annual cultural celebration featuring music, dance, and performances from students.',
    date: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
    startTime: '05:00 PM',
    endTime: '08:00 PM',
    locationId: 'devdan_amphitheater',
    locationName: 'Amphitheater',
    category: 'cultural',
    organizer: 'Cultural Committee',
    isActive: false,
    isUpcoming: true,
  },
  {
    id: 'evt-4',
    title: 'Architecture Exhibition',
    description: 'Student projects and architectural designs on display.',
    date: new Date(Date.now() + 3 * 60 * 60 * 1000),
    startTime: '11:00 AM',
    endTime: '05:00 PM',
    locationId: 'archi_studio',
    locationName: 'Architecture Studio',
    category: 'academic',
    organizer: 'Architecture Dept',
    isActive: false,
    isUpcoming: true,
  },
  {
    id: 'evt-5',
    title: 'Sports Meet',
    description: 'Inter-department sports competition and activities.',
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
    startTime: '09:00 AM',
    endTime: '05:00 PM',
    locationId: 'block3_ground',
    locationName: 'Sports Ground',
    category: 'sports',
    organizer: 'Sports Committee',
    isActive: false,
    isUpcoming: true,
  },
];

export const useEventsStore = create<EventsState>((set, get) => ({
  events: [],

  addEvent: (event) =>
    set((state) => ({
      events: [...state.events, event],
    })),

  removeEvent: (eventId) =>
    set((state) => ({
      events: state.events.filter((e) => e.id !== eventId),
    })),

  updateEvent: (eventId, updates) =>
    set((state) => ({
      events: state.events.map((e) => (e.id === eventId ? { ...e, ...updates } : e)),
    })),

  getEventsByLocation: (locationId) => {
    return get().events.filter((e) => e.locationId === locationId);
  },

  getUpcomingEvents: () => {
    return get()
      .events.filter((e) => e.isUpcoming)
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  },

  getActiveEvents: () => {
    return get().events.filter((e) => e.isActive);
  },

  loadMockEvents: () => set({ events: mockEvents }),
}));
