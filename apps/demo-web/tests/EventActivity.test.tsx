import React from 'react';
import { describe, expect, it } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import { MediaSDKProvider, useMediaSDK } from '@fotowl/media-react';
import type { MediaAsset } from '@fotowl/media-react';
import { EventActivity } from '../src/components/EventActivity';

const mockAsset: MediaAsset = {
  id: '999',
  type: 'photo',
  title: 'Event Logger Photo',
  url: 'https://example.com/999',
  previewUrl: 'https://example.com/999.jpg',
  width: 1000,
  height: 800,
  author: {
    name: 'Test Author',
    url: 'https://example.com/author',
  },
  src: { original: '999.jpg', large: '999.jpg', medium: '999.jpg', small: '999.jpg', tiny: '999.jpg' },
};

const TriggerComponent: React.FC = () => {
  const sdk = useMediaSDK();
  return (
    <div>
      <button onClick={() => sdk.trackView(mockAsset)}>Trigger View</button>
      <button onClick={() => sdk.trackDownload(mockAsset)}>Trigger Download</button>
    </div>
  );
};

describe('EventActivity Component', () => {
  it('renders initial empty activity log state', () => {
    render(
      <MediaSDKProvider config={{ apiKey: 'test' }}>
        <EventActivity />
      </MediaSDKProvider>
    );

    expect(screen.getByText(/no sdk events recorded yet/i)).not.toBeNull();
  });

  it('updates live activity feed when view or download events occur', () => {
    render(
      <MediaSDKProvider config={{ apiKey: 'test' }}>
        <TriggerComponent />
        <EventActivity />
      </MediaSDKProvider>
    );

    const viewBtn = screen.getByRole('button', { name: /trigger view/i });
    const downloadBtn = screen.getByRole('button', { name: /trigger download/i });

    act(() => {
      viewBtn.click();
    });

    expect(screen.getByText('Event Logger Photo')).not.toBeNull();
    expect(screen.getByText('view')).not.toBeNull();

    act(() => {
      downloadBtn.click();
    });

    expect(screen.getByText('download')).not.toBeNull();
  });
});
