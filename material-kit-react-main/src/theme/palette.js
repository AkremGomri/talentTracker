import { alpha } from '@mui/material/styles';

// ----------------------------------------------------------------------

// SETUP COLORS
const GREY = {
  0: '#FFFFFF',
  100: '#F9FAFB',
  200: '#F4F6F8',
  300: '#DFE3E8',
  400: '#C4CDD5',
  500: '#919EAB',
  600: '#637381',
  700: '#454F5B',
  800: '#212B36',
  900: '#161C24',
};

const ORANGE = {
  0: '#FFFFFF',
  100: '#754C00',
  200: '#A36A00',
  300: '#D18700',
  400: '#FF9653',
  500: '#FFA500',
  600: '#FFB52E',
  700: '#FFC55C',
  800: '#FFD68A',
  900: '#000000',
};

const RED = {
  0: '#FFFFFF',
  100: '#750000',
  200: '#A30000',
  300: '#D10000',
  400: '#FF0000',
  500: '#FF2E2E',
  600: '#FF5C5C',
  700: '#FF8A8A',
  800: '#000000',
  900: '#000000',
};

const BROWN = {
  0: '#FFFFFF',
  100: '#754C00',
  200: '#A36A00',
  300: '#D18700',
  400: '#FF9653',
  500: '#FFA500',
  600: '#FFB52E',
  700: '#FFC55C',
  800: '#FFD68A',
  900: '#000000',
};

const YELLOW = {
  0: '#FFFFFF',
  100: '#757500',
  200: '#A3A300',
  300: '#D1D100',
  400: '#FFFF53',
  500: '#FFFF00',
  600: '#FFFF2E',
  700: '#FFFF5C',
  800: '#FFFF8A',
  900: '#000000',
};

const GREEN = {
  0: '#FFFFFF',
  100: '#007500',
  200: '#00A300',
  300: '#00D100',
  400: '#53FF53',
  500: '#00FF00',
  600: '#2EFF2E',
  700: '#5CFF5C',
  800: '#8AFF8A',
  900: '#000000',
};

const BLUE = {
  0: '#FFFFFF',
  100: '#000075',
  200: '#0000A3',
  300: '#0000D1',
  400: '#5353FF',
  500: '#0000FF',
  600: '#2E2EFF',
  700: '#5C5CFF',
  800: '#8A8AFF',
  900: '#000000',
};

const PURPLE = {
  0: '#FFFFFF',
  100: '#750075',
  200: '#A300A3',
  300: '#D100D1',
  400: '#FF53FF',
  500: '#FF00FF',
  600: '#FF2EFF',
  700: '#FF5CFF',
  800: '#FF8AFF',
  900: '#000000',
};

const PINK = {
  0: '#fce4ec',
  100: '#f8bbd0',
  200: '#f48fb1',
  300: '#f06292',
  400: '#ec407a',
  500: '#e91e63',
  600: '#d81b60',
  700: '#c2185b',
  800: '#ad1457',
  900: '#880e4f',
};

const INDIGO = {
  0: '#e8eaf6',
  100: '#c5cae9',
  200: '#9fa8da',
  300: '#7986cb',
  400: '#5c6bc0',
  500: '#3f51b5',
  600: '#3949ab',
  700: '#303f9f',
  800: '#283593',
  900: '#1a237e',
};

const OrangeCombination = {
  orange: '#D37506',
  redOrange: '#9F2B00',
  pewter: '#D3D3CB',
  taupe: '#ADA7A7'
}

const OrangeCombination2 = {
  orange: '#FD7F20',
  redOrange: '#FC2E20',
  amber: '#FDB750',
  black: '#010100'
}

const PRIMARY = {
  lighter: '#D1E9FC',
  light: '#76B0F1',
  main: '#2065D1',
  dark: '#103996',
  darker: '#061B64',
  contrastText: '#fff',
};

const SECONDARY = {
  lighter: '#D6E4FF',
  light: '#84A9FF',
  main: '#3366FF',
  dark: '#1939B7',
  darker: '#091A7A',
  contrastText: '#fff',
};

const INFO = {
  lighter: '#D0F2FF',
  light: '#74CAFF',
  main: '#1890FF',
  dark: '#0C53B7',
  darker: '#04297A',
  contrastText: '#fff',
};

const SUCCESS = {
  lighter: '#E9FCD4',
  light: '#AAF27F',
  main: '#54D62C',
  dark: '#229A16',
  darker: '#08660D',
  contrastText: GREY[800],
};

const WARNING = {
  lighter: '#FFF7CD',
  light: '#FFE16A',
  main: '#FFC107',
  dark: '#B78103',
  darker: '#7A4F01',
  contrastText: GREY[800],
};

const ERROR = {
  lighter: '#FFE7D9',
  light: '#FFA48D',
  main: '#FF4842',
  dark: '#B72136',
  darker: '#7A0C2E',
  contrastText: '#fff',
};

const palette = {
  common: { black: '#000', white: '#fff' },
  primary: {
    main: PRIMARY.main,
  },
  secondary: SECONDARY,
  info: INFO,
  success: SUCCESS,
  warning: WARNING,
  error: ERROR,
  grey: GREY,
  Orange: OrangeCombination,
  Orange2: OrangeCombination2,
  PRIMARY,
  INDIGO,
  divider: alpha(GREY[500], 0.24),
  text: {
    primary: GREY[800],
    secondary: GREY[600],
    disabled: GREY[500],
  },
  background: {
    paper: '#fff',
    default: GREY[100],
    neutral: GREY[200],
  },
  action: {
    active: GREY[600],
    hover: alpha(GREY[500], 0.08),
    selected: alpha(GREY[500], 0.16),
    disabled: alpha(GREY[500], 0.8),
    disabledBackground: alpha(GREY[500], 0.24),
    focus: alpha(GREY[500], 0.24),
    hoverOpacity: 0.08,
    disabledOpacity: 0.48,
  },
};

export default palette;
