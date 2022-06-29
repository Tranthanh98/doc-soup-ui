import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Stack, Persona, PersonaSize, FontSizes, Link as FluentUILink, DefaultButton } from '@fluentui/react';
import { copyToClipboard } from 'features/shared/lib/utils';
import { LIGHT_THEME } from 'core/constants/Theme';

const linkWithPersonaStyles = (props) => {
  const { theme, width } = props;
  return {
    root: {
      width,
      position: 'relative',
      backgroundColor: theme.palette.neutralLight,
      paddingLeft: theme.spacing.s2,
      paddingRight: theme.spacing.s2,
      paddingTop: theme.spacing.m,
      paddingBottom: theme.spacing.m,
      borderRadius: 8,
    },
    details: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    primaryText: {
      color: theme.palette.neutralSecondaryAlt,
      fontSize: FontSizes.size12,
    },
    secondaryText: {
      height: 'auto',
      overflowX: 'initial',
      overflowY: 'initial',
      color: theme.palette.themePrimary,
      borderRadius: 6,
      marginLeft: 8,
    },
  };
};
const linkViewStyles = {
  root: {
    color: 'inherit',
    overflow: 'hidden',
    selectors: {
      ':hover': { color: LIGHT_THEME.palette.neutralPrimary },
    },
  },
};
const copyButtonStyles = (isCopied) => ({
  root: {
    minWidth: 68,
    height: '24px !important',
    borderRadius: '6px !important',
    color: 'inherit',
    borderColor: 'inherit',
    backgroundColor: isCopied ? LIGHT_THEME.palette.themeLighterAlt : LIGHT_THEME.palette.white,
  },
  rootHovered: {
    color: 'inherit',
    borderColor: 'inherit',
    backgroundColor: LIGHT_THEME.palette.themeLighterAlt,
  },
  label: { fontSize: FontSizes.size12 },
  rootPressed: { color: 'inherit', backgroundColor: LIGHT_THEME.palette.themeLighterAlt },
});
export default function PersonaLinkTag(props) {
  const [isCopied, setIsCopied] = useState(false);
  const { linkId, width, isCopyToClipboard, createdBy } = props;
  const href = `${window.location.origin}/view/${linkId}`;

  const _copyLinkToClipboard = () => {
    copyToClipboard(href);
    setIsCopied(true);
  };

  const _getLinkName = () => {
    if (href.includes('https://')) {
      return href.replace('https://', '');
    }

    return href.replace('http://', '');
  };

  return (
    <Persona
      text={createdBy}
      secondaryText={isCopied ? 'Copied' : 'Copy'}
      showSecondaryText={isCopyToClipboard}
      size={PersonaSize.size24}
      initialsColor={8}
      styles={(styleProps) => linkWithPersonaStyles({ ...styleProps, width })}
      coinProps={{ styles: { initials: { borderRadius: 6 } } }}
      onRenderPrimaryText={() => (
        <Stack horizontal verticalAlign="center">
          <FluentUILink href={href} target="_blank" rel="noreferrer" styles={linkViewStyles}>
            {_getLinkName()}
          </FluentUILink>
        </Stack>
      )}
      onRenderSecondaryText={() => (
        <DefaultButton
          text={isCopied ? 'Copied' : 'Copy'}
          styles={copyButtonStyles(isCopied)}
          onClick={() => _copyLinkToClipboard()}
        />
      )}
      onMouseLeave={() => isCopied && setIsCopied(false)}
    />
  );
}
PersonaLinkTag.propTypes = {
  linkId: PropTypes.string,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  isCopyToClipboard: PropTypes.bool,
  createdBy: PropTypes.string.isRequired,
};
PersonaLinkTag.defaultProps = {
  linkId: undefined,
  width: 236,
  isCopyToClipboard: false,
};
