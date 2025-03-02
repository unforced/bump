import 'styled-components';
import { Theme } from './theme';

declare module 'styled-components' {
  export interface DefaultTheme extends Theme {
    // The Theme interface already contains all the properties we need
  }
} 