import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  searchAlbums,
  getAlbumsByArtist,
  getAlbumCountByArtist,
  getAlbumById,
  getTracksByAlbum,
  getRecentAlbums,
  getAlbumCount,
  getTypeDistributionFromSearch,
} from '../../src/lib/albumApi';
import { mockApiAlbum, mockApiAlbums, mockApiResponse } from '../mocks/mockData';

describe('albumApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('searchAlbums', () => {
    it('searches albums with basic parameters', async () => {
      const mockResponse = mockApiResponse(mockApiAlbums);
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await searchAlbums({ searchTerm: 'test' });

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('albums/search'),
        expect.any(Object)
      );
      expect(result.data).toBeDefined();
      expect(result.data).toEqual(mockApiAlbums);
    });

    it('includes all search parameters in URL', async () => {
      const mockResponse = mockApiResponse(mockApiAlbums);
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      await searchAlbums({
        searchTerm: 'rock',
        typeFilter: 'album',
        sortBy: 'popularity',
        sortOrder: 'DESC',
        limit: 20,
        offset: 10,
      });

      const fetchUrl = (global.fetch as any).mock.calls[0][0];
      expect(fetchUrl).toContain('searchTerm=rock');
      expect(fetchUrl).toContain('typeFilter=album');
      expect(fetchUrl).toContain('sortBy=popularity');
      expect(fetchUrl).toContain('sortOrder=DESC');
      expect(fetchUrl).toContain('limit=20');
      expect(fetchUrl).toContain('offset=10');
    });

    it('handles empty parameters', async () => {
      const mockResponse = mockApiResponse(mockApiAlbums);
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      await searchAlbums({});

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('albums/search'),
        expect.any(Object)
      );
    });
  });

  describe('getAlbumsByArtist', () => {
    it('fetches albums by artist ID', async () => {
      const mockResponse = mockApiResponse(mockApiAlbums);
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await getAlbumsByArtist({ artistId: 'artist-1' });

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('artists/artist-1/albums'),
        expect.any(Object)
      );
      expect(result.data).toBeDefined();
      expect(result.data).toEqual(mockApiAlbums);
    });

    it('includes limit and offset parameters', async () => {
      const mockResponse = mockApiResponse(mockApiAlbums);
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      await getAlbumsByArtist({ artistId: 'artist-1', limit: 20, offset: 5 });

      const fetchUrl = (global.fetch as any).mock.calls[0][0];
      expect(fetchUrl).toContain('limit=20');
      expect(fetchUrl).toContain('offset=5');
    });
  });

  describe('getAlbumCountByArtist', () => {
    it('fetches album count by artist', async () => {
      const mockResponse = mockApiResponse(10);
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await getAlbumCountByArtist('artist-1');

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('artists/artist-1/albums/count'),
        expect.any(Object)
      );
      expect(result.data).toBeDefined();
      expect(result.data).toBe(10);
    });
  });

  describe('getAlbumById', () => {
    it('fetches album by ID', async () => {
      const mockResponse = mockApiResponse(mockApiAlbum);
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await getAlbumById('album-1');

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('albums/album-1'),
        expect.any(Object)
      );
      expect(result.data).toBeDefined();
      expect(result.data).toEqual(mockApiAlbum);
    });
  });

  describe('getTracksByAlbum', () => {
    it('fetches tracks by album ID', async () => {
      const mockTracks = [{ id: 'track-1', name: 'Track 1' }];
      const mockResponse = mockApiResponse(mockTracks);
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await getTracksByAlbum('album-1');

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('albums/album-1/tracks'),
        expect.any(Object)
      );
      expect(result.data).toBeDefined();
      expect(result.data).toEqual(mockTracks);
    });
  });

  describe('getRecentAlbums', () => {
    it('fetches recent albums with default limit', async () => {
      const mockResponse = mockApiResponse(mockApiAlbums);
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await getRecentAlbums();

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('albums/recent?limit=10'),
        expect.any(Object)
      );
      expect(result.data).toBeDefined();
      expect(result.data).toEqual(mockApiAlbums);
    });

    it('fetches recent albums with custom limit', async () => {
      const mockResponse = mockApiResponse(mockApiAlbums);
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      await getRecentAlbums(20);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('albums/recent?limit=20'),
        expect.any(Object)
      );
    });
  });

  describe('getAlbumCount', () => {
    it('fetches album count with search parameters', async () => {
      const mockResponse = mockApiResponse(50);
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await getAlbumCount({ searchTerm: 'rock' });

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('albums/count'),
        expect.any(Object)
      );
      expect(result.data).toBeDefined();
      expect(result.data).toBe(50);
    });
  });

  describe('getTypeDistributionFromSearch', () => {
    it('fetches type distribution from search', async () => {
      const mockDistribution = [
        { type: 'album', count: 100 },
        { type: 'single', count: 50 },
      ];
      const mockResponse = mockApiResponse(mockDistribution);
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await getTypeDistributionFromSearch({ searchTerm: 'test' });

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('albums/search/type-distribution'),
        expect.any(Object)
      );
      expect(result.data).toBeDefined();
      expect(result.data).toEqual(mockDistribution);
    });
  });
});
