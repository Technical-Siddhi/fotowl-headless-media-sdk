import { describe, expect, it, vi } from 'vitest';
import { MediaSDK, ValidationError } from '../src/index.js';

describe('MediaSDK Configuration', () => {
  it('throws ValidationError if config is missing or empty', () => {
    expect(() => new (MediaSDK as any)()).toThrow(ValidationError);
  });

  it('throws ValidationError if apiKey is missing and no provider is passed', () => {
    expect(() => new MediaSDK({ apiKey: '' })).toThrow(ValidationError);
    expect(() => new MediaSDK({ apiKey: '   ' })).toThrow(ValidationError);
  });

  it('initializes successfully with valid apiKey', () => {
    const sdk = new MediaSDK({ apiKey: 'test-key' });
    expect(sdk.providerName).toBe('pexels');
  });

  it('accepts custom provider implementation', () => {
    const mockProvider = {
      name: 'custom-mock',
      search: vi.fn(),
      curated: vi.fn(),
      getById: vi.fn(),
    };

    const sdk = new MediaSDK({
      apiKey: 'unused',
      provider: mockProvider,
    });

    expect(sdk.providerName).toBe('custom-mock');
  });
});
