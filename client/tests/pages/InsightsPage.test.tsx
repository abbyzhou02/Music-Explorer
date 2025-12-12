import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { InsightsPage } from '../../src/pages/InsightsPage';
import * as insightApi from '../../src/lib/insightApi';
import { mockApiResponse } from '../mocks/mockData';

// Mock recharts
vi.mock('recharts', () => ({
  PieChart: ({ children }: any) => <div data-testid="pie-chart">{children}</div>,
  Pie: ({ children }: any) => <div>{children}</div>,
  Cell: () => <div>Cell</div>,
  ResponsiveContainer: ({ children }: any) => <div>{children}</div>,
  Tooltip: () => <div>Tooltip</div>,
  BarChart: ({ children }: any) => <div data-testid="bar-chart">{children}</div>,
  Bar: () => <div>Bar</div>,
  XAxis: () => <div>XAxis</div>,
  YAxis: () => <div>YAxis</div>,
  CartesianGrid: () => <div>CartesianGrid</div>,
}));

// Mock react-wordcloud
vi.mock('react-wordcloud', () => ({
  default: () => <div data-testid="word-cloud">Word Cloud</div>,
}));

describe('InsightsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders page header', async () => {
    vi.spyOn(insightApi, 'getLoveDistribution').mockResolvedValue(mockApiResponse([]));
    vi.spyOn(insightApi, 'getPopWords').mockResolvedValue(mockApiResponse([]));
    vi.spyOn(insightApi, 'getArtistPopularityGrowth').mockResolvedValue(mockApiResponse([]));
    vi.spyOn(insightApi, 'getArtistEmotionVariety').mockResolvedValue(mockApiResponse([]));

    render(
      <BrowserRouter>
        <InsightsPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Music Insights')).toBeInTheDocument();
    });
  });

  it('displays loading state initially', () => {
    vi.spyOn(insightApi, 'getLoveDistribution').mockImplementation(() => new Promise(() => {}));
    vi.spyOn(insightApi, 'getPopWords').mockImplementation(() => new Promise(() => {}));
    vi.spyOn(insightApi, 'getArtistPopularityGrowth').mockImplementation(() => new Promise(() => {}));
    vi.spyOn(insightApi, 'getArtistEmotionVariety').mockImplementation(() => new Promise(() => {}));
    
    render(
      <BrowserRouter>
        <InsightsPage />
      </BrowserRouter>
    );

    expect(screen.getByText('Loading insights...')).toBeInTheDocument();
  });

  it('renders love distribution chart', async () => {
    const mockLoveData = [
      { emotion: 'Happy', cnt: '100', ratio: '0.5' },
      { emotion: 'Sad', cnt: '50', ratio: '0.25' },
    ];

    vi.spyOn(insightApi, 'getLoveDistribution').mockResolvedValue(mockApiResponse(mockLoveData));
    vi.spyOn(insightApi, 'getPopWords').mockResolvedValue(mockApiResponse([]));
    vi.spyOn(insightApi, 'getArtistPopularityGrowth').mockResolvedValue(mockApiResponse([]));
    vi.spyOn(insightApi, 'getArtistEmotionVariety').mockResolvedValue(mockApiResponse([]));

    render(
      <BrowserRouter>
        <InsightsPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("The Use of 'Love' in Songs")).toBeInTheDocument();
    });
  });

  it('renders word cloud', async () => {
    const mockWords = [
      { word: 'love', cnt: '100' },
      { word: 'heart', cnt: '80' },
    ];

    vi.spyOn(insightApi, 'getLoveDistribution').mockResolvedValue(mockApiResponse([]));
    vi.spyOn(insightApi, 'getPopWords').mockResolvedValue(mockApiResponse(mockWords));
    vi.spyOn(insightApi, 'getArtistPopularityGrowth').mockResolvedValue(mockApiResponse([]));
    vi.spyOn(insightApi, 'getArtistEmotionVariety').mockResolvedValue(mockApiResponse([]));

    render(
      <BrowserRouter>
        <InsightsPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('High-freq Words in City Pop Songs')).toBeInTheDocument();
      expect(screen.getByTestId('word-cloud')).toBeInTheDocument();
    });
  });

  it('renders artist popularity growth section', async () => {
    const mockGrowthData = [
      {
        artist_id: 1,
        artist: 'Test Artist',
        pre_album_id: 1,
        prev_album: 'Old Album',
        prev_release_date: '2020-01-01',
        prev_popularity: '70',
        curr_album_id: 2,
        curr_album: 'New Album',
        curr_release_date: '2021-01-01',
        curr_popularity: '85',
        popularity_growth_ratio: '21.43',
      },
    ];

    vi.spyOn(insightApi, 'getLoveDistribution').mockResolvedValue(mockApiResponse([]));
    vi.spyOn(insightApi, 'getPopWords').mockResolvedValue(mockApiResponse([]));
    vi.spyOn(insightApi, 'getArtistPopularityGrowth').mockResolvedValue(mockApiResponse(mockGrowthData));
    vi.spyOn(insightApi, 'getArtistEmotionVariety').mockResolvedValue(mockApiResponse([]));

    render(
      <BrowserRouter>
        <InsightsPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Fastest Growing Artists')).toBeInTheDocument();
      expect(screen.getByText('Test Artist')).toBeInTheDocument();
      expect(screen.getByText('+21.43%')).toBeInTheDocument();
    });
  });

  it('renders artist emotion variety section', async () => {
    const mockVarietyData = [
      { id: '1', name: 'Artist 1', variety: '0.852' },
      { id: '2', name: 'Artist 2', variety: '0.741' },
    ];

    vi.spyOn(insightApi, 'getLoveDistribution').mockResolvedValue(mockApiResponse([]));
    vi.spyOn(insightApi, 'getPopWords').mockResolvedValue(mockApiResponse([]));
    vi.spyOn(insightApi, 'getArtistPopularityGrowth').mockResolvedValue(mockApiResponse([]));
    vi.spyOn(insightApi, 'getArtistEmotionVariety').mockResolvedValue(mockApiResponse(mockVarietyData));

    render(
      <BrowserRouter>
        <InsightsPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Most Emotionally Diverse Artists')).toBeInTheDocument();
      expect(screen.getByText('Artist 1')).toBeInTheDocument();
      expect(screen.getByText('0.852')).toBeInTheDocument();
    });
  });

  it('handles empty love distribution data', async () => {
    vi.spyOn(insightApi, 'getLoveDistribution').mockResolvedValue(mockApiResponse([]));
    vi.spyOn(insightApi, 'getPopWords').mockResolvedValue(mockApiResponse([]));
    vi.spyOn(insightApi, 'getArtistPopularityGrowth').mockResolvedValue(mockApiResponse([]));
    vi.spyOn(insightApi, 'getArtistEmotionVariety').mockResolvedValue(mockApiResponse([]));

    render(
      <BrowserRouter>
        <InsightsPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("The Use of 'Love' in Songs")).toBeInTheDocument();
    });
  });

  it('handles empty word cloud data', async () => {
    vi.spyOn(insightApi, 'getLoveDistribution').mockResolvedValue(mockApiResponse([]));
    vi.spyOn(insightApi, 'getPopWords').mockResolvedValue(mockApiResponse([]));
    vi.spyOn(insightApi, 'getArtistPopularityGrowth').mockResolvedValue(mockApiResponse([]));
    vi.spyOn(insightApi, 'getArtistEmotionVariety').mockResolvedValue(mockApiResponse([]));

    render(
      <BrowserRouter>
        <InsightsPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('High-freq Words in City Pop Songs')).toBeInTheDocument();
    });
  });

  it('displays message when no popularity growth data', async () => {
    vi.spyOn(insightApi, 'getLoveDistribution').mockResolvedValue(mockApiResponse([]));
    vi.spyOn(insightApi, 'getPopWords').mockResolvedValue(mockApiResponse([]));
    vi.spyOn(insightApi, 'getArtistPopularityGrowth').mockResolvedValue(mockApiResponse([]));
    vi.spyOn(insightApi, 'getArtistEmotionVariety').mockResolvedValue(mockApiResponse([]));

    render(
      <BrowserRouter>
        <InsightsPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('No artist popularity data available')).toBeInTheDocument();
    });
  });

  it('displays message when no emotion variety data', async () => {
    vi.spyOn(insightApi, 'getLoveDistribution').mockResolvedValue(mockApiResponse([]));
    vi.spyOn(insightApi, 'getPopWords').mockResolvedValue(mockApiResponse([]));
    vi.spyOn(insightApi, 'getArtistPopularityGrowth').mockResolvedValue(mockApiResponse([]));
    vi.spyOn(insightApi, 'getArtistEmotionVariety').mockResolvedValue(mockApiResponse([]));

    render(
      <BrowserRouter>
        <InsightsPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('No artist emotion data available')).toBeInTheDocument();
    });
  });

  it('renders coming soon section', async () => {
    vi.spyOn(insightApi, 'getLoveDistribution').mockResolvedValue(mockApiResponse([]));
    vi.spyOn(insightApi, 'getPopWords').mockResolvedValue(mockApiResponse([]));
    vi.spyOn(insightApi, 'getArtistPopularityGrowth').mockResolvedValue(mockApiResponse([]));
    vi.spyOn(insightApi, 'getArtistEmotionVariety').mockResolvedValue(mockApiResponse([]));

    render(
      <BrowserRouter>
        <InsightsPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('More Insights Coming Soon')).toBeInTheDocument();
    });
  });

  it('handles API errors gracefully', async () => {
    vi.spyOn(insightApi, 'getLoveDistribution').mockRejectedValue(new Error('API Error'));
    vi.spyOn(insightApi, 'getPopWords').mockResolvedValue(mockApiResponse([]));
    vi.spyOn(insightApi, 'getArtistPopularityGrowth').mockResolvedValue(mockApiResponse([]));
    vi.spyOn(insightApi, 'getArtistEmotionVariety').mockResolvedValue(mockApiResponse([]));

    render(
      <BrowserRouter>
        <InsightsPage />
      </BrowserRouter>
    );

    // Should still render the page even if one API fails
    await waitFor(() => {
      expect(screen.getByText('Music Insights')).toBeInTheDocument();
    });
  });

  it('converts string numbers to integers for love distribution', async () => {
    const mockLoveData = [
      { emotion: 'Happy', cnt: '100', ratio: '0.5' },
    ];

    vi.spyOn(insightApi, 'getLoveDistribution').mockResolvedValue(mockApiResponse(mockLoveData));
    vi.spyOn(insightApi, 'getPopWords').mockResolvedValue(mockApiResponse([]));
    vi.spyOn(insightApi, 'getArtistPopularityGrowth').mockResolvedValue(mockApiResponse([]));
    vi.spyOn(insightApi, 'getArtistEmotionVariety').mockResolvedValue(mockApiResponse([]));

    render(
      <BrowserRouter>
        <InsightsPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("The Use of 'Love' in Songs")).toBeInTheDocument();
    });
  });

  it('renders artist links in popularity growth section', async () => {
    const mockGrowthData = [
      {
        artist_id: 1,
        artist: 'Test Artist',
        pre_album_id: 1,
        prev_album: 'Old Album',
        prev_release_date: '2020-01-01',
        prev_popularity: '70',
        curr_album_id: 2,
        curr_album: 'New Album',
        curr_release_date: '2021-01-01',
        curr_popularity: '85',
        popularity_growth_ratio: '21.43',
      },
    ];

    vi.spyOn(insightApi, 'getLoveDistribution').mockResolvedValue(mockApiResponse([]));
    vi.spyOn(insightApi, 'getPopWords').mockResolvedValue(mockApiResponse([]));
    vi.spyOn(insightApi, 'getArtistPopularityGrowth').mockResolvedValue(mockApiResponse(mockGrowthData));
    vi.spyOn(insightApi, 'getArtistEmotionVariety').mockResolvedValue(mockApiResponse([]));

    render(
      <BrowserRouter>
        <InsightsPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      const artistLink = screen.getByRole('link', { name: 'Test Artist' });
      expect(artistLink).toHaveAttribute('href', '/artist/1');
    });
  });

  it('renders album links in popularity growth section', async () => {
    const mockGrowthData = [
      {
        artist_id: 1,
        artist: 'Test Artist',
        pre_album_id: 1,
        prev_album: 'Old Album',
        prev_release_date: '2020-01-01',
        prev_popularity: '70',
        curr_album_id: 2,
        curr_album: 'New Album',
        curr_release_date: '2021-01-01',
        curr_popularity: '85',
        popularity_growth_ratio: '21.43',
      },
    ];

    vi.spyOn(insightApi, 'getLoveDistribution').mockResolvedValue(mockApiResponse([]));
    vi.spyOn(insightApi, 'getPopWords').mockResolvedValue(mockApiResponse([]));
    vi.spyOn(insightApi, 'getArtistPopularityGrowth').mockResolvedValue(mockApiResponse(mockGrowthData));
    vi.spyOn(insightApi, 'getArtistEmotionVariety').mockResolvedValue(mockApiResponse([]));

    render(
      <BrowserRouter>
        <InsightsPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      const oldAlbumLink = screen.getByRole('link', { name: /"Old Album"/i });
      expect(oldAlbumLink).toHaveAttribute('href', '/album/1');
      const newAlbumLink = screen.getByRole('link', { name: /"New Album"/i });
      expect(newAlbumLink).toHaveAttribute('href', '/album/2');
    });
  });
});
