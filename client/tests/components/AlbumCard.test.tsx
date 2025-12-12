import { describe, it, expect } from 'vitest';
import { render, screen } from '../utils/test-utils';
import { AlbumCard } from '../../src/components/AlbumCard';
import { mockAlbum, mockAlbums } from '../mocks/mockData';

describe('AlbumCard', () => {
  it('renders album information correctly', () => {
    render(<AlbumCard album={mockAlbum} />);

    // Check if album name is displayed
    expect(screen.getByText('Test Album')).toBeInTheDocument();

    // Check if artist name is displayed
    expect(screen.getByText('Test Artist')).toBeInTheDocument();

    // Check if release year is displayed
    expect(screen.getByText('2023')).toBeInTheDocument();

    // Check if total tracks is displayed
    expect(screen.getByText('12 tracks')).toBeInTheDocument();
  });

  it('renders album cover image', () => {
    render(<AlbumCard album={mockAlbum} />);

    const img = screen.getByAltText('Test Album') as HTMLImageElement;
    expect(img).toBeInTheDocument();
    expect(img.src).toContain('example.com/album.jpg');
  });

  it('renders link to album detail page', () => {
    render(<AlbumCard album={mockAlbum} />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/album/test-album-1');
  });

  it('extracts year from release date correctly', () => {
    const albumWithDifferentYear = {
      ...mockAlbum,
      release_date: '2020-12-25',
    };
    render(<AlbumCard album={albumWithDifferentYear} />);

    expect(screen.getByText('2020')).toBeInTheDocument();
  });

  it('handles single track album', () => {
    const singleAlbum = {
      ...mockAlbum,
      total_tracks: 1,
      album_type: 'single',
    };
    render(<AlbumCard album={singleAlbum} />);

    expect(screen.getByText('1 tracks')).toBeInTheDocument();
  });

  it('displays truncated long album name', () => {
    const longNameAlbum = {
      ...mockAlbum,
      name: 'This is a Very Long Album Name That Should Be Truncated When Displayed',
    };
    render(<AlbumCard album={longNameAlbum} />);

    const heading = screen.getByRole('heading', { level: 3 });
    expect(heading).toHaveClass('truncate');
  });

  it('displays truncated long artist name', () => {
    const longArtistAlbum = {
      ...mockAlbum,
      artist_name: 'This is a Very Long Artist Name That Should Be Truncated',
    };
    render(<AlbumCard album={longArtistAlbum} />);

    const artistText = screen.getByText('This is a Very Long Artist Name That Should Be Truncated');
    expect(artistText).toHaveClass('truncate');
  });

  it('applies hover effects correctly', () => {
    render(<AlbumCard album={mockAlbum} />);

    const card = screen.getByRole('link').parentElement;
    expect(card).toHaveClass('hover:shadow-lg');
    expect(card).toHaveClass('hover:-translate-y-1');
    expect(card).toHaveClass('transition-all');
  });

  it('renders multiple albums correctly', () => {
    const { rerender } = render(<AlbumCard album={mockAlbums[0]} />);
    expect(screen.getByText('Test Album')).toBeInTheDocument();

    rerender(<AlbumCard album={mockAlbums[1]} />);
    expect(screen.getByText('Another Album')).toBeInTheDocument();

    rerender(<AlbumCard album={mockAlbums[2]} />);
    expect(screen.getByText('Single Release')).toBeInTheDocument();
  });

  it('formats track count correctly for various numbers', () => {
    const { rerender } = render(<AlbumCard album={{ ...mockAlbum, total_tracks: 5 }} />);
    expect(screen.getByText('5 tracks')).toBeInTheDocument();

    rerender(<AlbumCard album={{ ...mockAlbum, total_tracks: 20 }} />);
    expect(screen.getByText('20 tracks')).toBeInTheDocument();

    rerender(<AlbumCard album={{ ...mockAlbum, total_tracks: 100 }} />);
    expect(screen.getByText('100 tracks')).toBeInTheDocument();
  });
});
