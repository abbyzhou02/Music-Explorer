import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { TrackDetailPage } from '../../src/pages/TrackDetailPage';
import * as trackApi from '../../src/lib/trackApi';
import { mockApiTracks, mockApiResponse } from '../mocks/mockData';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({ id: 'test-track-1' }),
  };
});

describe('TrackDetailPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state initially', () => {
    vi.spyOn(trackApi, 'getTrackById').mockImplementation(() => new Promise(() => {}));
    
    render(
      <BrowserRouter>
        <TrackDetailPage />
      </BrowserRouter>
    );

    expect(screen.getByText('Loading track details...')).toBeInTheDocument();
  });

  it('renders track details when data is loaded', async () => {
    vi.spyOn(trackApi, 'getTrackById').mockResolvedValue(mockApiResponse(mockApiTracks[0]));
    vi.spyOn(trackApi, 'getLyricsByTrackId').mockResolvedValue({ success: true, data: undefined, timestamp: '' });
    vi.spyOn(trackApi, 'getSimilarTracks').mockResolvedValue(mockApiResponse([]));

    render(
      <BrowserRouter>
        <TrackDetailPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Track')).toBeInTheDocument();
    });
  });

  it('displays artist names with links', async () => {
    vi.spyOn(trackApi, 'getTrackById').mockResolvedValue(mockApiResponse(mockApiTracks[0]));
    vi.spyOn(trackApi, 'getLyricsByTrackId').mockResolvedValue({ success: true, data: undefined, timestamp: '' });
    vi.spyOn(trackApi, 'getSimilarTracks').mockResolvedValue(mockApiResponse([]));

    render(
      <BrowserRouter>
        <TrackDetailPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      const artistLink = screen.getByRole('link', { name: 'Test Artist' });
      expect(artistLink).toHaveAttribute('href', '/artist/test-artist-1');
    });
  });

  it('displays album name with link', async () => {
    vi.spyOn(trackApi, 'getTrackById').mockResolvedValue(mockApiResponse(mockApiTracks[0]));
    vi.spyOn(trackApi, 'getLyricsByTrackId').mockResolvedValue({ success: true, data: undefined, timestamp: '' });
    vi.spyOn(trackApi, 'getSimilarTracks').mockResolvedValue(mockApiResponse([]));

    render(
      <BrowserRouter>
        <TrackDetailPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      const albumLink = screen.getByRole('link', { name: /Test Album/i });
      expect(albumLink).toHaveAttribute('href', '/album/test-album-1');
    });
  });

  it('displays track duration', async () => {
    vi.spyOn(trackApi, 'getTrackById').mockResolvedValue(mockApiResponse(mockApiTracks[0]));
    vi.spyOn(trackApi, 'getLyricsByTrackId').mockResolvedValue({ success: true, data: undefined, timestamp: '' });
    vi.spyOn(trackApi, 'getSimilarTracks').mockResolvedValue(mockApiResponse([]));

    render(
      <BrowserRouter>
        <TrackDetailPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('3:30')).toBeInTheDocument();
    });
  });

  it('displays explicit status', async () => {
    vi.spyOn(trackApi, 'getTrackById').mockResolvedValue(mockApiResponse(mockApiTracks[0]));
    vi.spyOn(trackApi, 'getLyricsByTrackId').mockResolvedValue({ success: true, data: undefined, timestamp: '' });
    vi.spyOn(trackApi, 'getSimilarTracks').mockResolvedValue(mockApiResponse([]));

    render(
      <BrowserRouter>
        <TrackDetailPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('No')).toBeInTheDocument();
    });
  });

  it('displays lyrics when available', async () => {
    const mockLyrics = 'This is a test song\nWith some lyrics';
    vi.spyOn(trackApi, 'getTrackById').mockResolvedValue(mockApiResponse(mockApiTracks[0]));
    vi.spyOn(trackApi, 'getLyricsByTrackId').mockResolvedValue(mockApiResponse(mockLyrics));
    vi.spyOn(trackApi, 'getSimilarTracks').mockResolvedValue(mockApiResponse([]));

    render(
      <BrowserRouter>
        <TrackDetailPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Lyrics')).toBeInTheDocument();
      expect(screen.getByText(mockLyrics)).toBeInTheDocument();
    });
  });

  it('displays message when lyrics not available', async () => {
    vi.spyOn(trackApi, 'getTrackById').mockResolvedValue(mockApiResponse(mockApiTracks[0]));
    vi.spyOn(trackApi, 'getLyricsByTrackId').mockResolvedValue({ success: true, data: undefined, timestamp: '' });
    vi.spyOn(trackApi, 'getSimilarTracks').mockResolvedValue(mockApiResponse([]));

    render(
      <BrowserRouter>
        <TrackDetailPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Lyrics not available for this track')).toBeInTheDocument();
    });
  });

  it('displays similar tracks', async () => {
    vi.spyOn(trackApi, 'getTrackById').mockResolvedValue(mockApiResponse(mockApiTracks[0]));
    vi.spyOn(trackApi, 'getLyricsByTrackId').mockResolvedValue({ success: true, data: undefined, timestamp: '' });
    vi.spyOn(trackApi, 'getSimilarTracks').mockResolvedValue(mockApiResponse([mockApiTracks[1]]));

    render(
      <BrowserRouter>
        <TrackDetailPage />
      </BrowserRouter>
    );

    // Click Audio Analysis tab
    await waitFor(() => {
      const analysisTab = screen.getByRole('button', { name: /audio analysis/i });
      analysisTab.click();
    });

    await waitFor(() => {
      expect(screen.getByText('Similar Tracks')).toBeInTheDocument();
      expect(screen.getByText('Explicit Track')).toBeInTheDocument();
    });
  });

  it('displays audio analysis data', async () => {
    const trackWithFeatures = {
      ...mockApiTracks[0],
      key: 5,
      mode: 1,
      time_signature: 4,
      loudness: -5.2,
      tempo: 120,
      acousticness: 0.1,
      instrumentalness: 0.05,
      liveness: 0.2,
      speechiness: 0.04,
    };

    vi.spyOn(trackApi, 'getTrackById').mockResolvedValue(mockApiResponse(trackWithFeatures));
    vi.spyOn(trackApi, 'getLyricsByTrackId').mockResolvedValue({ success: true, data: undefined, timestamp: '' });
    vi.spyOn(trackApi, 'getSimilarTracks').mockResolvedValue(mockApiResponse([]));

    render(
      <BrowserRouter>
        <TrackDetailPage />
      </BrowserRouter>
    );

    // Click Audio Analysis tab
    await waitFor(() => {
      const analysisTab = screen.getByRole('button', { name: /audio analysis/i });
      analysisTab.click();
    });

    await waitFor(() => {
      expect(screen.getByText('Audio Analysis')).toBeInTheDocument();
      expect(screen.getByText('5')).toBeInTheDocument(); // key
      expect(screen.getByText('Major')).toBeInTheDocument(); // mode
    });
  });

  it('renders error state when track not found', async () => {
    vi.spyOn(trackApi, 'getTrackById').mockResolvedValue({ success: false, data: undefined, timestamp: '' });
    vi.spyOn(trackApi, 'getLyricsByTrackId').mockResolvedValue({ success: true, data: undefined, timestamp: '' });
    vi.spyOn(trackApi, 'getSimilarTracks').mockResolvedValue(mockApiResponse([]));

    render(
      <BrowserRouter>
        <TrackDetailPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Track not found')).toBeInTheDocument();
    });
  });

  it('handles API error gracefully', async () => {
    vi.spyOn(trackApi, 'getTrackById').mockRejectedValue(new Error('Failed to load track details'));

    render(
      <BrowserRouter>
        <TrackDetailPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Failed to load track details/i)).toBeInTheDocument();
    });
  });

  it('displays lyrics tab by default', async () => {
    vi.spyOn(trackApi, 'getTrackById').mockResolvedValue(mockApiResponse(mockApiTracks[0]));
    vi.spyOn(trackApi, 'getLyricsByTrackId').mockResolvedValue(mockApiResponse('Sample lyrics'));
    vi.spyOn(trackApi, 'getSimilarTracks').mockResolvedValue(mockApiResponse([]));

    render(
      <BrowserRouter>
        <TrackDetailPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      const lyricsTab = screen.getByRole('button', { name: /lyrics/i });
      expect(lyricsTab).toHaveClass('border-primary-500');
    });
  });

  it('handles missing audio features gracefully', async () => {
    const trackWithoutFeatures = {
      ...mockApiTracks[0],
      energy: undefined,
      danceability: undefined,
      valence: undefined,
    };

    vi.spyOn(trackApi, 'getTrackById').mockResolvedValue(mockApiResponse(trackWithoutFeatures));
    vi.spyOn(trackApi, 'getLyricsByTrackId').mockResolvedValue({ success: true, data: undefined, timestamp: '' });
    vi.spyOn(trackApi, 'getSimilarTracks').mockResolvedValue(mockApiResponse([]));

    render(
      <BrowserRouter>
        <TrackDetailPage />
      </BrowserRouter>
    );

    // Click Audio Analysis tab
    await waitFor(() => {
      const analysisTab = screen.getByRole('button', { name: /audio analysis/i });
      analysisTab.click();
    });

    await waitFor(() => {
      expect(screen.getAllByText('--').length).toBeGreaterThan(0);
    });
  });

  it('displays message when no similar tracks found', async () => {
    vi.spyOn(trackApi, 'getTrackById').mockResolvedValue(mockApiResponse(mockApiTracks[0]));
    vi.spyOn(trackApi, 'getLyricsByTrackId').mockResolvedValue({ success: true, data: undefined, timestamp: '' });
    vi.spyOn(trackApi, 'getSimilarTracks').mockResolvedValue(mockApiResponse([]));

    render(
      <BrowserRouter>
        <TrackDetailPage />
      </BrowserRouter>
    );

    // Click Audio Analysis tab
    await waitFor(() => {
      const analysisTab = screen.getByRole('button', { name: /audio analysis/i });
      analysisTab.click();
    });

    await waitFor(() => {
      expect(screen.getByText('Similar tracks not available yet')).toBeInTheDocument();
    });
  });
});
