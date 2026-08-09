import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // "document.documentElement.scrollTo(0, 0);" for cross-browser compatibility
    // For modern browsers, window.scrollTo(0, 0) is usually sufficient.
    window.scrollTo(0, 0);
  }, [pathname]); // Re-run effect whenever the pathname changes

    window.scrollTo(0, 0);
    console.log("ScrollToTop triggered for path:", pathname);
  return null; // This component doesn't render anything itself
}

export default ScrollToTop;
