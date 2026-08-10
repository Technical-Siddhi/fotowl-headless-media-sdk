import React, { useState } from 'react';
import { describe, expect, it } from 'vitest';
import { act, render, renderHook } from '@testing-library/react';
import { MediaSDK } from '@fotowl/media-core';
import { MediaSDKProvider, useMediaSDK } from '../src/index.js';

describe('MediaSDKProvider & useMediaSDK', () => {
  it('provides MediaSDK instance to descendants', () => {
    const { result } = renderHook(() => useMediaSDK(), {
      wrapper: ({ children }) => (
        <MediaSDKProvider config={{ apiKey: 'test-key', enableDefaultLogger: false }}>
          {children}
        </MediaSDKProvider>
      ),
    });

    expect(result.current).toBeInstanceOf(MediaSDK);
    expect(result.current.providerName).toBe('pexels');
  });

  it('throws developer-friendly error when useMediaSDK is used outside MediaSDKProvider', () => {
    expect(() => renderHook(() => useMediaSDK())).toThrow(
      'useMediaSDK must be used within a <MediaSDKProvider>'
    );
  });

  it('uses exact sdk instance when sdk prop is provided', () => {
    const customSdk = new MediaSDK({ apiKey: 'custom-key', enableDefaultLogger: false });

    const { result } = renderHook(() => useMediaSDK(), {
      wrapper: ({ children }) => (
        <MediaSDKProvider sdk={customSdk}>{children}</MediaSDKProvider>,
      ),
    });

    expect(result.current).toBe(customSdk);
  });

  it('maintains a stable SDK instance across parent rerenders with inline equivalent config', () => {
    let sdkRef1: MediaSDK | null = null;
    let sdkRef2: MediaSDK | null = null;

    const TestComponent = () => {
      const sdk = useMediaSDK();

      if (!sdkRef1) {
        sdkRef1 = sdk;
      } else {
        sdkRef2 = sdk;
      }

      return <div>Test</div>;
    };

    const ParentComponent = () => {
      const [, setCounter] = useState(0);
      return (
        <div>
          <MediaSDKProvider config={{ apiKey: 'stable-key', enableDefaultLogger: false }}>
            <TestComponent />
          </MediaSDKProvider>
          <button id="parent-btn" onClick={() => setCounter((c) => c + 1)}>
            Trigger Parent
          </button>
        </div>
      );
    };

    const { container } = render(<ParentComponent />);
    const button = container.querySelector('#parent-btn')!;

    act(() => {
      button.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });

    expect(sdkRef1).not.toBeNull();
    expect(sdkRef2).not.toBeNull();
    expect(sdkRef1).toBe(sdkRef2);
  });
});
