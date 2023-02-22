import ICONS from './SvgIcons';
import { ComponentStyles, BREAKPOINTS } from './ComponentStyles';

export const LIGHT_THEME = {
  defaultFontStyle: { fontFamily: 'SourceHanSansKR, sans-serif' },
  fonts: {
    smallPlus: {
      fontSize: '13px',
    },
  },
  palette: {
    themePrimary: '#f79f1a',
    themeLighterAlt: '#fff8ed',
    themeLighter: '#feefda',
    themeLight: '#fcd9a3',
    themeTertiary: '#fac575',
    themeSecondary: '#f8aa36',
    themeDarkAlt: '#df8f18',
    themeDark: '#bc7915',
    themeDarker: '#8b590f',
    neutralLighterAlt: '#faf9f8',
    neutralLighter: '#fafafa',
    neutralLight: '#f4f4f4',
    neutralQuaternaryAlt: '#dadada',
    neutralQuaternary: '#c8c8c8',
    neutralTertiaryAlt: '#c6c6c6',
    neutralTertiary: '#c4c4c4',
    neutralSecondaryAlt: '#6c6c6c',
    neutralSecondary: '#4a4a4a',
    neutralPrimaryAlt: '#363636',
    neutralPrimary: '#1e1e1e',
    neutralDark: '#111111',
    black: '#000000',
    white: '#ffffff',
    orangeLight: '#ff6100',
    red: '#e4002b',
    gray: '#c4c4c4',
    darkLight: '#f5f5f5',
    magentaLight: '#e40f9b',
    greenLight: '#0cbc82',
    grayLight: '#fbfbfb',
    lightRed: '#f499aa',
    noBackground: '#00000000',
    silver: '#d6d6d6',
    grayLightSecondary: '#b3b3b3',
  },
  semanticColors: {
    bodyDivider: '#dadada',
    buttonText: '#6c6c6c',
  },
  components: ComponentStyles,
};

export const HEADER_LIGHT_THEME = {
  components: {
    IconButton: {
      styles: {
        root: {
          color: LIGHT_THEME.palette.white,
        },
        rootHovered: {
          background: LIGHT_THEME.palette.neutralSecondary,
        },
        rootPressed: {
          background: LIGHT_THEME.palette.neutralSecondary,
        },
      },
    },
    SearchBox: {
      styles: (props) => ({
        root: {
          background: props.theme.palette.neutralSecondary,
          borderColor: 'transparent',
          borderRadius: 20,
          height: 40,
          width: 310,
          selectors: {
            '::after': {
              borderRadius: 20,
              borderColor: 'transparent',
            },
            ':hover': {
              borderColor: 'transparent',
            },
          },
        },
        icon: {
          width: 20,
          height: 20,
          fill: props.theme.palette.neutralTertiary,
          marginLeft: 4,
        },
        field: {
          color: props.theme.palette.white,
          selectors: {
            '::placeholder': {
              color: props.theme.palette.neutralTertiary,
              opacity: 1,
            },
          },
        },
        clearButton: {
          selectors: {
            i: {
              color: `${props.theme.palette.neutralTertiary} !important`,
            },
            ':hover': {
              button: {
                backgroundColor: 'transparent !important',
                borderTopRightRadius: 20,
                borderBottomRightRadius: 20,
                i: {
                  color: `${props.theme.palette.white} !important`,
                },
              },
            },
          },
        },
      }),
    },
    Text: {
      styles: {
        root: {
          color: LIGHT_THEME.palette.white,
        },
      },
    },
  },
};

export const BUTTON_DARK_THEME = {
  palette: {
    themePrimary: '#363636',
    themeDarkAlt: '#4a4a4a',
    themeDark: '#292929',
    themeDarker: '#1e1e1e',
    neutralLighter: '#605e5c',
  },
  components: {
    PrimaryButton: {
      styles: {
        root: {
          borderColor: '#363636',
        },
        rootHovered: {
          backgroundColor: '#4a4a4a',
        },
        rootDisabled: {
          color: '#ffffff',
          borderColor: '#605e5c',
          backgroundColor: '#605e5c',
        },
      },
    },
  },
};

export const RED_BUTTON_THEME = {
  palette: {
    themePrimary: '#e4002b',
    themeLighterAlt: '#fef4f6',
    themeLighter: '#fbd2da',
    themeLight: '#f7adba',
    themeDarkAlt: '#cc0025',
    themeDark: '#ac0020',
    themeDarker: '#7f0017',
    neutralLighterAlt: '#faf9f8',
    neutralLighter: '#f3f2f1',
    neutralLight: '#edebe9',
  },
  components: {
    PrimaryButton: {
      styles: {
        root: {
          borderColor: '#e4002b',
        },
        rootHovered: {
          backgroundColor: '#cc0025',
        },
        rootDisabled: {
          color: '#ffffff',
          borderColor: '#f3f2f1',
          backgroundColor: '#f3f2f1',
        },
      },
    },
  },
};

export const BREAKPOINTS_RESPONSIVE = { ...BREAKPOINTS };

export const BAR_CHART_COLOR = [
  '#f79f1a',
  '#0c7489',
  '#ff6100',
  '#286DA8',
  '#86669F',
  '#584B73',
  '#2FA765',
  '#008573',
  '#BA2C2C',
  '#8F1828',
];

export const DARK_THEME = {
  defaultFontStyle: { fontFamily: 'SourceHanSansKR, sans-serif' },
  palette: {
    themePrimary: '#f79f1a',
    themeLighterAlt: '#0a0601',
    themeLighter: '#281904',
    themeLight: '#4a3008',
    themeTertiary: '#946010',
    themeSecondary: '#da8c18',
    themeDarkAlt: '#f8a931',
    themeDark: '#f9b651',
    themeDarker: '#fbc97e',
    neutralLighterAlt: '#3c3b3b',
    neutralLighter: '#444343',
    neutralLight: '#515050',
    neutralQuaternaryAlt: '#595858',
    neutralQuaternary: '#5f5e5e',
    neutralTertiaryAlt: '#7a7979',
    neutralTertiary: '#c8c8c8',
    neutralSecondary: '#d0d0d0',
    neutralPrimaryAlt: '#dadada',
    neutralPrimary: '#ffffff',
    neutralDark: '#f4f4f4',
    black: '#f8f8f8',
    white: '#333232',
    orangeLight: '#ff6100',
    gray: '#6c6c6c',
  },
};

export const REGISTER_ICONS = {
  icons: {
    'folder-svg': ICONS.folder,
    'folder-open-svg': ICONS.folderOpen,
    'team-folder-svg': ICONS.teamFolder,
    'pdf-svg': ICONS.pdf,
    'photo-svg': ICONS.photo,
    'black-circle-chart-svg': ICONS.blackCircleChart,
    'white-circle-chart-svg': ICONS.whiteCircleChart,
    'gray-profile-user': ICONS.grayProfileUser,
    'orange-profile-user': ICONS.orangeProfileUser,
    'menu-svg': ICONS.menu,
    'list-view-svg': ICONS.listView,
    'ico-dap-svg': ICONS.icoDap,
    'user-svg': ICONS.user,
    'chevron-right-svg': ICONS.chevronRight,
    'chevron-down-svg': ICONS.chevronDown,
    'chevron-up-svg': ICONS.chevronUp,
    'share-svg': ICONS.share,
    'folder-plus-svg': ICONS.folderPlus,
    'pin-svg': ICONS.pin,
    'more-svg': ICONS.more,
    'plus-svg': ICONS.plus,
    'circle-plus-svg': ICONS.circlePlus,
    'eye-open-svg': ICONS.eyeOpen,
    'search-svg': ICONS.search,
    'error-toast-svg': ICONS.errorToast,
    'success-toast-svg': ICONS.successToast,
    'home-folder-svg': ICONS.homeFolder,
    'clear-svg': ICONS.clear,
    'download-svg': ICONS.download,
    'email-verified': ICONS.emailVerified,
    'hyperlink-svg': ICONS.hyperlink,
    'white-plus-svg': ICONS.whitePlus,
    'arrow-back': ICONS.arrowBack,
    'double-chevron-up-svg': ICONS.doubleChevronUp,
    'eye-hidden': ICONS.eyeHidden,
    'upload-file-svg': ICONS.uploadFile,
    'downloaded-svg': ICONS.downloaded,
    'time-svg': ICONS.time,
  },
};
