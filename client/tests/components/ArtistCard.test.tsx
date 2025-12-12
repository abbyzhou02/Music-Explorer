import { describe, it, expect } from 'vitest';
import { render, screen } from '../utils/test-utils';
import { ArtistCard } from '../../src/components/ArtistCard';
import { mockArtist } from '../mocks/mockData';

describe('ArtistCard', () => {
  it('renders artist information correctly', () => {
    render(<ArtistCard artist={mockArtist} />);

    // Check if artist name is displayed
    expect(screen.getByText('Test Artist')).toBeInTheDocument();

    // Check if followers are displayed correctly
    expect(screen.getByText('5.0M followers')).toBeInTheDocument();

    // Check if popularity is displayed
    expect(screen.getByText('85% Popularity')).toBeInTheDocument();
  });

  it('displays genres correctly', () => {
    render(<ArtistCard artist={mockArtist} />);

    // Should display first 2 genres
    expect(screen.getByText('pop')).toBeInTheDocument();
    expect(screen.getByText('rock')).toBeInTheDocument();
  });

  it('renders image with correct src', () => {
    render(<ArtistCard artist={mockArtist} />);

    const img = screen.getByAltText('Test Artist') as HTMLImageElement;
    expect(img).toBeInTheDocument();
    expect(img.src).toContain('example.com/artist.jpg');
  });

  it('uses placeholder image when no urls provided', () => {
    const artistWithoutImage = { ...mockArtist, urls: [] };
    render(<ArtistCard artist={artistWithoutImage} />);

    const img = screen.getByAltText('Test Artist') as HTMLImageElement;
    expect(img.src).toContain('placeholder.jpg');
  });

  it('renders link to artist detail page', () => {
    render(<ArtistCard artist={mockArtist} />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/artist/test-artist-1');
  });

  it('displays only first 2 genres when more than 2 genres exist', () => {
    const artistWithManyGenres = {
      ...mockArtist,
      genres: ['pop', 'rock', 'jazz', 'blues'],
    };
    render(<ArtistCard artist={artistWithManyGenres} />);

    expect(screen.getByText('pop')).toBeInTheDocument();
    expect(screen.getByText('rock')).toBeInTheDocument();
    expect(screen.queryByText('jazz')).not.toBeInTheDocument();
    expect(screen.queryByText('blues')).not.toBeInTheDocument();
  });

  it('renders without genres when none provided', () => {
    const artistWithoutGenres = { ...mockArtist, genres: [] };
    render(<ArtistCard artist={artistWithoutGenres} />);

    expect(screen.getByText('Test Artist')).toBeInTheDocument();
    // Should still render other information
    expect(screen.getByText('5.0M followers')).toBeInTheDocument();
  });

  it('formats followers correctly for different numbers', () => {
    const artist1M = { ...mockArtist, followers: 1234567 };
    const { rerender } = render(<ArtistCard artist={artist1M} />);
    expect(screen.getByText('1.2M followers')).toBeInTheDocument();

    const artist10M = { ...mockArtist, followers: 10500000 };
    rerender(<ArtistCard artist={artist10M} />);
    expect(screen.getByText('10.5M followers')).toBeInTheDocument();
  });

  it('handles missing popularity gracefully', () => {
    const artistWithoutPopularity = { ...mockArtist, popularity: 0 };
    render(<ArtistCard artist={artistWithoutPopularity} />);

    expect(screen.getByText('Test Artist')).toBeInTheDocument();
    // Popularity should still be shown as 0%
    expect(screen.getByText('0% Popularity')).toBeInTheDocument();
  });
});
