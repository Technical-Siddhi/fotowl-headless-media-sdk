import React from 'react';

export const AppHeader: React.FC = () => {
  return (
    <header className="app-header">
      <div className="header-brand">
        <h1 className="header-logo">FotoOwl</h1>
        <span className="header-badge">Headless Media SDK</span>
      </div>
      <p className="header-desc">Framework-agnostic media infrastructure for React</p>
    </header>
  );
};
