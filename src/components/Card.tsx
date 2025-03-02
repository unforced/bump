import React from 'react';
import styled, { css } from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';

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

const getCardPadding = (padding: CardPadding, theme: any) => {
  switch (padding) {
    case 'none':
      return css`
        padding: 0;
      `;
    case 'sm':
      return css`
        padding: ${theme.spacing[2]};
      `;
    case 'md':
      return css`
        padding: ${theme.spacing[4]};
      `;
    case 'lg':
      return css`
        padding: ${theme.spacing[6]};
      `;
    default:
      return css``;
  }
};

const getCardVariant = (variant: CardVariant, theme: any) => {
  switch (variant) {
    case 'default':
      return css`
        background-color: ${theme.colors.white};
        border: none;
        box-shadow: ${theme.shadows.sm};
      `;
    case 'outlined':
      return css`
        background-color: ${theme.colors.white};
        border: 1px solid ${theme.colors.gray[200]};
        box-shadow: none;
      `;
    case 'elevated':
      return css`
        background-color: ${theme.colors.white};
        border: none;
        box-shadow: ${theme.shadows.lg};
      `;
    default:
      return css``;
  }
};

const StyledCard = styled.div<Omit<CardProps, 'children' | 'animationClass'>>`
  border-radius: ${props => props.theme.radii.lg};
  overflow: hidden;
  transition: all 0.3s ease;
  width: ${props => props.fullWidth ? '100%' : 'auto'};
  
  ${props => getCardVariant(props.variant || 'default', props.theme)}
  ${props => getCardPadding(props.padding || 'md', props.theme)}
  
  ${props => props.onClick && css`
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
  padding: ${props => props.theme.spacing[3]} ${props => props.theme.spacing[4]};
  border-bottom: 1px solid ${props => props.theme.colors.gray[200]};
  font-weight: ${props => props.theme.fontWeights.semibold};
  font-size: ${props => props.theme.fontSizes.lg};
`;

const StyledCardFooter = styled.div`
  padding: ${props => props.theme.spacing[3]} ${props => props.theme.spacing[4]};
  border-top: 1px solid ${props => props.theme.colors.gray[200]};
  background-color: ${props => props.theme.colors.gray[50]};
`;

const StyledCardContent = styled.div`
  padding: ${props => props.theme.spacing[4]};
`;

const StyledCardMedia = styled.div<{ height?: string }>`
  width: 100%;
  height: ${props => props.height || '200px'};
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  background-image: ${props => props.style?.backgroundImage || 'none'};
`;

// Define the Card component and its subcomponents
interface CardComponent extends React.FC<CardProps> {
  Header: React.FC<React.PropsWithChildren<{}>>;
  Footer: React.FC<React.PropsWithChildren<{}>>;
  Content: React.FC<React.PropsWithChildren<{}>>;
  Media: React.FC<CardMediaProps>;
}

// Create the main Card component
const Card: CardComponent = ({
  variant = 'default',
  padding = 'md',
  fullWidth = false,
  onClick,
  className,
  animationClass,
  children,
}) => {
  const theme = useTheme();
  
  return (
    <StyledCard
      variant={variant}
      padding={padding}
      fullWidth={fullWidth}
      onClick={onClick}
      className={`${animationClass || ''} ${className || ''}`}
    >
      {children}
    </StyledCard>
  );
};

// Define subcomponents
const CardHeader: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  return <StyledCardHeader>{children}</StyledCardHeader>;
};

const CardFooter: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  return <StyledCardFooter>{children}</StyledCardFooter>;
};

const CardContent: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  return <StyledCardContent>{children}</StyledCardContent>;
};

const CardMedia: React.FC<CardMediaProps> = ({ height, backgroundImage, children }) => {
  const style = backgroundImage ? { backgroundImage: `url(${backgroundImage})` } : undefined;
  
  return (
    <StyledCardMedia height={height} style={style}>
      {children}
    </StyledCardMedia>
  );
};

// Assign subcomponents to Card
Card.Header = CardHeader;
Card.Footer = CardFooter;
Card.Content = CardContent;
Card.Media = CardMedia;

export default Card; 