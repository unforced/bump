import React, { ButtonHTMLAttributes } from 'react';
import styled, { css } from 'styled-components';
import { Theme } from '../styles/theme';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'text';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  isLoading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  animationClass?: string;
}

const getButtonStyles = (variant: ButtonVariant, theme: Theme) => {
  switch (variant) {
    case 'primary':
      return css`
        background-color: ${theme.colors.primary};
        color: ${theme.colors.white};
        border: none;
        
        &:hover:not(:disabled) {
          background-color: ${theme.colors.primaryDark};
        }
        
        &:active:not(:disabled) {
          background-color: ${theme.colors.primaryDarker};
        }
      `;
    case 'secondary':
      return css`
        background-color: ${theme.colors.secondary};
        color: ${theme.colors.white};
        border: none;
        
        &:hover:not(:disabled) {
          background-color: ${theme.colors.secondaryDark};
        }
        
        &:active:not(:disabled) {
          background-color: ${theme.colors.secondaryDarker};
        }
      `;
    case 'outline':
      return css`
        background-color: transparent;
        color: ${theme.colors.primary};
        border: 2px solid ${theme.colors.primary};
        
        &:hover:not(:disabled) {
          background-color: rgba(74, 124, 89, 0.1);
        }
        
        &:active:not(:disabled) {
          background-color: rgba(74, 124, 89, 0.2);
        }
      `;
    case 'text':
      return css`
        background-color: transparent;
        color: ${theme.colors.primary};
        border: none;
        padding: ${theme.space[1]} ${theme.space[2]};
        
        &:hover:not(:disabled) {
          background-color: rgba(74, 124, 89, 0.1);
        }
        
        &:active:not(:disabled) {
          background-color: rgba(74, 124, 89, 0.2);
        }
      `;
    default:
      return css``;
  }
};

const getButtonSize = (size: ButtonSize, theme: Theme) => {
  switch (size) {
    case 'sm':
      return css`
        padding: ${theme.space[1]} ${theme.space[2]};
        font-size: ${theme.fontSizes.xs};
      `;
    case 'md':
      return css`
        padding: ${theme.space[2]} ${theme.space[3]};
        font-size: ${theme.fontSizes.sm};
      `;
    case 'lg':
      return css`
        padding: ${theme.space[3]} ${theme.space[4]};
        font-size: ${theme.fontSizes.md};
      `;
    default:
      return css``;
  }
};

// Use $-prefixed props (transient props) to prevent them from being passed to the DOM
const StyledButton = styled.button<{
  $variant?: ButtonVariant;
  $size?: ButtonSize;
  $fullWidth?: boolean;
  $iconPosition?: 'left' | 'right';
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${props => props.theme.space[2]};
  border-radius: ${props => props.theme.radii.md};
  font-weight: ${props => props.theme.fontWeights.medium};
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: ${props => props.theme.shadows.sm};
  
  ${props => getButtonStyles(props.$variant || 'primary', props.theme)}
  ${props => getButtonSize(props.$size || 'md', props.theme)}
  
  width: ${props => props.$fullWidth ? '100%' : 'auto'};
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(74, 124, 89, 0.3);
  }
  
  ${props => props.$iconPosition === 'right' && css`
    flex-direction: row-reverse;
  `}
`;

const LoadingSpinner = styled.div`
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: rotate 1s linear infinite;
`;

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  icon,
  iconPosition = 'left',
  animationClass,
  className,
  ...props
}) => {
  return (
    <StyledButton
      $variant={variant}
      $size={size}
      $fullWidth={fullWidth}
      $iconPosition={iconPosition}
      disabled={isLoading || props.disabled}
      className={`${animationClass || ''} ${className || ''}`}
      {...props}
    >
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <>
          {icon && icon}
          {children}
        </>
      )}
    </StyledButton>
  );
};

export default Button; 