// src/components/SimpleLoader.jsx
import React from 'react';
import styled, { keyframes } from 'styled-components';

// Define a simple spin animation
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

// Styled components for the loader
const LoaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 150px; /* Adjust height as needed */
  width: 100%;
  text-align: center;
  padding: 20px;
  box-sizing: border-box; /* Include padding in the width/height */
  color: ${({ theme }) => theme.colors.primary}; /* Use theme primary color for text */
  font-family: ${({ theme }) => theme.fonts.body}; /* Use theme body font */
`;

const Spinner = styled.div`
  border: 4px solid ${({ theme }) => theme.colors.border}; /* Light border from theme */
  border-top: 4px solid ${({ theme }) => theme.colors.accent}; /* Accent color for spinner top */
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: ${spin} 0.8s linear infinite; /* Faster spin */
  margin-bottom: 10px;
`;

const LoadingMessage = styled.p`
  margin: 0;
  font-size: 1rem;
`;

export default function SimpleLoader() {
  return (
    <LoaderContainer>
      <Spinner />
      <LoadingMessage>Loading...</LoadingMessage>
    </LoaderContainer>
  );
}


