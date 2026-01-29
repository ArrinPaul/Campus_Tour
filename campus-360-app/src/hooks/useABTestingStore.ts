/**
 * A/B Testing Store - Test different UI layouts and features
 * Track user engagement with different variants
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ABTestVariant {
  id: string;
  name: string;
  weight: number; // Percentage of users to show this variant (0-100)
}

export interface ABTest {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  variants: ABTestVariant[];
  metrics: {
    impressions: Map<string, number>;
    conversions: Map<string, number>;
    engagementTime: Map<string, number>;
  };
  createdAt: number;
  startedAt?: number;
  endedAt?: number;
}

export interface UserAssignment {
  testId: string;
  variantId: string;
  assignedAt: number;
}

// Pre-defined tests for common UI variations
export const DEFAULT_TESTS: Omit<ABTest, 'id' | 'createdAt' | 'metrics'>[] = [
  {
    name: 'Navigation Style',
    description: 'Test different navigation button layouts',
    isActive: false,
    variants: [
      { id: 'nav-arrows', name: 'Arrow Navigation', weight: 50 },
      { id: 'nav-cards', name: 'Card Navigation', weight: 50 },
    ],
  },
  {
    name: 'POI Indicators',
    description: 'Test different POI marker styles',
    isActive: false,
    variants: [
      { id: 'poi-minimal', name: 'Minimal Icons', weight: 33 },
      { id: 'poi-badges', name: 'Badges with Labels', weight: 33 },
      { id: 'poi-glow', name: 'Glowing Markers', weight: 34 },
    ],
  },
  {
    name: 'Welcome Experience',
    description: 'Test different onboarding flows',
    isActive: false,
    variants: [
      { id: 'welcome-splash', name: 'Full Splash Screen', weight: 50 },
      { id: 'welcome-quick', name: 'Quick Start', weight: 50 },
    ],
  },
  {
    name: 'Map Position',
    description: 'Test minimap placement',
    isActive: false,
    variants: [
      { id: 'map-corner', name: 'Corner Minimap', weight: 50 },
      { id: 'map-bottom', name: 'Bottom Bar', weight: 50 },
    ],
  },
  {
    name: 'Control Layout',
    description: 'Test control button arrangements',
    isActive: false,
    variants: [
      { id: 'controls-bottom', name: 'Bottom Center', weight: 50 },
      { id: 'controls-sides', name: 'Split Sides', weight: 50 },
    ],
  },
];

interface ABTestingState {
  // Tests
  tests: ABTest[];
  
  // User assignments (persisted to ensure consistent experience)
  userAssignments: UserAssignment[];
  
  // Current session's active variants
  activeVariants: Map<string, string>;
  
  // Actions - Test Management
  createTest: (test: Omit<ABTest, 'id' | 'createdAt' | 'metrics'>) => string;
  updateTest: (id: string, updates: Partial<ABTest>) => void;
  deleteTest: (id: string) => void;
  activateTest: (id: string) => void;
  deactivateTest: (id: string) => void;
  
  // Actions - Assignment
  getAssignment: (testId: string) => string | null;
  assignUserToVariant: (testId: string) => string;
  
  // Actions - Metrics
  recordImpression: (testId: string, variantId: string) => void;
  recordConversion: (testId: string, variantId: string) => void;
  recordEngagement: (testId: string, variantId: string, timeMs: number) => void;
  
  // Actions - Analysis
  getTestResults: (testId: string) => {
    variant: ABTestVariant;
    impressions: number;
    conversions: number;
    conversionRate: number;
    avgEngagement: number;
  }[];
  
  // Initialize default tests
  initializeDefaultTests: () => void;
  
  // Export
  exportResults: () => string;
}

export const useABTestingStore = create<ABTestingState>()(
  persist(
    (set, get) => ({
      tests: [],
      userAssignments: [],
      activeVariants: new Map(),
      
      createTest: (test) => {
        const id = `test_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const newTest: ABTest = {
          ...test,
          id,
          createdAt: Date.now(),
          metrics: {
            impressions: new Map(),
            conversions: new Map(),
            engagementTime: new Map(),
          },
        };
        set((state) => ({ tests: [...state.tests, newTest] }));
        return id;
      },
      
      updateTest: (id, updates) => {
        set((state) => ({
          tests: state.tests.map((test) =>
            test.id === id ? { ...test, ...updates } : test
          ),
        }));
      },
      
      deleteTest: (id) => {
        set((state) => ({
          tests: state.tests.filter((test) => test.id !== id),
          userAssignments: state.userAssignments.filter((a) => a.testId !== id),
        }));
      },
      
      activateTest: (id) => {
        set((state) => ({
          tests: state.tests.map((test) =>
            test.id === id
              ? { ...test, isActive: true, startedAt: Date.now() }
              : test
          ),
        }));
      },
      
      deactivateTest: (id) => {
        set((state) => ({
          tests: state.tests.map((test) =>
            test.id === id
              ? { ...test, isActive: false, endedAt: Date.now() }
              : test
          ),
        }));
      },
      
      getAssignment: (testId) => {
        // Check existing assignment
        const existing = get().userAssignments.find((a) => a.testId === testId);
        if (existing) return existing.variantId;
        
        // Check if test is active
        const test = get().tests.find((t) => t.id === testId);
        if (!test || !test.isActive) return null;
        
        // Assign user to variant
        return get().assignUserToVariant(testId);
      },
      
      assignUserToVariant: (testId) => {
        const test = get().tests.find((t) => t.id === testId);
        if (!test) return '';
        
        // Weighted random selection
        const random = Math.random() * 100;
        let cumulative = 0;
        let selectedVariant = test.variants[0];
        
        for (const variant of test.variants) {
          cumulative += variant.weight;
          if (random <= cumulative) {
            selectedVariant = variant;
            break;
          }
        }
        
        // Save assignment
        const assignment: UserAssignment = {
          testId,
          variantId: selectedVariant.id,
          assignedAt: Date.now(),
        };
        
        set((state) => ({
          userAssignments: [...state.userAssignments, assignment],
          activeVariants: new Map(state.activeVariants).set(testId, selectedVariant.id),
        }));
        
        return selectedVariant.id;
      },
      
      recordImpression: (testId, variantId) => {
        set((state) => ({
          tests: state.tests.map((test) => {
            if (test.id !== testId) return test;
            const impressions = new Map(test.metrics.impressions);
            impressions.set(variantId, (impressions.get(variantId) || 0) + 1);
            return {
              ...test,
              metrics: { ...test.metrics, impressions },
            };
          }),
        }));
      },
      
      recordConversion: (testId, variantId) => {
        set((state) => ({
          tests: state.tests.map((test) => {
            if (test.id !== testId) return test;
            const conversions = new Map(test.metrics.conversions);
            conversions.set(variantId, (conversions.get(variantId) || 0) + 1);
            return {
              ...test,
              metrics: { ...test.metrics, conversions },
            };
          }),
        }));
      },
      
      recordEngagement: (testId, variantId, timeMs) => {
        set((state) => ({
          tests: state.tests.map((test) => {
            if (test.id !== testId) return test;
            const engagementTime = new Map(test.metrics.engagementTime);
            engagementTime.set(
              variantId,
              (engagementTime.get(variantId) || 0) + timeMs
            );
            return {
              ...test,
              metrics: { ...test.metrics, engagementTime },
            };
          }),
        }));
      },
      
      getTestResults: (testId) => {
        const test = get().tests.find((t) => t.id === testId);
        if (!test) return [];
        
        return test.variants.map((variant) => {
          const impressions = test.metrics.impressions.get(variant.id) || 0;
          const conversions = test.metrics.conversions.get(variant.id) || 0;
          const engagementTime = test.metrics.engagementTime.get(variant.id) || 0;
          
          return {
            variant,
            impressions,
            conversions,
            conversionRate: impressions > 0 ? (conversions / impressions) * 100 : 0,
            avgEngagement: impressions > 0 ? engagementTime / impressions : 0,
          };
        });
      },
      
      initializeDefaultTests: () => {
        const existingNames = new Set(get().tests.map((t) => t.name));
        const newTests = DEFAULT_TESTS.filter((t) => !existingNames.has(t.name));
        
        newTests.forEach((test) => {
          get().createTest(test);
        });
      },
      
      exportResults: () => {
        const tests = get().tests;
        const results = tests.map((test) => ({
          ...test,
          results: get().getTestResults(test.id),
          metrics: {
            impressions: Object.fromEntries(test.metrics.impressions),
            conversions: Object.fromEntries(test.metrics.conversions),
            engagementTime: Object.fromEntries(test.metrics.engagementTime),
          },
        }));
        
        return JSON.stringify(results, null, 2);
      },
    }),
    {
      name: 'campus-tour-ab-testing',
      partialize: (state) => ({
        tests: state.tests.map((t) => ({
          ...t,
          metrics: {
            impressions: Array.from(t.metrics.impressions.entries()),
            conversions: Array.from(t.metrics.conversions.entries()),
            engagementTime: Array.from(t.metrics.engagementTime.entries()),
          },
        })),
        userAssignments: state.userAssignments,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.tests) {
          // Type assertion for serialized data structure
          type SerializedMetrics = { 
            impressions: [string, number][]; 
            conversions: [string, number][]; 
            engagementTime: [string, number][] 
          };
          type SerializedTest = Omit<ABTest, 'metrics'> & { metrics: SerializedMetrics };
          
          state.tests = (state.tests as unknown as SerializedTest[]).map((t) => ({
            ...t,
            metrics: {
              impressions: new Map(t.metrics.impressions || []),
              conversions: new Map(t.metrics.conversions || []),
              engagementTime: new Map(t.metrics.engagementTime || []),
            },
          }));
        }
        // Initialize active variants from assignments
        if (state?.userAssignments) {
          state.activeVariants = new Map(
            state.userAssignments.map((a: UserAssignment) => [a.testId, a.variantId])
          );
        }
      },
    }
  )
);
