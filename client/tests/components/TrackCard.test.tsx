import { describe, it, expect } from 'vitest';
import { render, screen } from '../utils/test-utils';
import { TrackCard } from '../../src/components/TrackCard';
import { mockTrack, mockTracks } from '../mocks/mockData';

describe('TrackCard', () => {
  it('renders track information correctly', () => {
    render(<TrackCard track={mockTrack} />);

    // Check if track name is displayed
    expect(screen.getByText('Test Track')).toBeInTheDocument();

    // Check if artist name is displayed
    expect(screen.getByText('Test Artist')).toBeInTheDocument();

    // Check if album name is displayed
    expect(screen.getByText('Test Album')).toBeInTheDocument();

    // Check if popularity is displayed
    expect(screen.getByText('85%')).toBeInTheDocument();
  });

  it('formats duration correctly', () => {
    render(<TrackCard track={mockTrack} />);

    // 210000ms = 3:30
    expect(screen.getByText('3:30')).toBeInTheDocument();
  });

  it('formats duration with leading zero for seconds', () => {
    const trackWithShortSeconds = {
      ...mockTrack,
      duration_ms: 125000, // 2:05
    };
    render(<TrackCard track={trackWithShortSeconds} />);

    expect(screen.getByText('2:05')).toBeInTheDocument();
  });

  it('displays explicit indicator for explicit tracks', () => {
    const explicitTrack = mockTracks[1]; // This is an explicit track
    render(<TrackCard track={explicitTrack} />);

    expect(screen.getByText('E')).toBeInTheDocument();
  });

  it('does not display explicit indicator for clean tracks', () => {
    render(<TrackCard track={mockTrack} />);

    expect(screen.queryByText('E')).not.toBeInTheDocument();
  });

  it('displays energy percentage correctly', () => {
    render(<TrackCard track={mockTrack} />);

    // Energy is 0.8 = 80%
    expect(screen.getByText('Energy 80%')).toBeInTheDocument();
  });

  it('displays danceability percentage correctly', () => {
    render(<TrackCard track={mockTrack} />);

    // Danceability is 0.75 = 75%
    expect(screen.getByText('Dance 75%')).toBeInTheDocument();
  });

  it('renders album cover image', () => {
    render(<TrackCard track={mockTrack} />);

    const img = screen.getByAltText('Test Album') as HTMLImageElement;
    expect(img).toBeInTheDocument();
    expect(img.src).toContain('test-album-1');
  });

  it('renders link to track detail page', () => {
    render(<TrackCard track={mockTrack} />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/track/test-track-1');
  });

  it('truncates long track name', () => {
    const longNameTrack = {
      ...mockTrack,
      name: 'This is a Very Long Track Name That Should Be Truncated',
    };
    render(<TrackCard track={longNameTrack} />);

    const heading = screen.getByRole('heading', { level: 3 });
    expect(heading).toHaveClass('truncate');
  });

  it('handles different audio feature values', () => {
    const lowEnergyTrack = {
      ...mockTrack,
      energy: 0.2,
      danceability: 0.3,
    };
    render(<TrackCard track={lowEnergyTrack} />);

    expect(screen.getByText('Energy 20%')).toBeInTheDocument();
    expect(screen.getByText('Dance 30%')).toBeInTheDocument();
  });

  it('handles maximum audio feature values', () => {
    const maxFeaturesTrack = {
      ...mockTrack,
      energy: 1.0,
      danceability: 1.0,
    };
    render(<TrackCard track={maxFeaturesTrack} />);

    expect(screen.getByText('Energy 100%')).toBeInTheDocument();
    expect(screen.getByText('Dance 100%')).toBeInTheDocument();
  });

  it('formats very short duration correctly', () => {
    const shortTrack = {
      ...mockTrack,
      duration_ms: 30000, // 0:30
    };
    render(<TrackCard track={shortTrack} />);

    expect(screen.getByText('0:30')).toBeInTheDocument();
  });

  it('formats long duration correctly', () => {
    const longTrack = {
      ...mockTrack,
      duration_ms: 600000, // 10:00
    };
    render(<TrackCard track={longTrack} />);

    expect(screen.getByText('10:00')).toBeInTheDocument();
  });

  it('applies hover effects correctly', () => {
    render(<TrackCard track={mockTrack} />);

    const card = screen.getByRole('link').parentElement;
    expect(card).toHaveClass('hover:shadow-lg');
    expect(card).toHaveClass('transition-all');
  });

  it('renders multiple tracks correctly', () => {
    const { rerender } = render(<TrackCard track={mockTracks[0]} />);
    expect(screen.getByText('Test Track')).toBeInTheDocument();

    rerender(<TrackCard track={mockTracks[1]} />);
    expect(screen.getByText('Explicit Track')).toBeInTheDocument();

    rerender(<TrackCard track={mockTracks[2]} />);
    expect(screen.getByText('Chill Track')).toBeInTheDocument();
  });
});
