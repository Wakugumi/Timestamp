import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import ErrorBoundary from "./components/ErrorBoundary.tsx";
import { useEffect, useState } from "react";
import LoggerService from "./services/LoggerService.tsx";

const Root = () => {
  const [key, setKey] = useState(0);
  window.reloadDOMTree = () => setKey((prev) => prev + 1);
  useEffect(() => {
    LoggerService.trace("root key updated to", key.toString());
  }, [key]);
  return (
    <ErrorBoundary>
      <App key={key} />
    </ErrorBoundary>
  );
};

createRoot(document.getElementById("root")!).render(<Root />);
