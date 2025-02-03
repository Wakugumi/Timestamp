import { useEffect } from "react";

/**
 * Custom hook to create script tag and append to HTML upon rendering
 * This is necessary since how React works.
 * @returns in return, this remove the script tag
 */
const useScript = (url: string) => {
  useEffect(() => {
    const script = document.createElement("script");

    script.src = url;
    script.async = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [url]);
};

export default useScript;
