import * as ArtistService from '../../../src/services/artistService';

// Mock the database connection
jest.mock('../../../src/database/connection', () => ({
  __esModule: true,
  default: {
    query: jest.fn(),
  },
}));

describe('ArtistService', () => {
  let mockQuery: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    const pool = require('../../../src/database/connection').default;
    mockQuery = pool.query;
  });

  describe('getArtists', () => {
    it('should return artists with default parameters', async () => {
      const mockArtists = [
        { id: '1', name: 'Artist 1', popularity: 85 },
        { id: '2', name: 'Artist 2', popularity: 75 },
      ];

      mockQuery.mockResolvedValue({
        rows: mockArtists,
        rowCount: 2,
      });

      const result = await ArtistService.getArtists({});

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('SELECT'),
        expect.any(Array)
      );
      expect(result).toEqual(mockArtists);
    });

    it('should handle search term filtering', async () => {
      const mockArtists = [
        { id: '1', name: 'Test Artist', popularity: 85 },
      ];

      mockQuery.mockResolvedValue({
        rows: mockArtists,
        rowCount: 1,
      });

      const result = await ArtistService.getArtists({
        searchTerm: 'Test',
      });

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('WHERE'),
        expect.any(Array)
      );
      expect(result).toEqual(mockArtists);
    });

    it('should handle genre filtering', async () => {
      const mockArtists = [
        { id: '1', name: 'Rock Artist', popularity: 85 },
      ];

      mockQuery.mockResolvedValue({
        rows: mockArtists,
        rowCount: 1,
      });

      const result = await ArtistService.getArtists({
        genreFilter: 'rock',
      });

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('genre'),
        expect.any(Array)
      );
      expect(result).toEqual(mockArtists);
    });

    it('should handle pagination', async () => {
      const mockArtists = [
        { id: '1', name: 'Artist 1', popularity: 85 },
      ];

      mockQuery.mockResolvedValue({
        rows: mockArtists,
        rowCount: 1,
      });

      const result = await ArtistService.getArtists({
        limit: 10,
        offset: 20,
      });

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('LIMIT'),
        expect.any(Array)
      );
      expect(result).toEqual(mockArtists);
    });

    it('should handle database errors', async () => {
      const error = new Error('Database connection failed');
      mockQuery.mockRejectedValue(error);

      await expect(ArtistService.getArtists({})).rejects.toThrow(error);
    });
  });

  describe('getArtistCount', () => {
    it('should return artist count', async () => {
      mockQuery.mockResolvedValue({
        rows: [{ artist_cnt: 10 }],
        rowCount: 1,
      });

      const result = await ArtistService.getArtistCount({});

      expect(result).toBe(10);
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('COUNT'),
        expect.any(Array)
      );
    });

    it('should handle database errors', async () => {
      const error = new Error('Database error');
      mockQuery.mockRejectedValue(error);

      await expect(ArtistService.getArtistCount({})).rejects.toThrow(error);
    });
  });

  describe('getGenreCount', () => {
    it('should return genre count', async () => {
      mockQuery.mockResolvedValue({
        rows: [{ genre_cnt: 5 }],
        rowCount: 1,
      });

      const result = await ArtistService.getGenreCount();

      expect(result).toBe(5);
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('COUNT'),
      );
    });

    it('should handle database errors', async () => {
      const error = new Error('Database error');
      mockQuery.mockRejectedValue(error);

      await expect(ArtistService.getGenreCount()).rejects.toThrow('Error fetching genre count');
    });
  });

  describe('getGenreDistribution', () => {
    it('should return genre distribution with default parameters', async () => {
      const mockGenreDistribution = [
        { genre: 'pop', artist_num: 15, ratio: 0.5 },
        { genre: 'rock', artist_num: 10, ratio: 0.33 },
        { genre: 'jazz', artist_num: 5, ratio: 0.17 },
      ];

      mockQuery.mockResolvedValue({
        rows: mockGenreDistribution,
        rowCount: 3,
      });

      const result = await ArtistService.getGenreDistribution({});

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('genre'),
        expect.any(Array)
      );
      expect(result).toEqual(mockGenreDistribution);
    });

    it('should filter by searchTerm', async () => {
      const mockGenreDistribution = [
        { genre: 'indie', artist_num: 8, ratio: 1.0 },
      ];

      mockQuery.mockResolvedValue({
        rows: mockGenreDistribution,
        rowCount: 1,
      });

      const result = await ArtistService.getGenreDistribution({
        searchTerm: 'indie',
      });

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('name ILIKE'),
        expect.arrayContaining(['%indie%'])
      );
      expect(result).toEqual(mockGenreDistribution);
    });

    it('should filter by artist ids', async () => {
      const mockGenreDistribution = [
        { genre: 'alternative', artist_num: 3, ratio: 0.6 },
        { genre: 'rock', artist_num: 2, ratio: 0.4 },
      ];

      mockQuery.mockResolvedValue({
        rows: mockGenreDistribution,
        rowCount: 2,
      });

      const result = await ArtistService.getGenreDistribution({
        ids: ['id1', 'id2', 'id3'],
      });

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('id = ANY'),
        expect.arrayContaining([['id1', 'id2', 'id3']])
      );
      expect(result).toEqual(mockGenreDistribution);
    });

    it('should filter by genreFilter', async () => {
      const mockGenreDistribution = [
        { genre: 'pop rock', artist_num: 5, ratio: 0.7 },
        { genre: 'pop punk', artist_num: 2, ratio: 0.3 },
      ];

      mockQuery.mockResolvedValue({
        rows: mockGenreDistribution,
        rowCount: 2,
      });

      const result = await ArtistService.getGenreDistribution({
        genreFilter: 'pop',
      });

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('genre ILIKE'),
        expect.arrayContaining(['%pop%'])
      );
      expect(result).toEqual(mockGenreDistribution);
    });

    it('should handle combined filters', async () => {
      mockQuery.mockResolvedValue({
        rows: [{ genre: 'electronic', artist_num: 4, ratio: 1.0 }],
        rowCount: 1,
      });

      await ArtistService.getGenreDistribution({
        searchTerm: 'daft',
        genreFilter: 'electronic',
        ids: ['id1'],
      });

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('name ILIKE'),
        expect.arrayContaining(['%daft%', ['id1'], '%electronic%'])
      );
    });

    it('should handle empty results', async () => {
      mockQuery.mockResolvedValue({
        rows: [],
        rowCount: 0,
      });

      const result = await ArtistService.getGenreDistribution({
        searchTerm: 'nonexistent',
      });

      expect(result).toEqual([]);
    });

    it('should handle database errors', async () => {
      const error = new Error('Query execution failed');
      mockQuery.mockRejectedValue(error);

      await expect(
        ArtistService.getGenreDistribution({})
      ).rejects.toThrow('Error fetching artist genre distribution');
    });
  });

  describe('getEmotionDistribution', () => {
    it('should return emotion distribution with default parameters', async () => {
      const mockEmotionDistribution = [
        { emotion: 'Euphotic', track_num: 25, ratio: 0.5 },
        { emotion: 'Calm', track_num: 15, ratio: 0.3 },
        { emotion: 'Bleak', track_num: 10, ratio: 0.2 },
      ];

      mockQuery.mockResolvedValue({
        rows: mockEmotionDistribution,
        rowCount: 3,
      });

      const result = await ArtistService.getEmotionDistribution({});

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('CASE'),
        expect.any(Array)
      );
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('energy'),
        expect.any(Array)
      );
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('valence'),
        expect.any(Array)
      );
      expect(result).toEqual(mockEmotionDistribution);
    });

    it('should filter by searchTerm', async () => {
      const mockEmotionDistribution = [
        { emotion: 'Cheerful', track_num: 20, ratio: 1.0 },
      ];

      mockQuery.mockResolvedValue({
        rows: mockEmotionDistribution,
        rowCount: 1,
      });

      const result = await ArtistService.getEmotionDistribution({
        searchTerm: 'happy',
      });

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('name ILIKE'),
        expect.arrayContaining(['%happy%'])
      );
      expect(result).toEqual(mockEmotionDistribution);
    });

    it('should filter by artist ids', async () => {
      const mockEmotionDistribution = [
        { emotion: 'Tense', track_num: 12, ratio: 0.6 },
        { emotion: 'Frantic', track_num: 8, ratio: 0.4 },
      ];

      mockQuery.mockResolvedValue({
        rows: mockEmotionDistribution,
        rowCount: 2,
      });

      const result = await ArtistService.getEmotionDistribution({
        ids: ['artist1', 'artist2'],
      });

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('id = ANY'),
        expect.arrayContaining([['artist1', 'artist2']])
      );
      expect(result).toEqual(mockEmotionDistribution);
    });

    it('should filter by genreFilter', async () => {
      const mockEmotionDistribution = [
        { emotion: 'Serene', track_num: 30, ratio: 1.0 },
      ];

      mockQuery.mockResolvedValue({
        rows: mockEmotionDistribution,
        rowCount: 1,
      });

      const result = await ArtistService.getEmotionDistribution({
        genreFilter: 'ambient',
      });

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('genre ILIKE'),
        expect.arrayContaining(['%ambient%'])
      );
      expect(result).toEqual(mockEmotionDistribution);
    });

    it('should calculate emotion categories correctly', async () => {
      // This tests that the CASE statement logic is included in the query
      mockQuery.mockResolvedValue({
        rows: [
          { emotion: 'Frantic', track_num: 5, ratio: 0.1 },
          { emotion: 'Tense', track_num: 8, ratio: 0.16 },
          { emotion: 'Euphotic', track_num: 10, ratio: 0.2 },
          { emotion: 'Upset', track_num: 6, ratio: 0.12 },
          { emotion: 'Calm', track_num: 7, ratio: 0.14 },
          { emotion: 'Cheerful', track_num: 9, ratio: 0.18 },
          { emotion: 'Bleak', track_num: 3, ratio: 0.06 },
          { emotion: 'Apathetic', track_num: 2, ratio: 0.04 },
        ],
        rowCount: 8,
      });

      const result = await ArtistService.getEmotionDistribution({});

      // Verify result is not null
      expect(result).not.toBeNull();
      
      // Verify all emotion categories are present
      if (result) {
        const emotions = result.map((r) => r.emotion);
        expect(emotions).toContain('Frantic');
        expect(emotions).toContain('Euphotic');
        expect(emotions).toContain('Calm');
        expect(emotions).toContain('Bleak');
      }
    });

    it('should return null when no tracks have emotion data', async () => {
      mockQuery.mockResolvedValue({
        rows: [],
        rowCount: 0,
      });

      const result = await ArtistService.getEmotionDistribution({
        ids: ['no-tracks-artist'],
      });

      expect(result).toBeNull();
    });

    it('should handle combined filters', async () => {
      mockQuery.mockResolvedValue({
        rows: [{ emotion: 'Cheerful', track_num: 15, ratio: 1.0 }],
        rowCount: 1,
      });

      await ArtistService.getEmotionDistribution({
        searchTerm: 'upbeat',
        genreFilter: 'pop',
        ids: ['artist-id'],
      });

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('name ILIKE'),
        expect.arrayContaining(['%upbeat%', ['artist-id'], '%pop%'])
      );
    });

    it('should handle database errors', async () => {
      const error = new Error('Connection timeout');
      mockQuery.mockRejectedValue(error);

      await expect(
        ArtistService.getEmotionDistribution({})
      ).rejects.toThrow('Error fetching emotion distribution');
    });
  });

  describe('getCollaborators', () => {
    it('should return collaborators for an artist', async () => {
      const mockCollaborators = [
        { 
          id: 'collab1', 
          name: 'Collaborator 1', 
          collab_num: 5,
          popularity: 80,
          genres: ['pop', 'rock'],
          urls: ['http://image1.jpg']
        },
        { 
          id: 'collab2', 
          name: 'Collaborator 2', 
          collab_num: 3,
          popularity: 75,
          genres: ['indie'],
          urls: ['http://image2.jpg']
        },
      ];

      mockQuery.mockResolvedValue({
        rows: mockCollaborators,
        rowCount: 2,
      });

      const result = await ArtistService.getCollaborators('artist-id');

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('collaboration'),
        ['artist-id']
      );
      expect(result).toEqual(mockCollaborators);
    });

    it('should handle database errors', async () => {
      const error = new Error('Database error');
      mockQuery.mockRejectedValue(error);

      await expect(
        ArtistService.getCollaborators('artist-id')
      ).rejects.toThrow('Error fetching collaborators');
    });
  });
});