import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { FatalErrorView } from '@/shell/fatal-error-view';
import type {
  FatalBoundaryProps,
  FatalBoundaryState,
} from './fatal-boundary.interface';
import './fatal-boundary.css';

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

  render(): ReactNode {
    const { error } = this.state;

    if (error) {
      return <FatalErrorView detail={error.message} />;
    }

    return this.props.children;
  }
}
