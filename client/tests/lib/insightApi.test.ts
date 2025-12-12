import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  getLoveDistribution,
  getPopWords,
  getArtistPopularityGrowth,
  getArtistEmotionVariety,
} from '../../src/lib/insightApi';
import { mockApiResponse } from '../mocks/mockData';

describe('insightApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('getLoveDistribution', () => {
    it('fetches love distribution data', async () => {
      const mockData = [
        { category: 'High Love', count: 150 },
        { category: 'Low Love', count: 50 },
      ];
      const mockResponse = mockApiResponse(mockData);
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await getLoveDistribution();

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/insights/love-distribution')
      );
      expect(result.data).toBeDefined();
      expect(result.data).toEqual(mockData);
    });
  });

  describe('getPopWords', () => {
    it('fetches popular words data', async () => {
      const mockData = [
        { word: 'love', count: 500 },
        { word: 'heart', count: 350 },
        { word: 'night', count: 300 },
      ];
      const mockResponse = mockApiResponse(mockData);
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await getPopWords();

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/insights/pop-words')
      );
      expect(result.data).toBeDefined();
      expect(result.data).toEqual(mockData);
    });
  });

  describe('getArtistPopularityGrowth', () => {
    it('fetches artist popularity growth data', async () => {
      const mockData = [
        { artist_id: 'artist-1', growth_rate: 15.5 },
        { artist_id: 'artist-2', growth_rate: 22.3 },
      ];
      const mockResponse = mockApiResponse(mockData);
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await getArtistPopularityGrowth();

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/insights/artist-popularity-growth')
      );
      expect(result.data).toBeDefined();
      expect(result.data).toEqual(mockData);
    });
  });

  describe('getArtistEmotionVariety', () => {
    it('fetches artist emotion variety data', async () => {
      const mockData = [
        { artist_id: 'artist-1', emotion_variety: 8 },
        { artist_id: 'artist-2', emotion_variety: 6 },
      ];
      const mockResponse = mockApiResponse(mockData);
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await getArtistEmotionVariety();

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/insights/artist-emotion-variety')
      );
      expect(result.data).toBeDefined();
      expect(result.data).toEqual(mockData);
    });
  });
});
