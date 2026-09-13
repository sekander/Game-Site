// src/pages/ChangeLog.jsx - NO INNER SCROLLBARS
import { useResetKey } from "../hooks/useResetKey";
import React, { useContext, useState } from "react";
import styled from "styled-components";
import StyledMain from "../styles/StyledMain";
import ContentContext from "../contexts/ContentContext";
import { Reveal, StaggerContainer } from "../components/Animations";
import { motion, AnimatePresence } from "framer-motion";

// ===== STYLED COMPONENTS - MOBILE OPTIMIZED =====

const Headline = styled.h2`
  font-size: clamp(2rem, 4vw, 2.5rem);
  font-weight: bold;
  text-align: center;
  line-height: 1.2;
  max-width: 100%;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 1.5rem;
  padding: 0 1rem;

  @media (max-width: 768px) {
    font-size: clamp(1.5rem, 6vw, 1.8rem);
    margin-bottom: 1rem;
  }

  @media (max-width: 480px) {
    font-size: clamp(1.3rem, 7vw, 1.5rem);
    margin-bottom: 0.75rem;
  }
`;

const PageDescription = styled.p`
  text-align: center;
  max-width: 800px;
  margin: 0 auto 2rem auto;
  font-size: clamp(0.95rem, 1.5vw, 1.1rem);
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.text};
  padding: 0 1rem;

  @media (max-width: 768px) {
    font-size: clamp(0.85rem, 2vw, 0.95rem);
    margin: 0 auto 1.5rem auto;
  }

  @media (max-width: 480px) {
    font-size: clamp(0.8rem, 2.5vw, 0.85rem);
    margin: 0 auto 1rem auto;
  }
`;

// ===== ACCORDION STYLES - NO INNER SCROLLBARS =====

const AccordionContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 0 1rem;

  @media (max-width: 768px) {
    gap: 0.6rem;
    padding: 0 0.75rem;
  }

  @media (max-width: 480px) {
    gap: 0.5rem;
    padding: 0 0.5rem;
  }
`;

const AccordionItem = styled(motion.div)`
  background: ${({ theme }) => theme.colors.background || "#1a1a2e"};
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.border || "rgba(255,255,255,0.1)"};
  overflow: visible !important;
  transition: all 0.3s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary || "#e8d5a3"};
  }

  @media (max-width: 768px) {
    border-radius: 10px;
  }

  @media (max-width: 480px) {
    border-radius: 8px;
  }
`;

const AccordionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.25rem;
  cursor: pointer;
  transition: all 0.3s ease;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;

  &:hover {
    background: ${({ theme }) =>
      theme.colors.surface || "rgba(255,255,255,0.03)"};
  }

  &:active {
    transform: scale(0.99);
  }

  @media (max-width: 768px) {
    padding: 0.85rem 1rem;
    gap: 0.6rem;
  }

  @media (max-width: 480px) {
    padding: 0.7rem 0.75rem;
    gap: 0.5rem;
    flex-wrap: wrap;
  }
`;

const AccordionImage = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
  background: ${({ theme }) => theme.colors.surface || "#2a2a4a"};

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  @media (max-width: 768px) {
    width: 45px;
    height: 45px;
  }

  @media (max-width: 480px) {
    width: 40px;
    height: 40px;
    border-radius: 6px;
  }
`;

const AccordionTitleGroup = styled.div`
  flex: 1;
  min-width: 0;

  h3 {
    font-size: clamp(1rem, 1.5vw, 1.1rem);
    font-weight: 600;
    color: ${({ theme }) => theme.colors.primary || "#e8d5a3"};
    margin: 0 0 0.15rem 0;
    word-break: break-word;
  }

  p {
    font-size: clamp(0.75rem, 1vw, 0.85rem);
    color: ${({ theme }) => theme.colors.text || "#8899aa"};
    margin: 0;
    opacity: 0.7;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  @media (max-width: 480px) {
    h3 {
      font-size: clamp(0.85rem, 2vw, 0.95rem);
    }
    p {
      font-size: clamp(0.65rem, 1.5vw, 0.75rem);
      -webkit-line-clamp: 1;
    }
  }
`;

const AccordionBadge = styled.span`
  font-size: clamp(0.6rem, 0.8vw, 0.7rem);
  padding: 0.2rem 0.6rem;
  border-radius: 20px;
  background: ${({ theme }) => theme.colors.primary || "#e8d5a3"}20;
  color: ${({ theme }) => theme.colors.primary || "#e8d5a3"};
  border: 1px solid ${({ theme }) => theme.colors.primary || "#e8d5a3"}40;
  white-space: nowrap;
  flex-shrink: 0;

  @media (max-width: 480px) {
    font-size: 0.55rem;
    padding: 0.15rem 0.5rem;
  }
`;

const AccordionToggle = styled.div`
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.text || "#8899aa"};
  transition: transform 0.3s ease;
  transform: ${({ isOpen }) => (isOpen ? "rotate(180deg)" : "rotate(0deg)")};
  flex-shrink: 0;

  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

// ===== ACCORDION BODY - NO SCROLLBARS EVER =====
const AccordionBody = styled(motion.div)`
  overflow: visible !important;
  max-height: none !important;
  height: auto !important;
`;

const AccordionContent = styled.div`
  padding: 0 1.25rem 1.25rem 1.25rem;
  overflow: visible !important;
  max-height: none !important;

  @media (max-width: 768px) {
    padding: 0 1rem 1rem 1rem;
  }

  @media (max-width: 480px) {
    padding: 0 0.75rem 0.75rem 0.75rem;
  }
`;

// ===== CHANGE LOG ENTRY STYLES =====

const ChangelogEntry = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.colors.border || "rgba(255,255,255,0.05)"};
  padding: 0.75rem 0;

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }

  @media (max-width: 480px) {
    padding: 0.5rem 0;
  }
`;

const ChangelogHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.35rem;
  flex-wrap: wrap;
  gap: 0.3rem;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.15rem;
  }
`;

const ChangelogVersion = styled.span`
  font-size: clamp(0.9rem, 1.2vw, 1rem);
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary || "#e8d5a3"};

  @media (max-width: 480px) {
    font-size: clamp(0.8rem, 2vw, 0.9rem);
  }
`;

const ChangelogDate = styled.span`
  font-size: clamp(0.75rem, 1vw, 0.85rem);
  color: ${({ theme }) => theme.colors.text || "#8899aa"};
  opacity: 0.7;

  @media (max-width: 480px) {
    font-size: clamp(0.65rem, 1.5vw, 0.75rem);
  }
`;

const ChangelogChanges = styled.ul`
  margin: 0.2rem 0 0 0;
  padding-left: 1.25rem;
  overflow: visible !important;

  li {
    font-size: clamp(0.85rem, 1.2vw, 0.95rem);
    line-height: 1.6;
    color: ${({ theme }) => theme.colors.text || "#8899aa"};
    margin-bottom: 0.15rem;
    overflow: visible !important;
    white-space: normal;
    word-wrap: break-word;

    &:last-child {
      margin-bottom: 0;
    }
  }

  @media (max-width: 768px) {
    padding-left: 1rem;

    li {
      font-size: clamp(0.8rem, 1.5vw, 0.9rem);
    }
  }

  @media (max-width: 480px) {
    padding-left: 0.75rem;

    li {
      font-size: clamp(0.7rem, 2vw, 0.8rem);
      line-height: 1.5;
      margin-bottom: 0.1rem;
    }
  }
`;

// ===== EMPTY STATE =====

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem 1.5rem;

  .icon {
    font-size: 3rem;
    margin-bottom: 0.75rem;
    opacity: 0.4;
  }

  h3 {
    color: ${({ theme }) => theme.colors.text || "#8899aa"};
    font-size: 1.2rem;
    margin-bottom: 0.3rem;
  }

  p {
    color: ${({ theme }) => theme.colors.text || "#667a8a"};
    opacity: 0.7;
    font-size: 0.9rem;
  }

  @media (max-width: 480px) {
    padding: 2rem 1rem;

    .icon {
      font-size: 2.5rem;
    }
    h3 {
      font-size: 1rem;
    }
    p {
      font-size: 0.8rem;
    }
  }
`;

// ===== COMPONENT =====

export default function ChangeLog() {
  const resetKey = useResetKey();
  const content = useContext(ContentContext);
  const [openItems, setOpenItems] = useState({});

  // ===== BUILD CHANGE LOG FROM WORDPRESS CONTENT =====
  const buildChangelog = () => {
    const changelogContent = content?.changelog || {};

    if (changelogContent.changelog_json) {
      try {
        const parsedChangelog = JSON.parse(changelogContent.changelog_json);
        if (Array.isArray(parsedChangelog) && parsedChangelog.length > 0) {
          return parsedChangelog.map((item, index) => ({
            id: item.id || index + 1,
            title: item.title || "Project",
            image: item.image || "",
            description: item.description || "",
            changelog: item.changelog || [],
          }));
        }
      } catch (e) {
        console.error("Error parsing changelog JSON:", e);
      }
    }

    // Fallback data
    return [
      {
        id: 1,
        title: "Multi-Player Space Shooter",
        image: "/images/space-shooter.jpg",
        description: "Thrilling Unity multiplayer game with powerups",
        changelog: [
          {
            version: "v2.1.0",
            date: "2024-03-15",
            changes: [
              "Added new powerup: Shield Generator",
              "Fixed networking sync issues",
              "Improved performance on mobile devices",
            ],
          },
          {
            version: "v2.0.0",
            date: "2024-02-01",
            changes: [
              "Complete multiplayer overhaul",
              "Added LAN support",
              "New UI system",
            ],
          },
        ],
      },
      {
        id: 2,
        title: "Contra Remix",
        image: "/images/contra-remix.jpg",
        description: "Side-scrolling action with AI",
        changelog: [
          {
            version: "v1.3.0",
            date: "2024-03-10",
            changes: [
              "Added split-screen multiplayer",
              "New AI behavior patterns",
              "Added 3 new weapons",
            ],
          },
          {
            version: "v1.2.0",
            date: "2024-02-15",
            changes: [
              "Improved enemy AI",
              "Added boss battles",
              "New level designs",
            ],
          },
        ],
      },
      {
        id: 3,
        title: "Colour Memory Master",
        image: "/images/color-memory.jpg",
        description: "Puzzle game on Google Play",
        changelog: [
          {
            version: "v2.2.0",
            date: "2024-03-01",
            changes: [
              "Added new levels (50+)",
              "Improved performance",
              "UI refresh",
            ],
          },
          {
            version: "v2.1.0",
            date: "2024-02-10",
            changes: [
              "Added AdMob integration",
              "New pattern generator",
              "Bug fixes",
            ],
          },
        ],
      },
    ];
  };

  const changelog = buildChangelog();

  const toggleItem = (id) => {
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Date TBD";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (e) {
      return dateString;
    }
  };

  const totalChanges = changelog.reduce(
    (acc, item) => acc + item.changelog.length,
    0,
  );

  return (
    <StyledMain>
      <br />
      <br />
      <Reveal direction="up" delay={0} resetKey={resetKey}>
        <Headline>Change Log</Headline>
      </Reveal>

      <Reveal direction="up" delay={0.1} resetKey={resetKey}>
        <PageDescription>
          Track the latest updates and improvements across all my projects.
          {totalChanges > 0 &&
            ` Total of ${totalChanges} updates across ${changelog.length} projects.`}
        </PageDescription>
      </Reveal>

      {changelog.length === 0 ? (
        <EmptyState>
          <div className="icon">📋</div>
          <h3>No Change Log Entries</h3>
          <p>Check back soon for updates!</p>
        </EmptyState>
      ) : (
        <AccordionContainer>
          {changelog.map((item, index) => (
            <Reveal
              key={item.id}
              direction="up"
              delay={0.05 * index}
              resetKey={resetKey}
            >
              <AccordionItem>
                <AccordionHeader onClick={() => toggleItem(item.id)}>
                  {item.image && (
                    <AccordionImage>
                      <img src={item.image} alt={item.title} loading="lazy" />
                    </AccordionImage>
                  )}
                  <AccordionTitleGroup>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </AccordionTitleGroup>
                  <AccordionBadge>
                    {item.changelog.length} update
                    {item.changelog.length !== 1 ? "s" : ""}
                  </AccordionBadge>
                  <AccordionToggle isOpen={openItems[item.id]}>
                    ▼
                  </AccordionToggle>
                </AccordionHeader>

                <AnimatePresence initial={false}>
                  {openItems[item.id] && (
                    <AccordionBody
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <AccordionContent>
                        {item.changelog.map((entry, idx) => (
                          <ChangelogEntry key={idx}>
                            <ChangelogHeader>
                              <ChangelogVersion>
                                {entry.version}
                              </ChangelogVersion>
                              <ChangelogDate>
                                {entry.date
                                  ? formatDate(entry.date)
                                  : "Date TBD"}
                              </ChangelogDate>
                            </ChangelogHeader>
                            <ChangelogChanges>
                              {entry.changes.map((change, changeIdx) => (
                                <li key={changeIdx}>{change}</li>
                              ))}
                            </ChangelogChanges>
                          </ChangelogEntry>
                        ))}
                      </AccordionContent>
                    </AccordionBody>
                  )}
                </AnimatePresence>
              </AccordionItem>
            </Reveal>
          ))}
        </AccordionContainer>
      )}
    </StyledMain>
  );
}
