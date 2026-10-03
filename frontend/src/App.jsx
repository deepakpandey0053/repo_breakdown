import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import DashboardHeader from './components/DashboardHeader.jsx';
import FileTree from './components/FileTree.jsx';
import FlowCanvas from './components/FlowCanvas.jsx';
import GuidePanel from './components/GuidePanel.jsx';
import FileDetailModal from './components/FileDetailModal.jsx';
import SecurityModal from './components/SecurityModal.jsx';
import MonorepoModal from './components/MonorepoModal.jsx';
import { BackgroundCanvas } from './components/ui/BackgroundCanvas.jsx';
import { AlertCircle, X } from 'lucide-react';
import { fireConfetti } from './components/ui/confetti.js';

export default function App() {
  const [currentRepo, setCurrentRepo] = useState('');
  const [breakdownData, setBreakdownData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);
  const [isMonorepoModalOpen, setIsMonorepoModalOpen] = useState(false);
  const [monorepoData, setMonorepoData] = useState(null);
  const [error, setError] = useState(null);

  const handleAnalyze = async (repoUrl, targetDirectory = '') => {
    setIsLoading(true);
    setError(null);
    setLoadingStep('Ingesting repository archive & detecting project architecture...');

    try {
      // Step update timer simulation for UX transparency
      const timer1 = setTimeout(() => {
        setLoadingStep('Extracting AST skeletons, OOP class inheritance, & multiple inheritance flows...');
      }, 1800);

      const timer2 = setTimeout(() => {
        setLoadingStep('Executing heuristic security regex scan & Gemini architectural synthesis...');
      }, 3800);

      const response = await axios.post('/api/analyze', { repoUrl, forceRefresh: true, targetDirectory }, { timeout: 120000 });
      clearTimeout(timer1);
      clearTimeout(timer2);

      // Check if repository is a monorepo requiring directory selection
      if (response.data && response.data.status === 'monorepo_detected') {
        setMonorepoData(response.data);
        setIsMonorepoModalOpen(true);
        setCurrentRepo(response.data.fullName || repoUrl);
        setIsLoading(false);
        setLoadingStep('');
        return;
      }

      if (response.data && response.data.data) {
        setBreakdownData(response.data.data);
        setCurrentRepo(response.data.fullName || repoUrl);
        setTimeout(() => fireConfetti(), 400);
      } else {
        throw new Error('Invalid response structure returned from server.');
      }
    } catch (err) {
      console.error('[App Analyze Error]', err);
      let msg = err.response?.data?.error || err.message || 'Failed to analyze repository.';
      if (msg.includes('500') || msg.includes('ECONNREFUSED') || err.response?.status === 500) {
        msg = 'Backend server (port 5000) or Python service is offline. Please make sure the backend and python services are running with npm run dev.';
      }
      setError(msg);
    } finally {
      setIsLoading(false);
      setLoadingStep('');
    }
  };

  const handleReset = () => {
    setBreakdownData(null);
    setCurrentRepo('');
    setSelectedFile(null);
    setIsSecurityModalOpen(false);
    setIsMonorepoModalOpen(false);
    setMonorepoData(null);
    setError(null);
  };

  return (
    <div className="w-full min-h-screen flex flex-col bg-obsidian-950 text-slate-100 font-sans relative selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Interactive Luxury Ambient Particle Canvas & Aurora */}
      <BackgroundCanvas />

      {/* Floating Island Navigation */}
      <Navbar onReset={handleReset} currentRepo={currentRepo} />

      {/* Error Alert Overlay */}
      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 max-w-xl w-full px-4 z-50 pointer-events-auto"
          >
            <div className="bg-red-950/90 border border-red-500/40 px-4 py-3 rounded-2xl flex items-center justify-between text-xs text-red-200 shadow-2xl backdrop-blur-xl">
              <div className="flex items-center gap-2.5">
                <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
                <span>{error}</span>
              </div>
              <button onClick={() => setError(null)} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main View Container */}
      <main className="flex-1 flex flex-col relative z-10">
        <AnimatePresence mode="wait">
          {!breakdownData ? (
            <motion.div 
              key="hero"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="flex-1 flex flex-col"
            >
              <Hero
                onAnalyze={handleAnalyze}
                isLoading={isLoading}
                loadingStep={loadingStep}
              />
            </motion.div>
          ) : (
            <motion.div 
              key="dashboard"
              initial={{ opacity: 0, scale: 0.99 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="flex-1 flex flex-col relative"
            >
              {/* Killer Feature #1 & #4: Dashboard Header with ELI5 Toggle & Security Badge */}
              <DashboardHeader
                data={breakdownData}
                onOpenSecurityAlerts={() => setIsSecurityModalOpen(true)}
              />

              {/* 3-Column Split Dashboard View with full comfortable workspace height */}
              <div className="w-full h-[calc(100vh-80px)] min-h-[660px] flex overflow-hidden relative border-t border-white/[0.08] bg-obsidian-900/40 backdrop-blur-xl">
                {/* Killer Feature #5: Left Sidebar (File Tree + "Test My Knowledge" Quiz) */}
                <FileTree
                  tree={breakdownData.tree || []}
                  quiz={breakdownData.mini_quiz || []}
                  onSelectFile={(path) => setSelectedFile(path)}
                  selectedFile={selectedFile}
                />

                {/* Killer Feature #2: Middle Canvas: Interactive React Flow Architecture Graph */}
                <div className="flex-1 relative flex flex-col overflow-hidden">
                  <FlowCanvas
                    architectureNodes={breakdownData.architecture_nodes || []}
                    onSelectNode={(nodeId) => console.log('Selected node:', nodeId)}
                  />
                </div>

                {/* Killer Feature #3: Right Panel (1-Click Run It Locally + Start Here Guide) */}
                <GuidePanel
                  data={breakdownData}
                  onSelectFile={(path) => setSelectedFile(path)}
                />
              </div>

              {/* File AST Inspector Modal */}
              {selectedFile && (
                <FileDetailModal
                  filePath={selectedFile}
                  breakdownData={breakdownData}
                  currentRepo={currentRepo}
                  onClose={() => setSelectedFile(null)}
                />
              )}

              {/* Security Audit Modal */}
              <SecurityModal
                alerts={breakdownData.security_alerts || []}
                isOpen={isSecurityModalOpen}
                onClose={() => setIsSecurityModalOpen(false)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Monorepo Project Selection Modal */}
      <MonorepoModal
        isOpen={isMonorepoModalOpen}
        onClose={() => setIsMonorepoModalOpen(false)}
        monorepoData={monorepoData}
        onSelectProject={(targetDir) => {
          setIsMonorepoModalOpen(false);
          const repoUrl = monorepoData?.repoUrl || currentRepo;
          handleAnalyze(repoUrl, targetDir);
        }}
      />
    </div>
  );
}
