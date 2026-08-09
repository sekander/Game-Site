import React, { useContext } from 'react';
import styled from 'styled-components';
import StyledMain from '../styles/StyledMain'; // Assuming this path is correct
import ContentContext from '../contexts/ContentContext';

const Container = styled.div`
  max-width: 900px; /* A slightly narrower max-width for policy text */
  margin: 0 auto;
  /* Removed padding here, relying on StyledMain's padding */
`;

const SectionTitle = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
`;

const PrivacySection = styled.div`
  margin-bottom: 2rem;

  h2 {
    font-size: 1.8rem;
    margin-bottom: 1rem;
    color: ${({ theme }) => theme.colors.primary};
  }

  h3 {
    font-size: 1.4rem;
    margin-bottom: 0.8rem;
    color: ${({ theme }) => theme.colors.secondary};
  }

  p {
    margin-bottom: 1rem;
    line-height: 1.6;
  }

  ul {
    margin-bottom: 1rem;
    padding-left: 20px;
  }

  li {
    margin-bottom: 0.5rem;
    line-height: 1.6;
  }
`;
// New Styled Component for the intro text to give it some consistent styling
const IntroContent = styled.div`
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 2rem;

  p {
    margin-bottom: 1em; /* Add spacing between paragraphs if WordPress generates them */
  }

  b, strong {
    font-weight: bold; /* Ensure bolding is applied */
  }
`;

const fallbackContent = {
  title: 'Privacy Notice',
  last_updated: 'January 1, 2025',
  introduction: 'This Privacy Notice describes how Threeclipse Inc. collects, uses, and discloses information when you use our website and services.',
  sections: [
    {
      heading: 'Information We Collect',
      content: 'We collect various types of information in connection with the services, including:\n\n* **Personal Data:** Information that can be used to identify you, such as name, email address, and contact details.\n* **Usage Data:** Information about how you access and use the services, such as your IP address, browser type, and pages visited.'
    },
    {
      heading: 'How We Use Your Information',
      content: 'We use the information we collect for various purposes, including to:\n\n* Provide and maintain our services.\n* Improve, personalize, and expand our services.\n* Communicate with you, including for customer service and marketing purposes.\n* Detect, prevent, and address technical issues.'
    },
    {
      heading: 'Sharing Your Information',
      content: 'We may share your information with third parties only in specific circumstances, such as with your consent, to comply with legal obligations, or with service providers who assist us in operating our services.'
    }
  ]
};

export default function PrivacyNotice() {
  const content = useContext(ContentContext);

  const getField = (key) => {
    const value = content.privacyNotice?.[key];
    return (value === undefined || value === null || value === '')
      ? fallbackContent[key]
      : value;
  };

  const title = getField('title');
  const lastUpdated = getField('lastUpdated');
  const introduction = getField('introduction');
  const sections = getField('sections');

  // Helper to render content that might contain newlines into paragraphs or list items
  const renderContent = (text) => {
    if (!text) return null;
    return text.split('\n\n').map((paragraph, index) => {
      if (paragraph.startsWith('* ')) {
        const listItems = paragraph.split('\n').map((item, liIndex) => (
          <li key={liIndex}>{item.substring(2)}</li>
        ));
        return <ul key={index}>{listItems}</ul>;
      }
      return <p key={index}>{paragraph}</p>;
    });
  };

  return (
    <StyledMain>
      <Container>
        <SectionTitle>{title}</SectionTitle>
        <p>Written July 15th, 2025.</p>
        <p>{lastUpdated}</p>
      <IntroContent dangerouslySetInnerHTML={{ __html: introduction}} />

        {/*
        {sections && sections.map((section, index) => (
          <PrivacySection key={index}>
            <h2>{section.heading}</h2>
            {renderContent(section.content)}
          </PrivacySection>
        ))}
        */}
      </Container>
    </StyledMain>
  );
}

