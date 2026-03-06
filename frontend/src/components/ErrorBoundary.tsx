"use client";

import { Component, type ReactNode } from "react";

type Props = { children: ReactNode; fallback?: ReactNode };
type State = { hasError: boolean };

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="flex min-h-[200px] flex-col items-center justify-center p-8 text-center">
            <p className="text-lg font-medium text-red-600 dark:text-red-400">
              Si è verificato un errore.
            </p>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="mt-4 rounded bg-zinc-200 px-4 py-2 text-sm dark:bg-zinc-800"
            >
              Riprova
            </button>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
