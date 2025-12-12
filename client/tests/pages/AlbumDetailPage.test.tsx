import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AlbumDetailPage } from '../../src/pages/AlbumDetailPage';
import * as albumApi from '../../src/lib/albumApi';
import { mockApiAlbums, mockApiTracks, mockApiResponse } from '../mocks/mockData';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ id: 'test-album-1' }),
  };
});

describe('AlbumDetailPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state initially', () => {
    vi.spyOn(albumApi, 'getAlbumById').mockImplementation(() => new Promise(() => {}));
    
    render(
      <BrowserRouter>
        <AlbumDetailPage />
      </BrowserRouter>
    );

    expect(screen.getByText('Loading album details...')).toBeInTheDocument();
  });

  it('renders album details when data is loaded', async () => {
    vi.spyOn(albumApi, 'getAlbumById').mockResolvedValue(mockApiResponse(mockApiAlbums[0]));
    vi.spyOn(albumApi, 'getTracksByAlbum').mockResolvedValue(mockApiResponse(mockApiTracks));

    render(
      <BrowserRouter>
        <AlbumDetailPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Album')).toBeInTheDocument();
    });
  });

  it('displays album type', async () => {
    vi.spyOn(albumApi, 'getAlbumById').mockResolvedValue(mockApiResponse(mockApiAlbums[0]));
    vi.spyOn(albumApi, 'getTracksByAlbum').mockResolvedValue(mockApiResponse([]));

    render(
      <BrowserRouter>
        <AlbumDetailPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('album')).toBeInTheDocument();
    });
  });

  it('displays artist links', async () => {
    vi.spyOn(albumApi, 'getAlbumById').mockResolvedValue(mockApiResponse(mockApiAlbums[0]));
    vi.spyOn(albumApi, 'getTracksByAlbum').mockResolvedValue(mockApiResponse([]));

    render(
      <BrowserRouter>
        <AlbumDetailPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Artist')).toBeInTheDocument();
    });
  });

  it('displays release date', async () => {
    vi.spyOn(albumApi, 'getAlbumById').mockResolvedValue(mockApiResponse(mockApiAlbums[0]));
    vi.spyOn(albumApi, 'getTracksByAlbum').mockResolvedValue(mockApiResponse([]));

    render(
      <BrowserRouter>
        <AlbumDetailPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Release Date')).toBeInTheDocument();
    });
  });

  it('displays album popularity', async () => {
    vi.spyOn(albumApi, 'getAlbumById').mockResolvedValue(mockApiResponse(mockApiAlbums[0]));
    vi.spyOn(albumApi, 'getTracksByAlbum').mockResolvedValue(mockApiResponse([]));

    render(
      <BrowserRouter>
        <AlbumDetailPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Popularity')).toBeInTheDocument();
      expect(screen.getByText('80')).toBeInTheDocument();
    });
  });

  it('renders track list', async () => {
    vi.spyOn(albumApi, 'getAlbumById').mockResolvedValue(mockApiResponse(mockApiAlbums[0]));
    vi.spyOn(albumApi, 'getTracksByAlbum').mockResolvedValue(mockApiResponse(mockApiTracks));

    render(
      <BrowserRouter>
        <AlbumDetailPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Track List')).toBeInTheDocument();
      expect(screen.getByText('Test Track')).toBeInTheDocument();
    });
  });

  it('displays track durations', async () => {
    vi.spyOn(albumApi, 'getAlbumById').mockResolvedValue(mockApiResponse(mockApiAlbums[0]));
    vi.spyOn(albumApi, 'getTracksByAlbum').mockResolvedValue(mockApiResponse(mockApiTracks));

    render(
      <BrowserRouter>
        <AlbumDetailPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('3:30')).toBeInTheDocument();
    });
  });

  it('displays track energy values', async () => {
    vi.spyOn(albumApi, 'getAlbumById').mockResolvedValue(mockApiResponse(mockApiAlbums[0]));
    vi.spyOn(albumApi, 'getTracksByAlbum').mockResolvedValue(mockApiResponse(mockApiTracks));

    render(
      <BrowserRouter>
        <AlbumDetailPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('0.80')).toBeInTheDocument();
    });
  });

  it('displays track danceability values', async () => {
    vi.spyOn(albumApi, 'getAlbumById').mockResolvedValue(mockApiResponse(mockApiAlbums[0]));
    vi.spyOn(albumApi, 'getTracksByAlbum').mockResolvedValue(mockApiResponse(mockApiTracks));

    render(
      <BrowserRouter>
        <AlbumDetailPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('0.75')).toBeInTheDocument();
    });
  });

  it('renders error state when album not found', async () => {
    vi.spyOn(albumApi, 'getAlbumById').mockResolvedValue({ success: false, data: undefined, timestamp: '' });
    vi.spyOn(albumApi, 'getTracksByAlbum').mockResolvedValue(mockApiResponse([]));

    render(
      <BrowserRouter>
        <AlbumDetailPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Album not found')).toBeInTheDocument();
    });
  });

  it('handles empty track list', async () => {
    vi.spyOn(albumApi, 'getAlbumById').mockResolvedValue(mockApiResponse(mockApiAlbums[0]));
    vi.spyOn(albumApi, 'getTracksByAlbum').mockResolvedValue(mockApiResponse([]));

    render(
      <BrowserRouter>
        <AlbumDetailPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('No tracks available')).toBeInTheDocument();
    });
  });

  it('displays album cover image', async () => {
    vi.spyOn(albumApi, 'getAlbumById').mockResolvedValue(mockApiResponse(mockApiAlbums[0]));
    vi.spyOn(albumApi, 'getTracksByAlbum').mockResolvedValue(mockApiResponse([]));

    render(
      <BrowserRouter>
        <AlbumDetailPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      const image = screen.getByAltText('Test Album');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', 'https://example.com/album.jpg');
    });
  });

  it('renders track numbers correctly', async () => {
    vi.spyOn(albumApi, 'getAlbumById').mockResolvedValue(mockApiResponse(mockApiAlbums[0]));
    vi.spyOn(albumApi, 'getTracksByAlbum').mockResolvedValue(mockApiResponse(mockApiTracks));

    render(
      <BrowserRouter>
        <AlbumDetailPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('3')).toBeInTheDocument();
    });
  });

  it('handles API error gracefully', async () => {
    vi.spyOn(albumApi, 'getAlbumById').mockRejectedValue(new Error('Failed to load album details'));
    vi.spyOn(albumApi, 'getTracksByAlbum').mockResolvedValue(mockApiResponse([]));

    render(
      <BrowserRouter>
        <AlbumDetailPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Failed to load album details/i)).toBeInTheDocument();
    });
  });

  it('renders track links', async () => {
    vi.spyOn(albumApi, 'getAlbumById').mockResolvedValue(mockApiResponse(mockApiAlbums[0]));
    vi.spyOn(albumApi, 'getTracksByAlbum').mockResolvedValue(mockApiResponse(mockApiTracks));

    render(
      <BrowserRouter>
        <AlbumDetailPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      const trackLink = screen.getByRole('link', { name: 'Test Track' });
      expect(trackLink).toHaveAttribute('href', '/track/test-track-1');
    });
  });

  it('handles missing audio features', async () => {
    const trackWithoutFeatures = {
      ...mockApiTracks[0],
      energy: undefined,
      danceability: undefined,
    };

    vi.spyOn(albumApi, 'getAlbumById').mockResolvedValue(mockApiResponse(mockApiAlbums[0]));
    vi.spyOn(albumApi, 'getTracksByAlbum').mockResolvedValue(mockApiResponse([trackWithoutFeatures]));

    render(
      <BrowserRouter>
        <AlbumDetailPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getAllByText('--')[0]).toBeInTheDocument();
    });
  });
});
