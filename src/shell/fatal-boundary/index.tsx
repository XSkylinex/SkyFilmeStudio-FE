import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { Button } from '@/lib/components/button';
import { ErrorState } from '@/lib/components/error-state';
import type {
  FatalBoundaryProps,
  FatalBoundaryState,
} from './fatal-boundary.interface';
import './fatal-boundary.css';

const FATAL_BOUNDARY_TITLE = 'Local AI Studio hit an unrecoverable error';

export class FatalBoundary extends Component<
  FatalBoundaryProps,
  FatalBoundaryState
> {
  state: FatalBoundaryState = { error: null };

  static getDerivedStateFromError(error: unknown): FatalBoundaryState {
    return {
      error: error instanceof Error ? error : new Error(String(error)),
    };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error(error, info.componentStack);
  }

  private readonly handleReload = (): void => {
    window.location.reload();
  };

  render(): ReactNode {
    const { error } = this.state;

    if (error) {
      return (
        <div className="fatal-boundary">
          <ErrorState
            title={FATAL_BOUNDARY_TITLE}
            description="Reload the app. If this keeps happening, check that the orchestrator is still running."
            detail={error.message}
            action={
              <Button variant="primary" size="md" onClick={this.handleReload}>
                Reload
              </Button>
            }
          />
        </div>
      );
    }

    return this.props.children;
  }
}
