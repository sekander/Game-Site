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
  grid-template-columns: 1fr;
  gap: 2rem;
`;

const ContactForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  input, textarea, select {
    padding: 0.8rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
    font-family: inherit;
    width: 100%;
    box-sizing: border-box;
  }
  button {
    padding: 1rem;
    background-color: #0066cc;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.2s;
    width: 100%;
    box-sizing: border-box;
    &:hover {
      background-color: #0052a3;
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
  p {
    margin-bottom: 1em;
  }
  b, strong {
    font-weight: bold;
  }
  @media (max-width: 1023px) {
    transform: translateY(-70px);
  }
`;

const fallbackContent = {
  title: "Contact Us",
  description: "Interested in learning more about Threeclipse? We have a multitude of ways to contact our team.",
  email: "contact@threeclipse.com",
  discord: "https://discord.gg/HjrhyucR7R",
  linkedin: "https://www.linkedin.com/company/threeclipse/",
  phone: "N/A"
};

export default function ContactUs() {
  const resetKey = useResetKey();
  const content = useContext(ContentContext);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [status, setStatus] = useState(null);

  const getField = (key) => {
    return content["contactUs"]?.[key] || fallbackContent[key];
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = {
      access_key: "0043bfb0-11e8-43d0-844c-8a3787915a70",
      name: formData.name,
      email: formData.email,
      subject: formData.subject,
      message: formData.message
    };
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const result = await res.json();
      if (result.success) {
        setStatus("success");
        setFormData({ name: "", email: "", subject: "", message: "" });
        setTimeout(() => setStatus(null), 5000);
      } else {
        setStatus("error");
      }
    } catch (error) {
      setStatus("error");
    }
  };

  return (
    <StyledMain>
      <br /><br />
      <Reveal direction="up" delay={0} resetKey={resetKey}>
        <Headline>{getField("title")}</Headline>
      </Reveal>

      <Reveal direction="up" delay={0.1} resetKey={resetKey}>
        <IntroContent dangerouslySetInnerHTML={{ __html: getField("description") }} />
      </Reveal>

      <ContactGrid>
        <ContactForm onSubmit={handleSubmit}>
          <Reveal direction="up" delay={0.05} resetKey={resetKey}>
            <h3>Send Us a Message</h3>
          </Reveal>

          <StaggerContainer delayChildren={0.06} resetKey={resetKey}>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <select
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
            >
              <option value="">Select a subject</option>
              <option value="Careers">Careers</option>
              <option value="Junior Program">Junior Program</option>
              <option value="Current Project Inquiries">Current Project Inquiries</option>
              <option value="Bug Report">Bug Report</option>
              <option value="Other">Other</option>
            </select>
            <textarea
              rows="5"
              name="message"
              placeholder="Your Message"
              value={formData.message}
              onChange={handleChange}
              required
            />
            <button type="submit">Send Message</button>
          </StaggerContainer>

          {status === "success" && (
            <p style={{ color: "green" }}>✅ Message sent successfully!</p>
          )}
          {status === "error" && (
            <p style={{ color: "red" }}>❌ Something went wrong. Please try again.</p>
          )}
        </ContactForm>
      </ContactGrid>
    </StyledMain>
  );
}

