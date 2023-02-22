import {
  Icon,
  Stack,
  Text,
  Spinner,
  SpinnerSize,
  TooltipHost,
  TooltipDelay,
  makeStyles,
  Image,
  ImageFit,
} from '@fluentui/react';
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import RestService from 'features/shared/services/restService';
import { FILE_TYPE } from 'core/constants/Const';
import trackService from 'features/shared/services/trackService';

const useStyles = makeStyles((theme) => ({
  itemGrid: {
    outline: 'none',
    position: 'relative',
    float: 'left',
    marginRight: 48,
    marginBottom: 48,
    '&:hover': {
      cursor: 'pointer',
      '#image-item': {
        backgroundColor: theme.palette.themeLighterAlt,
      },
      '#name-item': {
        textDecoration: 'underline',
        cursor: 'pointer',
      },
    },
    width: 208,
  },
  itemImage: {
    backgroundColor: theme.palette.neutralLighter,
    maxWidth: 208,
    height: 192,
    border: `1px solid #dadada`,
    position: 'relative',
  },
  itemLabel: {
    maxWidth: 210,
  },
  openingFile: {
    position: 'absolute',
    left: 0,
    top: 0,
    zIndex: 10,
    minHeight: '100%',
    minWidth: '100%',
    backgroundColor: 'rgba(50, 50, 50, 0.2)',
  },
}));

function CellOfGridView({ item, linkId, viewerId, icon, onClick, loadingFileId }) {
  const [imageUrl, setImageUrl] = useState(null);

  const classNames = useStyles();

  const _getThumbnailFile = async () => {
    const clientInfo = await trackService.getTrackPayload();
    if (item.type !== FILE_TYPE.FOLDER) {
      new RestService()
        .setPath(`/view-link/${linkId}/file/${item.id}/thumb/1?version=${item.version}`)
        .setHeaders({
          'x-viewerId': viewerId,
          'x-deviceId': clientInfo.app.deviceId,
        })
        .setResponseType('arraybuffer')
        .get()
        .then((response) => {
          const URL = window.URL || window.webkitURL;
          const url = URL.createObjectURL(new Blob([response.data], { type: 'image/jpeg', encoding: 'UTF-8' }));
          setImageUrl(url);
          setTimeout(() => {
            URL.revokeObjectURL(url);
          }, 100);
        });
    }
  };

  useEffect(() => {
    _getThumbnailFile();
  }, [item.id]);

  return (
    <Stack className={classNames.itemGrid} onClick={onClick}>
      <Stack id="image-item" className={classNames.itemImage} horizontalAlign="center" verticalAlign="center">
        {item.type !== FILE_TYPE.FOLDER && imageUrl ? (
          <Image src={imageUrl} height="100%" imageFit={ImageFit.contain} alt="page" />
        ) : (
          <Icon iconName={icon} styles={{ root: { width: 80, height: 80 } }} />
        )}
        {loadingFileId === item.id ? (
          <Stack className={classNames.openingFile} verticalAlign="center" horizontalAlign="center">
            <Spinner size={SpinnerSize.large} />
          </Stack>
        ) : null}
      </Stack>
      <TooltipHost content={item.name} delay={TooltipDelay.zero} id={item.name}>
        <Stack id="name-item" className={classNames.itemLabel} styles={{ root: { paddingTop: 12 } }}>
          <Text
            styles={{
              root: {
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
              },
            }}
          >
            {item.name}
          </Text>
        </Stack>
      </TooltipHost>
    </Stack>
  );
}

CellOfGridView.propTypes = {
  item: PropTypes.oneOfType([PropTypes.object]).isRequired,
  icon: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  loadingFileId: PropTypes.number,
  linkId: PropTypes.string.isRequired,
  viewerId: PropTypes.number.isRequired,
};

CellOfGridView.defaultProps = {
  onClick: undefined,
  loadingFileId: undefined,
};

export default CellOfGridView;
