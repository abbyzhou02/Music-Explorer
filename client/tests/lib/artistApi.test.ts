import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  getArtistById,
  getTrendingArtists,
  searchArtists,
  getArtistCount,
  getGenreDistribution,
  getEmotionDistribution,
  getCollaborators,
} from '../../src/lib/artistApi';
import { mockArtist, mockArtists, mockApiResponse } from '../mocks/mockData';

describe('artistApi', () => {
  beforeEach(() => {
    // Reset fetch mock before each test
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('getArtistById', () => {
    it('fetches artist by id successfully', async () => {
      const mockResponse = mockApiResponse(mockArtist);
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await getArtistById('test-artist-1');

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('artists/test-artist-1'),
        expect.objectContaining({
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        })
      );
      expect(result).toEqual(mockResponse);
      expect(result.data?.name).toBe('Test Artist');
    });

    it('throws error when fetch fails', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        statusText: 'Not Found',
      });

      await expect(getArtistById('invalid-id')).rejects.toThrow(
        'Failed to get artist details: Not Found'
      );
    });
  });

  describe('getTrendingArtists', () => {
    it('fetches trending artists with default limit', async () => {
      const mockResponse = mockApiResponse(mockArtists);
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await getTrendingArtists();

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('artists/trending?limit=10'),
        expect.any(Object)
      );
      expect(result.data).toBeDefined();
      expect(result.data).toEqual(mockArtists);
    });

    it('fetches trending artists with custom limit', async () => {
      const mockResponse = mockApiResponse(mockArtists);
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      await getTrendingArtists(20);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('artists/trending?limit=20'),
        expect.any(Object)
      );
    });

    it('throws error when request fails', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        statusText: 'Internal Server Error',
      });

      await expect(getTrendingArtists()).rejects.toThrow(
        'Failed to get trending artists'
      );
    });
  });

  describe('searchArtists', () => {
    it('searches artists with basic query', async () => {
      const mockResponse = mockApiResponse(mockArtists);
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await searchArtists({ searchTerm: 'test' });

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('artists/search'),
        expect.any(Object)
      );
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('searchTerm=test'),
        expect.any(Object)
      );
      expect(result.data).toBeDefined();
      expect(result.data).toEqual(mockArtists);
    });

    it('searches artists with full parameters', async () => {
      const mockResponse = mockApiResponse(mockArtists);
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      await searchArtists({
        searchTerm: 'test',
        limit: 20,
        offset: 10,
        includeGenres: true,
        genreFilter: 'pop',
        sortBy: 'popularity',
        sortOrder: 'DESC',
      });

      const fetchUrl = (global.fetch as any).mock.calls[0][0];
      expect(fetchUrl).toContain('searchTerm=test');
      expect(fetchUrl).toContain('limit=20');
      expect(fetchUrl).toContain('offset=10');
      expect(fetchUrl).toContain('includeGenres=true');
      expect(fetchUrl).toContain('genreFilter=pop');
      expect(fetchUrl).toContain('sortBy=popularity');
      expect(fetchUrl).toContain('sortOrder=DESC');
    });

    it('handles empty search term', async () => {
      const mockResponse = mockApiResponse(mockArtists);
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      await searchArtists({});

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('searchTerm='),
        expect.any(Object)
      );
    });
  });

  describe('getArtistCount', () => {
    it('fetches artist count successfully', async () => {
      const mockResponse = mockApiResponse(100);
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await getArtistCount({});

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('artists/count'),
        expect.any(Object)
      );
      expect(result.data).toBeDefined();
      expect(result.data).toBe(100);
    });

    it('includes search parameters in count request', async () => {
      const mockResponse = mockApiResponse(50);
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      await getArtistCount({ searchTerm: 'test', genreFilter: 'rock' });

      const fetchUrl = (global.fetch as any).mock.calls[0][0];
      expect(fetchUrl).toContain('searchTerm=test');
      expect(fetchUrl).toContain('genreFilter=rock');
    });
  });

  describe('getGenreDistribution', () => {
    it('fetches genre distribution successfully', async () => {
      const mockDistribution = [
        { genre: 'pop', count: 100 },
        { genre: 'rock', count: 80 },
      ];
      const mockResponse = mockApiResponse(mockDistribution);
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await getGenreDistribution({});

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('artists/genre-distribution'),
        expect.any(Object)
      );
      expect(result.data).toBeDefined();
      expect(result.data).toEqual(mockDistribution);
    });

    it('includes artist ids in request', async () => {
      const mockResponse = mockApiResponse([]);
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      await getGenreDistribution({ ids: ['artist1', 'artist2'] });

      const fetchUrl = (global.fetch as any).mock.calls[0][0];
      expect(fetchUrl).toContain('ids=artist1');
    });
  });

  describe('getEmotionDistribution', () => {
    it('fetches emotion distribution successfully', async () => {
      const mockDistribution = [
        { emotion: 'happy', count: 150 },
        { emotion: 'sad', count: 90 },
      ];
      const mockResponse = mockApiResponse(mockDistribution);
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await getEmotionDistribution({});

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('artists/emotion-distribution'),
        expect.any(Object)
      );
      expect(result.data).toBeDefined();
      expect(result.data).toEqual(mockDistribution);
    });
  });

  describe('getCollaborators', () => {
    it('fetches collaborating artists successfully', async () => {
      const mockResponse = mockApiResponse(mockArtists);
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await getCollaborators('test-artist-1');

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('artists/test-artist-1/collaborators'),
        expect.any(Object)
      );
      expect(result.data).toBeDefined();
      expect(result.data).toEqual(mockArtists);
    });

    it('throws error when fetch fails', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        statusText: 'Not Found',
      });

      await expect(getCollaborators('invalid-id')).rejects.toThrow(
        'Failed to get collaborating artists'
      );
    });
  });

  describe('Network Error Handling', () => {
    it('handles network errors gracefully', async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error('Network Error'));

      await expect(getArtistById('test-id')).rejects.toThrow('Network Error');
    });

    it('handles malformed JSON response', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => {
          throw new Error('Invalid JSON');
        },
      });

      await expect(getArtistById('test-id')).rejects.toThrow('Invalid JSON');
    });
  });
});
