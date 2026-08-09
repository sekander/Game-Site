import styled from 'styled-components';

const StyledMain = styled.main`
  /* Center the content and limit its max width */
  max-width: 1200px; /* Adjust as per your design's maximum content width */
  margin: 0 auto;    /* Centers the main content area */

  /* Responsive padding to prevent content from touching screen edges */
  padding: 20px; /* Default padding for all sides */
  box-sizing: border-box; /* IMPORTANT: Ensures padding is included in the element's total width */

  /* Adjust padding for smaller screens */
  @media (max-width: 768px) {
    padding: 15px; /* Slightly less padding on tablets/smaller desktops */
  }

  @media (max-width: 480px) {
    padding: 10px; /* Even less padding on very small mobile phones */
  }

  /* Ensure this main content area does not introduce its own horizontal scroll */
  /* While global overflow-x: hidden on html/body is primary, this adds an extra layer */
  overflow-x: hidden;
  width: 100%; /* Ensures it always takes 100% of its parent's width, respecting max-width */
`;

export default StyledMain;

