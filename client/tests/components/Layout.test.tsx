import { describe, it, expect } from 'vitest';
import { render, screen } from '../utils/test-utils';
import { Layout } from '../../src/components/Layout';

describe('Layout', () => {
  it('renders children content', () => {
    render(
      <Layout>
        <div>Test Content</div>
      </Layout>
    );

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('renders Navigation component', () => {
    render(
      <Layout>
        <div>Content</div>
      </Layout>
    );

    // Navigation should be present (check for common navigation elements)
    expect(screen.getByText('MusicVista')).toBeInTheDocument();
  });

  it('renders footer with correct content', () => {
    render(
      <Layout>
        <div>Content</div>
      </Layout>
    );

    // Check footer brand name
    const footerHeadings = screen.getAllByText('MusicVista');
    expect(footerHeadings.length).toBeGreaterThan(0);

    // Check footer description
    expect(screen.getByText('Intelligent Music Discovery and Analysis Platform')).toBeInTheDocument();
  });

  it('displays Quick Links section in footer', () => {
    render(
      <Layout>
        <div>Content</div>
      </Layout>
    );

    expect(screen.getByText('Quick Links')).toBeInTheDocument();
    expect(screen.getByText('About Us')).toBeInTheDocument();
    expect(screen.getByText('Help Center')).toBeInTheDocument();
    expect(screen.getByText('Privacy Policy')).toBeInTheDocument();
  });

  it('displays Contact Us section in footer', () => {
    render(
      <Layout>
        <div>Content</div>
      </Layout>
    );

    expect(screen.getByText('Contact Us')).toBeInTheDocument();
    expect(screen.getByText('support@musicvista.com')).toBeInTheDocument();
  });

  it('displays copyright notice', () => {
    render(
      <Layout>
        <div>Content</div>
      </Layout>
    );

    expect(screen.getByText(/© 2025 MusicVista. All rights reserved./)).toBeInTheDocument();
  });

  it('has correct structure with main element', () => {
    const { container } = render(
      <Layout>
        <div>Main Content</div>
      </Layout>
    );

    const mainElement = container.querySelector('main');
    expect(mainElement).toBeInTheDocument();
    expect(mainElement?.textContent).toContain('Main Content');
  });

  it('applies correct background styling', () => {
    const { container } = render(
      <Layout>
        <div>Content</div>
      </Layout>
    );

    const rootDiv = container.firstChild as HTMLElement;
    expect(rootDiv).toHaveClass('min-h-screen');
    expect(rootDiv).toHaveClass('bg-background');
  });

  it('footer has correct styling', () => {
    const { container } = render(
      <Layout>
        <div>Content</div>
      </Layout>
    );

    const footer = container.querySelector('footer');
    expect(footer).toHaveClass('bg-neutral-900');
    expect(footer).toHaveClass('text-neutral-100');
  });

  it('renders multiple children correctly', () => {
    render(
      <Layout>
        <div>First Section</div>
        <div>Second Section</div>
        <div>Third Section</div>
      </Layout>
    );

    expect(screen.getByText('First Section')).toBeInTheDocument();
    expect(screen.getByText('Second Section')).toBeInTheDocument();
    expect(screen.getByText('Third Section')).toBeInTheDocument();
  });
});
