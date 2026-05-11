import React from 'react';
import { Rocket, Layers, Layout, Database, Download, ChevronDown, FileType, FileJson, Copy, Target } from 'lucide-react';
import AgentPlan from './AgentPlan';

interface PrdViewerProps {
  prd: any;
  outputTab: string;
  setOutputTab: (tab: string) => void;
  showExportMenu: boolean;
  setShowExportMenu: (show: boolean) => void;
  downloadFile: (type: string) => void;
  copyToClipboard: (text: string, type?: string) => void;
  generatePlainTextPRD: () => string;
}

export const PrdViewer = React.memo(({
  prd,
  outputTab,
  setOutputTab,
  showExportMenu,
  setShowExportMenu,
  downloadFile,
  copyToClipboard,
  generatePlainTextPRD
}: PrdViewerProps) => {
  if (!prd) return null;

  return (
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
          ) : outputTab === 'roadmap' ? (
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
  );
});

PrdViewer.displayName = 'PrdViewer';
