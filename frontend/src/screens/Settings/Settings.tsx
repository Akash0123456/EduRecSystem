import React, { useState, useEffect } from 'react';
import { Header } from '../../components/Header';
import { Switch } from '../../components/ui/switch';
import { useTheme } from '../../contexts/ThemeContext';
import { 
  SunIcon, 
  MoonIcon, 
  BellIcon, 
  HistoryIcon, 
  MessageSquareIcon,
  ZoomInIcon,
  BookOpenIcon
} from 'lucide-react';
import { Separator } from '../../components/ui/separator';
import { Button } from '../../components/ui/button';
import { Checkbox } from '../../components/ui/checkbox';

export const Settings = (): JSX.Element => {
  const { theme, toggleTheme } = useTheme();
  
  // State for various settings with localStorage persistence
  const [fontSize, setFontSize] = useState<string>(() => {
    return localStorage.getItem('fontSize') || "medium";
  });
  const [highContrast, setHighContrast] = useState<boolean>(() => {
    return localStorage.getItem('highContrast') === 'true';
  });
  const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(() => {
    return localStorage.getItem('notificationsEnabled') !== 'false';
  });
  const [autoDeleteHistory, setAutoDeleteHistory] = useState<boolean>(() => {
    return localStorage.getItem('autoDeleteHistory') === 'true';
  });
  const [citationStyle, setCitationStyle] = useState<string>(() => {
    return localStorage.getItem('citationStyle') || "apa";
  });
  const [responseVerbosity, setResponseVerbosity] = useState<string>(() => {
    return localStorage.getItem('responseVerbosity') || "balanced";
  });
  const [includeSources, setIncludeSources] = useState<boolean>(() => {
    return localStorage.getItem('includeSources') !== 'false';
  });
  
  // Notification types
  const [notifyResponses, setNotifyResponses] = useState<boolean>(() => {
    return localStorage.getItem('notifyResponses') !== 'false';
  });
  const [notifyUpdates, setNotifyUpdates] = useState<boolean>(() => {
    return localStorage.getItem('notifyUpdates') !== 'false';
  });
  const [notifyTips, setNotifyTips] = useState<boolean>(() => {
    return localStorage.getItem('notifyTips') !== 'false';
  });
  
  // Apply settings on initial load
  useEffect(() => {
    // Apply high contrast mode
    if (highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
    
    // Apply font size
    document.body.style.fontSize = 
      fontSize === 'small' ? '14px' : 
      fontSize === 'medium' ? '16px' : 
      fontSize === 'large' ? '18px' : '20px';
  }, [fontSize, highContrast]);
  
  // Function to handle saving settings
  const handleSaveSettings = () => {
    // Save all settings to localStorage
    localStorage.setItem('fontSize', fontSize);
    localStorage.setItem('highContrast', highContrast.toString());
    localStorage.setItem('notificationsEnabled', notificationsEnabled.toString());
    localStorage.setItem('notifyResponses', notifyResponses.toString());
    localStorage.setItem('notifyUpdates', notifyUpdates.toString());
    localStorage.setItem('notifyTips', notifyTips.toString());
    localStorage.setItem('autoDeleteHistory', autoDeleteHistory.toString());
    localStorage.setItem('citationStyle', citationStyle);
    localStorage.setItem('responseVerbosity', responseVerbosity);
    localStorage.setItem('includeSources', includeSources.toString());
    
    // Apply high contrast mode immediately
    if (highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
    
    // Apply font size immediately
    document.body.style.fontSize = 
      fontSize === 'small' ? '14px' : 
      fontSize === 'medium' ? '16px' : 
      fontSize === 'large' ? '18px' : '20px';
    
    // Show success message
    alert("Settings saved successfully!");
  };
  
  // Function to handle clearing chat history
  const handleClearHistory = () => {
    if (confirm("Are you sure you want to clear all chat history? This action cannot be undone.")) {
      // In a real app, this would call an API to clear history
      console.log("Clearing chat history");
      alert("Chat history cleared successfully!");
    }
  };
  
  return (
    <div className="flex flex-col bg-background min-h-screen">
      <Header />
      {/* Main Content */}
      <main className="flex-1 flex flex-col pt-[69px]">
        <div className="max-w-4xl mx-auto w-full p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-foreground">Settings</h1>
            <Button 
              className="bg-cyan-500 hover:bg-cyan-600"
              onClick={handleSaveSettings}
            >
              Save Changes
            </Button>
          </div>
          
          {/* Appearance Settings */}
          <div className="bg-card border border-border rounded-lg p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              {theme === 'dark' ? (
                <MoonIcon className="h-5 w-5 text-foreground" />
              ) : (
                <SunIcon className="h-5 w-5 text-foreground" />
              )}
              <h2 className="text-xl font-semibold text-foreground">Appearance</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-foreground">
                  {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                </span>
                <Switch 
                  checked={theme === 'dark'}
                  onCheckedChange={toggleTheme}
                  aria-label="Toggle dark mode"
                />
              </div>
              
              <Separator className="my-4" />
              
              <div className="flex items-center justify-between">
                <span className="text-foreground">High Contrast Mode</span>
                <Switch 
                  checked={highContrast}
                  onCheckedChange={setHighContrast}
                  aria-label="Toggle high contrast mode"
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="font-size" className="text-foreground block">
                  Font Size
                </label>
                <div className="flex items-center gap-4">
                  <ZoomInIcon className="h-5 w-5 text-muted-foreground" />
                  <select 
                    id="font-size"
                    value={fontSize}
                    onChange={(e) => setFontSize(e.target.value)}
                    className="bg-background border border-border rounded p-2 w-full text-foreground"
                  >
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                    <option value="x-large">Extra Large</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          
          {/* Notification Settings */}
          <div className="bg-card border border-border rounded-lg p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <BellIcon className="h-5 w-5 text-foreground" />
              <h2 className="text-xl font-semibold text-foreground">Notifications</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-foreground">Enable Notifications</span>
                <Switch 
                  checked={notificationsEnabled}
                  onCheckedChange={setNotificationsEnabled}
                  aria-label="Toggle notifications"
                />
              </div>
              
              {notificationsEnabled && (
                <>
                  <Separator className="my-4" />
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="notify-responses" 
                        checked={notifyResponses}
                        onCheckedChange={(checked) => setNotifyResponses(checked === true)}
                      />
                      <label htmlFor="notify-responses" className="text-foreground">
                        New AI Responses
                      </label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="notify-updates" 
                        checked={notifyUpdates}
                        onCheckedChange={(checked) => setNotifyUpdates(checked === true)}
                      />
                      <label htmlFor="notify-updates" className="text-foreground">
                        System Updates
                      </label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="notify-tips" 
                        checked={notifyTips}
                        onCheckedChange={(checked) => setNotifyTips(checked === true)}
                      />
                      <label htmlFor="notify-tips" className="text-foreground">
                        Educational Tips & Resources
                      </label>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
          
          {/* Chat History Settings */}
          <div className="bg-card border border-border rounded-lg p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <HistoryIcon className="h-5 w-5 text-foreground" />
              <h2 className="text-xl font-semibold text-foreground">Chat History</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-foreground">Auto-delete History After 30 Days</span>
                <Switch 
                  checked={autoDeleteHistory}
                  onCheckedChange={setAutoDeleteHistory}
                  aria-label="Toggle auto-delete history"
                />
              </div>
              
              <Separator className="my-4" />
              
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  className="text-red-500 border-red-500 hover:bg-red-500/10"
                  onClick={handleClearHistory}
                >
                  Clear All Chat History
                </Button>
                
                <p className="text-sm text-muted-foreground mt-2">
                  This action cannot be undone. All your conversations will be permanently deleted.
                </p>
              </div>
            </div>
          </div>
          
          {/* AI Response Settings */}
          <div className="bg-card border border-border rounded-lg p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <MessageSquareIcon className="h-5 w-5 text-foreground" />
              <h2 className="text-xl font-semibold text-foreground">AI Responses</h2>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="verbosity" className="text-foreground block">
                  Response Verbosity
                </label>
                <select 
                  id="verbosity"
                  value={responseVerbosity}
                  onChange={(e) => setResponseVerbosity(e.target.value)}
                  className="bg-background border border-border rounded p-2 w-full text-foreground"
                >
                  <option value="concise">Concise</option>
                  <option value="balanced">Balanced</option>
                  <option value="detailed">Detailed</option>
                </select>
              </div>
              
              <Separator className="my-4" />
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpenIcon className="h-5 w-5 text-muted-foreground" />
                  <label htmlFor="citation-style" className="text-foreground block">
                    Citation Style
                  </label>
                </div>
                <select 
                  id="citation-style"
                  value={citationStyle}
                  onChange={(e) => setCitationStyle(e.target.value)}
                  className="bg-background border border-border rounded p-2 w-full text-foreground"
                >
                  <option value="apa">APA</option>
                  <option value="mla">MLA</option>
                  <option value="chicago">Chicago</option>
                  <option value="harvard">Harvard</option>
                  <option value="ieee">IEEE</option>
                </select>
              </div>
              
              <div className="flex items-center space-x-2 mt-4">
                <Checkbox 
                  id="include-sources" 
                  checked={includeSources}
                  onCheckedChange={(checked) => setIncludeSources(checked === true)}
                />
                <label htmlFor="include-sources" className="text-foreground">
                  Always include sources in responses
                </label>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
