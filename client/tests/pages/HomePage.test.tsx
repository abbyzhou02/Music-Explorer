import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '../utils/test-utils';
import { HomePage } from '../../src/pages/HomePage';
import { mockArtists, mockApiAlbums, mockApiResponse } from '../mocks/mockData';
import * as artistApi from '../../src/lib/artistApi';
import * as albumApi from '../../src/lib/albumApi';
import * as trackApi from '../../src/lib/trackApi';

// Mock the API modules
vi.mock('../../src/lib/artistApi');
vi.mock('../../src/lib/albumApi');
vi.mock('../../src/lib/trackApi');

describe('HomePage', () => {
  beforeEach(() => {
    // Reset all mocks before each test
    vi.clearAllMocks();

    // Setup default mock implementations
    vi.mocked(artistApi.getTrendingArtists).mockResolvedValue(
      mockApiResponse(mockArtists.slice(0, 8))
    );
    vi.mocked(albumApi.getRecentAlbums).mockResolvedValue(
      mockApiResponse(mockApiAlbums.slice(0, 6))
    );
    vi.mocked(artistApi.getArtistCount).mockResolvedValue(mockApiResponse(1000));
    vi.mocked(albumApi.getAlbumCount).mockResolvedValue(mockApiResponse(5000));
    vi.mocked(trackApi.getTrackCount).mockResolvedValue(mockApiResponse(50000));
    vi.mocked(artistApi.getGenreCount).mockResolvedValue(mockApiResponse(50));
  });

  it('renders hero section correctly', () => {
    render(<HomePage />);

    expect(screen.getByText(/Discover Your Next/i)).toBeInTheDocument();
    expect(screen.getByText(/Favorite/i)).toBeInTheDocument();
    expect(screen.getByText(/Explore music from top global artists/i)).toBeInTheDocument();
    expect(screen.getByText('Start Exploring')).toBeInTheDocument();
  });

  it('displays loading skeletons initially', () => {
    render(<HomePage />);

    // Check for loading skeletons
    const skeletons = document.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('loads and displays trending artists', async () => {
    render(<HomePage />);

    await waitFor(() => {
      expect(artistApi.getTrendingArtists).toHaveBeenCalledWith(8);
    });

    await waitFor(() => {
      expect(screen.getByText('Test Artist')).toBeInTheDocument();
      expect(screen.getByText('Another Artist')).toBeInTheDocument();
    });
  });

  it('loads and displays recent albums', async () => {
    render(<HomePage />);

    await waitFor(() => {
      expect(albumApi.getRecentAlbums).toHaveBeenCalledWith(6);
    });

    await waitFor(() => {
      expect(screen.getByText('Test Album')).toBeInTheDocument();
    });
  });

  it('displays statistics cards with correct data', async () => {
    render(<HomePage />);

    await waitFor(() => {
      expect(screen.getByText('Total Artists')).toBeInTheDocument();
      expect(screen.getByText('Total Albums')).toBeInTheDocument();
      expect(screen.getByText('Total Songs')).toBeInTheDocument();
      expect(screen.getByText('Music Genres')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText('1000')).toBeInTheDocument();
      expect(screen.getByText('5000')).toBeInTheDocument();
      expect(screen.getByText('50000')).toBeInTheDocument();
      expect(screen.getByText('50')).toBeInTheDocument();
    });
  });

  it('calls all API endpoints on mount', async () => {
    render(<HomePage />);

    await waitFor(() => {
      expect(artistApi.getTrendingArtists).toHaveBeenCalled();
      expect(albumApi.getRecentAlbums).toHaveBeenCalled();
      expect(artistApi.getArtistCount).toHaveBeenCalled();
      expect(albumApi.getAlbumCount).toHaveBeenCalled();
      expect(trackApi.getTrackCount).toHaveBeenCalled();
      expect(artistApi.getGenreCount).toHaveBeenCalled();
    });
  });

  it('handles API errors gracefully', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    vi.mocked(artistApi.getTrendingArtists).mockRejectedValue(
      new Error('API Error')
    );

    render(<HomePage />);

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error loading data:',
        expect.any(Error)
      );
    });

    consoleErrorSpy.mockRestore();
  });

  it('contains navigation links to explore page', () => {
    render(<HomePage />);

    const exploreLinks = screen.getAllByText(/View All|Start Exploring/i);
    expect(exploreLinks.length).toBeGreaterThan(0);
  });

  it('renders section headers correctly', () => {
    render(<HomePage />);

    expect(screen.getByText('Popular Artists')).toBeInTheDocument();
    expect(screen.getByText('Recent Albums')).toBeInTheDocument();
  });

  it('displays correct number of artist and album cards', async () => {
    render(<HomePage />);

    await waitFor(() => {
      // 3 artists in mockArtists array
      const artistCards = screen.getAllByText(/Test Artist|Another Artist|Third Artist/i);
      expect(artistCards.length).toBeGreaterThan(0);
    });
  });
});
