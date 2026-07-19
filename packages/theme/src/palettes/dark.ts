import type { ColorPalette } from './types'

/**
 * Unified dark mode color palette.
 * Merged from web and mobile palettes with mobile's extended colors as the base.
 */
const darkPalette: ColorPalette = {
  text: {
    primary: '#FFFFFF',
    secondary: '#636669',
    disabled: 'rgba(255, 255, 255, 0.3)',
    contrast: '#000000',
  },
  primary: {
    dark: '#E0E0E0',
    main: '#FFFFFF',
    light: '#A1A3A7',
  },
  secondary: {
    dark: '#636669',
    main: '#FFFFFF',
    light: '#DDDEE0',
    background: '#303033',
  },
  border: {
    main: '#636669',
    light: '#303033',
    background: '#121312',
  },
  error: {
    dark: '#FFE0E6',
    main: '#FF5F72',
    light: '#4A2125',
    background: '#4A2125',
  },
  error1: {
    main: '#4A2125',
    contrastText: '#FFE0E6',
  },
  success: {
    dark: '#DDDEE0',
    main: '#636669',
    light: '#636669',
    background: '#303033',
  },
  info: {
    dark: '#D9F4FB',
    main: '#00BFE5',
    light: '#458898',
    background: '#203339',
  },
  warning: {
    dark: '#FFE4CB',
    main: '#FF8C00',
    light: '#A65F34',
    background: '#4A3621',
  },
  warning1: {
    main: '#4A3621',
    text: '#FFE4CB',
    contrastText: '#FF8C00',
  },
  background: {
    default: '#121312',
    main: '#121312',
    sheet: '#121312',
    paper: '#1C1C1C',
    light: '#303033',
    secondary: '#303033',
    skeleton: 'rgba(255, 255, 255, 0.04)',
    disabled: '#7878801F',
  },
  backdrop: {
    main: '#636669',
  },
  logo: {
    main: '#FFFFFF',
    background: '#303033',
  },
  static: {
    main: '#121312',
    light: '#636669',
    primary: '#FFFFFF',
    textSecondary: '#A1A3A7',
    textBrand: '#FFFFFF',
  },
}

export default darkPalette
