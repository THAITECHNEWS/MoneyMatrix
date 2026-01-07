'use client';

import { useState } from 'react';

interface Heading {
  level: number;
  text: string;
  id: string;
}

interface TableOfContentsProps {
  headings: Heading[];
}

export default function TableOfContents({ headings }: TableOfContentsProps) {
  const [isOpen, setIsOpen] = useState(true);

  if (headings.length === 0) return null;

  return (
    <aside style={{
      background: '#f9fafb',
      border: '1px solid #e5e7eb',
      borderRadius: '0.75rem',
      padding: '1.5rem',
      marginBottom: '3rem'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: isOpen ? '1rem' : '0',
        cursor: 'pointer',
        userSelect: 'none'
      }}
      onClick={() => setIsOpen(!isOpen)}
      >
        <h2 style={{ 
          fontSize: '1.25rem', 
          fontWeight: 700, 
          margin: 0,
          color: '#111827'
        }}>
          Table of Contents
        </h2>
        <button
          style={{
            background: 'transparent',
            border: 'none',
            fontSize: '1.5rem',
            color: '#6b7280',
            cursor: 'pointer',
            padding: '0.25rem 0.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'transform 0.2s ease',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)'
          }}
          aria-label={isOpen ? 'Collapse table of contents' : 'Expand table of contents'}
        >
          ▼
        </button>
      </div>
      
      {isOpen && (
        <nav aria-label="Article contents">
          <ol style={{ 
            listStyle: 'none', 
            padding: 0, 
            margin: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
          }}>
            {headings.map((heading, index) => (
              <li key={index} style={{ paddingLeft: heading.level === 3 ? '1.5rem' : '0' }}>
                <a 
                  href={`#${heading.id}`}
                  className="toc-link"
                  style={{
                    color: 'var(--primary-color)',
                    textDecoration: 'none',
                    fontSize: heading.level === 2 ? '1rem' : '0.9375rem',
                    display: 'block',
                    padding: '0.25rem 0',
                    transition: 'color 0.2s'
                  }}
                  onClick={(e) => {
                    setIsOpen(false); // Collapse after clicking a link on mobile
                  }}
                >
                  {heading.text}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      )}
    </aside>
  );
}








