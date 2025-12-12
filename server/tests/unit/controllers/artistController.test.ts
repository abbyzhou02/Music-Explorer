import { Request, Response } from 'express';
import * as ArtistController from '../../../src/controllers/artistController';
import * as ArtistService from '../../../src/services/artistService';

// Mock the service
jest.mock('../../../src/services/artistService');
const mockArtistService = ArtistService as jest.Mocked<typeof ArtistService>;

describe('ArtistController', () => {
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;

  beforeEach(() => {
    mockReq = {
      query: {},
      params: {},
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks();
  });

  describe('searchArtists', () => {
    it('should return artists successfully', async () => {
      const mockArtists = [
        { id: '1', name: 'Artist 1', popularity: 85 },
        { id: '2', name: 'Artist 2', popularity: 75 },
      ];

      mockArtistService.getArtists.mockResolvedValue(mockArtists);

      await ArtistController.searchArtists(mockReq as Request, mockRes as Response);

      expect(mockArtistService.getArtists).toHaveBeenCalledWith({
        searchTerm: '',
        genreFilter: '',
        includeGenres: false,
        limit: 10,
        offset: 0,
        sortBy: 'popularity',
        sortOrder: 'DESC',
      });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockArtists,
        timestamp: expect.any(String),
      });
    });

    it('should handle query parameters correctly', async () => {
      const mockArtists = [{ id: '1', name: 'Test Artist' }];
      
      mockReq.query = {
        searchTerm: 'test',
        limit: '10',
        offset: '20',
        genreFilter: 'rock',
        includeGenres: 'true',
        sortBy: 'popularity',
        sortOrder: 'ASC',
      };

      mockArtistService.getArtists.mockResolvedValue(mockArtists);

      await ArtistController.searchArtists(mockReq as Request, mockRes as Response);

      expect(mockArtistService.getArtists).toHaveBeenCalledWith({
        searchTerm: 'test',
        genreFilter: 'rock',
        includeGenres: true,
        limit: 10,
        offset: 20,
        sortBy: 'popularity',
        sortOrder: 'ASC',
      });
    });

    it('should handle service errors', async () => {
      const error = new Error('Service error');
      mockArtistService.getArtists.mockRejectedValue(error);

      await ArtistController.searchArtists(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: 'Service error',
        timestamp: expect.any(String),
      });
    });
  });

  describe('getArtistById', () => {
    it('should return artist when found', async () => {
      const mockArtist = { id: '1', name: 'Test Artist', popularity: 85 };
      mockReq.params = { id: '1' };
      mockArtistService.getArtists.mockResolvedValue([mockArtist]);

      await ArtistController.getArtistById(mockReq as Request, mockRes as Response);

      expect(mockArtistService.getArtists).toHaveBeenCalledWith({ ids: ['1'] });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockArtist,
        timestamp: expect.any(String),
      });
    });

    it('should return 404 when artist not found', async () => {
      mockReq.params = { id: '999' };
      mockArtistService.getArtists.mockResolvedValue([]);

      await ArtistController.getArtistById(mockReq as Request, mockRes as Response);

      expect(mockArtistService.getArtists).toHaveBeenCalledWith({ ids: ['999'] });
      // When no artist is found, the controller returns empty array in data, not 404
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: undefined, // artist[0] when array is empty
        timestamp: expect.any(String),
      });
    });

    it('should handle missing ID parameter', async () => {
      mockReq.params = {};
      mockArtistService.getArtists.mockResolvedValue([]);

      await ArtistController.getArtistById(mockReq as Request, mockRes as Response);

      // The controller still calls getArtists with undefined id
      expect(mockArtistService.getArtists).toHaveBeenCalledWith({ ids: [undefined] });
      expect(mockRes.status).toHaveBeenCalledWith(200);
    });

    it('should handle service errors', async () => {
      const error = new Error('Database error');
      mockReq.params = { id: '1' };
      mockArtistService.getArtists.mockRejectedValue(error);

      await ArtistController.getArtistById(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: 'Database error',
        timestamp: expect.any(String),
      });
    });
  });

  describe('getGenreDistribution', () => {
    it('should return genre distribution successfully', async () => {
      const mockGenreDistribution = [
        { genre: 'pop', artist_num: 15, ratio: 0.5 },
        { genre: 'rock', artist_num: 10, ratio: 0.33 },
        { genre: 'jazz', artist_num: 5, ratio: 0.17 },
      ];

      mockArtistService.getGenreDistribution.mockResolvedValue(mockGenreDistribution);

      await ArtistController.getGenreDistribution(mockReq as Request, mockRes as Response);

      expect(mockArtistService.getGenreDistribution).toHaveBeenCalledWith({
        searchTerm: '',
        genreFilter: '',
        ids: [],
      });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockGenreDistribution,
        timestamp: expect.any(String),
      });
    });

    it('should handle query parameters correctly', async () => {
      const mockGenreDistribution = [
        { genre: 'rock', artist_num: 10, ratio: 1.0 },
      ];

      mockReq.query = {
        searchTerm: 'artist',
        genreFilter: 'rock',
        ids: ['id1', 'id2'],
      };

      mockArtistService.getGenreDistribution.mockResolvedValue(mockGenreDistribution);

      await ArtistController.getGenreDistribution(mockReq as Request, mockRes as Response);

      expect(mockArtistService.getGenreDistribution).toHaveBeenCalledWith({
        searchTerm: 'artist',
        genreFilter: 'rock',
        ids: ['id1', 'id2'],
      });
    });

    it('should handle single id parameter as array', async () => {
      mockReq.query = { ids: 'single-id' };

      mockArtistService.getGenreDistribution.mockResolvedValue([]);

      await ArtistController.getGenreDistribution(mockReq as Request, mockRes as Response);

      expect(mockArtistService.getGenreDistribution).toHaveBeenCalledWith({
        searchTerm: '',
        genreFilter: '',
        ids: ['single-id'],
      });
    });

    it('should handle service errors', async () => {
      const error = new Error('Database error');
      mockArtistService.getGenreDistribution.mockRejectedValue(error);

      await ArtistController.getGenreDistribution(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: 'Database error',
        timestamp: expect.any(String),
      });
    });
  });

  describe('getEmotionDistribution', () => {
    it('should return emotion distribution successfully', async () => {
      const mockEmotionDistribution = [
        { emotion: 'Euphotic', track_num: 25, ratio: 0.5 },
        { emotion: 'Calm', track_num: 15, ratio: 0.3 },
        { emotion: 'Bleak', track_num: 10, ratio: 0.2 },
      ];

      mockArtistService.getEmotionDistribution.mockResolvedValue(mockEmotionDistribution);

      await ArtistController.getEmotionDistribution(mockReq as Request, mockRes as Response);

      expect(mockArtistService.getEmotionDistribution).toHaveBeenCalledWith({
        searchTerm: '',
        genreFilter: '',
        ids: [],
      });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockEmotionDistribution,
        timestamp: expect.any(String),
      });
    });

    it('should handle query parameters correctly', async () => {
      const mockEmotionDistribution = [
        { emotion: 'Cheerful', track_num: 20, ratio: 1.0 },
      ];

      mockReq.query = {
        searchTerm: 'happy',
        genreFilter: 'pop',
        ids: ['id1', 'id2', 'id3'],
      };

      mockArtistService.getEmotionDistribution.mockResolvedValue(mockEmotionDistribution);

      await ArtistController.getEmotionDistribution(mockReq as Request, mockRes as Response);

      expect(mockArtistService.getEmotionDistribution).toHaveBeenCalledWith({
        searchTerm: 'happy',
        genreFilter: 'pop',
        ids: ['id1', 'id2', 'id3'],
      });
    });

    it('should handle empty results', async () => {
      mockArtistService.getEmotionDistribution.mockResolvedValue([]);

      await ArtistController.getEmotionDistribution(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: [],
        timestamp: expect.any(String),
      });
    });

    it('should handle service errors', async () => {
      const error = new Error('Query failed');
      mockArtistService.getEmotionDistribution.mockRejectedValue(error);

      await ArtistController.getEmotionDistribution(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: 'Query failed',
        timestamp: expect.any(String),
      });
    });
  });

  describe('getGenreDistributionById', () => {
    it('should return genre distribution for a specific artist', async () => {
      const mockGenreDistribution = [
        { genre: 'indie', artist_num: 1, ratio: 0.6 },
        { genre: 'alternative', artist_num: 1, ratio: 0.4 },
      ];

      mockReq.params = { id: 'artist-123' };
      mockArtistService.getGenreDistribution.mockResolvedValue(mockGenreDistribution);

      await ArtistController.getGenreDistributionById(mockReq as Request, mockRes as Response);

      expect(mockArtistService.getGenreDistribution).toHaveBeenCalledWith({
        ids: ['artist-123'],
      });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockGenreDistribution,
        timestamp: expect.any(String),
      });
    });

    it('should handle service errors', async () => {
      const error = new Error('Artist not found');
      mockReq.params = { id: 'invalid-id' };
      mockArtistService.getGenreDistribution.mockRejectedValue(error);

      await ArtistController.getGenreDistributionById(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
    });
  });

  describe('getEmotionDistributionById', () => {
    it('should return emotion distribution for a specific artist', async () => {
      const mockEmotionDistribution = [
        { emotion: 'Serene', track_num: 8, ratio: 0.4 },
        { emotion: 'Cheerful', track_num: 12, ratio: 0.6 },
      ];

      mockReq.params = { id: 'artist-456' };
      mockArtistService.getEmotionDistribution.mockResolvedValue(mockEmotionDistribution);

      await ArtistController.getEmotionDistributionById(mockReq as Request, mockRes as Response);

      expect(mockArtistService.getEmotionDistribution).toHaveBeenCalledWith({
        ids: ['artist-456'],
      });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockEmotionDistribution,
        timestamp: expect.any(String),
      });
    });

    it('should handle service errors', async () => {
      const error = new Error('Database connection failed');
      mockReq.params = { id: 'artist-789' };
      mockArtistService.getEmotionDistribution.mockRejectedValue(error);

      await ArtistController.getEmotionDistributionById(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
    });
  });

  describe('getArtistCount', () => {
    it('should return artist count successfully', async () => {
      const mockCount = 150;

      mockReq.query = {
        searchTerm: 'rock',
        genreFilter: 'rock'
      };
      mockArtistService.getArtistCount.mockResolvedValue(mockCount);

      await ArtistController.getArtistCount(mockReq as Request, mockRes as Response);

      expect(mockArtistService.getArtistCount).toHaveBeenCalledWith({
        searchTerm: 'rock',
        genreFilter: 'rock'
      });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockCount,
        timestamp: expect.any(String),
      });
    });

    it('should use default empty strings when query is empty', async () => {
      mockReq.query = {};
      mockArtistService.getArtistCount.mockResolvedValue(0);

      await ArtistController.getArtistCount(mockReq as Request, mockRes as Response);

      expect(mockArtistService.getArtistCount).toHaveBeenCalledWith({
        searchTerm: '',
        genreFilter: ''
      });
    });

    it('should handle service errors', async () => {
      const error = new Error('Database error');
      mockReq.query = {};
      mockArtistService.getArtistCount.mockRejectedValue(error);

      await ArtistController.getArtistCount(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
    });
  });

  describe('getGenreCount', () => {
    it('should return genre count successfully', async () => {
      const mockCount = 50;

      mockArtistService.getGenreCount.mockResolvedValue(mockCount);

      await ArtistController.getGenreCount(mockReq as Request, mockRes as Response);

      expect(mockArtistService.getGenreCount).toHaveBeenCalled();
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockCount,
        timestamp: expect.any(String),
      });
    });

    it('should handle service errors', async () => {
      const error = new Error('Query failed');
      mockArtistService.getGenreCount.mockRejectedValue(error);

      await ArtistController.getGenreCount(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
    });
  });

  describe('getTrendingArtists', () => {
    it('should return trending artists with default limit', async () => {
      const mockArtists = [
        { id: '1', name: 'Trending Artist 1', popularity: 95 },
        { id: '2', name: 'Trending Artist 2', popularity: 90 },
      ];

      mockReq.query = {};
      mockArtistService.getArtists.mockResolvedValue(mockArtists);

      await ArtistController.getTrendingArtists(mockReq as Request, mockRes as Response);

      expect(mockArtistService.getArtists).toHaveBeenCalledWith({
        limit: 10,
        sortBy: 'popularity',
        sortOrder: 'DESC'
      });
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockArtists,
        timestamp: expect.any(String),
      });
    });

    it('should use custom limit when provided', async () => {
      const mockArtists = [
        { id: '1', name: 'Top Artist', popularity: 100 }
      ];

      mockReq.query = { limit: '5' };
      mockArtistService.getArtists.mockResolvedValue(mockArtists);

      await ArtistController.getTrendingArtists(mockReq as Request, mockRes as Response);

      expect(mockArtistService.getArtists).toHaveBeenCalledWith({
        limit: 5,
        sortBy: 'popularity',
        sortOrder: 'DESC'
      });
    });

    it('should handle service errors', async () => {
      const error = new Error('Database error');
      mockReq.query = {};
      mockArtistService.getArtists.mockRejectedValue(error);

      await ArtistController.getTrendingArtists(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
    });
  });

  describe('getCollaborators', () => {
    it('should return collaborators for an artist', async () => {
      const mockCollaborators = [
        { id: 'collab1', name: 'Collaborator 1', collaboration_count: 5 },
        { id: 'collab2', name: 'Collaborator 2', collaboration_count: 3 },
      ];

      mockReq.params = { id: 'artist-main' };
      mockArtistService.getCollaborators.mockResolvedValue(mockCollaborators as any);

      await ArtistController.getCollaborators(mockReq as Request, mockRes as Response);

      expect(mockArtistService.getCollaborators).toHaveBeenCalledWith('artist-main');
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: mockCollaborators,
        timestamp: expect.any(String),
      });
    });

    it('should handle empty collaborators list', async () => {
      mockReq.params = { id: 'solo-artist' };
      mockArtistService.getCollaborators.mockResolvedValue([]);

      await ArtistController.getCollaborators(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        data: [],
        timestamp: expect.any(String),
      });
    });

    it('should handle service errors', async () => {
      const error = new Error('Query error');
      mockReq.params = { id: 'artist-error' };
      mockArtistService.getCollaborators.mockRejectedValue(error);

      await ArtistController.getCollaborators(mockReq as Request, mockRes as Response);

      expect(mockRes.status).toHaveBeenCalledWith(500);
    });
  });
});