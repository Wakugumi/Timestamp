import { Component, ErrorInfo, ReactNode } from "react";
import LoggerService from "../services/LoggerService";
import Page from "./Page";
import Icon from "./Icon";

/**
 * Catches error thrown by this component childrens.
 * Use this as a wrapper to catch errors thrown by the components.
 *
 * @returns {ReactNode} Returns the children node, if catches error, return a fallback UI defined in this function
 */
class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    LoggerService.error("Fatal Error: " + error + errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Page
          className="flex flex-col justify-center items-center gap-12 rounded-xl"
          style={{ backgroundColor: "#ffdad6", color: "#93000a" }}
        >
          <Icon
            type="error"
            className="animate-pulse text-red-200"
            style={{ color: "#93000a" }}
            size="4rem"
          ></Icon>
          <span className="text-xl">
            Our service is unavailable right now, we're very sorry.
          </span>
        </Page>
      );
    }
    return this.props.children;
  }
}
export default ErrorBoundary;
