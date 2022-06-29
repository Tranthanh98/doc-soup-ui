/* eslint-disable max-lines */
/* eslint max-lines: ["warn", {"max": 500, "skipBlankLines": true, "skipComments": true}] */
export const BREAKPOINTS = {
  sm: '@media screen and (max-width: 360.9px)', // from 767px to smaller
  md: '@media screen and (min-width: 361px) and (max-width: 767.9px)', // from 361px to 767px
  lg: '@media screen and (min-width: 768px) and (max-width: 1023.9px)', // from 768px to 1023px
  xl: '@media screen and (min-width: 1024px) and (max-width: 1439.9px)', // from 1024px to 1439px
  xxl: '@media screen and (min-width: 1440px)', // from 1440px to larger

  mdDown: '@media screen and (max-width: 767.9px)',
  mdUp: '@media screen and (min-width: 361px)',

  lgDown: '@media screen and (max-width: 1023.9px)',
  lgUp: '@media screen and (min-width: 768px)',

  xlDown: '@media screen and (max-width: 1439.9px)',
  xlUp: '@media screen and (min-width: 1024px)',

  xxlDown: '@media screen and (max-width: 1440px)',
};

export const ComponentStyles = {
  DefaultButton: {
    styles: {
      root: {
        minWidth: 'auto',
        height: 40,
        padding: '0 8px',
        fill: '#6c6c6c',
        color: '#6c6c6c',
        borderColor: '#c8c8c8',
        borderWidth: 1.2,
        borderRadius: 2,
        selectors: {
          [BREAKPOINTS.mdDown]: {
            height: 30,
            borderRadius: 2,
          },
        },
      },
      rootDisabled: {
        borderColor: '#c8c8c8',
      },
      rootHovered: {
        backgroundColor: '#f4f4f4',
      },
      label: {
        fontSize: 13,
        letterSpacing: -0.5,
        fontWeight: 500,
      },
      icon: {
        width: 20,
        height: 'auto',
        fontWeight: 'bold',
      },
      menuIcon: {
        width: 22,
        height: 'auto',
      },
    },
  },
  PrimaryButton: {
    styles: {
      root: {
        color: '#ffffff',
        borderColor: '#f79f1a',
        borderWidth: 1.2,
        minWidth: 88,
      },
      rootDisabled: {
        color: '#ffffff',
        borderColor: '#fcd9a3',
        backgroundColor: '#fcd9a3',
      },
      rootHovered: {
        backgroundColor: '#df8f18',
      },
      icon: {
        fill: '#ffffff',
      },
      menuIcon: {
        width: 22,
        height: 'auto',
      },
      label: {
        fontSize: 13,
        letterSpacing: -0.5,
      },
    },
  },
  Nav: {
    styles: () => {
      return {
        link: {
          height: 42,
          selectors: {
            '::after': {
              border: 'none',
            },
            i: {
              color: 'inherit',
            },
          },
        },
      };
    },
  },
  Separator: {
    styles: (props) => ({
      root: {
        padding: 0,
        selectors: {
          '::before': {
            backgroundColor: props.theme.palette.neutralQuaternaryAlt,
          },
          '::after': {
            backgroundColor: props.theme.palette.neutralQuaternaryAlt,
          },
        },
      },
    }),
  },
  Breadcrumb: {
    styles: (props) => ({
      itemLink: {
        color: props.theme.palette.neutralSecondaryAlt,
        padding: `0 ${props.theme.spacing.m}`,
      },
    }),
  },
  ContextualMenu: {
    styles: (props) => ({
      container: {
        borderRadius: 4,
        border: `solid 1px ${props.theme.palette.neutralQuaternaryAlt}`,
        padding: '2px 0',
      },
      root: {
        fontSize: 13,
        borderRadius: 4,
        minWidth: 100,
      },
      subComponentStyles: {
        callout: {
          root: {
            borderRadius: 4,
            boxShadow: '0 4px 32px 0 rgba(108, 108, 108, 0.12)',
          },
          calloutMain: {
            borderRadius: 4,
          },
        },
        menuItem: (itemProps) => ({
          root: {
            color: itemProps.disabled ? props.theme.palette.neutralSecondaryAlt : '',
            padding: '0 12px',
            height: 30,
            lineHeight: 30,
            selectors: {
              '&:hover': {
                backgroundColor: props.theme.palette.neutralQuaternaryAlt,
              },
            },
          },
          divider: {
            backgroundColor: props.theme.palette.neutralQuaternaryAlt,
          },
          label: {
            margin: 0,
            fontSize: 13,
            letterSpacing: -0.5,
          },
        }),
      },
    }),
  },
  DetailsHeader: {
    styles: {
      check: {
        opacity: 'initial !important',
      },
      root: {
        paddingTop: 0,
      },
    },
  },
  DetailsColumn: {
    styles: {
      cellName: {
        color: '#6c6c6c',
        fontSize: 13,
        letterSpacing: -0.5,
      },
    },
  },
  DetailsRow: {
    styles: {
      cell: {
        display: 'flex',
        alignItems: 'center',
      },
      check: {
        height: '100% !important',
        backgroundColor: 'pink',
      },
    },
  },
  Modal: {
    styles: {
      main: {
        borderRadius: 6,
      },
    },
  },
  Dialog: {
    styles: {
      main: {
        minHeight: 'auto',
      },
    },
  },
  DialogContent: {
    styles: (props) => ({
      title: {
        paddingTop: 32,
      },
      innerContent: {
        color: props.theme.palette.neutralSecondaryAlt,
      },
      topButton: {
        paddingTop: 30,
      },
    }),
  },
  TextField: {
    styles: (props) => ({
      fieldGroup: {
        borderColor: props.hasErrorMessage ? props.theme.palette.red : props.theme.palette.neutralQuaternaryAlt,
      },
      field: {
        selectors: {
          '&::placeholder': {
            color: props.theme.palette.neutralTertiary,
          },
        },
      },
      errorMessage: {
        color: props.theme.palette.red,
        fontWeight: 500,
      },
      subComponentStyles: {
        label: {
          root: {
            color: props.theme.palette.neutralSecondaryAlt,
            fontSize: 13,
          },
        },
      },
    }),
  },
  Checkbox: {
    styles: (props) => {
      let checkboxStyles = { borderColor: props.theme.palette.neutralQuaternary };
      if (props.checked) {
        checkboxStyles = { borderColor: props.theme.palette.themePrimary };
      }
      if (props.disabled) {
        const disableColor = props.theme.palette.neutralQuaternaryAlt;
        checkboxStyles = { borderColor: disableColor, background: disableColor };
      }
      return {
        checkbox: {
          width: 18,
          height: 18,
          borderRadius: 3,
          ...checkboxStyles,
        },
        checkmark: {
          color: `${props.theme.palette.white} !important`,
        },
        text: {
          color: props.disabled ? props.theme.palette.neutralTertiary : props.theme.palette.neutralSecondaryAlt,
          fontSize: 13,
        },
        root: {
          selectors: {
            '&:hover': {
              '.ms-Checkbox-checkbox': {
                borderColor: props.checked ? 'transparent' : 'none',
              },
              '.ms-Checkbox-text': {
                color: props.checked ? 'inherit' : 'none',
              },
              '.ms-Checkbox-checkmark': {
                opacity: props.checked ? 1 : 0,
              },
            },
          },
        },
      };
    },
  },
  SearchBox: {
    styles: (props) => ({
      root: {
        borderColor: props.theme.palette.neutralQuaternaryAlt,
        borderRadius: 2,
      },
      field: {
        selectors: {
          '::placeholder': {
            color: props.theme.palette.neutralTertiary,
            opacity: 1,
          },
        },
      },
      icon: {
        width: 20,
        height: 20,
      },
    }),
  },
  Label: {
    root: {
      fontWeight: 'normal',
    },
  },
  Dropdown: {
    styles: (props) => ({
      title: {
        height: 40,
        lineHeight: 36,
        fontSize: 13,
        border: `solid 1.2px ${props.theme.palette.neutralQuaternaryAlt}`,
      },
      label: {
        fontWeight: 'normal',
      },
      caretDownWrapper: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: 17,
        height: 'auto',
        right: 1,
        bottom: 1,
        backgroundColor: props.theme.palette.neutralLight,
        borderLeft: `1px solid ${props.theme.palette.neutralQuaternaryAlt}`,
      },
      caretDown: {
        color: props.theme.palette.neutralPrimaryAlt,
        fontSize: 8,
        fontWeight: 'bold',
      },
    }),
  },
  Toggle: {
    styles: (props) => ({
      container: { width: 44, cursor: 'pointer' },
      pill: {
        width: 44,
        border: 'none',
        background: props.checked ? props.theme.palette.themePrimary : props.theme.palette.neutralQuaternary,
        selectors: {
          '&:hover': {
            background: props.checked ? props.theme.palette.themePrimary : props.theme.palette.neutralQuaternary,
            '& > span': {
              backgroundColor: `${props.theme.palette.white} !important`,
            },
          },
        },
      },
      thumb: {
        width: 14,
        height: 14,
        backgroundColor: props.theme.palette.white,
      },
      text: {
        position: 'absolute',
        top: 1.5,
        left: props.checked ? -2 : 12,
        color: '#fff',
        fontSize: 10,
        wordBreak: 'keep-all',
        cursor: 'pointer',
      },
    }),
  },
  Pivot: {
    styles: (props) => ({
      root: {
        display: 'flex',
        borderBottom: `1px solid ${props.theme.palette.neutralQuaternaryAlt}`,
      },
      link: {
        minWidth: 140,
        border: `1px solid transparent`,
        borderBottom: `1px solid ${props.theme.palette.neutralQuaternaryAlt}`,
        color: props.theme.palette.neutralSecondaryAlt,
        backgroundColor: props.theme.palette.neutralLight,
        fontWeight: 500,
        marginBottom: -1,
        marginRight: 8,
        selectors: {
          ':last-child': {
            marginRight: 0,
          },
          [BREAKPOINTS.sm]: {
            width: '100%',
            minWidth: 110,
            marginRight: 0,
          },
          [BREAKPOINTS.md]: {
            width: '100%',
            minWidth: 110,
            marginRight: 0,
          },
        },
      },
      linkIsSelected: {
        color: props.theme.palette.neutralPrimary,
        backgroundColor: props.theme.palette.white,
        borderColor: props.theme.palette.neutralQuaternaryAlt,
        borderBottomColor: props.theme.palette.white,
        borderTop: `3px solid ${props.theme.palette.themePrimary}`,
        marginRight: 8,
        selectors: {
          '&::before': {
            display: 'none',
          },
        },
      },
    }),
  },
  Tooltip: {
    styles: (props) => ({
      root: {
        padding: 0,
        boxShadow: 'none',
        selectors: {
          div: {
            backgroundColor: props.theme.palette.neutralPrimaryAlt,
            color: props.theme.palette.white,
          },
        },
      },
      content: {
        paddingLeft: 8,
        paddingRight: 8,
        paddingTop: 4,
        paddingBottom: 4,
      },
    }),
  },
  PersonaCoin: {
    styles: (props) => {
      const borderRadius = props.size < 12 ? 8 : 12;
      return {
        coin: {
          backgroundColor: props.theme.palette.greenLight,
          borderRadius,
        },
        initials: {
          borderRadius,
        },
      };
    },
  },
  Persona: {
    styles: (props) => ({
      primaryText: { fontWeight: props.size >= 12 && 500 },
    }),
  },
  GroupedList: {
    styles: (props) => ({
      root: {
        '.ms-List-cell': {
          minHeight: 'unset',
        },
      },
      group: {
        selectors: {
          '> div': {
            ':first-child:hover': {
              backgroundColor: props.theme.palette.themeLighterAlt,
            },
          },
        },
      },
    }),
  },
  CommandBar: {
    styles: (props) => ({
      root: {
        padding: 0,
        selectors: {
          'button, a': {
            borderRadius: 4,
            [BREAKPOINTS.mdDown]: {
              minWidth: 30,
              height: 30,
              padding: 0,
            },
            i: {
              width: 20,
              height: 20,
              [BREAKPOINTS.mdDown]: {
                width: 16,
                height: 16,
              },
            },
            svg: { fill: props.theme.palette.neutralSecondaryAlt },
            ':hover': {
              backgroundColor: props.theme.palette.neutralLight,
              svg: { fill: props.theme.palette.neutralPrimaryAlt },
            },
          },
        },
        [BREAKPOINTS.mdDown]: {
          height: 30,
        },
      },
      primarySet: {
        selectors: {
          'button.is-disabled': {
            svg: { fill: props.theme.palette.neutralTertiaryAlt },
          },
        },
      },
    }),
  },
  Text: {
    styles: () => ({
      root: {
        letterSpacing: -0.5,
      },
    }),
  },
};
export default ComponentStyles;
