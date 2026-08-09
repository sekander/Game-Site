import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import StyledMain from "../styles/StyledMain"; // Assuming this path is correct
import ContentContext from "../contexts/ContentContext";

const ResponsiveWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-top: 2rem;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
  }
`;

const Headline = styled.h2`
  font-size: 2.5rem;
  font-weight: bold;
  text-align: left;
  line-height: 1.2;
  max-width: 100%;
  color: ${({ theme }) => theme.colors.primary};

  @media (max-width: 1023px) {
    font-size: 2rem;
    width: auto;
    text-align: center;
  }

  @media (max-width: 767px) {
    font-size: 1.8rem;
  }
`;

const TextBlock = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-width: 0;
`;

const GraphicBlock = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  min-width: 0;
`;

// ✅ Hardcoded transform: translate for the image
const StyledImage = styled.img`
  max-width: 100%;
  height: auto;
  transform: translate(40px, -50px);
  transition: transform 0.3s ease;

  @media (max-width: 768px) {
    transform: translate(40px, -20px);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: row;
  gap: 12px;

  @media (max-width: 767px) {
    flex-direction: column;
    gap: 10px;

    button {
      width: 100%;
    }
  }
`;

const Button = styled.button`
  padding: 10px 20px;
  font-weight: 600;
  border: none;
  cursor: pointer;
  border-radius: ${({ theme }) => theme.borderRadius};
  transition:
    background-color 0.3s ease,
    color 0.3s ease,
    border-color 0.3s ease;

  ${({ variant, theme }) =>
    variant === "filled"
      ? `
    background: ${theme.colors.buttonPrimaryBg};
    color: ${theme.colors.buttonPrimaryText};
    border: 1px solid ${theme.colors.buttonPrimaryBg};
    &:hover {
      background: ${theme.colors.accent};
      border-color: ${theme.colors.accent};
    }
  `
      : `
    background: ${theme.colors.buttonSecondaryBg};
    border: 1px solid ${theme.colors.buttonSecondaryBorder};
    color: ${theme.colors.buttonSecondaryText};
    &:hover {
      background: ${theme.colors.buttonSecondaryBorder};
      color: ${theme.colors.buttonPrimaryText};
    }
  `}
`;

const fallbackContent = {
  about_title: "About Us",
  section_1_title: "Building great experiences",
  section_1_content:
    "Threeclipse Inc. is an indie game development studio dedicated to crafting exceptional games with meaningful stories. Founded in 2025 in Montreal, Canada, we are committed to healthy, sustainable development.",
  section_2_title: null,
  section_2_content:
    "We believe in collaborative growth, respectful communication, and the ethical use of technology. While the studio remains fully remote, we operate as a tight-knit team united by a shared passion for narrative-driven, innovative gameplay experiences.",
  section_3_isGraphic: true,
  aboutimage: {
    url: "https://via.placeholder.com/600x300?text=Hero+Image+Fallback",
  },
};

export default function About() {
  const content = useContext(ContentContext);

  const getField = (key) => {
    const value = content.about?.[key];
    if (value === undefined || value === null || value === "") {
      return fallbackContent[key];
    }
    return value;
  };

  const title = getField("about_title");
  const section1Title = getField("section_1_title");
  const section1Content = getField("section_1_content");
  const section2Title = getField("section_2_title");
  const section2Content = getField("section_2_content");
  const showGraphic = getField("section_3_isGraphic");
  const heroImageUrl =
    getField("aboutimage")?.url || fallbackContent.aboutimage.url;

  const navigate = useNavigate();

  /*
  const handleOurPillarsClick = () => {
    navigate('/about/pillars');
  };

  const handleOurTeamClick = () => {
    navigate('/about/team');
  };
    */

  return (
    <StyledMain>
      <ResponsiveWrapper>
        <TextBlock></TextBlock>

        <GraphicBlock>
          {showGraphic && (
            <div>
              <StyledImage src={heroImageUrl} alt="Hero" />
            </div>
          )}
        </GraphicBlock>
      </ResponsiveWrapper>
    </StyledMain>
  );
}
