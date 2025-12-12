import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '../utils/test-utils';
import { ArtistList } from '../../src/components/ArtistList';
import { mockArtists } from '../mocks/mockData';

describe('ArtistList', () => {
  const defaultProps = {
    artists: mockArtists,
    loading: false,
    totalItems: 100,
    currentPage: 1,
    itemsPerPage: 10,
  };

  it('renders artist list correctly', () => {
    render(<ArtistList {...defaultProps} />);

    expect(screen.getByText('Test Artist')).toBeInTheDocument();
    expect(screen.getByText('Another Artist')).toBeInTheDocument();
    expect(screen.getByText('Third Artist')).toBeInTheDocument();
  });

  it('displays loading skeletons when loading', () => {
    render(<ArtistList {...defaultProps} loading={true} />);

    const skeletons = document.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('displays empty state when no artists', () => {
    render(<ArtistList {...defaultProps} artists={[]} />);

    expect(screen.getByText('No artists available')).toBeInTheDocument();
  });

  it('displays artist genres', () => {
    render(<ArtistList {...defaultProps} />);

    expect(screen.getByText(/pop, rock/i)).toBeInTheDocument();
    expect(screen.getByText(/jazz, blues/i)).toBeInTheDocument();
  });

  it('displays artist popularity', () => {
    render(<ArtistList {...defaultProps} />);

    const popularityLabels = screen.getAllByText('Popularity:');
    expect(popularityLabels.length).toBeGreaterThan(0);
    
    expect(screen.getByText('85')).toBeInTheDocument();
    expect(screen.getByText('75')).toBeInTheDocument();
    expect(screen.getByText('90')).toBeInTheDocument();
  });

  it('displays artist followers with formatting', () => {
    render(<ArtistList {...defaultProps} />);

    const followersLabels = screen.getAllByText('Followers:');
    expect(followersLabels.length).toBeGreaterThan(0);

    // Check for formatted numbers (with commas)
    expect(screen.getByText('5,000,000')).toBeInTheDocument();
    expect(screen.getByText('3,000,000')).toBeInTheDocument();
  });

  it('renders artist images', () => {
    render(<ArtistList {...defaultProps} />);

    const images = screen.getAllByRole('img');
    expect(images.length).toBe(3);
    expect(images[0]).toHaveAttribute('alt', 'Test Artist');
  });

  it('creates links to artist detail pages', () => {
    render(<ArtistList {...defaultProps} />);

    const artistLinks = screen.getAllByRole('link');
    expect(artistLinks[0]).toHaveAttribute('href', '/artist/test-artist-1');
    expect(artistLinks[1]).toHaveAttribute('href', '/artist/test-artist-2');
  });

  it('displays pagination when totalPages > 1', () => {
    render(<ArtistList {...defaultProps} totalItems={100} itemsPerPage={10} />);

    expect(screen.getByText('Previous')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
    expect(screen.getByText('Showing 1-10 of 100 artists')).toBeInTheDocument();
  });

  it('hides pagination when totalPages <= 1', () => {
    render(<ArtistList {...defaultProps} totalItems={5} itemsPerPage={10} />);

    expect(screen.queryByText('Previous')).not.toBeInTheDocument();
    expect(screen.queryByText('Next')).not.toBeInTheDocument();
  });

  it('handles page change correctly', () => {
    const onPageChange = vi.fn();
    render(
      <ArtistList
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
    const onPageChange = vi.fn();
    render(
      <ArtistList
        {...defaultProps}
        currentPage={1}
        totalItems={50}
        onPageChange={onPageChange}
      />
    );

    const prevButton = screen.getByText('Previous');
    expect(prevButton).toBeDisabled();
  });

  it('disables Next button on last page', () => {
    const onPageChange = vi.fn();
    render(
      <ArtistList
        {...defaultProps}
        currentPage={10}
        totalItems={100}
        itemsPerPage={10}
        onPageChange={onPageChange}
      />
    );

    const nextButton = screen.getByText('Next');
    expect(nextButton).toBeDisabled();
  });

  it('handles page size change', () => {
    const onPageSizeChange = vi.fn();
    render(
      <ArtistList
        {...defaultProps}
        totalItems={100}
        onPageSizeChange={onPageSizeChange}
      />
    );

    const select = screen.getByLabelText('Show:');
    fireEvent.change(select, { target: { value: '20' } });

    expect(onPageSizeChange).toHaveBeenCalledWith(20);
  });

  it('truncates long genre lists', () => {
    const artistWithManyGenres = {
      ...mockArtists[0],
      genres: ['genre1', 'genre2', 'genre3', 'genre4', 'genre5'],
    };

    render(<ArtistList {...defaultProps} artists={[artistWithManyGenres]} />);

    expect(screen.getByText(/genre1, genre2, genre3 \+ more/i)).toBeInTheDocument();
  });

  it('handles artists without genres', () => {
    const artistWithoutGenres = {
      ...mockArtists[0],
      genres: undefined,
    };

    render(<ArtistList {...defaultProps} artists={[artistWithoutGenres]} />);

    expect(screen.getByText('Test Artist')).toBeInTheDocument();
    expect(screen.queryByText(/pop/i)).not.toBeInTheDocument();
  });

  it('displays correct page range info', () => {
    render(
      <ArtistList
        {...defaultProps}
        currentPage={2}
        itemsPerPage={10}
        totalItems={100}
      />
    );

    expect(screen.getByText('Showing 11-20 of 100 artists')).toBeInTheDocument();
  });

  it('highlights current page button', () => {
    const onPageChange = vi.fn();
    render(
      <ArtistList
        {...defaultProps}
        currentPage={2}
        totalItems={100}
        itemsPerPage={10}
        onPageChange={onPageChange}
      />
    );

    const page2Button = screen.getByText('2');
    expect(page2Button).toHaveClass('bg-primary-500');
  });
});
