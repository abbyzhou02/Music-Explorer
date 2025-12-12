import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  searchTracks,
  getTracksByArtist,
  getTrackCountByArtist,
  getTrackById,
  getLyricsByTrackId,
  getTrackCount,
  getSimilarTracks,
} from '../../src/lib/trackApi';
import { mockApiTrack, mockApiTracks, mockApiResponse } from '../mocks/mockData';

describe('trackApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('searchTracks', () => {
    it('searches tracks with basic parameters', async () => {
      const mockResponse = mockApiResponse(mockApiTracks);
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await searchTracks({ searchTerm: 'test' });

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('tracks/search'),
        expect.any(Object)
      );
      expect(result.data).toBeDefined();
      expect(result.data).toEqual(mockApiTracks);
    });

    it('includes emotion filter in search', async () => {
      const mockResponse = mockApiResponse(mockApiTracks);
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      await searchTracks({
        searchTerm: 'happy',
        emotionFilter: 'Cheerful',
        sortBy: 'release_date',
        sortOrder: 'DESC',
        limit: 20,
        offset: 10,
      });

      const fetchUrl = (global.fetch as any).mock.calls[0][0];
      expect(fetchUrl).toContain('searchTerm=happy');
      expect(fetchUrl).toContain('emotionFilter=Cheerful');
      expect(fetchUrl).toContain('sortBy=release_date');
      expect(fetchUrl).toContain('sortOrder=DESC');
      expect(fetchUrl).toContain('limit=20');
      expect(fetchUrl).toContain('offset=10');
    });

    it('handles empty parameters', async () => {
      const mockResponse = mockApiResponse(mockApiTracks);
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      await searchTracks({});

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('tracks/search'),
        expect.any(Object)
      );
    });
  });

  describe('getTracksByArtist', () => {
    it('fetches tracks by artist ID', async () => {
      const mockResponse = mockApiResponse(mockApiTracks);
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await getTracksByArtist({ artistId: 'artist-1' });

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('artists/artist-1/tracks'),
        expect.any(Object)
      );
      expect(result.data).toBeDefined();
      expect(result.data).toEqual(mockApiTracks);
    });

    it('includes limit and offset parameters', async () => {
      const mockResponse = mockApiResponse(mockApiTracks);
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      await getTracksByArtist({ artistId: 'artist-1', limit: 20, offset: 5 });

      const fetchUrl = (global.fetch as any).mock.calls[0][0];
      expect(fetchUrl).toContain('limit=20');
      expect(fetchUrl).toContain('offset=5');
    });
  });

  describe('getTrackCountByArtist', () => {
    it('fetches track count by artist', async () => {
      const mockResponse = mockApiResponse(50);
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await getTrackCountByArtist('artist-1');

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('artists/artist-1/tracks/count'),
        expect.any(Object)
      );
      expect(result.data).toBeDefined();
      expect(result.data).toBe(50);
    });
  });

  describe('getTrackById', () => {
    it('fetches track by ID', async () => {
      const mockResponse = mockApiResponse(mockApiTrack);
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await getTrackById('track-1');

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('tracks/track-1'),
        expect.any(Object)
      );
      expect(result.data).toBeDefined();
      expect(result.data).toEqual(mockApiTrack);
    });
  });

  describe('getLyricsByTrackId', () => {
    it('fetches lyrics by track ID', async () => {
      const mockLyrics = 'Test lyrics content';
      const mockResponse = mockApiResponse(mockLyrics);
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await getLyricsByTrackId('track-1');

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('tracks/track-1/lyrics'),
        expect.any(Object)
      );
      expect(result.data).toBeDefined();
      expect(result.data).toBe(mockLyrics);
    });
  });

  describe('getTrackCount', () => {
    it('fetches track count with search parameters', async () => {
      const mockResponse = mockApiResponse(100);
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await getTrackCount({ searchTerm: 'rock' });

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('tracks/count'),
        expect.any(Object)
      );
      expect(result.data).toBeDefined();
      expect(result.data).toBe(100);
    });

    it('includes emotion filter in count request', async () => {
      const mockResponse = mockApiResponse(50);
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      await getTrackCount({ emotionFilter: 'Calm' });

      const fetchUrl = (global.fetch as any).mock.calls[0][0];
      expect(fetchUrl).toContain('emotionFilter=Calm');
    });
  });

  describe('getSimilarTracks', () => {
    it('fetches similar tracks with default limit', async () => {
      const mockResponse = mockApiResponse(mockApiTracks);
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await getSimilarTracks('track-1');

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('tracks/track-1/similar?limit=3'),
        expect.any(Object)
      );
      expect(result.data).toBeDefined();
      expect(result.data).toEqual(mockApiTracks);
    });

    it('fetches similar tracks with custom limit', async () => {
      const mockResponse = mockApiResponse(mockApiTracks);
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      await getSimilarTracks('track-1', 10);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('tracks/track-1/similar?limit=10'),
        expect.any(Object)
      );
    });
  });
});
