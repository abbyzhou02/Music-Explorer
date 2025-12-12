import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ExplorePage } from '../../src/pages/ExplorePage';
import * as artistApi from '../../src/lib/artistApi';
import * as albumApi from '../../src/lib/albumApi';
import * as trackApi from '../../src/lib/trackApi';
import { mockArtists, mockApiAlbums, mockApiTracks, mockApiResponse } from '../mocks/mockData';

// Mock Chart.js
vi.mock('chart.js', () => ({
  Chart: class Chart {
    static register = vi.fn();
    constructor() {}
    destroy() {}
    update() {}
  },
  CategoryScale: vi.fn(),
  LinearScale: vi.fn(),
  ArcElement: vi.fn(),
  Title: vi.fn(),
  Tooltip: vi.fn(),
  Legend: vi.fn(),
}));

// Mock react-chartjs-2
vi.mock('react-chartjs-2', () => ({
  Pie: () => <div data-testid="pie-chart">Pie Chart</div>,
}));

describe('ExplorePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders page header', async () => {
    vi.spyOn(artistApi, 'searchArtists').mockResolvedValue(mockApiResponse(mockArtists));
    vi.spyOn(artistApi, 'getArtistCount').mockResolvedValue(mockApiResponse(3));
    vi.spyOn(artistApi, 'getGenreDistribution').mockResolvedValue(mockApiResponse([]));
    vi.spyOn(artistApi, 'getEmotionDistribution').mockResolvedValue(mockApiResponse([]));

    render(
      <BrowserRouter>
        <ExplorePage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Explore Music')).toBeInTheDocument();
    });
  });

  it('renders view toggle buttons', async () => {
    vi.spyOn(artistApi, 'searchArtists').mockResolvedValue(mockApiResponse(mockArtists));
    vi.spyOn(artistApi, 'getArtistCount').mockResolvedValue(mockApiResponse(3));
    vi.spyOn(artistApi, 'getGenreDistribution').mockResolvedValue(mockApiResponse([]));
    vi.spyOn(artistApi, 'getEmotionDistribution').mockResolvedValue(mockApiResponse([]));

    render(
      <BrowserRouter>
        <ExplorePage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /artists/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /albums/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /tracks/i })).toBeInTheDocument();
    });
  });

  it('displays artists by default', async () => {
    vi.spyOn(artistApi, 'searchArtists').mockResolvedValue(mockApiResponse(mockArtists));
    vi.spyOn(artistApi, 'getArtistCount').mockResolvedValue(mockApiResponse(3));
    vi.spyOn(artistApi, 'getGenreDistribution').mockResolvedValue(mockApiResponse([]));
    vi.spyOn(artistApi, 'getEmotionDistribution').mockResolvedValue(mockApiResponse([]));

    render(
      <BrowserRouter>
        <ExplorePage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Artist')).toBeInTheDocument();
      expect(screen.getByText('Another Artist')).toBeInTheDocument();
    });
  });

  it('switches to albums view when albums button clicked', async () => {
    vi.spyOn(artistApi, 'searchArtists').mockResolvedValue(mockApiResponse(mockArtists));
    vi.spyOn(artistApi, 'getArtistCount').mockResolvedValue(mockApiResponse(3));
    vi.spyOn(artistApi, 'getGenreDistribution').mockResolvedValue(mockApiResponse([]));
    vi.spyOn(artistApi, 'getEmotionDistribution').mockResolvedValue(mockApiResponse([]));
    vi.spyOn(albumApi, 'searchAlbums').mockResolvedValue(mockApiResponse(mockApiAlbums));
    vi.spyOn(albumApi, 'getAlbumCount').mockResolvedValue(mockApiResponse(3));
    vi.spyOn(albumApi, 'getTypeDistributionFromSearch').mockResolvedValue(mockApiResponse([]));

    render(
      <BrowserRouter>
        <ExplorePage />
      </BrowserRouter>
    );

    await waitFor(() => {
      const albumsButton = screen.getByRole('button', { name: /albums/i });
      fireEvent.click(albumsButton);
    });

    await waitFor(() => {
      expect(screen.getByText('Test Album')).toBeInTheDocument();
    });
  });

  it('switches to tracks view when tracks button clicked', async () => {
    vi.spyOn(artistApi, 'searchArtists').mockResolvedValue(mockApiResponse(mockArtists));
    vi.spyOn(artistApi, 'getArtistCount').mockResolvedValue(mockApiResponse(3));
    vi.spyOn(artistApi, 'getGenreDistribution').mockResolvedValue(mockApiResponse([]));
    vi.spyOn(artistApi, 'getEmotionDistribution').mockResolvedValue(mockApiResponse([]));
    vi.spyOn(trackApi, 'searchTracks').mockResolvedValue(mockApiResponse(mockApiTracks));
    vi.spyOn(trackApi, 'getTrackCount').mockResolvedValue(mockApiResponse(3));

    render(
      <BrowserRouter>
        <ExplorePage />
      </BrowserRouter>
    );

    await waitFor(() => {
      const tracksButton = screen.getByRole('button', { name: /tracks/i });
      fireEvent.click(tracksButton);
    });

    await waitFor(() => {
      expect(screen.getByText('Test Track')).toBeInTheDocument();
    });
  });

  it('renders search input', async () => {
    vi.spyOn(artistApi, 'searchArtists').mockResolvedValue(mockApiResponse(mockArtists));
    vi.spyOn(artistApi, 'getArtistCount').mockResolvedValue(mockApiResponse(3));
    vi.spyOn(artistApi, 'getGenreDistribution').mockResolvedValue(mockApiResponse([]));
    vi.spyOn(artistApi, 'getEmotionDistribution').mockResolvedValue(mockApiResponse([]));

    render(
      <BrowserRouter>
        <ExplorePage />
      </BrowserRouter>
    );

    await waitFor(() => {
      const searchInput = screen.getByPlaceholderText('Search...');
      expect(searchInput).toBeInTheDocument();
    });
  });

  it('renders genre filter for artists view', async () => {
    vi.spyOn(artistApi, 'searchArtists').mockResolvedValue(mockApiResponse(mockArtists));
    vi.spyOn(artistApi, 'getArtistCount').mockResolvedValue(mockApiResponse(3));
    vi.spyOn(artistApi, 'getGenreDistribution').mockResolvedValue(mockApiResponse([]));
    vi.spyOn(artistApi, 'getEmotionDistribution').mockResolvedValue(mockApiResponse([]));

    render(
      <BrowserRouter>
        <ExplorePage />
      </BrowserRouter>
    );

    await waitFor(() => {
      const genreFilter = screen.getByPlaceholderText('Filter by genre...');
      expect(genreFilter).toBeInTheDocument();
    });
  });

  it('renders emotion filter for tracks view', async () => {
    vi.spyOn(artistApi, 'searchArtists').mockResolvedValue(mockApiResponse(mockArtists));
    vi.spyOn(artistApi, 'getArtistCount').mockResolvedValue(mockApiResponse(3));
    vi.spyOn(artistApi, 'getGenreDistribution').mockResolvedValue(mockApiResponse([]));
    vi.spyOn(artistApi, 'getEmotionDistribution').mockResolvedValue(mockApiResponse([]));
    vi.spyOn(trackApi, 'searchTracks').mockResolvedValue(mockApiResponse(mockApiTracks));
    vi.spyOn(trackApi, 'getTrackCount').mockResolvedValue(mockApiResponse(3));

    render(
      <BrowserRouter>
        <ExplorePage />
      </BrowserRouter>
    );

    await waitFor(() => {
      const tracksButton = screen.getByRole('button', { name: /tracks/i });
      fireEvent.click(tracksButton);
    });

    await waitFor(() => {
      expect(screen.getByDisplayValue('All Emotions')).toBeInTheDocument();
    });
  });

  it('renders album type filter for albums view', async () => {
    vi.spyOn(artistApi, 'searchArtists').mockResolvedValue(mockApiResponse(mockArtists));
    vi.spyOn(artistApi, 'getArtistCount').mockResolvedValue(mockApiResponse(3));
    vi.spyOn(artistApi, 'getGenreDistribution').mockResolvedValue(mockApiResponse([]));
    vi.spyOn(artistApi, 'getEmotionDistribution').mockResolvedValue(mockApiResponse([]));
    vi.spyOn(albumApi, 'searchAlbums').mockResolvedValue(mockApiResponse(mockApiAlbums));
    vi.spyOn(albumApi, 'getAlbumCount').mockResolvedValue(mockApiResponse(3));
    vi.spyOn(albumApi, 'getTypeDistributionFromSearch').mockResolvedValue(mockApiResponse([]));

    render(
      <BrowserRouter>
        <ExplorePage />
      </BrowserRouter>
    );

    await waitFor(() => {
      const albumsButton = screen.getByRole('button', { name: /albums/i });
      fireEvent.click(albumsButton);
    });

    await waitFor(() => {
      expect(screen.getByDisplayValue('All Types')).toBeInTheDocument();
    });
  });

  it('renders sort selector', async () => {
    vi.spyOn(artistApi, 'searchArtists').mockResolvedValue(mockApiResponse(mockArtists));
    vi.spyOn(artistApi, 'getArtistCount').mockResolvedValue(mockApiResponse(3));
    vi.spyOn(artistApi, 'getGenreDistribution').mockResolvedValue(mockApiResponse([]));
    vi.spyOn(artistApi, 'getEmotionDistribution').mockResolvedValue(mockApiResponse([]));

    render(
      <BrowserRouter>
        <ExplorePage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue('By Popularity')).toBeInTheDocument();
    });
  });

  it('renders sort order toggle', async () => {
    vi.spyOn(artistApi, 'searchArtists').mockResolvedValue(mockApiResponse(mockArtists));
    vi.spyOn(artistApi, 'getArtistCount').mockResolvedValue(mockApiResponse(3));
    vi.spyOn(artistApi, 'getGenreDistribution').mockResolvedValue(mockApiResponse([]));
    vi.spyOn(artistApi, 'getEmotionDistribution').mockResolvedValue(mockApiResponse([]));

    render(
      <BrowserRouter>
        <ExplorePage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('DESC')).toBeInTheDocument();
    });
  });

  it('displays loading state', () => {
    vi.spyOn(artistApi, 'searchArtists').mockImplementation(() => new Promise(() => {}));
    
    render(
      <BrowserRouter>
        <ExplorePage />
      </BrowserRouter>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('handles search API errors gracefully', async () => {
    vi.spyOn(artistApi, 'searchArtists').mockRejectedValue(new Error('API Error'));
    vi.spyOn(artistApi, 'getArtistCount').mockResolvedValue(mockApiResponse(0));
    vi.spyOn(artistApi, 'getGenreDistribution').mockResolvedValue(mockApiResponse([]));
    vi.spyOn(artistApi, 'getEmotionDistribution').mockResolvedValue(mockApiResponse([]));

    render(
      <BrowserRouter>
        <ExplorePage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/API Error/i)).toBeInTheDocument();
    });
  });

  it('displays genre distribution chart for artists', async () => {
    const mockGenres = [
      { genre: 'pop', artist_num: 100, ratio: 0.5 },
      { genre: 'rock', artist_num: 50, ratio: 0.25 },
    ];

    vi.spyOn(artistApi, 'searchArtists').mockResolvedValue(mockApiResponse(mockArtists));
    vi.spyOn(artistApi, 'getArtistCount').mockResolvedValue(mockApiResponse(3));
    vi.spyOn(artistApi, 'getGenreDistribution').mockResolvedValue(mockApiResponse(mockGenres));
    vi.spyOn(artistApi, 'getEmotionDistribution').mockResolvedValue(mockApiResponse([]));

    render(
      <BrowserRouter>
        <ExplorePage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Distribution Analytics')).toBeInTheDocument();
      expect(screen.getByText('Genre Distribution')).toBeInTheDocument();
    });
  });

  it('displays emotion distribution chart for artists', async () => {
    const mockEmotions = [
      { emotion: 'Happy', track_num: 200, ratio: 0.4 },
      { emotion: 'Sad', track_num: 150, ratio: 0.3 },
    ];

    vi.spyOn(artistApi, 'searchArtists').mockResolvedValue(mockApiResponse(mockArtists));
    vi.spyOn(artistApi, 'getArtistCount').mockResolvedValue(mockApiResponse(3));
    vi.spyOn(artistApi, 'getGenreDistribution').mockResolvedValue(mockApiResponse([]));
    vi.spyOn(artistApi, 'getEmotionDistribution').mockResolvedValue(mockApiResponse(mockEmotions));

    render(
      <BrowserRouter>
        <ExplorePage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Emotion Distribution')).toBeInTheDocument();
    });
  });

  it('displays album type distribution for albums view', async () => {
    const mockTypes = [
      { type: 'album', cnt: 100 },
      { type: 'single', cnt: 50 },
    ];

    vi.spyOn(artistApi, 'searchArtists').mockResolvedValue(mockApiResponse(mockArtists));
    vi.spyOn(artistApi, 'getArtistCount').mockResolvedValue(mockApiResponse(3));
    vi.spyOn(artistApi, 'getGenreDistribution').mockResolvedValue(mockApiResponse([]));
    vi.spyOn(artistApi, 'getEmotionDistribution').mockResolvedValue(mockApiResponse([]));
    vi.spyOn(albumApi, 'searchAlbums').mockResolvedValue(mockApiResponse(mockApiAlbums));
    vi.spyOn(albumApi, 'getAlbumCount').mockResolvedValue(mockApiResponse(3));
    vi.spyOn(albumApi, 'getTypeDistributionFromSearch').mockResolvedValue(mockApiResponse(mockTypes));

    render(
      <BrowserRouter>
        <ExplorePage />
      </BrowserRouter>
    );

    await waitFor(() => {
      const albumsButton = screen.getByRole('button', { name: /albums/i });
      fireEvent.click(albumsButton);
    });

    await waitFor(() => {
      expect(screen.getByText('Album Type Distribution')).toBeInTheDocument();
    });
  });

  it('handles empty results', async () => {
    vi.spyOn(artistApi, 'searchArtists').mockResolvedValue(mockApiResponse([]));
    vi.spyOn(artistApi, 'getArtistCount').mockResolvedValue(mockApiResponse(0));
    vi.spyOn(artistApi, 'getGenreDistribution').mockResolvedValue(mockApiResponse([]));
    vi.spyOn(artistApi, 'getEmotionDistribution').mockResolvedValue(mockApiResponse([]));

    render(
      <BrowserRouter>
        <ExplorePage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('No artists found')).toBeInTheDocument();
    });
  });
});
