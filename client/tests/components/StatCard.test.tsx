import { describe, it, expect } from 'vitest';
import { render, screen } from '../utils/test-utils';
import { StatCard } from '../../src/components/StatCard';
import { Music } from 'lucide-react';

describe('StatCard', () => {
  it('renders basic stat card with title and value', () => {
    render(
      <StatCard
        icon={<Music data-testid="music-icon" />}
        title="Total Artists"
        value={1234}
      />
    );

    expect(screen.getByText('Total Artists')).toBeInTheDocument();
    expect(screen.getByText('1,234')).toBeInTheDocument();
    expect(screen.getByTestId('music-icon')).toBeInTheDocument();
  });

  it('formats numeric values with commas', () => {
    render(
      <StatCard
        icon={<Music />}
        title="Total Tracks"
        value={1000000}
      />
    );

    expect(screen.getByText('1,000,000')).toBeInTheDocument();
  });

  it('displays string values without formatting', () => {
    render(
      <StatCard
        icon={<Music />}
        title="Status"
        value="Active"
      />
    );

    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('shows positive trend indicator', () => {
    render(
      <StatCard
        icon={<Music />}
        title="Growth"
        value={100}
        trend={{ value: '+12%', isPositive: true }}
      />
    );

    const trendElement = screen.getByText('↑ +12%');
    expect(trendElement).toBeInTheDocument();
    expect(trendElement).toHaveClass('text-green-600');
  });

  it('shows negative trend indicator', () => {
    render(
      <StatCard
        icon={<Music />}
        title="Growth"
        value={100}
        trend={{ value: '-5%', isPositive: false }}
      />
    );

    const trendElement = screen.getByText('↓ -5%');
    expect(trendElement).toBeInTheDocument();
    expect(trendElement).toHaveClass('text-red-600');
  });

  it('displays change text when provided', () => {
    render(
      <StatCard
        icon={<Music />}
        title="Total Artists"
        value={1234}
        change="vs last month"
      />
    );

    expect(screen.getByText('vs last month')).toBeInTheDocument();
  });

  it('renders without optional props', () => {
    render(
      <StatCard
        icon={<Music data-testid="icon" />}
        value={500}
      />
    );

    expect(screen.getByText('500')).toBeInTheDocument();
    expect(screen.getByTestId('icon')).toBeInTheDocument();
    // Should not have title, trend, or change
    expect(screen.queryByText('Total')).not.toBeInTheDocument();
  });

  it('applies custom color class', () => {
    render(
      <StatCard
        icon={<Music data-testid="colored-icon" />}
        title="Custom Color"
        value={100}
        color="blue"
      />
    );

    const iconContainer = screen.getByTestId('colored-icon').parentElement;
    expect(iconContainer).toHaveClass('text-blue-500');
  });

  it('uses default color when not specified', () => {
    render(
      <StatCard
        icon={<Music data-testid="default-icon" />}
        title="Default Color"
        value={100}
      />
    );

    const iconContainer = screen.getByTestId('default-icon').parentElement;
    expect(iconContainer).toHaveClass('text-primary-500');
  });

  it('renders with all props combined', () => {
    render(
      <StatCard
        icon={<Music data-testid="full-icon" />}
        title="Complete Example"
        value={9999}
        trend={{ value: '+20%', isPositive: true }}
        change="from last week"
        color="green"
      />
    );

    expect(screen.getByText('Complete Example')).toBeInTheDocument();
    expect(screen.getByText('9,999')).toBeInTheDocument();
    expect(screen.getByText('↑ +20%')).toBeInTheDocument();
    expect(screen.getByText('from last week')).toBeInTheDocument();
    expect(screen.getByTestId('full-icon')).toBeInTheDocument();
  });
});
