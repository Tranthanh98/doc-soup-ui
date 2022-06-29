import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import {
  ThemeContext,
  Stack,
  Text,
  FontWeights,
  Image,
  ImageFit,
  Persona,
  PersonaSize,
  Icon,
  ContextualMenu,
  PrimaryButton,
  DefaultButton,
  SearchBox,
} from '@fluentui/react';
import RestService from 'features/shared/services/restService';
import restServiceHelper from 'features/shared/lib/restServiceHelper';
import fileHelper from 'features/shared/lib/fileHelper';
import trackService from 'features/shared/services/trackService';
import { useParams } from 'react-router-dom/cjs/react-router-dom.min';
import { BREAKPOINTS_RESPONSIVE } from 'core/constants/Theme';

const stackHeaderStyles = (theme, headerHeight) => ({
  root: {
    position: 'sticky',
    top: 0,
    zIndex: 7000,
    height: headerHeight,
    overflowX: 'auto',
    overflowY: 'hidden',
    paddingLeft: theme.spacing.l1,
    paddingRight: theme.spacing.l1,
    borderBottom: `1px solid ${theme.palette.neutralQuaternaryAlt}`,
    backgroundColor: theme.palette.white,
  },
});
const contextualMenuStyles = (props) => ({
  container: { border: 'none' },
  root: {
    backgroundColor: props.theme.palette.neutralPrimaryAlt,
  },
  subComponentStyles: {
    callout: { calloutMain: { backgroundColor: 'transparent' } },
    menuItem: { item: { color: 'white' } },
  },
});
const onRenderDataRoomOwnerInfo = (linkCreator) => {
  return (
    <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 8, padding: 16 }}>
      <Persona
        hidePersonaDetails
        size={PersonaSize.size32}
        initialsColor={15}
        styles={{ root: { flexWrap: 'wrap' } }}
        text={linkCreator?.fullName}
      />
      <Stack.Item>
        <Text block styles={{ root: { fontWeight: FontWeights.semibold, color: 'inherit' } }}>
          {linkCreator?.fullName}
        </Text>
        <Text block variant="smallPlus" styles={{ root: { color: 'inherit' } }}>
          {linkCreator?.email}
        </Text>
      </Stack.Item>
      <PrimaryButton text="Contact" href={`mailto:${linkCreator?.email}?subject=&body=`} />
    </Stack>
  );
};

export default function PreviewHeader(props) {
  const _personaMenuRef = useRef();
  const [isShowPersonaMenu, setIsShowPersonaMenu] = useState(false);
  const [disableDownloadButton, setDisableDownloadButton] = useState(false);
  const [keyword, setKeyword] = useState('');

  const [showSearchBox, setShowSearchBox] = useState(false);

  const { linkCreator, viewerId, allowDownloadFile, dataRoomName, onSearchSubDocument } = props;
  const { linkId } = useParams();

  const _togglePersonaMenu = () => {
    setIsShowPersonaMenu((prevState) => !prevState);
  };

  const _handleSearch = (keyword) => {
    setKeyword(keyword);
    onSearchSubDocument(keyword);
  };

  const _handleDownload = async (linkId) => {
    setDisableDownloadButton(true);
    const clientInfo = await trackService.getTrackPayload();

    new RestService()
      .setPath(`view-link/${linkId}/download-all-file`)
      .setHeaders({ 'x-viewerId': viewerId, 'x-deviceId': clientInfo.app.deviceId })
      .setResponseType('arraybuffer')
      .get()
      .then((res) => {
        fileHelper.download(res.data, res.headers['content-type'], `${dataRoomName}.zip`);
      })
      .catch((err) => {
        restServiceHelper.handleError(err);
      })
      .finally(() => setDisableDownloadButton(false));
  };

  return (
    <ThemeContext.Consumer>
      {(theme) => (
        <Stack horizontal horizontalAlign="space-between" verticalAlign="center" styles={stackHeaderStyles(theme, 70)}>
          <Stack
            horizontal
            verticalAlign="center"
            tokens={{ childrenGap: theme.spacing.s1 }}
            style={{ maxWidth: '33%' }}
          >
            <Link to="/">
              <Image
                imageFit={ImageFit.contain}
                src="/img/logo-black.png"
                srcSet="/img/logo2x-black.png 2x, /img/logo3x-black.png 3x"
                alt="Logo"
                width={116}
                height={54}
                styles={{ root: { marginLeft: 16, marginRight: 72 } }}
              />
            </Link>
          </Stack>
          <Stack horizontal horizontalAlign="center" verticalAlign="center" tokens={{ childrenGap: 24 }}>
            <Stack
              styles={{
                root: {
                  [BREAKPOINTS_RESPONSIVE.mdDown]: { display: 'none' },
                },
              }}
            >
              {showSearchBox ? (
                <SearchBox
                  placeholder="Search"
                  onSearch={_handleSearch}
                  onChange={(_event, value) => _handleSearch(value)}
                  iconProps={{ iconName: 'search-svg' }}
                  onBlur={() => {
                    if (!keyword) {
                      setShowSearchBox(false);
                    }
                  }}
                  autoFocus
                />
              ) : (
                <Icon
                  iconName="search-svg"
                  styles={{ root: { cursor: 'pointer', width: 24, height: 24 } }}
                  onClick={() => {
                    setShowSearchBox(true);
                    onSearchSubDocument('');
                  }}
                />
              )}
            </Stack>
            {allowDownloadFile && viewerId ? (
              <>
                <DefaultButton
                  onClick={() => _handleDownload(linkId)}
                  text={disableDownloadButton ? 'Downloading...' : 'Download as zip'}
                  iconProps={{ iconName: 'CircleAdditionSolid' }}
                  styles={{ root: { height: 30, borderRadius: 2 } }}
                  disabled={disableDownloadButton}
                />
              </>
            ) : null}

            <Persona
              hidePersonaDetails
              ref={_personaMenuRef}
              size={PersonaSize.size40}
              styles={{ root: { cursor: 'pointer', flexWrap: 'wrap' } }}
              initialsColor={15}
              text={linkCreator?.fullName}
              onClick={_togglePersonaMenu}
            />
            <ContextualMenu
              items={[
                {
                  key: 'dataRoomOwner',
                  onRender: () => onRenderDataRoomOwnerInfo(linkCreator),
                },
              ]}
              hidden={!isShowPersonaMenu}
              target={_personaMenuRef}
              styles={contextualMenuStyles}
              onDismiss={_togglePersonaMenu}
            />
          </Stack>
        </Stack>
      )}
    </ThemeContext.Consumer>
  );
}
PreviewHeader.propTypes = {
  linkCreator: PropTypes.oneOfType([PropTypes.object]),
  viewerId: PropTypes.number,
  allowDownloadFile: PropTypes.bool,
  dataRoomName: PropTypes.string,
  onSearchSubDocument: PropTypes.func.isRequired,
};

PreviewHeader.defaultProps = {
  allowDownloadFile: false,
  linkCreator: {},
  viewerId: undefined,
  dataRoomName: undefined,
};
