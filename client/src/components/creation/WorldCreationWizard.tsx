import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWorldStore } from '../../stores/worldStore';
import { useNavigate } from 'react-router-dom';
import { Globe, Sparkles, ArrowRight, ArrowLeft, Check } from 'lucide-react';

const SIMULATION_STYLES = [
  { id: 'realistic', label: 'Realistic', desc: 'Agents behave rationally, events follow natural cause-and-effect chains.' },
  { id: 'dramatic', label: 'Dramatic', desc: 'Higher chance of conflicts, emotional decisions, and pivotal moments.' },
  { id: 'chaotic', label: 'Chaotic', desc: 'Unpredictable events, impulsive agents, rapid changes.' },
  { id: 'peaceful', label: 'Peaceful', desc: 'Cooperative agents, fewer conflicts, steady community growth.' },
  { id: 'experimental', label: 'Experimental', desc: 'Balanced mix of all tendencies. Best for sandbox exploration.' },
];

interface WizardProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WorldCreationWizard({ isOpen, onClose }: WizardProps) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [style, setStyle] = useState('realistic');
  const [creating, setCreating] = useState(false);
  const { createWorld } = useWorldStore();
  const navigate = useNavigate();

  const handleCreate = async () => {
    if (!name.trim()) return;
    setCreating(true);
    try {
      const world = await createWorld({ name, description, simulation_style: style });
      onClose();
      navigate(`/world/${world.id}`);
    } catch (err) {
      console.error('Failed to create world:', err);
    } finally {
      setCreating(false);
    }
  };

  if (!isOpen) return null;

  const steps = [
    // Step 0: Name & Description
    <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">World Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g., Northbridge, Riverside University..."
          className="w-full bg-echo-darker border border-echo-border rounded-lg px-4 py-3 text-gray-100 placeholder-gray-600 focus:outline-none focus:border-echo-cyan transition-colors"
          autoFocus
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="A university town with students, professors, cafes and businesses..."
          rows={4}
          className="w-full bg-echo-darker border border-echo-border rounded-lg px-4 py-3 text-gray-100 placeholder-gray-600 focus:outline-none focus:border-echo-cyan transition-colors resize-none"
        />
      </div>
    </motion.div>,

    // Step 1: Simulation Style
    <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-3">
      <p className="text-sm text-gray-400 mb-4">Choose how agents in this world tend to behave. This influences parameters, not outcomes.</p>
      {SIMULATION_STYLES.map((s) => (
        <button
          key={s.id}
          onClick={() => setStyle(s.id)}
          className={`w-full text-left p-4 rounded-lg border transition-all ${
            style === s.id
              ? 'border-echo-cyan bg-echo-cyan/10 text-echo-cyan'
              : 'border-echo-border bg-echo-darker text-gray-300 hover:border-gray-600'
          }`}
        >
          <div className="font-medium">{s.label}</div>
          <div className="text-sm text-gray-400 mt-1">{s.desc}</div>
        </button>
      ))}
    </motion.div>,

    // Step 2: Review
    <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
      <div className="bg-echo-darker rounded-lg p-6 border border-echo-border">
        <div className="flex items-center gap-3 mb-4">
          <Globe className="w-8 h-8 text-echo-cyan" />
          <div>
            <h3 className="text-xl font-bold text-gray-100">{name || 'Untitled World'}</h3>
            <span className="text-sm text-echo-cyan capitalize">{style}</span>
          </div>
        </div>
        <p className="text-gray-400 text-sm">{description || 'No description provided.'}</p>
      </div>
      <div className="bg-echo-darker rounded-lg p-4 border border-echo-border">
        <p className="text-sm text-gray-400">
          <Sparkles className="w-4 h-4 inline mr-2 text-echo-amber" />
          After creation, you can add locations and populate the world with synthetic people.
        </p>
      </div>
    </motion.div>,
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative bg-echo-card border border-echo-border rounded-2xl p-8 max-w-lg w-full mx-4 shadow-2xl"
      >
        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-8">
          {['Name', 'Style', 'Review'].map((label, i) => (
            <div key={label} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                i <= step ? 'bg-echo-cyan text-black' : 'bg-echo-border text-gray-500'
              }`}>
                {i < step ? <Check className="w-4 h-4" /> : i + 1}
              </div>
              <span className={`text-sm ${i <= step ? 'text-gray-200' : 'text-gray-600'}`}>{label}</span>
              {i < 2 && <div className={`w-8 h-px ${i < step ? 'bg-echo-cyan' : 'bg-echo-border'}`} />}
            </div>
          ))}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {steps[step]}
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between mt-8 pt-6 border-t border-echo-border">
          <button
            onClick={() => step > 0 ? setStep(step - 1) : onClose()}
            className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-gray-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {step > 0 ? 'Back' : 'Cancel'}
          </button>
          {step < 2 ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={step === 0 && !name.trim()}
              className="flex items-center gap-2 px-6 py-2 bg-echo-cyan text-black font-medium rounded-lg hover:bg-echo-cyan/90 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Next <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleCreate}
              disabled={creating || !name.trim()}
              className="flex items-center gap-2 px-6 py-2 bg-echo-cyan text-black font-medium rounded-lg hover:bg-echo-cyan/90 transition-colors disabled:opacity-50"
            >
              {creating ? (
                <><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full" /> Creating...</>
              ) : (
                <><Sparkles className="w-4 h-4" /> Create World</>
              )}
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
