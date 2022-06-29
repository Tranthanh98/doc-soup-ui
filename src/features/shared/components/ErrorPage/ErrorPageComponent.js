import React from 'react';
import { Stack, Text, PrimaryButton, Image, ImageFit, Link } from '@fluentui/react';
import { DARK_THEME } from 'core/constants/Theme';
import PropTypes from 'prop-types';

const guideArea = { root: { border: 'solid 1px #363636', width: 400, height: 100 } };
const guideStyles = {
  root: {
    borderBottom: 'solid 1px #363636',
    width: '100%',
    height: 25,
    backgroundColor: DARK_THEME.palette.neutralPrimaryAlt,
  },
};
const textStyles = { root: { textAlign: 'center', verticalAlign: 'center', fontSize: 16, fontWeight: 600 } };
const contactContainer = { root: { padding: '10px 16px', border: 'solid 1px #c8c8c8' } };
const contactText = { root: { fontSize: 16, color: DARK_THEME.palette.gray, fontWeight: 400 } };
const goHomeContainer = { root: { height: '100%', padding: '10px 16px' } };
const goHomeText = { root: { fontSize: 16, color: DARK_THEME.palette.neutralPrimary } };

function ErrorPageComponent({ errorTypeOption, errorImageOption, guideTitle }) {
  const { REACT_APP_CONTACT_EMAIL } = process.env;

  return (
    <Stack horizontalAlign="center" tokens={{ childrenGap: 16 }} styles={{ root: { height: '100%', paddingTop: 50 } }}>
      <Image
        imageFit={ImageFit.contain}
        src="/img/logo-black.png"
        srcSet="/img/logo2x-black.png 2x, /img/logo3x-black.png 3x"
        alt="Doc-soup"
      />
      <Image
        style={{ paddingTop: 60 }}
        imageFit={ImageFit.contain}
        src={errorTypeOption.src}
        srcSet={errorTypeOption.srcSet}
        alt={errorTypeOption.alt}
      />

      <Image
        style={{ paddingTop: 30 }}
        imageFit={ImageFit.contain}
        src={errorImageOption.src}
        srcSet={errorImageOption.srcSet}
        alt={errorImageOption.alt}
      />

      <Stack styles={guideArea} style={{ marginTop: 45 }}>
        <Stack verticalAlign="center" styles={guideStyles}>
          <Text styles={textStyles}>Guide</Text>
        </Stack>
        <Stack verticalAlign="center" horizontalAlign="center" styles={{ root: { height: 75 } }}>
          <Text styles={textStyles}>{guideTitle}</Text>
        </Stack>
      </Stack>

      <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 16 }} style={{ marginTop: 35, marginBottom: 20 }}>
        <Link styles={contactContainer} href={`mailto:${REACT_APP_CONTACT_EMAIL}?subject=PAGE_NOT_FOUND&body=`}>
          <Text styles={contactText}>Contact us by email</Text>
        </Link>
        <PrimaryButton styles={goHomeContainer} href="/">
          <Text styles={goHomeText}>Go to DocSoup</Text>
        </PrimaryButton>
      </Stack>
    </Stack>
  );
}

ErrorPageComponent.propTypes = {
  errorTypeOption: PropTypes.shape({
    src: PropTypes.string,
    srcSet: PropTypes.string,
    alt: PropTypes.string,
  }),
  errorImageOption: PropTypes.shape({
    src: PropTypes.string,
    srcSet: PropTypes.string,
    alt: PropTypes.string,
  }),
  guideTitle: PropTypes.string.isRequired,
};

ErrorPageComponent.defaultProps = {
  errorTypeOption: {
    src: '',
    srcSet: '',
    alt: '',
  },
  errorImageOption: {
    src: '',
    srcSet: '',
    alt: '',
  },
};

export default ErrorPageComponent;
