import React, { useState } from 'react';

interface SidebarProps {
  className?: string;
}

export default function Sidebar({ className = '' }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <aside className={`sidebar ${isOpen ? 'open' : 'closed'} ${className}`}>
      <div className="sidebar-header">
        <h2>Navigation</h2>
        <button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? '×' : '☰'}
        </button>
      </div>
      <nav className="sidebar-nav">
        <ul>
          <li><a href="#projects">Projects</a></li>
          <li><a href="#achievements">Achievements</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </nav>
    </aside>
  );
}
