import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  ArrowLeft, 
  ArrowRight, 
  RotateCcw, 
  Plus, 
  X, 
  Bookmark, 
  History, 
  Settings, 
  Sparkles,
  Home,
  Shield,
  Globe,
  PanelRightClose,
  PanelRightOpen,
  Menu,
  Sun,
  Moon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AIAssistant } from '@/src/components/AI/AIAssistant';
import { Tab } from '@/src/types';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

const INITIAL_TABS: Tab[] = [
  { id: '1', title: 'New Tab', url: 'about:blank' }
];

export default function App() {
  const [tabs, setTabs] = useState<Tab[]>(INITIAL_TABS);
  const [activeTabId, setActiveTabId] = useState('1');
  const [urlInput, setUrlInput] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false); // Default to light mode
  const [isShieldActive, setIsShieldActive] = useState(true);
  const [blockedCount, setBlockedCount] = useState(0);
  const [currentTheme, setCurrentTheme] = useState<'aura' | 'ocean' | 'emerald' | 'sunset'>('aura');

  const activeTab = tabs.find(t => t.id === activeTabId) || tabs[0];

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', isDarkMode);
    
    // Manage theme classes
    root.classList.remove('theme-aura', 'theme-ocean', 'theme-emerald', 'theme-sunset');
    if (currentTheme !== 'aura') {
      root.classList.add(`theme-${currentTheme}`);
    }
  }, [isDarkMode, currentTheme]);

  // Simulate ad blocking when navigating
  useEffect(() => {
    if (isShieldActive && activeTab.url !== 'about:blank') {
      const timer = setTimeout(() => {
        setBlockedCount(prev => prev + Math.floor(Math.random() * 5) + 1);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [activeTab.url, isShieldActive]);

  const handleNavigate = (e?: React.FormEvent) => {
    e?.preventDefault();
    let url = urlInput.trim();
    if (!url) return;
    
    if (!url.startsWith('http')) {
      if (url.includes('.') && !url.includes(' ')) {
        url = `https://${url}`;
      } else {
        url = `https://www.google.com/search?q=${encodeURIComponent(url)}`;
      }
    }

    // Basic Ad-blocker simulation: Strip common tracking params
    if (isShieldActive) {
      try {
        const urlObj = new URL(url);
        const paramsToStrip = ['utm_source', 'utm_medium', 'utm_campaign', 'fbclid', 'gclid'];
        paramsToStrip.forEach(p => urlObj.searchParams.delete(p));
        url = urlObj.toString();
      } catch (e) {
        // Not a valid URL yet, skip
      }
    }

    setTabs(prev => prev.map(t => t.id === activeTabId ? { ...t, url, title: url } : t));
    setUrlInput(url);
  };

  const addTab = () => {
    const newId = Math.random().toString(36).substr(2, 9);
    const newTab = { id: newId, title: 'New Tab', url: 'about:blank' };
    setTabs(prev => [...prev, newTab]);
    setActiveTabId(newId);
    setUrlInput('');
  };

  const closeTab = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (tabs.length === 1) return;
    const newTabs = tabs.filter(t => t.id !== id);
    setTabs(newTabs);
    if (activeTabId === id) {
      setActiveTabId(newTabs[newTabs.length - 1].id);
    }
  };

  return (
    <div className="flex h-screen w-full bg-background text-foreground overflow-hidden font-sans">
      {/* Main Browser Area */}
      <div className="flex flex-col flex-1 min-w-0">
        
        {/* Tab Bar */}
        <div className="flex items-center gap-1 px-2 pt-2 bg-muted/30 border-b border-border/50">
          <div className="flex flex-1 gap-1 overflow-x-auto no-scrollbar">
            {tabs.map((tab) => (
              <div
                key={tab.id}
                onClick={() => {
                  setActiveTabId(tab.id);
                  setUrlInput(tab.url === 'about:blank' ? '' : tab.url);
                }}
                className={cn(
                  "group relative flex items-center gap-2 px-4 py-2 min-w-[140px] max-w-[200px] rounded-t-xl cursor-pointer transition-all duration-200",
                  activeTabId === tab.id 
                    ? "bg-card text-primary shadow-[0_-4px_10px_rgba(0,0,0,0.05)]" 
                    : "hover:bg-muted text-muted-foreground"
                )}
              >
                <Globe size={14} className={activeTabId === tab.id ? "text-primary" : "text-muted-foreground"} />
                <span className="text-xs font-medium truncate flex-1">
                  {tab.url === 'about:blank' ? 'New Tab' : tab.title}
                </span>
                <button
                  onClick={(e) => closeTab(tab.id, e)}
                  className="opacity-0 group-hover:opacity-100 hover:bg-muted-foreground/20 rounded-full p-0.5 transition-opacity"
                >
                  <X size={12} />
                </button>
                {activeTabId === tab.id && (
                  <motion.div 
                    layoutId="activeTabUnderline"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                  />
                )}
              </div>
            ))}
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={addTab}
              className="h-8 w-8 rounded-full hover:bg-primary/10 hover:text-primary"
            >
              <Plus size={16} />
            </Button>
          </div>
          
          <div className="flex items-center gap-2 px-2">
             <div className="flex items-center gap-1.5 p-1 bg-muted/50 rounded-full border border-border/50">
               {[
                 { id: 'aura', color: 'bg-[#ffa6c9]' },
                 { id: 'ocean', color: 'bg-[#a6e2ff]' },
                 { id: 'emerald', color: 'bg-[#a6ffd8]' },
                 { id: 'sunset', color: 'bg-[#ffdca6]' },
               ].map((theme) => (
                 <button
                   key={theme.id}
                   onClick={() => setCurrentTheme(theme.id as any)}
                   className={cn(
                     "w-5 h-5 rounded-full border-2 transition-all p-0",
                     currentTheme === theme.id ? "border-primary scale-110 shadow-md" : "border-transparent hover:scale-105"
                   )}
                   title={`Switch to ${theme.id} theme`}
                 >
                   <div className={cn("w-full h-full rounded-full", theme.color)} />
                 </button>
               ))}
             </div>
             <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsDarkMode(!isDarkMode)}
                className="h-8 w-8 rounded-full hover:bg-primary/10"
                title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
             >
                {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
             </Button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-3 p-2 bg-card border-b border-border/50 shadow-sm">
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-primary/10">
              <ArrowLeft size={18} />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-primary/10">
              <ArrowRight size={18} />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-primary/10">
              <RotateCcw size={18} />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-primary/10">
              <Home size={18} onClick={() => {
                setTabs(prev => prev.map(t => t.id === activeTabId ? { ...t, url: 'about:blank', title: 'New Tab' } : t));
                setUrlInput('');
              }} />
            </Button>
          </div>

          <form onSubmit={handleNavigate} className="flex-1 relative group">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-2 text-muted-foreground group-focus-within:text-primary transition-colors">
              <button 
                type="button"
                onClick={() => setIsShieldActive(!isShieldActive)}
                className={cn(
                  "p-1 rounded-md transition-all",
                  isShieldActive ? "text-green-500 bg-green-500/10" : "text-muted-foreground hover:bg-muted"
                )}
                title={isShieldActive ? "Aura Shield Active" : "Aura Shield Inactive"}
              >
                <Shield size={14} fill={isShieldActive ? "currentColor" : "none"} />
              </button>
              <Search size={14} />
            </div>
            <Input
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="Search or enter URL"
              className="w-full pl-14 pr-4 h-9 bg-muted/50 border-transparent focus-visible:bg-background focus-visible:border-primary/30 rounded-full transition-all"
            />
            {isShieldActive && blockedCount > 0 && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Badge variant="secondary" className="h-5 px-1.5 text-[10px] bg-primary/10 text-primary border-none">
                  {blockedCount} ads blocked
                </Badge>
              </div>
            )}
          </form>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-primary/10">
              <Bookmark size={18} />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className={cn(
                "h-8 w-8 rounded-full transition-colors",
                isSidebarOpen ? "text-primary bg-primary/10" : "hover:bg-primary/10"
              )}
            >
              {isSidebarOpen ? <PanelRightClose size={18} /> : <PanelRightOpen size={18} />}
            </Button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-muted/20 relative overflow-hidden">
          {activeTab.url === 'about:blank' ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-gradient-to-br from-background via-background to-primary/10">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-2xl text-center space-y-8"
              >
                <div className="flex flex-col items-center gap-4">
                  <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-primary to-primary/40 flex items-center justify-center shadow-2xl shadow-primary/20">
                    <Sparkles size={48} className="text-white animate-bounce-slow" />
                  </div>
                  <h1 className="text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60 capitalize">
                    {currentTheme} Browser
                  </h1>
                  <p className="text-muted-foreground text-lg max-w-md">
                    The {currentTheme} edition of Aura Browser. Professional, AI-powered, and beautiful.
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { name: 'Google', icon: Search, color: 'bg-blue-500/10 text-blue-500' },
                    { name: 'GitHub', icon: Globe, color: 'bg-slate-500/10 text-slate-500' },
                    { name: 'AI Studio', icon: Sparkles, color: 'bg-purple-500/10 text-purple-500' },
                    { name: 'History', icon: History, color: 'bg-orange-500/10 text-orange-500' },
                  ].map((site) => (
                    <button 
                      key={site.name}
                      className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-card border border-border/50 hover:border-primary/50 hover:shadow-lg hover:-translate-y-1 transition-all group"
                    >
                      <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform", site.color)}>
                        <site.icon size={24} />
                      </div>
                      <span className="text-sm font-medium">{site.name}</span>
                    </button>
                  ))}
                </div>

                <div className="pt-8 flex justify-center gap-4">
                   <Badge variant="outline" className="px-4 py-1 rounded-full border-primary/20 text-primary">
                     <Shield size={12} className="mr-2" /> Secure Browsing
                   </Badge>
                   <Badge variant="outline" className="px-4 py-1 rounded-full border-primary/20 text-primary">
                     <Sparkles size={12} className="mr-2" /> AI Powered
                   </Badge>
                </div>
              </motion.div>
            </div>
          ) : (
            <div className="w-full h-full flex flex-col">
              <iframe
                src={activeTab.url}
                className="w-full h-full border-none bg-white"
                title={activeTab.title}
                sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
              />
              {/* Overlay for sites that block iframes */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <div className="bg-background/80 backdrop-blur-md p-4 rounded-xl border border-border text-center max-w-xs pointer-events-auto">
                  <p className="text-sm text-muted-foreground mb-2">Some websites may block being viewed in an iframe for security reasons.</p>
                  <Button variant="outline" size="sm" onClick={() => window.open(activeTab.url, '_blank')}>
                    Open in New Tab
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar / AI Assistant */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 350, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="h-full border-l border-border/50 shadow-2xl z-10"
          >
            <AIAssistant currentUrl={activeTab.url} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background Glows */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px]" />
      </div>
    </div>
  );
}
