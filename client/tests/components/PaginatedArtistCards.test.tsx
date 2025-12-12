import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { PaginatedArtistCards } from '../../src/components/PaginatedArtistCards';
import { mockArtists } from '../mocks/mockData';

describe('PaginatedArtistCards', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders artist cards', () => {
    render(
      <BrowserRouter>
        <PaginatedArtistCards
          artists={mockArtists}
          currentPage={1}
          totalItems={3}
          itemsPerPage={12}
        />
      </BrowserRouter>
    );

    expect(screen.getByText('Test Artist')).toBeInTheDocument();
    expect(screen.getByText('Another Artist')).toBeInTheDocument();
  });

  it('displays title when provided', () => {
    render(
      <BrowserRouter>
        <PaginatedArtistCards
          artists={mockArtists}
          title="Featured Artists"
          currentPage={1}
          totalItems={3}
          itemsPerPage={12}
        />
      </BrowserRouter>
    );

    expect(screen.getByText('Featured Artists')).toBeInTheDocument();
  });

  it('displays loading skeleton when loading', () => {
    render(
      <BrowserRouter>
        <PaginatedArtistCards
          artists={[]}
          loading={true}
          currentPage={1}
          totalItems={0}
          itemsPerPage={12}
        />
      </BrowserRouter>
    );

    const skeletons = document.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('displays message when no artists found', () => {
    render(
      <BrowserRouter>
        <PaginatedArtistCards
          artists={[]}
          currentPage={1}
          totalItems={0}
          itemsPerPage={12}
        />
      </BrowserRouter>
    );

    expect(screen.getByText('No artists found')).toBeInTheDocument();
  });

  it('renders page size selector', () => {
    render(
      <BrowserRouter>
        <PaginatedArtistCards
          artists={mockArtists}
          currentPage={1}
          totalItems={30}
          itemsPerPage={12}
        />
      </BrowserRouter>
    );

    expect(screen.getByDisplayValue('12')).toBeInTheDocument();
  });

  it('displays page info correctly', () => {
    render(
      <BrowserRouter>
        <PaginatedArtistCards
          artists={mockArtists}
          currentPage={1}
          totalItems={30}
          itemsPerPage={12}
        />
      </BrowserRouter>
    );

    expect(screen.getByText(/Showing 1-12 of 30 artists/i)).toBeInTheDocument();
  });

  it('renders pagination buttons', () => {
    render(
      <BrowserRouter>
        <PaginatedArtistCards
          artists={mockArtists}
          currentPage={1}
          totalItems={30}
          itemsPerPage={12}
        />
      </BrowserRouter>
    );

    expect(screen.getByRole('button', { name: /previous/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();
  });

  it('disables previous button on first page', () => {
    render(
      <BrowserRouter>
        <PaginatedArtistCards
          artists={mockArtists}
          currentPage={1}
          totalItems={30}
          itemsPerPage={12}
        />
      </BrowserRouter>
    );

    const prevButton = screen.getByRole('button', { name: /previous/i });
    expect(prevButton).toBeDisabled();
  });

  it('disables next button on last page', () => {
    render(
      <BrowserRouter>
        <PaginatedArtistCards
          artists={mockArtists}
          currentPage={3}
          totalItems={30}
          itemsPerPage={12}
        />
      </BrowserRouter>
    );

    const nextButton = screen.getByRole('button', { name: /next/i });
    expect(nextButton).toBeDisabled();
  });

  it('calls onPageChange when page number is clicked', () => {
    const handlePageChange = vi.fn();
    
    render(
      <BrowserRouter>
        <PaginatedArtistCards
          artists={mockArtists}
          currentPage={1}
          totalItems={30}
          itemsPerPage={12}
          onPageChange={handlePageChange}
        />
      </BrowserRouter>
    );

    const pageButton = screen.getByRole('button', { name: '2' });
    fireEvent.click(pageButton);

    expect(handlePageChange).toHaveBeenCalledWith(2);
  });

  it('calls onPageChange when next button is clicked', () => {
    const handlePageChange = vi.fn();
    
    render(
      <BrowserRouter>
        <PaginatedArtistCards
          artists={mockArtists}
          currentPage={1}
          totalItems={30}
          itemsPerPage={12}
          onPageChange={handlePageChange}
        />
      </BrowserRouter>
    );

    const nextButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextButton);

    expect(handlePageChange).toHaveBeenCalledWith(2);
  });

  it('calls onPageChange when previous button is clicked', () => {
    const handlePageChange = vi.fn();
    
    render(
      <BrowserRouter>
        <PaginatedArtistCards
          artists={mockArtists}
          currentPage={2}
          totalItems={30}
          itemsPerPage={12}
          onPageChange={handlePageChange}
        />
      </BrowserRouter>
    );

    const prevButton = screen.getByRole('button', { name: /previous/i });
    fireEvent.click(prevButton);

    expect(handlePageChange).toHaveBeenCalledWith(1);
  });

  it('calls onPageSizeChange when page size is changed', () => {
    const handlePageSizeChange = vi.fn();
    
    render(
      <BrowserRouter>
        <PaginatedArtistCards
          artists={mockArtists}
          currentPage={1}
          totalItems={30}
          itemsPerPage={12}
          onPageSizeChange={handlePageSizeChange}
        />
      </BrowserRouter>
    );

    const pageSizeSelect = screen.getByDisplayValue('12');
    fireEvent.change(pageSizeSelect, { target: { value: '24' } });

    expect(handlePageSizeChange).toHaveBeenCalledWith(24);
  });

  it('highlights current page button', () => {
    render(
      <BrowserRouter>
        <PaginatedArtistCards
          artists={mockArtists}
          currentPage={2}
          totalItems={30}
          itemsPerPage={12}
        />
      </BrowserRouter>
    );

    const currentPageButton = screen.getByRole('button', { name: '2' });
    expect(currentPageButton).toHaveClass('bg-primary-500');
  });

  it('renders correct number of page buttons', () => {
    render(
      <BrowserRouter>
        <PaginatedArtistCards
          artists={mockArtists}
          currentPage={1}
          totalItems={60}
          itemsPerPage={12}
        />
      </BrowserRouter>
    );

    // Should show max 5 page buttons
    const pageButtons = screen.getAllByRole('button').filter(btn => 
      !btn.textContent?.includes('Previous') && !btn.textContent?.includes('Next')
    );
    expect(pageButtons.length).toBeLessThanOrEqual(5);
  });

  it('displays correct page info for middle pages', () => {
    render(
      <BrowserRouter>
        <PaginatedArtistCards
          artists={mockArtists}
          currentPage={2}
          totalItems={60}
          itemsPerPage={12}
        />
      </BrowserRouter>
    );

    expect(screen.getByText(/Showing 13-24 of 60 artists/i)).toBeInTheDocument();
  });

  it('handles single page correctly', () => {
    render(
      <BrowserRouter>
        <PaginatedArtistCards
          artists={mockArtists}
          currentPage={1}
          totalItems={3}
          itemsPerPage={12}
        />
      </BrowserRouter>
    );

    // Should not show pagination controls when only 1 page
    expect(screen.queryByRole('button', { name: /previous/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /next/i })).not.toBeInTheDocument();
  });

  it('renders all artist cards in grid layout', () => {
    const { container } = render(
      <BrowserRouter>
        <PaginatedArtistCards
          artists={mockArtists}
          currentPage={1}
          totalItems={3}
          itemsPerPage={12}
        />
      </BrowserRouter>
    );

    const grid = container.querySelector('.grid');
    expect(grid).toBeInTheDocument();
    expect(grid?.children.length).toBe(3);
  });
});
