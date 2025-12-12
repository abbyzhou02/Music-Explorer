import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ArtistDetailPage } from '../../src/pages/ArtistDetailPage';
import * as artistApi from '../../src/lib/artistApi';
import * as albumApi from '../../src/lib/albumApi';
import * as trackApi from '../../src/lib/trackApi';
import { mockArtist, mockApiAlbums, mockApiTracks, mockApiResponse } from '../mocks/mockData';

// Mock router params
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ id: 'test-artist-1' }),
  };
});

describe('ArtistDetailPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state initially', () => {
    vi.spyOn(artistApi, 'getArtistById').mockImplementation(() => new Promise(() => {}));
    
    render(
      <BrowserRouter>
        <ArtistDetailPage />
      </BrowserRouter>
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders artist details when data is loaded', async () => {
    vi.spyOn(artistApi, 'getArtistById').mockResolvedValue(mockApiResponse(mockArtist));
    vi.spyOn(albumApi, 'getAlbumsByArtist').mockResolvedValue(mockApiResponse(mockApiAlbums));
    vi.spyOn(trackApi, 'getTracksByArtist').mockResolvedValue(mockApiResponse(mockApiTracks));
    vi.spyOn(albumApi, 'getAlbumCountByArtist').mockResolvedValue(mockApiResponse(10));
    vi.spyOn(trackApi, 'getTrackCountByArtist').mockResolvedValue(mockApiResponse(50));
    vi.spyOn(artistApi, 'getCollaborators').mockResolvedValue(mockApiResponse([]));
    vi.spyOn(artistApi, 'getGenreDistributionById').mockResolvedValue(mockApiResponse([]));
    vi.spyOn(artistApi, 'getEmotionDistributionById').mockResolvedValue(mockApiResponse([]));

    render(
      <BrowserRouter>
        <ArtistDetailPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Artist')).toBeInTheDocument();
    });
  });

  it('displays artist genres', async () => {
    vi.spyOn(artistApi, 'getArtistById').mockResolvedValue(mockApiResponse(mockArtist));
    vi.spyOn(albumApi, 'getAlbumsByArtist').mockResolvedValue(mockApiResponse([]));
    vi.spyOn(trackApi, 'getTracksByArtist').mockResolvedValue(mockApiResponse([]));
    vi.spyOn(albumApi, 'getAlbumCountByArtist').mockResolvedValue(mockApiResponse(0));
    vi.spyOn(trackApi, 'getTrackCountByArtist').mockResolvedValue(mockApiResponse(0));
    vi.spyOn(artistApi, 'getCollaborators').mockResolvedValue(mockApiResponse([]));
    vi.spyOn(artistApi, 'getGenreDistributionById').mockResolvedValue(mockApiResponse([]));
    vi.spyOn(artistApi, 'getEmotionDistributionById').mockResolvedValue(mockApiResponse([]));

    render(
      <BrowserRouter>
        <ArtistDetailPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('pop')).toBeInTheDocument();
      expect(screen.getByText('rock')).toBeInTheDocument();
    });
  });

  it('displays artist popularity and followers', async () => {
    vi.spyOn(artistApi, 'getArtistById').mockResolvedValue(mockApiResponse(mockArtist));
    vi.spyOn(albumApi, 'getAlbumsByArtist').mockResolvedValue(mockApiResponse([]));
    vi.spyOn(trackApi, 'getTracksByArtist').mockResolvedValue(mockApiResponse([]));
    vi.spyOn(albumApi, 'getAlbumCountByArtist').mockResolvedValue(mockApiResponse(0));
    vi.spyOn(trackApi, 'getTrackCountByArtist').mockResolvedValue(mockApiResponse(0));
    vi.spyOn(artistApi, 'getCollaborators').mockResolvedValue(mockApiResponse([]));
    vi.spyOn(artistApi, 'getGenreDistributionById').mockResolvedValue(mockApiResponse([]));
    vi.spyOn(artistApi, 'getEmotionDistributionById').mockResolvedValue(mockApiResponse([]));

    render(
      <BrowserRouter>
        <ArtistDetailPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('85')).toBeInTheDocument();
      expect(screen.getByText('5.0M')).toBeInTheDocument();
    });
  });

  it('renders error state when artist not found', async () => {
    vi.spyOn(artistApi, 'getArtistById').mockResolvedValue({ success: false, data: undefined, timestamp: '' });
    vi.spyOn(albumApi, 'getAlbumsByArtist').mockResolvedValue(mockApiResponse([]));
    vi.spyOn(trackApi, 'getTracksByArtist').mockResolvedValue(mockApiResponse([]));
    vi.spyOn(albumApi, 'getAlbumCountByArtist').mockResolvedValue(mockApiResponse(0));
    vi.spyOn(trackApi, 'getTrackCountByArtist').mockResolvedValue(mockApiResponse(0));
    vi.spyOn(artistApi, 'getCollaborators').mockResolvedValue(mockApiResponse([]));
    vi.spyOn(artistApi, 'getGenreDistributionById').mockResolvedValue(mockApiResponse([]));
    vi.spyOn(artistApi, 'getEmotionDistributionById').mockResolvedValue(mockApiResponse([]));

    render(
      <BrowserRouter>
        <ArtistDetailPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Artist does not exist')).toBeInTheDocument();
    });
  });

  it('renders music works tab by default', async () => {
    vi.spyOn(artistApi, 'getArtistById').mockResolvedValue(mockApiResponse(mockArtist));
    vi.spyOn(albumApi, 'getAlbumsByArtist').mockResolvedValue(mockApiResponse(mockApiAlbums));
    vi.spyOn(trackApi, 'getTracksByArtist').mockResolvedValue(mockApiResponse(mockApiTracks));
    vi.spyOn(albumApi, 'getAlbumCountByArtist').mockResolvedValue(mockApiResponse(3));
    vi.spyOn(trackApi, 'getTrackCountByArtist').mockResolvedValue(mockApiResponse(3));
    vi.spyOn(artistApi, 'getCollaborators').mockResolvedValue(mockApiResponse([]));
    vi.spyOn(artistApi, 'getGenreDistributionById').mockResolvedValue(mockApiResponse([]));
    vi.spyOn(artistApi, 'getEmotionDistributionById').mockResolvedValue(mockApiResponse([]));

    render(
      <BrowserRouter>
        <ArtistDetailPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      const musicButton = screen.getByRole('button', { name: /music works/i });
      expect(musicButton).toHaveClass('border-primary-500');
    });
  });

  it('displays albums in music works view', async () => {
    vi.spyOn(artistApi, 'getArtistById').mockResolvedValue(mockApiResponse(mockArtist));
    vi.spyOn(albumApi, 'getAlbumsByArtist').mockResolvedValue(mockApiResponse(mockApiAlbums));
    vi.spyOn(trackApi, 'getTracksByArtist').mockResolvedValue(mockApiResponse(mockApiTracks));
    vi.spyOn(albumApi, 'getAlbumCountByArtist').mockResolvedValue(mockApiResponse(3));
    vi.spyOn(trackApi, 'getTrackCountByArtist').mockResolvedValue(mockApiResponse(3));
    vi.spyOn(artistApi, 'getCollaborators').mockResolvedValue(mockApiResponse([]));
    vi.spyOn(artistApi, 'getGenreDistributionById').mockResolvedValue(mockApiResponse([]));
    vi.spyOn(artistApi, 'getEmotionDistributionById').mockResolvedValue(mockApiResponse([]));

    render(
      <BrowserRouter>
        <ArtistDetailPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Album')).toBeInTheDocument();
      expect(screen.getByText('Another Album')).toBeInTheDocument();
    });
  });

  it('displays tracks in music works view', async () => {
    vi.spyOn(artistApi, 'getArtistById').mockResolvedValue(mockApiResponse(mockArtist));
    vi.spyOn(albumApi, 'getAlbumsByArtist').mockResolvedValue(mockApiResponse(mockApiAlbums));
    vi.spyOn(trackApi, 'getTracksByArtist').mockResolvedValue(mockApiResponse(mockApiTracks));
    vi.spyOn(albumApi, 'getAlbumCountByArtist').mockResolvedValue(mockApiResponse(3));
    vi.spyOn(trackApi, 'getTrackCountByArtist').mockResolvedValue(mockApiResponse(3));
    vi.spyOn(artistApi, 'getCollaborators').mockResolvedValue(mockApiResponse([]));
    vi.spyOn(artistApi, 'getGenreDistributionById').mockResolvedValue(mockApiResponse([]));
    vi.spyOn(artistApi, 'getEmotionDistributionById').mockResolvedValue(mockApiResponse([]));

    render(
      <BrowserRouter>
        <ArtistDetailPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Track')).toBeInTheDocument();
      expect(screen.getByText('Explicit Track')).toBeInTheDocument();
    });
  });

  it('renders collaborators when available', async () => {
    const mockCollaborators = [
      { ...mockArtist, id: 'collab-1', name: 'Collaborator 1' },
    ];

    vi.spyOn(artistApi, 'getArtistById').mockResolvedValue(mockApiResponse(mockArtist));
    vi.spyOn(albumApi, 'getAlbumsByArtist').mockResolvedValue(mockApiResponse([]));
    vi.spyOn(trackApi, 'getTracksByArtist').mockResolvedValue(mockApiResponse([]));
    vi.spyOn(albumApi, 'getAlbumCountByArtist').mockResolvedValue(mockApiResponse(0));
    vi.spyOn(trackApi, 'getTrackCountByArtist').mockResolvedValue(mockApiResponse(0));
    vi.spyOn(artistApi, 'getCollaborators').mockResolvedValue(mockApiResponse(mockCollaborators));
    vi.spyOn(artistApi, 'getGenreDistributionById').mockResolvedValue(mockApiResponse([]));
    vi.spyOn(artistApi, 'getEmotionDistributionById').mockResolvedValue(mockApiResponse([]));

    render(
      <BrowserRouter>
        <ArtistDetailPage />
      </BrowserRouter>
    );

    // Click analytics tab
    await waitFor(() => {
      const analyticsButton = screen.getByRole('button', { name: /analytics/i });
      analyticsButton.click();
    });

    await waitFor(() => {
      expect(screen.getByText('Collaborators')).toBeInTheDocument();
    });
  });

  it('renders genre distribution when available', async () => {
    const mockGenres = [
      { genre: 'pop', artist_num: '100', ratio: '0.5' },
      { genre: 'rock', artist_num: '50', ratio: '0.25' },
    ];

    vi.spyOn(artistApi, 'getArtistById').mockResolvedValue(mockApiResponse(mockArtist));
    vi.spyOn(albumApi, 'getAlbumsByArtist').mockResolvedValue(mockApiResponse([]));
    vi.spyOn(trackApi, 'getTracksByArtist').mockResolvedValue(mockApiResponse([]));
    vi.spyOn(albumApi, 'getAlbumCountByArtist').mockResolvedValue(mockApiResponse(0));
    vi.spyOn(trackApi, 'getTrackCountByArtist').mockResolvedValue(mockApiResponse(0));
    vi.spyOn(artistApi, 'getCollaborators').mockResolvedValue(mockApiResponse([]));
    vi.spyOn(artistApi, 'getGenreDistributionById').mockResolvedValue(mockApiResponse(mockGenres));
    vi.spyOn(artistApi, 'getEmotionDistributionById').mockResolvedValue(mockApiResponse([]));

    render(
      <BrowserRouter>
        <ArtistDetailPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      const analyticsButton = screen.getByRole('button', { name: /analytics/i });
      analyticsButton.click();
    });

    await waitFor(() => {
      expect(screen.getByText('Genre Distribution')).toBeInTheDocument();
    });
  });

  it('renders emotion distribution when available', async () => {
    const mockEmotions = [
      { emotion: 'Happy', track_num: '200', ratio: '0.4' },
      { emotion: 'Sad', track_num: '150', ratio: '0.3' },
    ];

    vi.spyOn(artistApi, 'getArtistById').mockResolvedValue(mockApiResponse(mockArtist));
    vi.spyOn(albumApi, 'getAlbumsByArtist').mockResolvedValue(mockApiResponse([]));
    vi.spyOn(trackApi, 'getTracksByArtist').mockResolvedValue(mockApiResponse([]));
    vi.spyOn(albumApi, 'getAlbumCountByArtist').mockResolvedValue(mockApiResponse(0));
    vi.spyOn(trackApi, 'getTrackCountByArtist').mockResolvedValue(mockApiResponse(0));
    vi.spyOn(artistApi, 'getCollaborators').mockResolvedValue(mockApiResponse([]));
    vi.spyOn(artistApi, 'getGenreDistributionById').mockResolvedValue(mockApiResponse([]));
    vi.spyOn(artistApi, 'getEmotionDistributionById').mockResolvedValue(mockApiResponse(mockEmotions));

    render(
      <BrowserRouter>
        <ArtistDetailPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      const analyticsButton = screen.getByRole('button', { name: /analytics/i });
      analyticsButton.click();
    });

    await waitFor(() => {
      expect(screen.getByText('Song Emotion Distribution')).toBeInTheDocument();
    });
  });

  it('handles API error gracefully', async () => {
    vi.spyOn(artistApi, 'getArtistById').mockRejectedValue(new Error('API Error'));

    render(
      <BrowserRouter>
        <ArtistDetailPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/API Error/i)).toBeInTheDocument();
    });
  });

  it('renders artist image', async () => {
    vi.spyOn(artistApi, 'getArtistById').mockResolvedValue(mockApiResponse(mockArtist));
    vi.spyOn(albumApi, 'getAlbumsByArtist').mockResolvedValue(mockApiResponse([]));
    vi.spyOn(trackApi, 'getTracksByArtist').mockResolvedValue(mockApiResponse([]));
    vi.spyOn(albumApi, 'getAlbumCountByArtist').mockResolvedValue(mockApiResponse(0));
    vi.spyOn(trackApi, 'getTrackCountByArtist').mockResolvedValue(mockApiResponse(0));
    vi.spyOn(artistApi, 'getCollaborators').mockResolvedValue(mockApiResponse([]));
    vi.spyOn(artistApi, 'getGenreDistributionById').mockResolvedValue(mockApiResponse([]));
    vi.spyOn(artistApi, 'getEmotionDistributionById').mockResolvedValue(mockApiResponse([]));

    render(
      <BrowserRouter>
        <ArtistDetailPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      const artistImage = screen.getByAltText('Test Artist');
      expect(artistImage).toBeInTheDocument();
      expect(artistImage).toHaveAttribute('src', 'https://example.com/artist.jpg');
    });
  });

  it('handles empty albums list', async () => {
    vi.spyOn(artistApi, 'getArtistById').mockResolvedValue(mockApiResponse(mockArtist));
    vi.spyOn(albumApi, 'getAlbumsByArtist').mockResolvedValue(mockApiResponse([]));
    vi.spyOn(trackApi, 'getTracksByArtist').mockResolvedValue(mockApiResponse([]));
    vi.spyOn(albumApi, 'getAlbumCountByArtist').mockResolvedValue(mockApiResponse(0));
    vi.spyOn(trackApi, 'getTrackCountByArtist').mockResolvedValue(mockApiResponse(0));
    vi.spyOn(artistApi, 'getCollaborators').mockResolvedValue(mockApiResponse([]));
    vi.spyOn(artistApi, 'getGenreDistributionById').mockResolvedValue(mockApiResponse([]));
    vi.spyOn(artistApi, 'getEmotionDistributionById').mockResolvedValue(mockApiResponse([]));

    render(
      <BrowserRouter>
        <ArtistDetailPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Artist')).toBeInTheDocument();
    });
  });

  it('handles empty tracks list', async () => {
    vi.spyOn(artistApi, 'getArtistById').mockResolvedValue(mockApiResponse(mockArtist));
    vi.spyOn(albumApi, 'getAlbumsByArtist').mockResolvedValue(mockApiResponse([]));
    vi.spyOn(trackApi, 'getTracksByArtist').mockResolvedValue(mockApiResponse([]));
    vi.spyOn(albumApi, 'getAlbumCountByArtist').mockResolvedValue(mockApiResponse(0));
    vi.spyOn(trackApi, 'getTrackCountByArtist').mockResolvedValue(mockApiResponse(0));
    vi.spyOn(artistApi, 'getCollaborators').mockResolvedValue(mockApiResponse([]));
    vi.spyOn(artistApi, 'getGenreDistributionById').mockResolvedValue(mockApiResponse([]));
    vi.spyOn(artistApi, 'getEmotionDistributionById').mockResolvedValue(mockApiResponse([]));

    render(
      <BrowserRouter>
        <ArtistDetailPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Artist')).toBeInTheDocument();
    });
  });
});
