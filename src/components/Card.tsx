import React from 'react';
import styled, { css } from 'styled-components';
import { Theme } from '../styles/theme';

type CardVariant = 'default' | 'outlined' | 'elevated';
type CardPadding = 'none' | 'sm' | 'md' | 'lg';

interface CardProps {
  variant?: CardVariant;
  padding?: CardPadding;
  fullWidth?: boolean;
  onClick?: () => void;
  className?: string;
  animationClass?: string;
  children: React.ReactNode;
}

interface CardMediaProps {
  height?: string;
  backgroundImage?: string;
  children?: React.ReactNode;
}

const getCardPadding = (padding: CardPadding, theme: Theme) => {
  switch (padding) {
    case 'none':
      return css`
        padding: 0;
      `;
    case 'sm':
      return css`
        padding: ${theme.space[2]};
      `;
    case 'md':
      return css`
        padding: ${theme.space[4]};
      `;
    case 'lg':
      return css`
        padding: ${theme.space[6]};
      `;
    default:
      return css``;
  }
};

const getCardVariant = (variant: CardVariant, theme: Theme) => {
  switch (variant) {
    case 'default':
      return css`
        background-color: ${theme.colors.white};
        border: none;
      `;
    case 'outlined':
      return css`
        background-color: ${theme.colors.white};
        border: 1px solid ${theme.colors.lightGray};
      `;
    case 'elevated':
      return css`
        background-color: ${theme.colors.white};
        border: none;
        box-shadow: ${theme.shadows.md};
      `;
    default:
      return css``;
  }
};

const StyledCard = styled.div<{
  $variant: CardVariant;
  $padding: CardPadding;
  $fullWidth: boolean;
  $isClickable: boolean;
}>`
  border-radius: ${props => props.theme.radii.md};
  width: ${props => props.$fullWidth ? '100%' : 'auto'};
  overflow: hidden;
  transition: all 0.2s ease;
  
  ${props => getCardVariant(props.$variant, props.theme)}
  ${props => getCardPadding(props.$padding, props.theme)}
  
  ${props => props.$isClickable && css`
    cursor: pointer;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: ${props.theme.shadows.md};
    }
    
    &:active {
      transform: translateY(0);
    }
  `}
`;

const StyledCardHeader = styled.div`
  padding: ${props => props.theme.space[4]};
  border-bottom: 1px solid ${props => props.theme.colors.lightGray};
  font-weight: ${props => props.theme.fontWeights.medium};
`;

const StyledCardFooter = styled.div`
  padding: ${props => props.theme.space[4]};
  border-top: 1px solid ${props => props.theme.colors.lightGray};
  background-color: ${props => props.theme.colors.backgroundAlt};
`;

const StyledCardContent = styled.div`
  padding: ${props => props.theme.space[4]};
`;

const StyledCardMedia = styled.div<{
  $height?: string;
  $backgroundImage?: string;
}>`
  height: ${props => props.$height || '200px'};
  background-image: ${props => props.$backgroundImage ? `url(${props.$backgroundImage})` : 'none'};
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
`;

interface CardHeaderProps {
  children: React.ReactNode;
}

interface CardFooterProps {
  children: React.ReactNode;
}

interface CardContentProps {
  children: React.ReactNode;
}

interface CardComponent extends React.FC<CardProps> {
  Header: React.FC<CardHeaderProps>;
  Footer: React.FC<CardFooterProps>;
  Content: React.FC<CardContentProps>;
  Media: React.FC<CardMediaProps>;
}

const Card: CardComponent = ({
  variant = 'default',
  padding = 'md',
  fullWidth = false,
  onClick,
  className,
  animationClass,
  children,
}) => {
  return (
    <StyledCard
      $variant={variant}
      $padding={padding}
      $fullWidth={fullWidth}
      $isClickable={!!onClick}
      onClick={onClick}
      className={`${animationClass || ''} ${className || ''}`}
    >
      {children}
    </StyledCard>
  );
};

const CardHeader: React.FC<CardHeaderProps> = ({ children }) => {
  return <StyledCardHeader>{children}</StyledCardHeader>;
};

const CardFooter: React.FC<CardFooterProps> = ({ children }) => {
  return <StyledCardFooter>{children}</StyledCardFooter>;
};

const CardContent: React.FC<CardContentProps> = ({ children }) => {
  return <StyledCardContent>{children}</StyledCardContent>;
};

const CardMedia: React.FC<CardMediaProps> = ({ height, backgroundImage, children }) => {
  return (
    <StyledCardMedia $height={height} $backgroundImage={backgroundImage}>
      {children}
    </StyledCardMedia>
  );
};

Card.Header = CardHeader;
Card.Footer = CardFooter;
Card.Content = CardContent;
Card.Media = CardMedia;

export default Card; 