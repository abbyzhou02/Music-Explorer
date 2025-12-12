import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '../utils/test-utils';
import { TrackList } from '../../src/components/TrackList';

describe('TrackList', () => {
  const mockTracks = [
    {
      id: 'track-1',
      name: 'Test Track 1',
      artist_ids: ['artist-1'],
      album_name: 'Test Album',
      duration_ms: 210000, // 3:30
      energy: 0.8,
      danceability: 0.75,
    },
    {
      id: 'track-2',
      name: 'Test Track 2',
      artist_ids: ['artist-2'],
      album_name: 'Another Album',
      duration_ms: 180000, // 3:00
      energy: 0.6,
      danceability: 0.5,
    },
  ];

  const defaultProps = {
    tracks: mockTracks,
    loading: false,
    totalItems: 50,
    currentPage: 1,
    itemsPerPage: 10,
  };

  it('renders track list correctly', () => {
    render(<TrackList {...defaultProps} />);

    expect(screen.getByText('Tracks')).toBeInTheDocument();
    expect(screen.getByText('Test Track 1')).toBeInTheDocument();
    expect(screen.getByText('Test Track 2')).toBeInTheDocument();
  });

  it('displays loading skeletons when loading', () => {
    render(<TrackList {...defaultProps} loading={true} />);

    const skeletons = document.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('displays empty state when no tracks', () => {
    render(<TrackList {...defaultProps} tracks={[]} />);

    expect(screen.getByText('No tracks available')).toBeInTheDocument();
  });

  it('renders table headers correctly', () => {
    render(<TrackList {...defaultProps} />);

    expect(screen.getByText('#')).toBeInTheDocument();
    expect(screen.getByText('Track Name')).toBeInTheDocument();
    expect(screen.getByText('Album')).toBeInTheDocument();
    expect(screen.getByText('Duration')).toBeInTheDocument();
  });

  it('displays track data correctly', () => {
    render(<TrackList {...defaultProps} />);

    // Check track names are links
    const trackLink = screen.getByText('Test Track 1');
    expect(trackLink).toBeInTheDocument();
    expect(trackLink.closest('a')).toHaveAttribute('href', '/track/track-1');

    // Check album names
    expect(screen.getByText('Test Album')).toBeInTheDocument();
    expect(screen.getByText('Another Album')).toBeInTheDocument();
  });

  it('formats duration correctly', () => {
    render(<TrackList {...defaultProps} />);

    expect(screen.getByText('3:30')).toBeInTheDocument();
    expect(screen.getByText('3:00')).toBeInTheDocument();
  });

  it('displays track numbers correctly', () => {
    render(<TrackList {...defaultProps} currentPage={2} itemsPerPage={10} />);

    // On page 2 with 10 items per page, should start at 11
    expect(screen.getByText('11')).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();
  });

  it('displays pagination when totalPages > 1', () => {
    render(<TrackList {...defaultProps} totalItems={100} itemsPerPage={10} />);

    expect(screen.getByText('Previous')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
    expect(screen.getByText('Showing 1-10 of 100 tracks')).toBeInTheDocument();
  });

  it('hides pagination when totalPages <= 1', () => {
    render(<TrackList {...defaultProps} totalItems={5} itemsPerPage={10} />);

    expect(screen.queryByText('Previous')).not.toBeInTheDocument();
    expect(screen.queryByText('Next')).not.toBeInTheDocument();
  });

  it('handles page change correctly', () => {
    const onPageChange = vi.fn();
    render(
      <TrackList
        {...defaultProps}
        totalItems={100}
        itemsPerPage={10}
        currentPage={2}
        onPageChange={onPageChange}
      />
    );

    const nextButton = screen.getByText('Next');
    fireEvent.click(nextButton);

    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it('disables Previous button on first page', () => {
    render(<TrackList {...defaultProps} currentPage={1} totalItems={50} />);

    const prevButton = screen.getByText('Previous');
    expect(prevButton).toBeDisabled();
  });

  it('disables Next button on last page', () => {
    render(<TrackList {...defaultProps} currentPage={5} totalItems={50} itemsPerPage={10} />);

    const nextButton = screen.getByText('Next');
    expect(nextButton).toBeDisabled();
  });

  it('handles page size change', () => {
    const onPageSizeChange = vi.fn();
    render(
      <TrackList
        {...defaultProps}
        totalItems={100}
        onPageSizeChange={onPageSizeChange}
      />
    );

    const select = screen.getByLabelText('Show:');
    fireEvent.change(select, { target: { value: '20' } });

    expect(onPageSizeChange).toHaveBeenCalledWith(20);
  });

  it('displays correct page range info', () => {
    render(
      <TrackList
        {...defaultProps}
        currentPage={2}
        itemsPerPage={10}
        totalItems={50}
      />
    );

    expect(screen.getByText('Showing 11-20 of 50 tracks')).toBeInTheDocument();
  });

  it('highlights current page button', () => {
    render(
      <TrackList
        {...defaultProps}
        currentPage={2}
        totalItems={100}
        itemsPerPage={10}
      />
    );

    const page2Button = screen.getByText('2');
    expect(page2Button).toHaveClass('bg-primary-500');
  });

  it('displays page size selector with correct options', () => {
    render(<TrackList {...defaultProps} totalItems={100} />);

    const select = screen.getByLabelText('Show:') as HTMLSelectElement;
    const options = Array.from(select.options).map(opt => opt.value);

    expect(options).toContain('5');
    expect(options).toContain('10');
    expect(options).toContain('20');
    expect(options).toContain('50');
  });

  it('formats duration with leading zeros for seconds', () => {
    const tracksWithShortDuration = [
      {
        id: 'track-1',
        name: 'Short Track',
        artist_ids: ['artist-1'],
        album_name: 'Test Album',
        duration_ms: 125000, // 2:05
      },
    ];

    render(<TrackList {...defaultProps} tracks={tracksWithShortDuration} />);

    expect(screen.getByText('2:05')).toBeInTheDocument();
  });

  it('handles tracks without duration', () => {
    const tracksWithoutDuration = [
      {
        id: 'track-1',
        name: 'No Duration Track',
        artist_ids: ['artist-1'],
        album_name: 'Test Album',
        duration_ms: 0,
      },
    ];

    render(<TrackList {...defaultProps} tracks={tracksWithoutDuration} />);

    expect(screen.getByText('No Duration Track')).toBeInTheDocument();
  });
});
