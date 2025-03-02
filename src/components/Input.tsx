import React, { forwardRef, InputHTMLAttributes } from 'react';
import styled, { css } from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';

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
const getInputSize = (size: InputSize, theme: any) => {
  switch (size) {
    case 'sm':
      return css`
        padding: ${theme.spacing[1]} ${theme.spacing[2]};
        font-size: ${theme.fontSizes.xs};
      `;
    case 'md':
      return css`
        padding: ${theme.spacing[2]} ${theme.spacing[3]};
        font-size: ${theme.fontSizes.sm};
      `;
    case 'lg':
      return css`
        padding: ${theme.spacing[3]} ${theme.spacing[4]};
        font-size: ${theme.fontSizes.md};
      `;
    default:
      return css``;
  }
};

const getInputVariant = (variant: InputVariant, theme: any, error: boolean) => {
  const errorColor = error ? theme.colors.error : theme.colors.gray[300];
  const focusBorderColor = error ? theme.colors.error : theme.colors.primary;
  
  switch (variant) {
    case 'default':
      return css`
        background-color: ${theme.colors.white};
        border: 1px solid ${errorColor};
        
        &:focus {
          border-color: ${focusBorderColor};
          box-shadow: 0 0 0 3px ${error ? 'rgba(220, 38, 38, 0.1)' : 'rgba(74, 124, 89, 0.1)'};
        }
      `;
    case 'filled':
      return css`
        background-color: ${theme.colors.gray[100]};
        border: 1px solid ${theme.colors.gray[100]};
        
        &:focus {
          background-color: ${theme.colors.white};
          border-color: ${focusBorderColor};
          box-shadow: 0 0 0 3px ${error ? 'rgba(220, 38, 38, 0.1)' : 'rgba(74, 124, 89, 0.1)'};
        }
        
        &:hover:not(:focus):not(:disabled) {
          background-color: ${theme.colors.gray[200]};
        }
      `;
    case 'outlined':
      return css`
        background-color: transparent;
        border: 2px solid ${errorColor};
        
        &:focus {
          border-color: ${focusBorderColor};
          box-shadow: 0 0 0 2px ${error ? 'rgba(220, 38, 38, 0.1)' : 'rgba(74, 124, 89, 0.1)'};
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
  margin-bottom: ${props => props.theme.spacing[3]};
  width: ${props => props.$fullWidth ? '100%' : 'auto'};
`;

const InputLabel = styled.label<InputLabelProps>`
  margin-bottom: ${props => props.theme.spacing[1]};
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
  border-radius: ${props => props.theme.radii.md};
  width: 100%;
  transition: all 0.2s ease;
  outline: none;
  
  ${props => getInputSize(props.$size || 'md', props.theme)}
  ${props => getInputVariant(props.$variant || 'default', props.theme, !!props.$error)}
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  ${props => props.$hasIcon && props.$iconPosition === 'left' && css`
    padding-left: ${props.theme.spacing[8]};
  `}
  
  ${props => props.$hasIcon && props.$iconPosition === 'right' && css`
    padding-right: ${props.theme.spacing[8]};
  `}
`;

const IconWrapper = styled.div<IconWrapperProps>`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  ${props => props.$position === 'left' ? 'left: 12px;' : 'right: 12px;'}
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.colors.gray[500]};
`;

const HelperText = styled.p<HelperTextProps>`
  margin-top: ${props => props.theme.spacing[1]};
  font-size: ${props => props.theme.fontSizes.xs};
  color: ${props => props.$error ? props.theme.colors.error : props.theme.colors.gray[500]};
`;

// Component implementation
const Input = forwardRef<HTMLInputElement, InputProps>(({
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
}, ref) => {
  const theme = useTheme();
  const displayText = error && errorText ? errorText : helperText;
  const hasIcon = !!icon;
  
  return (
    <InputContainer $fullWidth={fullWidth} className={animationClass}>
      {label && <InputLabel $error={error}>{label}</InputLabel>}
      <InputWrapper>
        {icon && (
          <IconWrapper $position={iconPosition}>
            {icon}
          </IconWrapper>
        )}
        <StyledInput
          ref={ref}
          $size={size}
          $variant={variant}
          $error={error}
          $hasIcon={hasIcon}
          $iconPosition={iconPosition}
          className={className}
          {...props}
        />
      </InputWrapper>
      {displayText && <HelperText $error={error}>{displayText}</HelperText>}
    </InputContainer>
  );
});

Input.displayName = 'Input';

export default Input; 