import React, { useState, useMemo } from 'react';
import { X, BookOpen, Search } from 'lucide-react';
import { ALPHABET_A_TO_Z, NUMBERS_0_TO_10, FULL_SIGN_VOCABULARY } from '../utils/signClassifier';

export default function HowToSignModal({ isOpen, onClose, onSelectSign }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSection, setActiveSection] = useState('all');

  const allItems = useMemo(() => [
    ...ALPHABET_A_TO_Z.map(item => ({
      ...item,
      phrase: `Letter ${item.letter}`,
      hindiPhrase: item.letter,
      badge: 'Fingerspelling'
    })),
    ...NUMBERS_0_TO_10.map(num => ({
      ...num,
      phrase: num.name,
      hindiPhrase: num.digit,
      badge: 'Number'
    })),
    ...FULL_SIGN_VOCABULARY.map(v => ({
      ...v,
      badge: v.category
    }))
  ], []);

  const filteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return allItems.filter(item => {
      const matchesSearch = !q ||
        (item.name && item.name.toLowerCase().includes(q)) ||
        (item.description && item.description.toLowerCase().includes(q)) ||
        (item.phrase && item.phrase.toLowerCase().includes(q)) ||
        (item.hindiPhrase && item.hindiPhrase.includes(q));

      if (!matchesSearch) return false;
      if (activeSection === 'all') return true;
      if (activeSection === 'alphabet') return item.isLetter;
      if (activeSection === 'numbers') return item.isNumber || item.category === 'Numbers';
      return item.category === activeSection;
    });
  }, [allItems, searchQuery, activeSection]);

  if (!isOpen) return null;

  const categories = [
    { id: 'all', label: 'All Signs (130+)' },
    { id: 'alphabet', label: 'A–Z Alphabet (26)' },
    { id: 'numbers', label: 'Numbers 0–10' },
    { id: 'Greetings', label: 'Greetings' },
    { id: 'Responses', label: 'Responses' },
    { id: 'Questions', label: 'Questions' },
    { id: 'Emergency', label: 'Emergency & Medical' },
    { id: 'Daily Needs', label: 'Daily Needs' },
    { id: 'Family', label: 'Family & Friends' },
    { id: 'Emotions', label: 'Emotions' },
    { id: 'Actions', label: 'Actions & Verbs' },
    { id: 'Time', label: 'Time & Calendar' }
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog modal-lg" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <BookOpen size={20} color="var(--accent-cyan)" />
              <h2 style={{ fontSize: '19px', fontWeight: 600, color: 'var(--text-primary)' }}>
                Total Sign Language Encyclopedia
              </h2>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Complete reference for Indian Sign Language (ISL) & ASL: A–Z fingerspelling, numbers, and 100+ conversational signs
            </p>
          </div>

          <button
            type="button"
            className="btn-icon"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        {/* Search Bar & Stats */}
        <div className="enc-search-bar">
          <div style={{ position: 'relative', flex: 1, display: 'flex', alignItems: 'center' }}>
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px' }} />
            <input
              type="text"
              placeholder="Search signs by name, phrase, English or Hindi meaning (e.g. Doctor, Namaste, A, Water)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="ui-select"
              style={{ width: '100%', padding: '8px 12px 8px 36px', fontSize: '13px' }}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute',
                  right: '10px',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  fontSize: '12px'
                }}
              >
                Clear
              </button>
            )}
          </div>

          <span style={{ fontSize: '12px', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
            Showing <strong>{filteredItems.length}</strong> signs
          </span>
        </div>

        {/* Category Filter Pills */}
        <div className="enc-filter-bar">
          {categories.map(cat => (
            <button
              key={cat.id}
              type="button"
              className={`category-chip ${activeSection === cat.id ? 'active' : ''}`}
              onClick={() => setActiveSection(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Cards Grid */}
        <div className="enc-grid">
          {filteredItems.map(item => (
            <div key={item.id} className="enc-card">
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {item.name || `Letter ${item.letter}`}
                  </span>
                  <span className="hud-tag" style={{
                    color: item.isLetter ? 'var(--accent-blue)' : (item.isNumber ? 'var(--accent-green)' : 'var(--accent-cyan)')
                  }}>
                    {item.badge}
                  </span>
                </div>

                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.4, marginBottom: '6px' }}>
                  {item.description}
                </p>

                {item.hindiPhrase && (
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    Meaning: <span style={{ color: 'var(--text-primary)' }}>"{item.hindiPhrase}"</span>
                  </div>
                )}
              </div>

              <button
                type="button"
                className="btn-action-start"
                style={{ width: '100%', justifyContent: 'center', fontSize: '12px', padding: '6px 12px' }}
                onClick={() => {
                  onSelectSign({
                    id: item.id,
                    name: item.name || `Letter ${item.letter}`,
                    phrase: item.phrase || item.letter || item.digit,
                    hindiPhrase: item.hindiPhrase,
                    confidence: 0.99,
                    isLetter: item.isLetter,
                    isNumber: item.isNumber
                  });
                  onClose();
                }}
              >
                Simulate Sign
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
