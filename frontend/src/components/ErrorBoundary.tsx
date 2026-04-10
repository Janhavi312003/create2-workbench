import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, message: "" };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message || "Something went wrong." };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("ErrorBoundary:", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#0B0B0F] text-white px-6">
          <h1 className="text-2xl font-bold text-orange-400 mb-4">
            Something went wrong
          </h1>
          <p className="text-gray-300 text-center max-w-lg mb-6">
            {this.state.message}
          </p>
          <button
            type="button"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 font-semibold"
            onClick={() => this.setState({ hasError: false, message: "" })}
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
