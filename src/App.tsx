import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Terminal, FileText, Settings, History, Send, Copy, Download, Share2, Check, Zap, Code, Layout, Target, Database, Globe, Layers, MoreVertical, ChevronDown, FileJson, FileType, AlertTriangle, Rocket, Box, Palette, Wand2 } from 'lucide-react';
import AgentPlan from './components/ui/AgentPlan';
import { SparklesCore } from './components/ui/sparkles';
import LoginCardSection from './components/ui/login-signup';
import { supabase } from './lib/supabase';
import './App.css';

const MISTRAL_KEY = 'tqd3sZ8qnPrf95jfJ68UihEeALoXcKbQ';

function App() {
  const [idea, setIdea] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [prd, setPrd] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('generate');
  const [outputTab, setOutputTab] = useState('roadmap');
  const [showInput, setShowInput] = useState(true);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [projectType, setProjectType] = useState('Web Application');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [uiSpecifics, setUiSpecifics] = useState('');
  
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoadingAuth(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const applyThemeColor = (hex) => {
    if (!hex) return;
    document.documentElement.style.setProperty('--primary', hex);
    // Convert hex to rgb for glow effects
    let r = parseInt(hex.slice(1, 3), 16);
    let g = parseInt(hex.slice(3, 5), 16);
    let b = parseInt(hex.slice(5, 7), 16);
    if (!isNaN(r) && !isNaN(g) && !isNaN(b)) {
      document.documentElement.style.setProperty('--primary-glow', `rgba(${r}, ${g}, ${b}, 0.5)`);
      document.documentElement.style.setProperty('--border-focus', `rgba(${r}, ${g}, ${b}, 0.5)`);
    }
  };

  const resetApp = () => {
    setPrd(null);
    setActiveTab('generate');
    setShowInput(true);
    applyThemeColor('#8B5CF6'); // Reset to default Violet
  };
  
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { data, error } = await supabase
          .from('architectures')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          setHistory(data.map(item => item.prd_data));
        } else {
          loadLocalHistory();
        }
      } catch (error) {
        console.error('Supabase fetch failed. Falling back to local storage:', error.message);
        loadLocalHistory();
      }
    };
    
    fetchHistory();
  }, []);

  const loadLocalHistory = () => {
    try {
      const saved = localStorage.getItem('vibe_history');
      const parsed = saved ? JSON.parse(saved) : [];
      setHistory(Array.isArray(parsed) ? parsed.filter(p => p && p.frontend && p.backend) : []);
    } catch (e) { setHistory([]); }
  };

  const handleGenerate = async () => {
    if (!idea.trim()) return;
    setIsGenerating(true);
    setPrd(null);

    const systemPrompt = `You are a Full-Stack Architect AI. Generate a PRD for the user's idea in STRICT JSON format.
    The response MUST include separate frontend and backend architectures and a unified vision.
    Crucially, determine an appropriate primary hex color for this project based on its theme (e.g. #1DB954 for Spotify, #8B4513 for dogs, #FF00FF for cyberpunk).
    JSON structure:
    {
      "title": "Project Name",
      "vision": "Unified full-stack executive summary",
      "themeColor": "#HEXCODE",
      "frontend": {
        "stack": ["Frontend tech"],
        "design": ["UI Patterns", "Tokens"],
        "logic": [{ "key": "state", "desc": "purpose" }],
        "prompts": [{ "step": 1, "title": "Skeleton", "content": "Full UI prompt" }]
      },
      "backend": {
        "stack": ["Backend tech"],
        "infra": ["DB Schema", "API Pattern"],
        "logic": [{ "key": "endpoint", "desc": "logic" }],
        "prompts": [{ "step": 1, "title": "API Setup", "content": "Full Server prompt" }]
      },
      "roadmap": [
        {
          "id": "1",
          "title": "Task Title",
          "status": "pending",
          "subtasks": [
            { "id": "1-1", "title": "Subtask", "description": "Details", "status": "pending", "tools": ["Tool"] }
          ]
        }
      ]
    }`;

    try {
      const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${MISTRAL_KEY}`
        },
        body: JSON.stringify({
          model: 'mistral-large-latest',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: `Project Type: ${projectType}\nUI & Design Specifics: ${uiSpecifics || 'None'}\nCore Vision: ${idea}` }
          ],
          response_format: { type: 'json_object' }
        })
      });

      const data = await response.json();
      const content = JSON.parse(data.choices[0].message.content);
      const fullPrd = { ...content, timestamp: new Date().toISOString() };
      setPrd(fullPrd);
      
      const updatedHistory = [fullPrd, ...history.slice(0, 19)];
      setHistory(updatedHistory);
      localStorage.setItem('vibe_history', JSON.stringify(updatedHistory)); // local backup
      
      try {
        const { error } = await supabase.from('architectures').insert([{ 
          title: fullPrd.title, 
          prd_data: fullPrd 
        }]);
        if (error) console.error('Supabase insert failed:', error.message);
      } catch (e) {}

      setOutputTab('roadmap');
      setShowInput(false);
      if (fullPrd.themeColor) applyThemeColor(fullPrd.themeColor);
    } catch (error) {
      console.error('Generation failed:', error);
      alert('Synthesis failed. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text, type = 'text') => {
    const content = type === 'json' ? JSON.stringify(prd, null, 2) : text;
    navigator.clipboard.writeText(content);
    setCopied(true);
    setShowExportMenu(false);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadFile = (type) => {
    const content = type === 'json' ? JSON.stringify(prd, null, 2) : generatePlainTextPRD();
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${(prd?.title || 'project').toLowerCase().replace(/\s+/g, '_')}_full_stack.${type}`;
    link.click();
    setShowExportMenu(false);
  };

  const generatePlainTextPRD = () => {
    if (!prd || !prd.frontend || !prd.backend) return '';
    return `
# ${prd.title} - FULL STACK ARCHITECTURE
VISION: ${prd.vision}

================================================================
FRONTEND BLUEPRINT
================================================================
Stack: ${(prd.frontend.stack || []).join(', ')}
Design: ${(prd.frontend.design || []).join(', ')}
Logic Architecture:
${(prd.frontend.logic || []).map(l => `- ${l.key}: ${l.desc}`).join('\n')}

IMPLEMENTATION PROMPTS:
${(prd.frontend.prompts || []).map(p => `\nSTEP ${p.step}: ${p.title}\nPROMPT: ${p.content}`).join('\n')}

================================================================
BACKEND BLUEPRINT
================================================================
Stack: ${(prd.backend.stack || []).join(', ')}
Infrastructure: ${(prd.backend.infra || []).join(', ')}
Data Models/Logic:
${(prd.backend.logic || []).map(l => `- ${l.key}: ${l.desc}`).join('\n')}

IMPLEMENTATION PROMPTS:
${(prd.backend.prompts || []).map(p => `\nSTEP ${p.step}: ${p.title}\nPROMPT: ${p.content}`).join('\n')}
    `;
  };

  const loadFromHistory = (item) => {
    if (!item || !item.frontend || !item.backend) return;
    setPrd(item);
    setActiveTab('generate');
    setOutputTab('roadmap');
    setShowInput(false);
    if (item.themeColor) applyThemeColor(item.themeColor);
  };

  return (
    <>
      <div className="bg-mesh">
        <SparklesCore
          id="tsparticlesfullpage"
          background="transparent"
          minSize={0.6}
          maxSize={1.4}
          particleDensity={100}
          className="w-full h-full"
          particleColor="#FFFFFF"
          speed={1}
        />
        <div className="bg-mesh-blob"></div>
      </div>
      
      {loadingAuth ? (
        <div style={{height: '100vh', width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <div className="loading-spinner"></div>
        </div>
      ) : !user ? (
        <LoginCardSection />
      ) : (
      <div className="app-container">
        <aside className="sidebar glass-panel animate-fade-in">
          <div className="logo" onClick={resetApp} style={{cursor: 'pointer'}}>
            <div className="logo-icon-wrapper">
              <Zap size={24} color="white" />
            </div>
            <span>VibePRD</span>
          </div>
          <nav className="sidebar-nav">
            <button className={`nav-item ${activeTab === 'generate' ? 'active' : ''}`} onClick={() => setActiveTab('generate')}><Sparkles size={18} /> Architect</button>
            <button className={`nav-item ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}><History size={18} /> Repository</button>
            <button className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}><Settings size={18} /> Config</button>
          </nav>
          <div className="sidebar-footer">
            <div className="user-info" onClick={() => setActiveTab('profile')}>
              {user?.user_metadata?.avatar_url ? (
                <img src={user.user_metadata.avatar_url} alt="Avatar" className="avatar" style={{width: '32px', height: '32px', borderRadius: '8px', padding: 0}} />
              ) : (
                <div className="avatar">{user?.email?.charAt(0).toUpperCase() || 'U'}</div>
              )}
              <div className="user-details">
                <span className="user-name">{user?.user_metadata?.full_name || 'Vibe Coder'}</span>
                <span className="user-status">Mistral Powered</span>
              </div>
            </div>
          </div>
        </aside>

        <main className="main-content animate-fade-in delay-1">
          <div className="content-wrapper">
            {activeTab === 'generate' && (
              <>
                <header className="main-header animate-fade-in delay-2">
                  <div className="badge"><Wand2 size={14} /> Mistral Large Architect</div>
                  <h1>{prd ? 'Architectural' : 'Build your'} <span className="text-gradient">{prd ? 'Masterpiece' : 'next vision'}</span></h1>
                  <p className="subtitle">{prd ? `Blueprint for ${prd.title}` : 'Synchronized blueprints. Full-stack mastery.'}</p>
                  {prd && (
                    <button className="btn-secondary" style={{marginTop: '24px'}} onClick={resetApp}>
                      <Sparkles size={16} /> New Architect Session
                    </button>
                  )}
                </header>

                {showInput && (
                  <section className="input-section animate-fade-in delay-3">
                    <div className="input-wrapper glass-panel">
                      <div className="input-group">
                        <label><Box size={16} /> Project Type</label>
                        <div className="custom-select-container" ref={dropdownRef}>
                          <div 
                            className={`custom-select-trigger ${isDropdownOpen ? 'active' : ''}`}
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                          >
                            <span>{projectType}</span>
                            <ChevronDown size={16} className={`select-chevron ${isDropdownOpen ? 'open' : ''}`} />
                          </div>
                          
                          {isDropdownOpen && (
                            <div className="custom-select-dropdown glass-panel animate-fade-in" style={{animationDuration: '0.2s'}}>
                              {['Web Application', 'Mobile App (iOS/Android)', 'Desktop Application', 'CLI / Tooling', 'API / Backend Service'].map((type) => (
                                <div 
                                  key={type} 
                                  className={`custom-select-option ${projectType === type ? 'selected' : ''}`}
                                  onClick={() => {
                                    setProjectType(type);
                                    setIsDropdownOpen(false);
                                  }}
                                >
                                  {type}
                                  {projectType === type && <Check size={14} className="text-primary" />}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="input-group">
                        <label><Target size={16} /> Core Vision</label>
                        <textarea 
                          placeholder="Describe your core idea (e.g., An AI playlist curator for Spotify)..." 
                          value={idea} 
                          onChange={(e) => setIdea(e.target.value)} 
                          disabled={isGenerating} 
                        />
                      </div>

                      <div className="input-group">
                        <label><Palette size={16} /> UI & Design Specifics (Optional)</label>
                        <textarea 
                          placeholder="e.g., Neo-brutalism, dark mode only, rich animations..." 
                          value={uiSpecifics} 
                          onChange={(e) => setUiSpecifics(e.target.value)} 
                          disabled={isGenerating} 
                        />
                      </div>

                      <div className="input-actions" style={{justifyContent: 'flex-end', marginTop: '16px'}}>
                        <button className={`btn-primary ${isGenerating ? 'loading' : ''}`} onClick={handleGenerate} disabled={isGenerating}>
                          {isGenerating ? 'Synthesizing Blueprint...' : <><Send size={18} /> Architect Vision</>}
                        </button>
                      </div>
                    </div>
                  </section>
                )}

                {prd && (
                  <section className="output-section animate-fade-in">
                    <div className="prd-viewer glass-panel">
                      <div className="arch-header">
                        <div className="arch-tabs">
                          <button className={`arch-tab ${outputTab === 'roadmap' ? 'active' : ''}`} onClick={() => setOutputTab('roadmap')}><Rocket size={14} /> Roadmap</button>
                          <button className={`arch-tab ${outputTab === 'fullstack' ? 'active' : ''}`} onClick={() => setOutputTab('fullstack')}><Layers size={14} /> Full Stack</button>
                          <button className={`arch-tab ${outputTab === 'frontend' ? 'active' : ''}`} onClick={() => setOutputTab('frontend')}><Layout size={14} /> Client</button>
                          <button className={`arch-tab ${outputTab === 'backend' ? 'active' : ''}`} onClick={() => setOutputTab('backend')}><Database size={14} /> Server</button>
                        </div>
                        
                        <div className="export-container" style={{position: 'relative'}}>
                          <button className="btn-secondary" onClick={() => setShowExportMenu(!showExportMenu)}>
                            <Download size={16} /> Export <ChevronDown size={14} style={{marginLeft: '4px'}} />
                          </button>
                          
                          {showExportMenu && (
                            <div className="export-menu animate-fade-in" style={{position: 'absolute', top: '100%', right: 0, marginTop: '12px', width: '220px', zIndex: 100}}>
                              <div className="menu-group" style={{padding: '8px', borderBottom: '1px solid var(--border-light)', marginBottom: '4px'}}>
                                <div style={{fontSize: '11px', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 'bold', paddingLeft: '8px'}}>DOWNLOAD AS...</div>
                                <button className="menu-item" onClick={() => downloadFile('txt')}><FileType size={14} /> Plain Text</button>
                                <button className="menu-item" onClick={() => downloadFile('json')}><FileJson size={14} /> JSON File</button>
                              </div>
                              <div className="menu-group" style={{padding: '8px'}}>
                                <div style={{fontSize: '11px', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 'bold', paddingLeft: '8px'}}>COPY AS...</div>
                                <button className="menu-item" onClick={() => copyToClipboard(generatePlainTextPRD(), 'text')}><Copy size={14} /> Plain Text</button>
                                <button className="menu-item" onClick={() => copyToClipboard('', 'json')}><Copy size={14} /> JSON String</button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="architecture-viewer">
                        {outputTab === 'fullstack' ? (
                          <>
                            <div className="full-stack-combined animate-fade-in">
                              <h1 className="arch-title">{prd.title} - Full Stack Architecture</h1>
                              <div className="arch-section glass-panel" style={{border: 'none'}}>
                                <h2><Target size={24} /> Vision</h2>
                                <p className="subtitle" style={{textAlign: 'left', fontSize: '16px', color: 'var(--text-main)'}}>{prd.vision}</p>
                              </div>

                              {/* Frontend Section */}
                              <div className="combined-group" style={{marginTop: '60px'}}>
                                <div style={{display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px'}}>
                                  <Layout size={32} className="text-primary" />
                                  <h2 style={{margin: 0, fontSize: '28px', color: 'var(--text-main)'}}>Frontend Architecture</h2>
                                </div>
                                <div className="arch-section">
                                  <h3>UI Foundation</h3>
                                  <ul className="arch-list">
                                    <li><strong>Stack:</strong> {prd.frontend?.stack?.map(tech => <span key={tech} className="pill-code">{tech}</span>)}</li>
                                    <li><strong>Design:</strong> {prd.frontend?.design?.map((item, i) => <span key={i} className="pill-code">{item}</span>)}</li>
                                  </ul>
                                </div>
                                <div className="arch-section">
                                  <h3>Logic & Prompts</h3>
                                  <ul className="arch-list">
                                    {prd.frontend?.logic?.map((item, i) => <li key={i}><strong>{item.key}</strong>: {item.desc}</li>)}
                                  </ul>
                                  <div className="prompt-sequence" style={{marginTop: '32px'}}>
                                    {prd.frontend?.prompts?.map((step, i) => (
                                      <div key={i} className="prompt-step">
                                        <div className="prompt-box">
                                          <div className="prompt-box-header">
                                            <div className="header-label">PROMPT {step.step}</div>
                                            <button className="btn-mini-copy" onClick={() => copyToClipboard(step.content)}>Copy</button>
                                          </div>
                                          <div className="prompt-content">{step.content}</div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>

                              {/* Backend Section */}
                              <div className="combined-group" style={{marginTop: '60px'}}>
                                <div style={{display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px'}}>
                                  <Database size={32} className="text-secondary" />
                                  <h2 style={{margin: 0, fontSize: '28px', color: 'var(--text-main)'}}>Backend Infrastructure</h2>
                                </div>
                                <div className="arch-section">
                                  <h3>Core System</h3>
                                  <ul className="arch-list">
                                    <li><strong>Stack:</strong> {prd.backend?.stack?.map(tech => <span key={tech} className="pill-code">{tech}</span>)}</li>
                                    <li><strong>Infra:</strong> {prd.backend?.infra?.map((item, i) => <span key={i} className="pill-code">{item}</span>)}</li>
                                  </ul>
                                </div>
                                <div className="arch-section">
                                  <h3>API & Prompts</h3>
                                  <ul className="arch-list">
                                    {prd.backend?.logic?.map((item, i) => <li key={i}><strong>{item.key}</strong>: {item.desc}</li>)}
                                  </ul>
                                  <div className="prompt-sequence" style={{marginTop: '32px'}}>
                                    {prd.backend?.prompts?.map((step, i) => (
                                      <div key={i} className="prompt-step">
                                        <div className="prompt-box">
                                          <div className="prompt-box-header">
                                            <div className="header-label">PROMPT {step.step}</div>
                                            <button className="btn-mini-copy" onClick={() => copyToClipboard(step.content)}>Copy</button>
                                          </div>
                                          <div className="prompt-content">{step.content}</div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>


                            </div>
                          </>
                        ) :
                        outputTab === 'roadmap' ? (
                          <div className="specialized-view animate-fade-in">
                            <h1 className="arch-title">{prd.title} - Execution Roadmap</h1>
                            <AgentPlan tasks={prd.roadmap || []} />
                          </div>
                        ) : (
                          <div className="specialized-view animate-fade-in">
                            <h1 className="arch-title">{prd.title} - {outputTab === 'frontend' ? 'Client' : 'Server'}</h1>
                            <div className="arch-section">
                              <h2>{outputTab === 'frontend' ? 'UI Foundation' : 'Infrastructure'}</h2>
                              <ul className="arch-list">
                                <li><strong>Stack:</strong> {prd[outputTab]?.stack?.map(tech => <span key={tech} className="pill-code">{tech}</span>)}</li>
                                <li><strong>{outputTab === 'frontend' ? 'Design:' : 'Pattern:'}</strong> {prd[outputTab]?.[outputTab === 'frontend' ? 'design' : 'infra']?.map((item, i) => <span key={i} className="pill-code">{item}</span>)}</li>
                              </ul>
                            </div>
                            <div className="arch-section">
                              <h2>AI Implementation Sequence</h2>
                              <div className="prompt-sequence">
                                {prd[outputTab]?.prompts?.map((step, i) => (
                                  <div key={i} className="prompt-step" style={{marginTop: i === 0 ? '0' : '40px'}}>
                                    <h3 style={{color: 'var(--text-main)', fontSize: '20px', marginBottom: '16px'}}>{step.step}. {step.title}</h3>
                                    <div className="prompt-box">
                                      <div className="prompt-box-header">
                                        <div className="header-label">ACTIONABLE PROMPT</div>
                                        <button className="btn-mini-copy" onClick={() => copyToClipboard(step.content)}>Copy</button>
                                      </div>
                                      <div className="prompt-content">{step.content}</div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </section>
                )}
              </>
            )}

            {activeTab === 'history' && (
              <div className="history-section animate-fade-in" style={{width: '100%', maxWidth: '1000px'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '48px'}}>
                  <h2 style={{fontSize: '36px', color: 'var(--text-main)'}}>Project Repository</h2>
                  <button className="btn-secondary" onClick={async () => {
                    setHistory([]); 
                    localStorage.removeItem('vibe_history');
                    try {
                      await supabase.from('architectures').delete().neq('id', '00000000-0000-0000-0000-000000000000');
                    } catch (e) {}
                  }}>Wipe All</button>
                </div>
                {history.length === 0 ? (
                  <div className="empty-state">
                    <History size={64} />
                    <h3 style={{fontSize: '24px'}}>Empty Repository</h3>
                    <p>Your generated architectures will appear here.</p>
                  </div>
                ) : (
                  <div className="history-grid">
                    {history.map((item, i) => (
                      <div key={i} className="history-card glass-panel" onClick={() => loadFromHistory(item)}>
                        <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
                          <Globe size={24} className="text-primary" />
                          <h4 style={{margin: 0}}>{item.title}</h4>
                        </div>
                        <p style={{overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical'}}>
                          {item.vision}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="settings-panel animate-fade-in glass-panel" style={{padding: '60px', width: '100%', maxWidth: '800px'}}>
                <h2 style={{fontSize: '36px', marginBottom: '16px'}}>Configuration</h2>
                <p className="subtitle" style={{marginBottom: '48px'}}>Mistral Engine is permanently set.</p>
                <div className="modal-actions">
                  <button className="btn-primary" onClick={() => setActiveTab('generate')}>Back to Architect</button>
                </div>
              </div>
            )}
            {activeTab === 'profile' && (
              <div className="profile-panel animate-fade-in glass-panel" style={{padding: '60px', width: '100%', maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '32px'}}>
                <div>
                  <h2 style={{fontSize: '36px', marginBottom: '8px'}}>Developer Profile</h2>
                  <p className="subtitle">Your VibePRD usage and identity.</p>
                </div>
                
                <div style={{display: 'flex', alignItems: 'center', gap: '24px', padding: '32px', background: 'rgba(255,255,255,0.02)', borderRadius: '24px', border: '1px solid var(--border-light)'}}>
                  {user?.user_metadata?.avatar_url ? (
                    <img src={user.user_metadata.avatar_url} alt="Avatar" style={{width: '80px', height: '80px', borderRadius: '24px', objectFit: 'cover'}} />
                  ) : (
                    <div className="avatar" style={{width: '80px', height: '80px', fontSize: '28px', borderRadius: '24px'}}>{user?.email?.charAt(0).toUpperCase() || 'U'}</div>
                  )}
                  <div style={{flex: 1}}>
                    <h3 style={{fontSize: '28px', color: 'var(--text-main)', marginBottom: '8px'}}>{user?.user_metadata?.full_name || 'Vibe Coder'}</h3>
                    <div className="user-status" style={{fontSize: '15px'}}><span style={{display: 'inline-block', width: '8px', height: '8px', background: 'var(--secondary)', borderRadius: '50%', marginRight: '6px', boxShadow: '0 0 8px var(--secondary)'}}></span> {user?.email}</div>
                  </div>
                  <button className="btn-secondary" onClick={() => supabase.auth.signOut()}>Sign Out</button>
                </div>

                <div className="stats-grid" style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px'}}>
                  <div style={{padding: '24px', background: 'rgba(0,0,0,0.2)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)'}}>
                    <h4 style={{color: 'var(--text-muted)', fontSize: '14px', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px'}}>Architectures Generated</h4>
                    <p style={{fontSize: '42px', fontWeight: 'bold', color: 'var(--primary)'}}>{history.length}</p>
                  </div>
                  <div style={{padding: '24px', background: 'rgba(0,0,0,0.2)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)'}}>
                    <h4 style={{color: 'var(--text-muted)', fontSize: '14px', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px'}}>Current Workspace</h4>
                    <p style={{fontSize: '24px', fontWeight: 'bold', color: 'var(--text-main)'}}>Prd UI</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
      )}
    </>
  );
}

export default App;

