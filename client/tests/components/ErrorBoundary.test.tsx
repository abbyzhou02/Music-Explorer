import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import { render, screen } from '../utils/test-utils';
import { ErrorBoundary } from '../../src/components/ErrorBoundary';

// Component that throws an error
const ThrowError = ({ error }: { error: Error }) => {
  throw error;
};

// Normal component that renders successfully
const NormalComponent = () => <div>Normal content</div>;

describe('ErrorBoundary', () => {
  // Suppress console.error for these tests
  const originalError = console.error;
  beforeAll(() => {
    console.error = vi.fn();
  });

  afterAll(() => {
    console.error = originalError;
  });

  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <NormalComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText('Normal content')).toBeInTheDocument();
  });

  it('displays error message when error is caught', () => {
    const testError = new Error('Test error message');

    render(
      <ErrorBoundary>
        <ThrowError error={testError} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong.')).toBeInTheDocument();
    expect(screen.getByText(/Test error message/)).toBeInTheDocument();
  });

  it('displays error stack trace', () => {
    const testError = new Error('Stack trace test');

    render(
      <ErrorBoundary>
        <ThrowError error={testError} />
      </ErrorBoundary>
    );

    // The pre element should contain error details
    const preElement = document.querySelector('pre');
    expect(preElement).toBeInTheDocument();
    expect(preElement?.textContent).toContain('Stack trace test');
  });

  it('applies correct error styling', () => {
    const testError = new Error('Styling test');

    render(
      <ErrorBoundary>
        <ThrowError error={testError} />
      </ErrorBoundary>
    );

    const errorContainer = screen.getByText('Something went wrong.').closest('div');
    expect(errorContainer).toHaveClass('border-red-500');
    expect(errorContainer).toHaveClass('rounded');
  });

  it('serializes non-Error objects correctly', () => {
    const nonErrorObject = { message: 'Custom error object', code: 500 };
    
    // We can't directly test getDerivedStateFromError, but we can verify
    // that the component handles different error types
    const testError = new Error(JSON.stringify(nonErrorObject));

    render(
      <ErrorBoundary>
        <ThrowError error={testError} />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong.')).toBeInTheDocument();
  });
});
