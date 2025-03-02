import React, { InputHTMLAttributes } from 'react';
import styled, { css } from 'styled-components';
import { Theme } from '../styles/theme';

// Custom input sizes
type InputSize = 'sm' | 'md' | 'lg';
type InputVariant = 'default' | 'filled' | 'outlined';

// Extend the HTML input props but omit the size attribute to avoid conflicts
interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  helperText?: string;
  error?: boolean;
  errorText?: string;
  size?: InputSize;
  variant?: InputVariant;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  animationClass?: string;
}

// Props for styled components
interface StyledInputProps {
  $size?: InputSize;
  $variant?: InputVariant;
  $error?: boolean;
  $hasIcon?: boolean;
  $iconPosition?: 'left' | 'right';
}

interface InputContainerProps {
  $fullWidth?: boolean;
}

interface InputLabelProps {
  $error?: boolean;
}

interface IconWrapperProps {
  $position: 'left' | 'right';
}

interface HelperTextProps {
  $error?: boolean;
}

// Styling functions
const getInputSize = (size: InputSize, theme: Theme) => {
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

const getInputVariant = (variant: InputVariant, theme: Theme, error: boolean) => {
  const borderColor = error ? theme.colors.error : theme.colors.lightGray;
  const focusBorderColor = error ? theme.colors.error : theme.colors.primary;
  
  switch (variant) {
    case 'default':
      return css`
        border: 1px solid ${borderColor};
        background-color: ${theme.colors.white};
        
        &:focus {
          border-color: ${focusBorderColor};
          box-shadow: 0 0 0 3px ${error ? 'rgba(220, 53, 69, 0.25)' : 'rgba(74, 124, 89, 0.25)'};
        }
      `;
    case 'filled':
      return css`
        border: 1px solid transparent;
        background-color: ${error ? 'rgba(220, 53, 69, 0.1)' : theme.colors.backgroundAlt};
        
        &:focus {
          border-color: ${focusBorderColor};
          background-color: ${theme.colors.white};
        }
      `;
    case 'outlined':
      return css`
        border: 2px solid ${borderColor};
        background-color: transparent;
        
        &:focus {
          border-color: ${focusBorderColor};
          box-shadow: none;
        }
      `;
    default:
      return css``;
  }
};

// Styled components
const InputContainer = styled.div<InputContainerProps>`
  display: flex;
  flex-direction: column;
  margin-bottom: ${props => props.theme.space[3]};
  width: ${props => props.$fullWidth ? '100%' : 'auto'};
`;

const InputLabel = styled.label<InputLabelProps>`
  margin-bottom: ${props => props.theme.space[1]};
  font-size: ${props => props.theme.fontSizes.sm};
  font-weight: ${props => props.theme.fontWeights.medium};
  color: ${props => props.$error ? props.theme.colors.error : props.theme.colors.text};
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const StyledInput = styled.input<StyledInputProps>`
  width: 100%;
  border-radius: ${props => props.theme.radii.md};
  outline: none;
  transition: all 0.2s ease;
  
  ${props => getInputSize(props.$size || 'md', props.theme)}
  ${props => getInputVariant(props.$variant || 'default', props.theme, !!props.$error)}
  
  padding-left: ${props => props.$hasIcon && props.$iconPosition === 'left' ? '2.5rem' : props.theme.space[3]};
  padding-right: ${props => props.$hasIcon && props.$iconPosition === 'right' ? '2.5rem' : props.theme.space[3]};
  
  &::placeholder {
    color: ${props => props.theme.colors.mediumGray};
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const IconWrapper = styled.div<IconWrapperProps>`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  ${props => props.$position === 'left' ? 'left: 0.75rem;' : 'right: 0.75rem;'}
  color: ${props => props.theme.colors.mediumGray};
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
`;

const HelperText = styled.div<HelperTextProps>`
  font-size: ${props => props.theme.fontSizes.xs};
  margin-top: ${props => props.theme.space[1]};
  color: ${props => props.$error ? props.theme.colors.error : props.theme.colors.mediumGray};
`;

// Component implementation
const Input: React.FC<InputProps> = ({
  type = 'text',
  label,
  helperText,
  error = false,
  errorText,
  size = 'md',
  variant = 'default',
  fullWidth = false,
  icon,
  iconPosition = 'left',
  animationClass,
  className,
  ...props
}) => {
  return (
    <InputContainer $fullWidth={fullWidth} className={animationClass}>
      {label && <InputLabel $error={error}>{label}</InputLabel>}
      <InputWrapper>
        {icon && <IconWrapper $position={iconPosition}>{icon}</IconWrapper>}
        <StyledInput
          type={type}
          $size={size}
          $variant={variant}
          $error={error}
          $hasIcon={!!icon}
          $iconPosition={iconPosition}
          className={className}
          {...props}
        />
      </InputWrapper>
      {(error && errorText) ? (
        <HelperText $error={true}>{errorText}</HelperText>
      ) : helperText ? (
        <HelperText>{helperText}</HelperText>
      ) : null}
    </InputContainer>
  );
};

Input.displayName = 'Input';

export default Input; 