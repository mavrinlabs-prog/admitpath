"use client";

import React from "react";

/**
 * Local client-side error boundary. Wraps a subtree and falls back to
 * `fallback` (or `null`) if any descendant throws during render or commit.
 *
 * Why it exists: the dashboard's segment `error.tsx` catches render errors,
 * but it unmounts the entire dashboard tree and shows the full
 * "Something on our end broke." page. We want finer granularity — if one
 * subcomponent (e.g. an animated grid) blows up on a hydration edge case,
 * we'd rather render a static fallback for that subtree and keep the rest
 * of the dashboard intact.
 *
 * Recovery: pass `recoverable` to show a "Try again" button that resets
 * the boundary state, re-mounting the children. Without `recoverable` the
 * behaviour is unchanged (renders `fallback` or null).
 *
 * React only ships class-component error boundaries — there's no hook
 * equivalent — so this stays a class.
 */
export class ErrorBoundary extends React.Component<
  {
    children: React.ReactNode;
    fallback?: React.ReactNode;
    /** Tag for the console.error line so we can grep prod logs. */
    label?: string;
    /** Show a "Try again" button that re-mounts the children. */
    recoverable?: boolean;
    /** Callback fired when the boundary catches an error. */
    onError?: (error: unknown, info: React.ErrorInfo) => void;
  },
  { hasError: boolean; error: unknown }
> {
  constructor(props: {
    children: React.ReactNode;
    fallback?: React.ReactNode;
    label?: string;
    recoverable?: boolean;
    onError?: (error: unknown, info: React.ErrorInfo) => void;
  }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: unknown) {
    return { hasError: true, error };
  }

  componentDidCatch(error: unknown, info: React.ErrorInfo) {
    console.error(
      `[error-boundary${this.props.label ? `:${this.props.label}` : ""}]`,
      error,
      info?.componentStack,
    );
    this.props.onError?.(error, info);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      // If a custom fallback is provided, use it as-is
      if (this.props.fallback !== undefined) return this.props.fallback;

      // Default recoverable fallback with a retry button
      if (this.props.recoverable) {
        return (
          <div
            role="alert"
            style={{
              padding: "24px",
              textAlign: "center",
              color: "var(--dl-text-secondary, #454B5E)",
              fontSize: "14px",
            }}
          >
            <p
              style={{
                marginBottom: "12px",
                color: "var(--dl-text-primary, #1B2030)",
                fontWeight: 500,
              }}
            >
              We hit a snag
              {this.props.label ? ` loading ${this.props.label}` : ""}.
            </p>
            <button
              type="button"
              onClick={this.handleRetry}
              className="transition-colors hover:bg-[rgba(74,111,165,0.16)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4A6FA5] focus-visible:ring-offset-2"
              style={{
                padding: "6px 16px",
                fontSize: "13px",
                fontWeight: 500,
                color: "#4A6FA5",
                background: "rgba(74,111,165,0.08)",
                border: "1px solid rgba(0,0,0,0.06)",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              Try again
            </button>
          </div>
        );
      }

      return null;
    }
    return this.props.children;
  }
}
