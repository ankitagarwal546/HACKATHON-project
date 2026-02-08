import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError && this.state.error) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-8 font-mono">
          <h1 className="text-xl font-bold text-red-400 mb-4">Something went wrong</h1>
          <pre className="text-sm text-gray-400 max-w-2xl overflow-auto p-4 bg-white/5 rounded border border-white/10">
            {this.state.error.message}
          </pre>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 px-4 py-2 bg-cyan-500/20 border border-cyan-500/50 text-cyan-400 rounded hover:bg-cyan-500/30"
          >
            Reload page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
