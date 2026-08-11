import React from 'react';
import { MediaSDKProvider } from '@fotowl/media-react';
import { AppHeader } from './components/AppHeader.js';
import { HeroSection } from './components/HeroSection.js';
import { MediaBrowser } from './components/MediaBrowser.js';
import { EventActivity } from './components/EventActivity.js';
import './styles/app.css';

const emptySearchResult = {
  assets: [],
  pagination: { page: 1, perPage: 12, totalResults: 0, hasNext: false, hasPrev: false },
};

const unconfiguredProvider = {
  name: 'unconfigured',
  search: async () => emptySearchResult,
  curated: async () => emptySearchResult,
  getById: async () => ({} as any),
};

export const AppContent: React.FC = () => {
  const apiKey = import.meta.env.VITE_PEXELS_API_KEY;
  const isMissingKey = !apiKey || apiKey === 'your_pexels_api_key_here';

  return (
    <div className="app-container">
      <AppHeader />

      {isMissingKey && (
        <div className="api-key-banner" role="alert">
          <h4>⚠️ Pexels API Key Required</h4>
          <p>
            Please set your Pexels API Key in <code>apps/demo-web/.env</code> using{' '}
            <code>VITE_PEXELS_API_KEY=your_key_here</code> to enable live media search and curated photos.
          </p>
        </div>
      )}

      <main>
        <HeroSection />
        <MediaBrowser />
        <EventActivity />
      </main>
    </div>
  );
};

export const App: React.FC = () => {
  const apiKey = import.meta.env.VITE_PEXELS_API_KEY || '';
  const config = apiKey
    ? { apiKey, cache: { ttlMs: 60000 } }
    : { apiKey: '', provider: unconfiguredProvider, cache: { ttlMs: 60000 } };

  return (
    <MediaSDKProvider config={config}>
      <AppContent />
    </MediaSDKProvider>
  );
};
