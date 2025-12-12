import { Request, Response } from 'express';
import * as AlbumController from '../../../src/controllers/albumController';
import * as AlbumService from '../../../src/services/albumService';

// Mock the service
jest.mock('../../../src/services/albumService');

const mockAlbumService = AlbumService as jest.Mocked<typeof AlbumService>;

describe('AlbumController', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
  });

  describe('getAlbumById', () => {
    it('should return album when found', async () => {
      const mockAlbum = {
        id: '1',
        name: 'Test Album',
        release_date: '2023-01-01',
        popularity: 85,
        num_tracks: 10,
        type: 'album'
      };

      mockRequest.params = { id: '1' };
      mockAlbumService.getAlbumById.mockResolvedValue(mockAlbum as any);

      await AlbumController.getAlbumById(mockRequest as Request, mockResponse as Response);

      expect(mockAlbumService.getAlbumById).toHaveBeenCalledWith('1');
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockAlbum,
        timestamp: expect.any(String)
      });
    });

    it('should return 404 when album not found', async () => {
      mockRequest.params = { id: 'nonexistent' };
      mockAlbumService.getAlbumById.mockResolvedValue(null);

      await AlbumController.getAlbumById(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        error: 'Album does not exist',
        timestamp: expect.any(String)
      });
    });
  });

  describe('getAllAlbums', () => {
    it('should return all albums', async () => {
      const mockAlbums = [
        { id: '1', name: 'Album 1' },
        { id: '2', name: 'Album 2' }
      ];

      mockAlbumService.getAlbums.mockResolvedValue(mockAlbums as any);

      await AlbumController.getAllAlbums(mockRequest as Request, mockResponse as Response);

      expect(mockAlbumService.getAlbums).toHaveBeenCalledWith({});
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });
  });

  describe('searchAlbums', () => {
    it('should search albums with query parameters', async () => {
      const mockAlbums = [{ id: '1', name: 'Search Result' }];
      
      mockRequest.query = {
        searchTerm: 'Test',
        typeFilter: 'album',
        sortBy: 'popularity',
        sortOrder: 'DESC',
        limit: '10',
        offset: '0'
      };
      mockAlbumService.getAlbums.mockResolvedValue(mockAlbums as any);

      await AlbumController.searchAlbums(mockRequest as Request, mockResponse as Response);

      expect(mockAlbumService.getAlbums).toHaveBeenCalledWith({
        searchTerm: 'Test',
        typeFilter: 'album',
        sortBy: 'popularity',
        sortOrder: 'DESC',
        limit: 10,
        offset: 0
      });
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });
  });

  describe('getAlbumsByArtist', () => {
    it('should return albums by artist', async () => {
      const mockAlbums = [{ id: '1', name: 'Artist Album' }];
      
      mockRequest.params = { id: 'artist1' };
      mockRequest.query = { limit: '5', offset: '0' };
      mockAlbumService.getAlbums.mockResolvedValue(mockAlbums as any);

      await AlbumController.getAlbumsByArtist(mockRequest as Request, mockResponse as Response);

      expect(mockAlbumService.getAlbums).toHaveBeenCalledWith({
        artistIds: ['artist1'],
        limit: 5,
        offset: 0
      });
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });
  });

  describe('getAlbumCount', () => {
    it('should return album count', async () => {
      const mockCount = 42;
      
      mockRequest.query = {
        searchTerm: 'Test',
        typeFilter: 'album'
      };
      mockAlbumService.getAlbumCount.mockResolvedValue(mockCount);

      await AlbumController.getAlbumCount(mockRequest as Request, mockResponse as Response);

      expect(mockAlbumService.getAlbumCount).toHaveBeenCalledWith({
        searchTerm: 'Test',
        typeFilter: 'album'
      });
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });
  });

  describe('getRecentAlbums', () => {
    it('should return recent albums', async () => {
      const mockAlbums = [
        { id: '1', name: 'Recent Album 1', release_date: '2024-01-01' },
        { id: '2', name: 'Recent Album 2', release_date: '2024-02-01' }
      ];

      mockRequest.query = { limit: '5' };
      mockAlbumService.getAlbums.mockResolvedValue(mockAlbums as any);

      await AlbumController.getRecentAlbums(mockRequest as Request, mockResponse as Response);

      expect(mockAlbumService.getAlbums).toHaveBeenCalledWith({
        sortBy: 'release_date',
        sortOrder: 'DESC',
        limit: 5
      });
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });

    it('should use default limit when not provided', async () => {
      mockRequest.query = {};
      mockAlbumService.getAlbums.mockResolvedValue([]);

      await AlbumController.getRecentAlbums(mockRequest as Request, mockResponse as Response);

      expect(mockAlbumService.getAlbums).toHaveBeenCalledWith({
        sortBy: 'release_date',
        sortOrder: 'DESC',
        limit: 10
      });
    });

    it('should handle service errors', async () => {
      mockRequest.query = {};
      mockAlbumService.getAlbums.mockRejectedValue(new Error('Database error'));

      await AlbumController.getRecentAlbums(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
    });
  });

  describe('getAlbumCountByArtist', () => {
    it('should return album count by artist', async () => {
      const mockCount = 15;
      
      mockRequest.params = { id: 'artist123' };
      mockAlbumService.getAlbumCount.mockResolvedValue(mockCount);

      await AlbumController.getAlbumCountByArtist(mockRequest as Request, mockResponse as Response);

      expect(mockAlbumService.getAlbumCount).toHaveBeenCalledWith({
        artistIds: ['artist123']
      });
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockCount,
        timestamp: expect.any(String)
      });
    });

    it('should handle service errors', async () => {
      mockRequest.params = { id: 'artist123' };
      mockAlbumService.getAlbumCount.mockRejectedValue(new Error('Database error'));

      await AlbumController.getAlbumCountByArtist(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
    });
  });

  describe('getTypeDistributionFromSearch', () => {
    it('should return type distribution', async () => {
      const mockDistribution = [
        { type: 'album', count: 50, ratio: 0.5 },
        { type: 'single', count: 30, ratio: 0.3 },
        { type: 'compilation', count: 20, ratio: 0.2 }
      ];

      mockRequest.query = {
        searchTerm: 'rock',
        typeFilter: 'all'
      };
      mockAlbumService.getTypeDistributionFromSearch.mockResolvedValue(mockDistribution as any);

      await AlbumController.getTypeDistributionFromSearch(mockRequest as Request, mockResponse as Response);

      expect(mockAlbumService.getTypeDistributionFromSearch).toHaveBeenCalledWith({
        searchTerm: 'rock',
        typeFilter: 'all'
      });
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: true,
        data: mockDistribution,
        timestamp: expect.any(String)
      });
    });

    it('should use default values for empty query', async () => {
      mockRequest.query = {};
      mockAlbumService.getTypeDistributionFromSearch.mockResolvedValue([]);

      await AlbumController.getTypeDistributionFromSearch(mockRequest as Request, mockResponse as Response);

      expect(mockAlbumService.getTypeDistributionFromSearch).toHaveBeenCalledWith({
        searchTerm: '',
        typeFilter: 'all'
      });
    });

    it('should handle service errors', async () => {
      mockRequest.query = {};
      mockAlbumService.getTypeDistributionFromSearch.mockRejectedValue(new Error('Query error'));

      await AlbumController.getTypeDistributionFromSearch(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
    });
  });
});
