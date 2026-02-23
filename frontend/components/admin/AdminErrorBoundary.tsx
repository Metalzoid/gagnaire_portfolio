"use client";

import { Component } from "react";
import { Button } from "@/components/ui/button";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class AdminErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="admin-error-boundary">
          <h2 className="admin-error-boundary__title">
            Une erreur est survenue
          </h2>
          <p className="admin-error-boundary__message">
            {this.state.error?.message || "Erreur inattendue"}
          </p>
          <Button
            onClick={this.handleReset}
            ariaLabel="Réessayer"
          >
            Réessayer
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
