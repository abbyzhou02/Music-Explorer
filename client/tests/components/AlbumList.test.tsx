import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '../utils/test-utils';
import { AlbumList } from '../../src/components/AlbumList';
import { mockApiAlbums } from '../mocks/mockData';

describe('AlbumList', () => {
  const defaultProps = {
    albums: mockApiAlbums,
    loading: false,
    totalItems: 100,
    currentPage: 1,
    itemsPerPage: 10,
  };

  it('renders album list correctly', () => {
    render(<AlbumList {...defaultProps} />);

    expect(screen.getByText('Albums')).toBeInTheDocument();
    expect(screen.getByText('Test Album')).toBeInTheDocument();
    expect(screen.getByText('Another Album')).toBeInTheDocument();
    expect(screen.getByText('Single Release')).toBeInTheDocument();
  });

  it('displays loading skeletons when loading', () => {
    render(<AlbumList {...defaultProps} loading={true} />);

    const skeletons = document.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('displays empty state when no albums', () => {
    render(<AlbumList {...defaultProps} albums={[]} />);

    expect(screen.getByText('No albums available')).toBeInTheDocument();
  });

  it('renders table headers correctly', () => {
    render(<AlbumList {...defaultProps} />);

    expect(screen.getByText('Cover')).toBeInTheDocument();
    expect(screen.getByText('Album Name')).toBeInTheDocument();
    expect(screen.getByText('Release Date')).toBeInTheDocument();
    expect(screen.getByText('Tracks')).toBeInTheDocument();
    expect(screen.getByText('Popularity')).toBeInTheDocument();
  });

  it('displays album data correctly', () => {
    render(<AlbumList {...defaultProps} />);

    // Check album names
    const albumLink = screen.getByText('Test Album');
    expect(albumLink).toBeInTheDocument();
    expect(albumLink.closest('a')).toHaveAttribute('href', '/album/test-album-1');

    // Check tracks count
    expect(screen.getByText('12')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  it('formats dates correctly', () => {
    render(<AlbumList {...defaultProps} />);

    // Should display formatted date
    expect(screen.getByText(/2023/)).toBeInTheDocument();
  });

  it('displays pagination when totalPages > 1', () => {
    render(<AlbumList {...defaultProps} totalItems={100} itemsPerPage={10} />);

    expect(screen.getByText('Previous')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
    expect(screen.getByText('Showing 1-10 of 100 albums')).toBeInTheDocument();
  });

  it('hides pagination when totalPages <= 1', () => {
    render(<AlbumList {...defaultProps} totalItems={5} itemsPerPage={10} />);

    expect(screen.queryByText('Previous')).not.toBeInTheDocument();
    expect(screen.queryByText('Next')).not.toBeInTheDocument();
  });

  it('handles page change correctly', () => {
    const onPageChange = vi.fn();
    render(
      <AlbumList
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
    render(<AlbumList {...defaultProps} currentPage={1} totalItems={50} />);

    const prevButton = screen.getByText('Previous');
    expect(prevButton).toBeDisabled();
  });

  it('disables Next button on last page', () => {
    render(<AlbumList {...defaultProps} currentPage={10} totalItems={100} itemsPerPage={10} />);

    const nextButton = screen.getByText('Next');
    expect(nextButton).toBeDisabled();
  });

  it('handles page size change', () => {
    const onPageSizeChange = vi.fn();
    render(
      <AlbumList
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
      <AlbumList
        {...defaultProps}
        currentPage={2}
        itemsPerPage={10}
        totalItems={100}
      />
    );

    expect(screen.getByText('Showing 11-20 of 100 albums')).toBeInTheDocument();
  });

  it('highlights current page button', () => {
    render(
      <AlbumList
        {...defaultProps}
        currentPage={2}
        totalItems={100}
        itemsPerPage={10}
      />
    );

    const page2Button = screen.getByText('2');
    expect(page2Button).toHaveClass('bg-primary-500');
  });

  it('renders album covers', () => {
    render(<AlbumList {...defaultProps} />);

    const images = screen.getAllByRole('img');
    expect(images.length).toBeGreaterThan(0);
    expect(images[0]).toHaveAttribute('alt', 'Test Album');
  });

  it('handles albums without cover URLs', () => {
    const albumsWithoutCovers = mockApiAlbums.map(album => ({
      ...album,
      urls: [],
    }));

    render(<AlbumList {...defaultProps} albums={albumsWithoutCovers} />);

    const images = screen.getAllByRole('img');
    images.forEach(img => {
      expect(img).toHaveAttribute('src', '/api/placeholder/56/56');
    });
  });

  it('displays page size selector with correct options', () => {
    render(<AlbumList {...defaultProps} totalItems={100} />);

    const select = screen.getByLabelText('Show:') as HTMLSelectElement;
    const options = Array.from(select.options).map(opt => opt.value);

    expect(options).toContain('5');
    expect(options).toContain('10');
    expect(options).toContain('20');
    expect(options).toContain('50');
  });
});
