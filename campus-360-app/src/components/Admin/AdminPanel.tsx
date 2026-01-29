/**
 * Admin Panel - Content Management UI
 * Allows editing POIs, locations, and announcements without code changes
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Shield, 
  MapPin, 
  Bell, 
  Settings, 
  Download, 
  Upload, 
  Plus, 
  Trash2, 
  Eye, 
  EyeOff,
  AlertTriangle,
  Save,
  LogOut
} from 'lucide-react';
import { useAdminStore } from '../../hooks/useAdminStore';
import type { EditablePOI, Announcement } from '../../hooks/useAdminStore';
import { useTourDataStore } from '../../hooks/useTourDataStore';

interface AdminPanelProps {
  onClose: () => void;
}

type TabType = 'pois' | 'announcements' | 'settings';

export const AdminPanel = ({ onClose }: AdminPanelProps) => {
  const {
    isAdminMode,
    enableAdminMode,
    disableAdminMode,
    customPOIs,
    announcements,
    maintenanceMode,
    maintenanceMessage,
    setMaintenanceMode,
    addPOI,
    updatePOI,
    deletePOI,
    addAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    exportData,
    importData,
  } = useAdminStore();
  
  const { manifest, currentImageId } = useTourDataStore();
  
  // Derive locations from manifest blocks and labs
  const locations = manifest?.blocks.flatMap(block => 
    block.labs.map(lab => ({ id: lab.id, name: lab.name || lab.id }))
  ) || [];
  const currentLocation = currentImageId;
  
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('pois');
  const [editingPOI, setEditingPOI] = useState<EditablePOI | null>(null);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [showNewPOIForm, setShowNewPOIForm] = useState(false);
  const [showNewAnnouncementForm, setShowNewAnnouncementForm] = useState(false);

  const handleLogin = () => {
    if (enableAdminMode(password)) {
      setLoginError(false);
      setPassword('');
    } else {
      setLoginError(true);
    }
  };

  const handleExport = () => {
    const data = exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `campus-tour-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const result = event.target?.result as string;
          if (importData(result)) {
            alert('Data imported successfully!');
          } else {
            alert('Failed to import data. Invalid format.');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  // Login screen
  if (!isAdminMode) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="w-full max-w-sm bg-zinc-900 rounded-2xl p-6 shadow-2xl border border-white/10"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-sky-500/20 flex items-center justify-center">
              <Shield className="w-5 h-5 text-sky-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Admin Login</h2>
              <p className="text-xs text-white/60">Enter password to continue</p>
            </div>
            <button onClick={onClose} className="ml-auto p-2 hover:bg-white/10 rounded-full">
              <X className="w-5 h-5 text-white/60" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                placeholder="Admin password"
                className={`w-full px-4 py-3 bg-white/5 border ${
                  loginError ? 'border-red-500' : 'border-white/10'
                } rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-sky-500`}
              />
              {loginError && (
                <p className="text-red-400 text-xs mt-2">Incorrect password</p>
              )}
            </div>
            <button
              onClick={handleLogin}
              className="w-full py-3 bg-sky-500 hover:bg-sky-600 text-white font-medium rounded-xl transition-colors"
            >
              Login
            </button>
            <p className="text-xs text-center text-white/40">
              Default: admin123 (change in production)
            </p>
          </div>
        </motion.div>
      </motion.div>
    );
  }

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
          <div className="w-10 h-10 rounded-full bg-sky-500/20 flex items-center justify-center">
            <Shield className="w-5 h-5 text-sky-400" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-white">Admin Panel</h2>
            <p className="text-xs text-white/60">Manage content without code changes</p>
          </div>
          <button
            onClick={handleExport}
            className="p-2 hover:bg-white/10 rounded-lg text-white/60 hover:text-white transition-colors"
            title="Export Data"
          >
            <Download className="w-5 h-5" />
          </button>
          <button
            onClick={handleImport}
            className="p-2 hover:bg-white/10 rounded-lg text-white/60 hover:text-white transition-colors"
            title="Import Data"
          >
            <Upload className="w-5 h-5" />
          </button>
          <button
            onClick={disableAdminMode}
            className="p-2 hover:bg-white/10 rounded-lg text-white/60 hover:text-white transition-colors"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg">
            <X className="w-5 h-5 text-white/60" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 p-4 border-b border-white/10">
          <TabButton active={activeTab === 'pois'} onClick={() => setActiveTab('pois')}>
            <MapPin className="w-4 h-4" />
            POIs ({customPOIs.length})
          </TabButton>
          <TabButton active={activeTab === 'announcements'} onClick={() => setActiveTab('announcements')}>
            <Bell className="w-4 h-4" />
            Announcements ({announcements.length})
          </TabButton>
          <TabButton active={activeTab === 'settings'} onClick={() => setActiveTab('settings')}>
            <Settings className="w-4 h-4" />
            Settings
          </TabButton>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <AnimatePresence mode="wait">
            {activeTab === 'pois' && (
              <POIsTab
                pois={customPOIs}
                locations={locations}
                currentLocation={currentLocation}
                onAdd={() => setShowNewPOIForm(true)}
                onEdit={setEditingPOI}
                onDelete={deletePOI}
                onToggleVisibility={(id, visible) => updatePOI(id, { isVisible: visible })}
              />
            )}
            {activeTab === 'announcements' && (
              <AnnouncementsTab
                announcements={announcements}
                onAdd={() => setShowNewAnnouncementForm(true)}
                onEdit={setEditingAnnouncement}
                onDelete={deleteAnnouncement}
                onToggleActive={(id, active) => updateAnnouncement(id, { isActive: active })}
              />
            )}
            {activeTab === 'settings' && (
              <SettingsTab
                maintenanceMode={maintenanceMode}
                maintenanceMessage={maintenanceMessage}
                onSetMaintenance={setMaintenanceMode}
              />
            )}
          </AnimatePresence>
        </div>

        {/* POI Form Modal */}
        <AnimatePresence>
          {(showNewPOIForm || editingPOI) && (
            <POIFormModal
              poi={editingPOI}
              locations={locations}
              currentLocation={currentLocation}
              onSave={(poi) => {
                if (editingPOI) {
                  updatePOI(editingPOI.id, poi);
                } else {
                  addPOI({ ...poi, isVisible: true });
                }
                setEditingPOI(null);
                setShowNewPOIForm(false);
              }}
              onClose={() => {
                setEditingPOI(null);
                setShowNewPOIForm(false);
              }}
            />
          )}
        </AnimatePresence>

        {/* Announcement Form Modal */}
        <AnimatePresence>
          {(showNewAnnouncementForm || editingAnnouncement) && (
            <AnnouncementFormModal
              announcement={editingAnnouncement}
              onSave={(ann) => {
                if (editingAnnouncement) {
                  updateAnnouncement(editingAnnouncement.id, ann);
                } else {
                  addAnnouncement({ ...ann, isActive: true });
                }
                setEditingAnnouncement(null);
                setShowNewAnnouncementForm(false);
              }}
              onClose={() => {
                setEditingAnnouncement(null);
                setShowNewAnnouncementForm(false);
              }}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

// Tab Button Component
const TabButton = ({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
      active
        ? 'bg-sky-500 text-white'
        : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
    }`}
  >
    {children}
  </button>
);

// POIs Tab
interface POIsTabProps {
  pois: EditablePOI[];
  locations: { id: string; name: string }[];
  currentLocation: string | null;
  onAdd: () => void;
  onEdit: (poi: EditablePOI) => void;
  onDelete: (id: string) => void;
  onToggleVisibility: (id: string, visible: boolean) => void;
}

const POIsTab = ({ pois, locations, currentLocation, onAdd, onEdit, onDelete, onToggleVisibility }: POIsTabProps) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    className="space-y-4"
  >
    <div className="flex items-center justify-between">
      <p className="text-white/60 text-sm">
        Current Location: <span className="text-sky-400">{currentLocation || 'None selected'}</span>
      </p>
      <button
        onClick={onAdd}
        className="flex items-center gap-2 px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors"
      >
        <Plus className="w-4 h-4" />
        Add POI
      </button>
    </div>

    {pois.length === 0 ? (
      <div className="text-center py-12 text-white/40">
        <MapPin className="w-12 h-12 mx-auto mb-4 opacity-40" />
        <p>No custom POIs yet</p>
        <p className="text-sm">Add points of interest to enhance the tour</p>
      </div>
    ) : (
      <div className="grid gap-3">
        {pois.map((poi) => {
          const location = locations.find((l) => l.id === poi.locationId);
          return (
            <div
              key={poi.id}
              className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10"
            >
              <div className="flex-1">
                <h3 className="font-medium text-white">{poi.title}</h3>
                <p className="text-sm text-white/60 line-clamp-1">{poi.description}</p>
                <p className="text-xs text-white/40 mt-1">
                  Location: {location?.name || poi.locationId}
                </p>
              </div>
              <button
                onClick={() => onToggleVisibility(poi.id, !poi.isVisible)}
                className={`p-2 rounded-lg transition-colors ${
                  poi.isVisible ? 'bg-green-500/20 text-green-400' : 'bg-white/5 text-white/40'
                }`}
              >
                {poi.isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
              <button
                onClick={() => onEdit(poi)}
                className="p-2 hover:bg-white/10 rounded-lg text-white/60"
              >
                <Settings className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(poi.id)}
                className="p-2 hover:bg-red-500/20 rounded-lg text-red-400"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    )}
  </motion.div>
);

// Announcements Tab
interface AnnouncementsTabProps {
  announcements: Announcement[];
  onAdd: () => void;
  onEdit: (ann: Announcement) => void;
  onDelete: (id: string) => void;
  onToggleActive: (id: string, active: boolean) => void;
}

const AnnouncementsTab = ({ announcements, onAdd, onEdit, onDelete, onToggleActive }: AnnouncementsTabProps) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    className="space-y-4"
  >
    <div className="flex items-center justify-end">
      <button
        onClick={onAdd}
        className="flex items-center gap-2 px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors"
      >
        <Plus className="w-4 h-4" />
        Add Announcement
      </button>
    </div>

    {announcements.length === 0 ? (
      <div className="text-center py-12 text-white/40">
        <Bell className="w-12 h-12 mx-auto mb-4 opacity-40" />
        <p>No announcements yet</p>
        <p className="text-sm">Create announcements to inform visitors</p>
      </div>
    ) : (
      <div className="grid gap-3">
        {announcements.map((ann) => (
          <div
            key={ann.id}
            className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10"
          >
            <div
              className={`w-2 h-2 rounded-full ${
                ann.type === 'info'
                  ? 'bg-blue-400'
                  : ann.type === 'warning'
                  ? 'bg-yellow-400'
                  : ann.type === 'success'
                  ? 'bg-green-400'
                  : 'bg-red-400'
              }`}
            />
            <div className="flex-1">
              <h3 className="font-medium text-white">{ann.title}</h3>
              <p className="text-sm text-white/60 line-clamp-1">{ann.message}</p>
            </div>
            <button
              onClick={() => onToggleActive(ann.id, !ann.isActive)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                ann.isActive
                  ? 'bg-green-500/20 text-green-400'
                  : 'bg-white/5 text-white/40'
              }`}
            >
              {ann.isActive ? 'Active' : 'Inactive'}
            </button>
            <button
              onClick={() => onEdit(ann)}
              className="p-2 hover:bg-white/10 rounded-lg text-white/60"
            >
              <Settings className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(ann.id)}
              className="p-2 hover:bg-red-500/20 rounded-lg text-red-400"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    )}
  </motion.div>
);

// Settings Tab
interface SettingsTabProps {
  maintenanceMode: boolean;
  maintenanceMessage: string;
  onSetMaintenance: (enabled: boolean, message?: string) => void;
}

const SettingsTab = ({ maintenanceMode, maintenanceMessage, onSetMaintenance }: SettingsTabProps) => {
  const [message, setMessage] = useState(maintenanceMessage);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6"
    >
      <div className="p-4 bg-white/5 rounded-xl border border-white/10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className={`w-5 h-5 ${maintenanceMode ? 'text-yellow-400' : 'text-white/40'}`} />
            <div>
              <h3 className="font-medium text-white">Maintenance Mode</h3>
              <p className="text-sm text-white/60">Temporarily disable the tour for all visitors</p>
            </div>
          </div>
          <button
            onClick={() => onSetMaintenance(!maintenanceMode)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              maintenanceMode
                ? 'bg-yellow-500 text-black'
                : 'bg-white/10 text-white'
            }`}
          >
            {maintenanceMode ? 'Disable' : 'Enable'}
          </button>
        </div>
        <div className="space-y-2">
          <label className="text-sm text-white/60">Maintenance Message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-sky-500 resize-none"
            rows={3}
          />
          <button
            onClick={() => onSetMaintenance(maintenanceMode, message)}
            className="flex items-center gap-2 px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors"
          >
            <Save className="w-4 h-4" />
            Save Message
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// POI Form Modal
interface POIFormModalProps {
  poi: EditablePOI | null;
  locations: { id: string; name: string }[];
  currentLocation: string | null;
  onSave: (poi: Omit<EditablePOI, 'id' | 'createdAt' | 'updatedAt' | 'isVisible'>) => void;
  onClose: () => void;
}

const POIFormModal = ({ poi, locations, currentLocation, onSave, onClose }: POIFormModalProps) => {
  const [form, setForm] = useState({
    locationId: poi?.locationId || currentLocation || '',
    title: poi?.title || '',
    description: poi?.description || '',
    x: poi?.x || 0,
    y: poi?.y || 0,
    z: poi?.z || -5,
    image: poi?.image || '',
    video: poi?.video || '',
  });

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
        className="w-full max-w-md bg-zinc-800 rounded-xl p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold text-white mb-4">
          {poi ? 'Edit POI' : 'Add New POI'}
        </h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-white/60">Location</label>
            <select
              value={form.locationId}
              onChange={(e) => setForm({ ...form, locationId: e.target.value })}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-sky-500"
            >
              <option value="">Select location</option>
              {locations.map((loc) => (
                <option key={loc.id} value={loc.id}>{loc.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm text-white/60">Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-sky-500"
            />
          </div>
          <div>
            <label className="text-sm text-white/60">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-sky-500 resize-none"
              rows={3}
            />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="text-sm text-white/60">X</label>
              <input
                type="number"
                value={form.x}
                onChange={(e) => setForm({ ...form, x: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-sky-500"
              />
            </div>
            <div>
              <label className="text-sm text-white/60">Y</label>
              <input
                type="number"
                value={form.y}
                onChange={(e) => setForm({ ...form, y: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-sky-500"
              />
            </div>
            <div>
              <label className="text-sm text-white/60">Z</label>
              <input
                type="number"
                value={form.z}
                onChange={(e) => setForm({ ...form, z: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-sky-500"
              />
            </div>
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
            onClick={() => onSave(form)}
            disabled={!form.locationId || !form.title}
            className="flex-1 py-2 bg-sky-500 hover:bg-sky-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
          >
            Save
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Announcement Form Modal
interface AnnouncementFormModalProps {
  announcement: Announcement | null;
  onSave: (ann: Omit<Announcement, 'id' | 'createdAt' | 'isActive'>) => void;
  onClose: () => void;
}

const AnnouncementFormModal = ({ announcement, onSave, onClose }: AnnouncementFormModalProps) => {
  const [form, setForm] = useState({
    title: announcement?.title || '',
    message: announcement?.message || '',
    type: announcement?.type || 'info' as Announcement['type'],
    showOnLocations: announcement?.showOnLocations || [],
    expiresAt: announcement?.expiresAt,
  });

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
        className="w-full max-w-md bg-zinc-800 rounded-xl p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold text-white mb-4">
          {announcement ? 'Edit Announcement' : 'Add Announcement'}
        </h3>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-white/60">Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-sky-500"
            />
          </div>
          <div>
            <label className="text-sm text-white/60">Message</label>
            <textarea
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-sky-500 resize-none"
              rows={3}
            />
          </div>
          <div>
            <label className="text-sm text-white/60">Type</label>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value as Announcement['type'] })}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-sky-500"
            >
              <option value="info">Info</option>
              <option value="warning">Warning</option>
              <option value="success">Success</option>
              <option value="error">Error</option>
            </select>
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
            onClick={() => onSave(form)}
            disabled={!form.title || !form.message}
            className="flex-1 py-2 bg-sky-500 hover:bg-sky-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
          >
            Save
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AdminPanel;
