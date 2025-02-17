import { ReactNode } from "react";
interface PageProps {
  children: ReactNode;
  className?: string;
}

/**
 * Page wrapper that returns div element with defined styles to match the app
 * @params {string} className - apply HTML element class attribute
 * @returns {React.FC}
 */
export default function Page({ children, className = "" }: PageProps) {
  const styles = `min-h-lvh max-h-lvh flex text-on-surface p-8 ${className}`;

  return <div className={styles}>{children}</div>;
}
