/**
 * A/B Testing Dashboard - View and manage A/B tests
 * Compare variants and analyze results
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  FlaskConical, 
  Play, 
  Pause, 
  Trash2, 
  Plus,
  BarChart3,
  Users,
  TrendingUp,
  Download,
  RefreshCw
} from 'lucide-react';
import { useABTestingStore } from '../../hooks/useABTestingStore';
import type { ABTest, ABTestVariant } from '../../hooks/useABTestingStore';

interface ABTestingPanelProps {
  onClose: () => void;
}

export const ABTestingPanel = ({ onClose }: ABTestingPanelProps) => {
  const {
    tests,
    activateTest,
    deactivateTest,
    deleteTest,
    createTest,
    getTestResults,
    initializeDefaultTests,
    exportResults,
  } = useABTestingStore();

  const [selectedTest, setSelectedTest] = useState<ABTest | null>(null);
  const [showNewTestForm, setShowNewTestForm] = useState(false);

  useEffect(() => {
    // Initialize default tests if none exist
    if (tests.length === 0) {
      initializeDefaultTests();
    }
  }, []);

  const handleExport = () => {
    const data = exportResults();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ab-test-results-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-4xl max-h-[90vh] bg-zinc-900 rounded-2xl shadow-2xl border border-white/10 flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center gap-4 p-4 border-b border-white/10">
          <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
            <FlaskConical className="w-5 h-5 text-purple-400" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-white">A/B Testing</h2>
            <p className="text-xs text-white/60">Test different UI layouts and features</p>
          </div>
          <button
            onClick={() => initializeDefaultTests()}
            className="p-2 hover:bg-white/10 rounded-lg text-white/60 hover:text-white transition-colors"
            title="Reset Default Tests"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
          <button
            onClick={handleExport}
            className="p-2 hover:bg-white/10 rounded-lg text-white/60 hover:text-white transition-colors"
            title="Export Results"
          >
            <Download className="w-5 h-5" />
          </button>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg">
            <X className="w-5 h-5 text-white/60" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <span className="text-sm text-white/60">
                {tests.filter((t) => t.isActive).length} active tests
              </span>
            </div>
            <button
              onClick={() => setShowNewTestForm(true)}
              className="flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              New Test
            </button>
          </div>

          {tests.length === 0 ? (
            <div className="text-center py-12 text-white/40">
              <FlaskConical className="w-12 h-12 mx-auto mb-4 opacity-40" />
              <p>No A/B tests configured</p>
              <p className="text-sm">Create tests to compare different UI variants</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {tests.map((test) => (
                <TestCard
                  key={test.id}
                  test={test}
                  results={getTestResults(test.id)}
                  onActivate={() => activateTest(test.id)}
                  onDeactivate={() => deactivateTest(test.id)}
                  onDelete={() => deleteTest(test.id)}
                  onViewDetails={() => setSelectedTest(test)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Test Details Modal */}
        <AnimatePresence>
          {selectedTest && (
            <TestDetailsModal
              test={selectedTest}
              results={getTestResults(selectedTest.id)}
              onClose={() => setSelectedTest(null)}
            />
          )}
        </AnimatePresence>

        {/* New Test Form Modal */}
        <AnimatePresence>
          {showNewTestForm && (
            <NewTestFormModal
              onSave={(test) => {
                createTest(test);
                setShowNewTestForm(false);
              }}
              onClose={() => setShowNewTestForm(false)}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

// Test Card Component
interface TestCardProps {
  test: ABTest;
  results: ReturnType<typeof useABTestingStore.getState>['getTestResults'] extends (id: string) => infer R ? R : never;
  onActivate: () => void;
  onDeactivate: () => void;
  onDelete: () => void;
  onViewDetails: () => void;
}

const TestCard = ({ test, results, onActivate, onDeactivate, onDelete, onViewDetails }: TestCardProps) => {
  const totalImpressions = results.reduce((sum, r) => sum + r.impressions, 0);
  const totalConversions = results.reduce((sum, r) => sum + r.conversions, 0);
  const overallConversionRate = totalImpressions > 0 ? (totalConversions / totalImpressions) * 100 : 0;

  // Find best performing variant
  const bestVariant = results.length > 0 
    ? results.reduce((best, current) => 
        current.conversionRate > best.conversionRate ? current : best
      )
    : null;

  return (
    <motion.div
      layout
      className={`p-4 rounded-xl border transition-colors ${
        test.isActive
          ? 'bg-purple-500/10 border-purple-500/30'
          : 'bg-white/5 border-white/10'
      }`}
    >
      <div className="flex items-start gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-medium text-white">{test.name}</h3>
            {test.isActive && (
              <span className="px-2 py-0.5 text-xs bg-green-500/20 text-green-400 rounded-full">
                Active
              </span>
            )}
          </div>
          <p className="text-sm text-white/60 mb-3">{test.description}</p>

          {/* Variants Summary */}
          <div className="flex flex-wrap gap-2 mb-3">
            {test.variants.map((variant) => (
              <span
                key={variant.id}
                className="px-2 py-1 text-xs bg-white/10 text-white/80 rounded"
              >
                {variant.name} ({variant.weight}%)
              </span>
            ))}
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2 text-white/60">
              <Users className="w-4 h-4" />
              <span>{totalImpressions} impressions</span>
            </div>
            <div className="flex items-center gap-2 text-white/60">
              <TrendingUp className="w-4 h-4" />
              <span>{overallConversionRate.toFixed(1)}% conversion</span>
            </div>
            {bestVariant && bestVariant.impressions > 0 && (
              <div className="flex items-center gap-2 text-green-400">
                <BarChart3 className="w-4 h-4" />
                <span>Best: {bestVariant.variant.name}</span>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onViewDetails}
            className="p-2 hover:bg-white/10 rounded-lg text-white/60 hover:text-white transition-colors"
            title="View Details"
          >
            <BarChart3 className="w-4 h-4" />
          </button>
          <button
            onClick={test.isActive ? onDeactivate : onActivate}
            className={`p-2 rounded-lg transition-colors ${
              test.isActive
                ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'
                : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
            }`}
            title={test.isActive ? 'Pause Test' : 'Start Test'}
          >
            {test.isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <button
            onClick={onDelete}
            className="p-2 hover:bg-red-500/20 rounded-lg text-red-400 transition-colors"
            title="Delete Test"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// Test Details Modal
interface TestDetailsModalProps {
  test: ABTest;
  results: {
    variant: ABTestVariant;
    impressions: number;
    conversions: number;
    conversionRate: number;
    avgEngagement: number;
  }[];
  onClose: () => void;
}

const TestDetailsModal = ({ test, results, onClose }: TestDetailsModalProps) => {
  const maxImpressions = Math.max(...results.map((r) => r.impressions), 1);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        className="w-full max-w-2xl bg-zinc-800 rounded-xl p-6 shadow-xl max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-white">{test.name}</h3>
            <p className="text-sm text-white/60">{test.description}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg">
            <X className="w-5 h-5 text-white/60" />
          </button>
        </div>

        {/* Results */}
        <div className="space-y-4">
          {results.map((result) => (
            <div
              key={result.variant.id}
              className="p-4 bg-white/5 rounded-xl border border-white/10"
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-medium text-white">{result.variant.name}</h4>
                  <p className="text-xs text-white/60">Weight: {result.variant.weight}%</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-white">
                    {result.conversionRate.toFixed(1)}%
                  </p>
                  <p className="text-xs text-white/60">conversion rate</p>
                </div>
              </div>

              {/* Bar visualization */}
              <div className="mb-3">
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(result.impressions / maxImpressions) * 100}%` }}
                    className="h-full bg-purple-500 rounded-full"
                  />
                </div>
              </div>

              {/* Metrics */}
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-lg font-semibold text-white">{result.impressions}</p>
                  <p className="text-xs text-white/60">Impressions</p>
                </div>
                <div>
                  <p className="text-lg font-semibold text-white">{result.conversions}</p>
                  <p className="text-xs text-white/60">Conversions</p>
                </div>
                <div>
                  <p className="text-lg font-semibold text-white">
                    {result.avgEngagement > 0
                      ? `${(result.avgEngagement / 1000).toFixed(1)}s`
                      : '-'}
                  </p>
                  <p className="text-xs text-white/60">Avg. Engagement</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Test Info */}
        <div className="mt-6 pt-4 border-t border-white/10">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-white/60">Created</p>
              <p className="text-white">{new Date(test.createdAt).toLocaleDateString()}</p>
            </div>
            {test.startedAt && (
              <div>
                <p className="text-white/60">Started</p>
                <p className="text-white">{new Date(test.startedAt).toLocaleDateString()}</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// New Test Form Modal
interface NewTestFormModalProps {
  onSave: (test: Omit<ABTest, 'id' | 'createdAt' | 'metrics'>) => void;
  onClose: () => void;
}

const NewTestFormModal = ({ onSave, onClose }: NewTestFormModalProps) => {
  const [form, setForm] = useState({
    name: '',
    description: '',
    variants: [
      { id: 'variant-a', name: 'Variant A', weight: 50 },
      { id: 'variant-b', name: 'Variant B', weight: 50 },
    ] as ABTestVariant[],
  });

  const addVariant = () => {
    const newVariant: ABTestVariant = {
      id: `variant-${Date.now()}`,
      name: `Variant ${String.fromCharCode(65 + form.variants.length)}`,
      weight: 0,
    };
    setForm({ ...form, variants: [...form.variants, newVariant] });
  };

  const updateVariant = (index: number, updates: Partial<ABTestVariant>) => {
    const variants = [...form.variants];
    variants[index] = { ...variants[index], ...updates };
    setForm({ ...form, variants });
  };

  const removeVariant = (index: number) => {
    if (form.variants.length <= 2) return;
    const variants = form.variants.filter((_, i) => i !== index);
    setForm({ ...form, variants });
  };

  const totalWeight = form.variants.reduce((sum, v) => sum + v.weight, 0);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        className="w-full max-w-lg bg-zinc-800 rounded-xl p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold text-white mb-4">Create New A/B Test</h3>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-white/60">Test Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g., Button Color Test"
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="text-sm text-white/60">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="What are you testing?"
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500 resize-none"
              rows={2}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm text-white/60">Variants</label>
              <span className={`text-xs ${totalWeight === 100 ? 'text-green-400' : 'text-yellow-400'}`}>
                Total: {totalWeight}%
              </span>
            </div>
            <div className="space-y-2">
              {form.variants.map((variant, index) => (
                <div key={variant.id} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={variant.name}
                    onChange={(e) => updateVariant(index, { name: e.target.value })}
                    className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500"
                  />
                  <input
                    type="number"
                    value={variant.weight}
                    onChange={(e) => updateVariant(index, { weight: parseInt(e.target.value) || 0 })}
                    className="w-20 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm text-center focus:outline-none focus:border-purple-500"
                    min={0}
                    max={100}
                  />
                  <span className="text-white/40 text-sm">%</span>
                  {form.variants.length > 2 && (
                    <button
                      onClick={() => removeVariant(index)}
                      className="p-1 hover:bg-red-500/20 rounded text-red-400"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              onClick={addVariant}
              className="mt-2 text-sm text-purple-400 hover:text-purple-300"
            >
              + Add Variant
            </button>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave({ ...form, isActive: false })}
            disabled={!form.name || totalWeight !== 100}
            className="flex-1 py-2 bg-purple-500 hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
          >
            Create Test
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ABTestingPanel;
