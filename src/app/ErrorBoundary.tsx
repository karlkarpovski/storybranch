// src/app/ErrorBoundary.tsx
import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{
          padding: "2rem",
          fontFamily: "monospace",
          background: "#1a1a2e",
          color: "#ef4444",
          height: "100vh",
          whiteSpace: "pre-wrap",
          overflow: "auto",
        }}>
          <h1 style={{ color: "#a855f7", marginBottom: "1rem" }}>
            StoryBranch — Runtime Error
          </h1>
          <strong>{this.state.error.message}</strong>
          <pre style={{ marginTop: "1rem", color: "#fca5a5", fontSize: "0.8rem" }}>
            {this.state.error.stack}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}