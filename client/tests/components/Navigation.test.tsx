import { describe, it, expect } from 'vitest';
import { render, screen } from '../utils/test-utils';
import { Navigation } from '../../src/components/Navigation';
import { MemoryRouter } from 'react-router-dom';

describe('Navigation', () => {
  it('renders the MusicVista logo and brand name', () => {
    render(<Navigation />);

    expect(screen.getByText('MusicVista')).toBeInTheDocument();
  });

  it('renders all navigation links', () => {
    render(<Navigation />);

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Explore')).toBeInTheDocument();
    expect(screen.getByText('Insights')).toBeInTheDocument();
  });

  it('highlights active link on home page', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Navigation />
      </MemoryRouter>
    );

    const homeLink = screen.getByText('Home').closest('a');
    expect(homeLink).toHaveClass('text-neutral-900');
    expect(homeLink).toHaveClass('font-bold');
  });

  it('highlights active link on explore page', () => {
    render(
      <MemoryRouter initialEntries={['/explore']}>
        <Navigation />
      </MemoryRouter>
    );

    const exploreLink = screen.getByText('Explore').closest('a');
    expect(exploreLink).toHaveClass('text-neutral-900');
    expect(exploreLink).toHaveClass('font-bold');
  });

  it('highlights active link on insights page', () => {
    render(
      <MemoryRouter initialEntries={['/insights']}>
        <Navigation />
      </MemoryRouter>
    );

    const insightsLink = screen.getByText('Insights').closest('a');
    expect(insightsLink).toHaveClass('text-neutral-900');
    expect(insightsLink).toHaveClass('font-bold');
  });

  it('non-active links have correct styling', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Navigation />
      </MemoryRouter>
    );

    const exploreLink = screen.getByText('Explore').closest('a');
    expect(exploreLink).toHaveClass('text-neutral-700');
    expect(exploreLink).not.toHaveClass('font-bold');
  });

  it('logo links to home page', () => {
    render(<Navigation />);

    const logoLink = screen.getByText('MusicVista').closest('a');
    expect(logoLink).toHaveAttribute('href', '/');
  });

  it('home link has correct href', () => {
    render(<Navigation />);

    const homeLink = screen.getByText('Home').closest('a');
    expect(homeLink).toHaveAttribute('href', '/');
  });

  it('explore link has correct href', () => {
    render(<Navigation />);

    const exploreLink = screen.getByText('Explore').closest('a');
    expect(exploreLink).toHaveAttribute('href', '/explore');
  });

  it('insights link has correct href', () => {
    render(<Navigation />);

    const insightsLink = screen.getByText('Insights').closest('a');
    expect(insightsLink).toHaveAttribute('href', '/insights');
  });

  it('renders with sticky positioning', () => {
    render(<Navigation />);

    const nav = screen.getByRole('navigation');
    expect(nav).toHaveClass('sticky');
    expect(nav).toHaveClass('top-0');
    expect(nav).toHaveClass('z-50');
  });

  it('has proper border styling', () => {
    render(<Navigation />);

    const nav = screen.getByRole('navigation');
    expect(nav).toHaveClass('border-b');
    expect(nav).toHaveClass('border-neutral-200');
  });

  it('displays navigation icons correctly', () => {
    render(<Navigation />);

    // Check if SVG icons are present (lucide-react renders SVGs)
    const homeIcon = screen.getByText('Home').previousElementSibling;
    expect(homeIcon).toBeTruthy();

    const exploreIcon = screen.getByText('Explore').previousElementSibling;
    expect(exploreIcon).toBeTruthy();

    const insightsIcon = screen.getByText('Insights').previousElementSibling;
    expect(insightsIcon).toBeTruthy();
  });

  it('navigation is responsive with hidden links on mobile', () => {
    render(<Navigation />);

    const navLinks = screen.getByText('Home').closest('div');
    expect(navLinks).toHaveClass('hidden');
    expect(navLinks).toHaveClass('md:flex');
  });

  it('centers navigation links horizontally', () => {
    render(<Navigation />);

    const navLinks = screen.getByText('Home').closest('div');
    expect(navLinks).toHaveClass('absolute');
    expect(navLinks).toHaveClass('left-1/2');
    expect(navLinks).toHaveClass('-translate-x-1/2');
  });
});
