import { Navigate } from "react-router-dom";

/** Legacy route — redirects old /portfolio URLs to /projects */
export default function PortfolioRedirect() {
  return <Navigate to="/projects" replace />;
}
