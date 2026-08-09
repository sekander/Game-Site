import React, { useState } from 'react';
import styled from 'styled-components';

// --- Styled Components for the entire FAQ Page structure ---

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 40px auto;
  padding: 0 20px;
  font-family: ${({ theme }) => theme.fonts.body};
  border-radius: ${({ theme }) => theme.borderRadius};

  @media (max-width: 767px) {
    margin: 20px auto;
    padding: 0 15px;
  }

  @media (min-width: 768px) and (max-width: 1023px) {
    margin: 30px auto;
    padding: 0 20px;
  }
`;

const FAQHeader = styled.header`
  text-align: left;
  margin-bottom: 30px;
  padding: 20px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  h1 {
    color: ${({ theme }) => theme.colors.primary};
    margin-bottom: 10px;
    font-size: 36px;
    font-weight: 700;
    font-family: ${({ theme }) => theme.fonts.heading};

    @media (max-width: 767px) {
      font-size: 28px;
    }
  }

  p {
    color: ${({ theme }) => theme.colors.text};
    font-size: 16px;

    @media (max-width: 767px) {
      font-size: 14px;
    }
  }
`;

const FAQListSection = styled.section`
  margin-top: 0;
  padding-top: 20px;
`;

const FAQItemWrapper = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  padding: 15px 0;

  &:last-child {
    border-bottom: none;
  }
`;

const FAQQuestion = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  padding: 10px 0;
  font-weight: 600;

  h3 {
    margin: 0;
    color: ${({ theme }) => theme.colors.text};
    font-size: 18px;
    font-weight: inherit;

    @media (max-width: 767px) {
      font-size: 16px;
    }
  }

  span {
    font-size: 20px;
    font-weight: bold;
    color: ${({ theme }) => theme.colors.primary};
    margin-left: 10px;
    user-select: none;
  }
`;

const FAQAnswer = styled.div`
  padding-top: 10px;
  padding-bottom: 10px;
  color: ${({ theme }) => theme.colors.text};
  line-height: 1.6;

  p {
    margin: 0;
    @media (max-width: 767px) {
      font-size: 14px;
    }
  }
`;

const FAQFooterSection = styled.footer`
  text-align: left;
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};

  h2 {
    font-size: 24px;
    color: ${({ theme }) => theme.colors.primary};
    margin-bottom: 10px;
    font-family: ${({ theme }) => theme.fonts.heading};

    @media (max-width: 767px) {
      font-size: 20px;
    }
  }

  p {
    color: ${({ theme }) => theme.colors.text};
    margin-bottom: 0;

    @media (max-width: 767px) {
      font-size: 14px;
    }
  }
`;

// --- New Styled Components for additional sections ---

const SectionWrapper = styled.section`
  background-color: ${({ theme }) => theme.colors.background};
  padding: 40px 30px;
  border-radius: ${({ theme }) => theme.borderRadius};
  margin-top: 60px;
  text-align: center;
  border: 1px solid ${({ theme }) => theme.colors.border}; /* Added border */
  transition: background-color 0.3s ease, border-color 0.3s ease;


  @media (max-width: 767px) {
    padding: 30px 20px;
    margin-top: 40px;
  }

  @media (min-width: 768px) and (max-width: 1023px) {
    padding: 35px 25px;
    margin-top: 50px;
  }
`;

const SectionWrapperJoinUs = styled.section`
  background-color: ${({ theme }) => theme.colors.primary}; /* Use primary for this section */
  color: ${({ theme }) => theme.colors.buttonPrimaryText};
  padding: 40px 30px;
  border-radius: ${({ theme }) => theme.borderRadius};
  margin-top: 60px;
  text-align: center;
  transition: background-color 0.3s ease, color 0.3s ease;

  @media (max-width: 767px) {
    padding: 30px 20px;
    margin-top: 40px;
  }

  @media (min-width: 768px) and (max-width: 1023px) {
    padding: 35px 25px;
    margin-top: 50px;
  }
`;

const SectionTitle = styled.h2`
  font-size: 28px;
  color: inherit; /* Inherit color from parent SectionWrapper */
  margin-bottom: 15px;
  font-weight: 700;
  font-family: ${({ theme }) => theme.fonts.heading};

  @media (max-width: 767px) {
    font-size: 22px;
    margin-bottom: 10px;
  }

  @media (min-width: 768px) and (max-width: 1023px) {
    font-size: 25px;
  }
`;

const SectionDescription = styled.p`
  font-size: 16px;
  color: inherit; /* Inherit color from parent SectionWrapper */
  margin-bottom: 30px;
  line-height: 1.6;

  @media (max-width: 767px) {
    font-size: 14px;
    margin-bottom: 20px;
  }
`;

// Join Us On Our Journey Section
const InputGroup = styled.form`
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 20px;

  @media (max-width: 767px) {
    flex-direction: column;
    gap: 10px;
    button {
      width: 100%;
    }
  }
`;

const FormButton = styled.button`
  padding: 12px 25px;
  border: 1px solid ${({ theme }) => theme.colors.secondary}; /* Use secondary for border */
  border-radius: ${({ theme }) => theme.borderRadius};
  background-color: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.buttonPrimaryText};
    border-color: ${({ theme }) => theme.colors.primary};
  }

  &.primary {
    background-color: ${({ theme }) => theme.colors.buttonPrimaryBg};
    color: ${({ theme }) => theme.colors.buttonPrimaryText};
    border-color: ${({ theme }) => theme.colors.buttonPrimaryBg};

    &:hover {
      background-color: ${({ theme }) => theme.colors.accent};
      border-color: ${({ theme }) => theme.colors.accent};
    }
  }

  @media (max-width: 767px) {
    padding: 10px 20px;
    font-size: 14px;
  }
`;

// Why Choose Threeclipse Studios Section
const ChooseStudioContent = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 30px;
  text-align: left;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
    align-items: center;
  }
`;

const ChooseStudioText = styled.div`
  h3 {
    font-size: 24px;
    color: ${({ theme }) => theme.colors.primary};
    margin-bottom: 15px;
    font-weight: 700;
    font-family: ${({ theme }) => theme.fonts.heading};

    @media (max-width: 767px) {
      font-size: 20px;
    }
  }
  p {
    font-size: 15px;
    color: ${({ theme }) => theme.colors.text};
    line-height: 1.6;
    margin-bottom: 20px;

    @media (max-width: 767px) {
      font-size: 14px;
    }
  }
  a {
    display: inline-block;
    padding: 10px 20px;
    border: 1px solid ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;
    border-radius: ${({ theme }) => theme.borderRadius};
    transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;

    &:hover {
      background-color: ${({ theme }) => theme.colors.primary};
      color: ${({ theme }) => theme.colors.buttonPrimaryText};
    }

    @media (max-width: 767px) {
      padding: 8px 15px;
      font-size: 14px;
    }
  }
`;

const ChooseStudioImagePlaceholder = styled.div`
  width: 100%;
  padding-bottom: 75%;
  background-color: ${({ theme }) => theme.colors.border};
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 50px;
  color: ${({ theme }) => theme.colors.text};
  border-radius: ${({ theme }) => theme.borderRadius};
  transition: background-color 0.3s ease, color 0.3s ease;

  @media (max-width: 767px) {
    font-size: 30px;
    padding-bottom: 60%;
  }
`;

// Achievements Section
const AchievementsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 30px;
  margin-top: 30px;
  text-align: left;

  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const AchievementsText = styled.div`
  h3 {
    font-size: 24px;
    color: ${({ theme }) => theme.colors.primary};
    margin-bottom: 15px;
    font-weight: 700;
    font-family: ${({ theme }) => theme.fonts.heading};

    @media (max-width: 767px) {
      font-size: 20px;
    }
  }
  p {
    font-size: 15px;
    color: ${({ theme }) => theme.colors.text};
    line-height: 1.6;

    @media (max-width: 767px) {
      font-size: 14px;
    }
  }
`;

const ProgressContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const ProgressBarWrapper = styled.div`
  width: 100%;
`;

const ProgressLabel = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 5px;
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

const ProgressBar = styled.div`
  background-color: ${({ theme }) => theme.colors.border};
  border-radius: 5px;
  height: 10px;
  overflow: hidden;
  transition: background-color 0.3s ease;
`;

const ProgressFill = styled.div`
  background-color: ${({ theme }) => theme.colors.accent};
  height: 100%;
  width: ${props => props.$percentage || 0}%;
  border-radius: 5px;
  transition: background-color 0.3s ease;
`;

// Testimonials Section
const TestimonialsPlaceholder = styled.div`
  min-height: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${({ theme }) => theme.colors.text};
  font-size: 20px;
`;


// --- FAQItem component ---
const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <FAQItemWrapper>
      <FAQQuestion onClick={toggleOpen}>
        <h3>{question}</h3>
        <span>{isOpen ? '∧' : '∨'}</span>
      </FAQQuestion>
      {isOpen && (
        <FAQAnswer>
          <p>{answer}</p>
        </FAQAnswer>
      )}
    </FAQItemWrapper>
  );
};

// --- Main FAQ component ---
const FAQ = () => {
  const faqData = [
    {
      question: 'What is Threeclipse Studios?',
      answer:
        'Threeclipse Studios is a game development company founded on the love for a true gaming experience. Our team is passionate about storytelling and immersed in the gaming industry. We strive to create engaging projects that resonate with players.',
    },
    {
      question: 'How can I join?',
      answer:
        'You can join us by applying through our careers page. We welcome talented individuals who share our passion for gaming. Check out our latest openings for a myriad of opportunities.',
    },
    {
      question: 'What games do you create?',
      answer:
      'We create a variety of genres, including action, adventure, and puzzle games. Our projects emphasize immersive storylines, engaging mechanics, and superb graphics to ensure a memorable experience.',
    },
    {
      question: 'Where can I play?',
      answer:
        'Our games are available on multiple platforms, including PC and consoles. We aim to reach a wide audience to share our creations. Stay tuned for updates on new releases.',
    },
    {
      question: 'How can I contact?',
      answer:
        'You can contact us through our website\'s contact form. We value your feedback and inquiries. Our team will respond as soon as possible.',
    },
  ];

  return (
    <PageContainer>
      <FAQHeader>
        <h1>FAQs</h1>
        <p>Find answers to your most pressing questions about Threeclipse Studios and our projects.</p>
      </FAQHeader>
      <FAQListSection>
        {faqData.map((item, index) => (
          <FAQItem key={index} question={item.question} answer={item.answer} />
        ))}
      </FAQListSection>
      <FAQFooterSection>
        <h2>Still have questions?</h2>
        <p>We're here to help!</p>
      </FAQFooterSection>

      {/* <SectionWrapperJoinUs>
        <SectionTitle>Join Us On Our Journey</SectionTitle>
        <SectionDescription>
          Discover our groundbreaking projects and milestones as we chart our future.
        </SectionDescription>
        <InputGroup>
          <FormButton className="primary">Register</FormButton>
          <FormButton>Learn More</FormButton>
        </InputGroup>
      </SectionWrapperJoinUs>

      <SectionWrapper>
        <ChooseStudioContent>
          <ChooseStudioText>
            <h3>Why Choose Threeclipse Studios <br/> for Your Projects?</h3>
            <p>
              At Threeclipse Studios, we fuse passion with remarkable expertise. Our commitment to innovation
              is matched only by our dedication to crafting unparalleled experiences. We believe that every
              project is a unique masterpiece. Our dedicated team is committed to delivering exceptional results
              that exceed your expectations.
            </p>
            <a href="#">Learn More &gt;</a>
          </ChooseStudioText>
          <ChooseStudioImagePlaceholder>
            📸
          </ChooseStudioImagePlaceholder>
        </ChooseStudioContent>
      </SectionWrapper>

      <SectionWrapper>
        <SectionTitle>Discover Our Impressive Achievements and Milestones at Threeclipse Studios</SectionTitle>
        <AchievementsGrid>
          <AchievementsText>
            <p>
              At Threeclipse Studios, we boast a profound commitment to remarkable outcomes. Our commitment
              to innovation is matched only by our dedication to crafting unparalleled experiences in the gaming industry.
            </p>
          </AchievementsText>
          <ProgressContainer>
            <ProgressBarWrapper>
              <ProgressLabel><span>75%</span> <span>New Projects Initiated</span></ProgressLabel>
              <ProgressBar><ProgressFill $percentage={75} /></ProgressBar>
            </ProgressBarWrapper>
            <ProgressBarWrapper>
              <ProgressLabel><span>100%</span> <span>Client Satisfaction Rate</span></ProgressLabel>
              <ProgressBar><ProgressFill $percentage={100} /></ProgressBar>
            </ProgressBarWrapper>
          </ProgressContainer>
        </AchievementsGrid>
      </SectionWrapper> */}

    </PageContainer>
  );
};

export default FAQ;

