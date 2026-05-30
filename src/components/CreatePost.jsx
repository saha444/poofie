import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ipfsMock } from '../utils/ipfsMock';
import { web3Mock } from '../utils/web3Mock';
import { 
  FileText, 
  Image as ImageIcon, 
  GitFork, 
  Tv, 
  Award, 
  Layers,
  Info
} from 'lucide-react';

const POST_TYPES = [
  { id: 'Article', name: 'Article / Blog', icon: <FileText size={18} />, desc: 'Write publications, technical research, or tutorials.' },
  { id: 'Image', name: 'Image / Design', icon: <ImageIcon size={18} />, desc: 'Share UI designs, paintings, photographs, or case mockups.' },
  { id: 'Project', name: 'Coding Project', icon: <GitFork size={18} />, desc: 'Share open-source repositories or software tools.' },
  { id: 'Achievement', name: 'Achievement', icon: <Award size={18} />, desc: 'Share credentials, Hackathon wins, or work promotions.' }
];

export default function CreatePost() {
  const { handleCreatePost, ipfsLoading, txStep, navigate } = useApp();

  const [type, setType] = useState('Article');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tagInput, setTagInput] = useState('');
  
  // Project specific
  const [githubUrl, setGithubUrl] = useState('');

  // Media file specific
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMediaFile(file);
      setMediaPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return alert('Please enter a post title.');
    if (!description.trim()) return alert('Please enter a description.');
    if (type === 'Project' && !githubUrl.trim()) return alert('Please enter a GitHub repository URL.');

    const tags = tagInput
      .split(',')
      .map(tag => tag.trim().replace(/[^a-zA-Z0-9]/g, ''))
      .filter(tag => tag.length > 0);

    await handleCreatePost(
      title.trim(),
      description.trim(),
      tags,
      type,
      mediaFile,
      type === 'Project' ? githubUrl.trim() : null
    );
  };

  return (
    <div className="animate-slide-up" style={{ maxWidth: '720px', margin: '0 auto', width: '100%' }}>
      <div className="glass-panel" style={{ padding: '36px' }}>
        <h2 style={{ fontFamily: 'var(--font-heading)', marginBottom: '8px' }}>Create On-Chain Content</h2>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '28px' }}>
          Poofie content is pinned permanently to IPFS. Pointers and metadata hashes are stored on the Ethereum ledger.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Post Type Selector */}
          <div>
            <label style={{ fontSize: '0.7rem', color: 'var(--text-dim)', display: 'block', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Select Post Type
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
              {POST_TYPES.map((pt) => {
                const isSelected = type === pt.id;
                return (
                  <button
                    key={pt.id}
                    type="button"
                    onClick={() => {
                      setType(pt.id);
                      setMediaFile(null);
                      setMediaPreview(null);
                    }}
                    style={{
                      background: isSelected ? 'rgba(0, 242, 254, 0.08)' : 'rgba(255, 255, 255, 0.02)',
                      border: isSelected ? '1px solid var(--accent-cyan)' : '1px solid var(--border-light)',
                      borderRadius: '12px',
                      padding: '16px 12px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '8px',
                      cursor: 'pointer',
                      color: isSelected ? 'var(--accent-cyan)' : 'var(--text-muted)',
                      transition: 'var(--transition-smooth)',
                      textAlign: 'center'
                    }}
                  >
                    {pt.icon}
                    <strong style={{ fontSize: '0.8rem' }}>{pt.name}</strong>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Title */}
          <div>
            <label style={{ fontSize: '0.7rem', color: 'var(--text-dim)', display: 'block', marginBottom: '6px' }}>POST TITLE</label>
            <input 
              type="text" 
              placeholder={type === 'Article' ? "e.g. Scaling Ethereum through Rollups" : type === 'Project' ? "e.g. Decentralized Oracle Smart Contract" : "e.g. MetaMask UI redesign mockups"}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input-field"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label style={{ fontSize: '0.7rem', color: 'var(--text-dim)', display: 'block', marginBottom: '6px' }}>DESCRIPTION / BODY CONTENT</label>
            <textarea 
              placeholder="Elaborate on your implementation details, research findings, or design decisions. Be descriptive so that readers can rate work accurately..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input-field"
              style={{ height: '140px', resize: 'none' }}
              required
            />
          </div>

          {/* Conditional Input: Github URL for Projects */}
          {type === 'Project' && (
            <div>
              <label style={{ fontSize: '0.7rem', color: 'var(--text-dim)', display: 'block', marginBottom: '6px' }}>GITHUB REPOSITORY URL</label>
              <input 
                type="url" 
                placeholder="https://github.com/username/repository"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                className="input-field"
                required
              />
            </div>
          )}

          {/* Media Upload Simulation */}
          {(type === 'Image' || type === 'Achievement') && (
            <div>
              <label style={{ fontSize: '0.7rem', color: 'var(--text-dim)', display: 'block', marginBottom: '6px' }}>UPLOAD MEDIA FILES (SIMULATED IPFS)</label>
              
              <div style={{
                border: '1px dashed var(--border-light)',
                borderRadius: '8px',
                padding: '24px',
                textAlign: 'center',
                background: 'rgba(0,0,0,0.15)',
                cursor: 'pointer',
                position: 'relative'
              }}>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleMediaChange}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    opacity: 0,
                    cursor: 'pointer',
                    width: '100%',
                    height: '100%'
                  }}
                />
                {mediaPreview ? (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                    <img src={mediaPreview} alt="preview" style={{ maxWidth: '100%', maxHeight: '180px', borderRadius: '6px', objectFit: 'contain' }} />
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{mediaFile?.name} (Click to replace)</span>
                  </div>
                ) : (
                  <div>
                    <ImageIcon size={32} className="text-gray-400" style={{ margin: '0 auto 8px auto', color: 'var(--text-dim)' }} />
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block' }}>Drag & Drop or Click to select image</span>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>Supports JPEG, PNG, WebP up to 10MB</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Tags */}
          <div>
            <label style={{ fontSize: '0.7rem', color: 'var(--text-dim)', display: 'block', marginBottom: '6px' }}>TAGS (COMMA SEPARATED)</label>
            <input 
              type="text" 
              placeholder="Solidity, Cryptography, NextJS, Audit"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              className="input-field"
            />
            <span style={{ fontSize: '0.65rem', color: 'var(--text-dim)', display: 'block', marginTop: '4px' }}>
              Separate tags with commas. E.g. "Solidity, Security" &rarr; #Solidity #Security
            </span>
          </div>

          {/* IPFS metadata info card */}
          <div style={{
            display: 'flex',
            gap: '12px',
            background: 'rgba(0, 242, 254, 0.02)',
            border: '1px solid rgba(0, 242, 254, 0.1)',
            borderRadius: '8px',
            padding: '12px 16px',
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            lineHeight: '1.4'
          }}>
            <Info size={16} style={{ color: 'var(--accent-cyan)', shrink: 0, marginTop: '2px' }} />
            <div>
              <strong>Decentralized Content Anchoring:</strong> By submitting, you write your data onto the IPFS public gateway and anchor the content ID (CID) to your wallet profile on Ethereum. This is an irreversible, portable certification of your intellectual output.
            </div>
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'end', marginTop: '12px' }}>
            <button 
              type="button" 
              onClick={() => navigate('feed')} 
              className="btn-secondary"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-primary"
            >
              <Layers size={16} />
              Publish to IPFS & EVM
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
