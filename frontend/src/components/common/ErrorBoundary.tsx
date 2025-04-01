import { Component, ReactNode } from "react";

type Props = {
  children: ReactNode;
  fallback?: ReactNode;
};

type State = {
  hasError: boolean;
  error?: Error;
};

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: unknown) {
    console.error("💥 Error caught by ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div className="p-6 text-center text-red-400 bg-red-500/10 rounded-lg">
          <h2 className="text-xl font-bold mb-2">Une erreur est survenue</h2>
          <p className="text-sm italic">Merci de réessayer ou de contacter le support.</p>
        </div>
      );
    }

    return this.props.children;
  }
}
