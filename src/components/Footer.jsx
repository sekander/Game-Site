import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import ContentContext from '../contexts/ContentContext';

// ===== Styled Components =====
const FooterWrapper = styled.footer`
  background: ${({ theme }) => theme.colors.background};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.text};
  font-size: 14px;
  width: 100%;
  transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
  padding-top: 10px;

  @media (max-width: 767px) {
    padding-top: 30px;
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 1200px;
  margin: auto;
  padding: 0 20px;
  gap: 40px;

  @media (max-width: 767px) {
    padding: 0 15px;
    gap: 30px;
  }
`;

const ContentBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  width: 100%;
  max-width: 600px;

  @media (max-width: 767px) {
    padding-bottom: 30px;
  }
`;

const LogoImage = styled.img`
  width: 400px;
  height: auto;
  margin-bottom: 0px;
  object-fit: contain;

  @media (max-width: 767px) {
    width: 200px;
    margin-bottom: 0px;
  }
`;

const SocialIconsLabel = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 15px;
`;

const SocialIcons = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 30px;
`;

const SocialIconImage = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  cursor: pointer;
  transition: opacity 0.3s ease;

  &:hover {
    opacity: 0.8;
  }

  @media (max-width: 767px) {
    width: 40px;
    height: 40px;
  }
`;

const ContactEmail = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};
  margin-top: 20px;
  margin-bottom: 10px;
`;

const BottomBar = styled.div`
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  padding: 0px;
  text-align: center;
  font-size: 12px;
  color: ${({ theme }) => theme.colors.text};
  transition: border-color 0.3s ease, color 0.3s ease;
  width: 100%;
  padding-bottom: 10px;
`;

const LinkGroup = styled.div`
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;

  a {
    margin: 0 5px;
    color: ${({ theme }) => theme.colors.text};
    text-decoration: none;
    transition: color 0.3s ease;

    &:hover {
      text-decoration: underline;
      color: ${({ theme }) => theme.colors.link};
    }

    @media (max-width: 767px) {
      font-size: 0.75rem;
      margin: 0 3px;
    }
  }
`;

const NavButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  margin: 0;
  color: ${({ theme }) => theme.colors.text};
  font-size: 14px;
  cursor: pointer;
  text-align: center;
  width: fit-content;
  display: block;
  transition: color 0.3s ease;

  &:hover {
    text-decoration: underline;
    color: ${({ theme }) => theme.colors.link};
  }

  @media (max-width: 767px) {
    text-align: center;
    width: 100%;
  }
`;

// Add these styled components for the ticker
const TickerWrapper = styled.div`
  overflow: hidden;
  background: ${({ theme }) => theme.colors.background};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const TickerContent = styled.div`
 display: inline-block;
  white-space: nowrap;
  animation: scroll 180s linear infinite;
  will-change: transform;
  transform: translate3d(0,0,0);
  backface-visibility: hidden;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  &:hover {
    animation-play-state: paused;
  }

  a {
    display: inline-block;
    color: #ff6600; /* solid color */
    margin-right: 80px; /* spacing between items */
    color: ${({ theme }) => theme.colors.link};
    text-decoration: none;
    text-shadow: 0 0 1px rgba(0,0,0,0); /* stabilize color */
    font-weight: 500;

    &:hover {
      text-decoration: underline;
    }
  }

  @keyframes scroll {
    0% {
      transform: translate3d(100%, 0, 0);
    }
    100% {
      transform: translate3d(-100%, 0, 0);
    }
  }
`;


// ===== Fallback Content =====
const fallbackContent = {
  footerlogoimage: { url: 'https://via.placeholder.com/100x100?text=Logo' },
  social1image: { url: 'https://via.placeholder.com/50?text=IG' },
  social2image: { url: 'https://via.placeholder.com/50?text=IN' },
  social3image: { url: 'https://via.placeholder.com/50?text=DC' },
  social_icons_label: 'Follow us',
  email: 'contact@threeclipse.com',
  copyright: '© 2025 Threeclipse. All rights reserved.',
  privacy_policy: 'Privacy Policy',
  terms_of_service: 'Terms of Service',
  cookie_settings: 'Cookie Settings',
};

// ===== Footer Component =====
export default function Footer() {
  const content = useContext(ContentContext);
  const navigate = useNavigate();
  const [items, setItems] = useState([]);

  const getField = (key) => {
    const value = content.footer?.[key];
    return value === undefined || value === null || value === '' ? fallbackContent[key] : value;
  };

  const handlePrivacyClick = () => navigate('/privacy-notice');
  const handleInstagramClick = () => window.open('https://store.steampowered.com/developer/Threeclipse', '_blank');
  const handleLinkedInClick = () => window.open('https://www.linkedin.com/company/threeclipse/', '_blank');
  const handleDiscordClick = () => window.open('https://discord.gg/NpNHBkWqyM', '_blank');

  // ===== Browser-safe RSS fetch using AllOrigins + DOMParser =====
  useEffect(() => {
    const loadRSS = async () => {
      try {
        const rssUrl = "https://feeds.ign.com/ign/all";
        const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(rssUrl)}`);
        const data = await response.json();

        const parser = new DOMParser();
        const xml = parser.parseFromString(data.contents, "text/xml");

        const itemsArray = Array.from(xml.querySelectorAll("item")).map(item => ({
          title: item.querySelector("title")?.textContent || "No title",
          link: item.querySelector("link")?.textContent || "#",
        }));

        setItems(itemsArray);
      } catch (error) {
        console.error("RSS load failed", error);
      }
    };

    loadRSS();
  }, []);

  return (
    <FooterWrapper>
      <Container>
        <ContentBlock>
          {/* Logo Image */}
          <LogoImage src={getField('footerlogoimage').url} alt="Logo" />

          {/* Social Icons */}
          <SocialIconsLabel>{getField('social_icons_label')}</SocialIconsLabel>
          <SocialIcons>
            <SocialIconImage src={getField('social1image').url} alt="Steam" onClick={handleInstagramClick} />
            <SocialIconImage src={getField('social2image').url} alt="LinkedIn" onClick={handleLinkedInClick} />
            <SocialIconImage src={getField('social3image').url} alt="Discord" onClick={handleDiscordClick} />
          </SocialIcons>

          <ContactEmail>Email us at: <a href="mailto:contact@threeclipse.com">contact@threeclipse.com</a></ContactEmail>
        </ContentBlock>

        {/* RSS Feed Ticker */}
        <ContentBlock>
          <h2>Latest News</h2>
          <TickerWrapper>
            <TickerContent>
              {items.map((item, i) => (
                <a 
                  key={i} 
                  href={item.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ color: i % 2 === 0 ? '#ff6600' : '#0099ff' }} // alternating colors
                >
                  {item.title}
                </a>
              ))}
            </TickerContent>
          </TickerWrapper>
        </ContentBlock>

      </Container>

      <BottomBar>
        <p>{getField('copyright')}</p>
        <LinkGroup>
          <NavButton onClick={handlePrivacyClick}>{getField('privacy_policy')}</NavButton>
          {/* <NavButton>{getField('terms_of_service')}</NavButton> */}
          {/* <NavButton>{getField('cookie_settings')}</NavButton> */}
        </LinkGroup>
      </BottomBar>
    </FooterWrapper>
  );
}

