// src/pages/ContactUs.jsx
import { useResetKey } from "../hooks/useResetKey";
import React, { useContext, useState } from "react";
import styled from "styled-components";
import StyledMain from "../styles/StyledMain";
import ContentContext from "../contexts/ContentContext";
import { Reveal, StaggerContainer } from "../components/Animations";

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
    transform: translateY(-70px);
  }
`;

const ContactGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const ContactInfo = styled.div`
  h3 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: ${({ theme }) => theme.colors.primary};
  }

  p {
    color: ${({ theme }) => theme.colors.text};
    margin: 0.5rem 0;
  }

  a {
    color: ${({ theme }) => theme.colors.link};
    text-decoration: none;
    display: block;
    margin: 0.5rem 0;

    &:hover {
      text-decoration: underline;
    }
  }

  @media (max-width: 1023px) {
    transform: translateY(-70px);
  }
`;

const IntroContent = styled.div`
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 2rem;
  color: ${({ theme }) => theme.colors.text};
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  text-align: center;

  p {
    margin-bottom: 1em;
  }

  b,
  strong {
    font-weight: bold;
  }

  @media (max-width: 1023px) {
    transform: translateY(-70px);
  }
`;

const ContactForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  input,
  textarea,
  select {
    padding: 0.8rem;
    border: 1px solid ${({ theme }) => theme.colors.border || "#ddd"};
    border-radius: 4px;
    font-size: 1rem;
    font-family: inherit;
    width: 100%;
    box-sizing: border-box;
    background-color: ${({ theme }) =>
      theme.colors.background || "rgba(255, 255, 255, 0.05)"};
    color: ${({ theme }) => theme.colors.text || "white"};

    &:focus {
      outline: none;
      border-color: ${({ theme }) => theme.colors.primary || "#ff9564"};
      box-shadow: 0 0 0 2px rgba(255, 149, 100, 0.2);
    }

    &::placeholder {
      color: ${({ theme }) =>
        theme.colors.textSecondary || "rgba(255, 255, 255, 0.5)"};
    }
  }

  label {
    color: ${({ theme }) => theme.colors.primary || "#ff9564"};
    font-weight: 600;
    font-size: 1.1em;
    margin-bottom: 5px;
    display: block;
    text-align: left;
  }

  h3 {
    color: ${({ theme }) => theme.colors.primary};
    margin-bottom: 0.5rem;
    text-align: center;
  }

  @media (max-width: 1023px) {
    transform: translateY(-30px);
  }
`;

const ButtonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-top: 10px;
  justify-items: center;

  @media (max-width: 500px) {
    grid-template-columns: 1fr;
  }
`;

const StyledButton = styled.button`
  padding: 1rem 2rem;
  background-color: ${({ theme }) => theme.colors.primary || "#ff9564"};
  color: white;
  border: 2px solid ${({ theme }) => theme.colors.primary || "#ff9564"};
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.3s ease;
  width: 100%;
  box-sizing: border-box;

  &:hover {
    background-color: ${({ theme }) => theme.colors.accent || "#e68050"};
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(255, 149, 100, 0.3);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
  }

  &.secondary {
    background-color: transparent;
    color: ${({ theme }) => theme.colors.primary || "#ff9564"};

    &:hover {
      background-color: ${({ theme }) => theme.colors.primary || "#ff9564"};
      color: white;
    }
  }
`;

const StatusMessage = styled.p`
  text-align: center;
  font-weight: 500;
  padding: 10px;
  border-radius: 4px;
  margin: 10px 0 0 0;

  &.success {
    color: #4caf50;
    background-color: rgba(76, 175, 80, 0.1);
    border: 1px solid #4caf50;
  }

  &.error {
    color: #f44336;
    background-color: rgba(244, 67, 54, 0.1);
    border: 1px solid #f44336;
  }

  &.info {
    color: #ff9800;
    background-color: rgba(255, 152, 0, 0.1);
    border: 1px solid #ff9800;
  }
`;

const SocialLinks = styled.div`
  margin-top: 1rem;

  h4 {
    color: ${({ theme }) => theme.colors.primary};
    margin-bottom: 0.5rem;
  }
`;

const fallbackContent = {
  title: "Contact Me",
  description:
    "Interested in learning more about my work? We have a multitude of ways to contact our team.",
  email: "sekander@protonmail.com",
  discord: "https://discord.gg/HjrhyucR7R",
  linkedin: "https://www.linkedin.com/company/fnkyg4m3z/",
  phone: "N/A",
};

// API URL - adjust based on environment
const API_URL =
  process.env.NODE_ENV === "production"
    ? "https://sekander.duckdns.org/mx-service/api"
    : "http://localhost:5001/api";

// Web3Forms Access Key
const WEB3FORMS_ACCESS_KEY = "a938a13e-5d63-4e82-837d-943c9e07af43";

export default function ContactUs() {
  const resetKey = useResetKey();
  const content = useContext(ContentContext);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getField = (key) => {
    return content["contactUs"]?.[key] || fallbackContent[key];
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (status) {
      setStatus(null);
      setStatusMessage("");
    }
  };

  const handleClear = () => {
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
    setStatus(null);
    setStatusMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus(null);
    setStatusMessage("");

    // Step 1: Validate email with backend
    setStatus("info");
    setStatusMessage("🔍 Validating your email address...");

    try {
      const validateResponse = await fetch(`${API_URL}/validate-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: formData.email }),
      });

      const validationResult = await validateResponse.json();

      if (!validationResult.valid) {
        setStatus("error");
        setStatusMessage(
          `❌ ${validationResult.message || "Invalid email address"}`,
        );
        setIsSubmitting(false);
        return;
      }

      // Step 2: Email is valid, send to Web3Forms directly
      setStatus("info");
      setStatusMessage("📤 Sending your message...");

      // Create FormData for Web3Forms (client-side)
      const form = new FormData();
      form.append("access_key", WEB3FORMS_ACCESS_KEY);
      form.append("name", formData.name);
      form.append("email", formData.email);
      form.append("subject", formData.subject);
      form.append("message", formData.message);

      const web3Response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: form,
      });

      const web3Result = await web3Response.json();

      if (web3Result.success) {
        setStatus("success");
        setStatusMessage(
          "✅ Message sent successfully! We'll get back to you soon.",
        );
        setFormData({ name: "", email: "", subject: "", message: "" });
        setTimeout(() => {
          setStatus(null);
          setStatusMessage("");
        }, 5000);
      } else {
        setStatus("error");
        setStatusMessage(
          `❌ ${web3Result.message || "Failed to send message"}`,
        );
        setTimeout(() => {
          setStatus(null);
          setStatusMessage("");
        }, 5000);
      }
    } catch (error) {
      console.error("Error:", error);
      setStatus("error");
      setStatusMessage("❌ Network error. Please try again.");
      setTimeout(() => {
        setStatus(null);
        setStatusMessage("");
      }, 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <StyledMain>
      <br />
      <br />
      <Reveal direction="up" delay={0} resetKey={resetKey}>
        <Headline>{getField("title")}</Headline>
      </Reveal>

      <Reveal direction="up" delay={0.1} resetKey={resetKey}>
        <IntroContent>
          <div dangerouslySetInnerHTML={{ __html: getField("description") }} />
          <p style={{ fontSize: "0.9rem", opacity: 0.6 }}>
            ⚡ Your email will be validated before submission
          </p>
        </IntroContent>
      </Reveal>

      <ContactGrid>
        <ContactInfo>
          <h3>Contact Information</h3>
          <p>
            <strong>Email:</strong>{" "}
            <a href={`mailto:${getField("email")}`}>{getField("email")}</a>
          </p>
          <SocialLinks>
            <h4>Connect With Me</h4>
            <a
              href={getField("discord")}
              target="_blank"
              rel="noopener noreferrer"
            >
              💬 Discord
            </a>
            <a
              href={getField("linkedin")}
              target="_blank"
              rel="noopener noreferrer"
            >
              🔗 LinkedIn
            </a>
          </SocialLinks>
        </ContactInfo>

        <ContactForm onSubmit={handleSubmit}>
          <h3>Send Me a Message</h3>

          <div>
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="name@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="subject">Subject</label>
            <input
              type="text"
              id="subject"
              name="subject"
              placeholder="Enter your subject"
              value={formData.subject}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              rows={5}
              placeholder="Your message here..."
              value={formData.message}
              onChange={handleChange}
              required
            />
          </div>

          <ButtonGrid>
            <StyledButton type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Sending..." : "Send Message"}
            </StyledButton>
            <StyledButton
              type="button"
              className="secondary"
              onClick={handleClear}
            >
              Clear Form
            </StyledButton>
          </ButtonGrid>

          {status && statusMessage && (
            <StatusMessage className={status}>{statusMessage}</StatusMessage>
          )}
        </ContactForm>
      </ContactGrid>
    </StyledMain>
  );
}
