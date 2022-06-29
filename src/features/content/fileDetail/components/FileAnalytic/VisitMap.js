/* eslint-disable*/
import { FontWeights, mergeStyleSets, Stack, Text } from '@fluentui/react';
import RestService from 'features/shared/services/restService';
import React, { useContext, useEffect } from 'react';
import GlobalContext from 'security/GlobalContext';
import PropTypes from 'prop-types';
import load from 'little-loader';
import { BREAKPOINTS_RESPONSIVE, LIGHT_THEME } from 'core/constants/Theme';

let didLoadOnce = false;

const classNames = mergeStyleSets({
  markerLabel: {
    marginTop: 55,
    marginLeft: 50,
  },
});

const googleMapWrapper = {
  root: {
    marginBottom: 34,
    height: 600,
    width: '100%',
    [BREAKPOINTS_RESPONSIVE.xlDown]: {
      height: 432,
    },
    [BREAKPOINTS_RESPONSIVE.mdDown]: {
      height: 318,
    },
    [BREAKPOINTS_RESPONSIVE.sm]: {
      height: 149,
    },
  },
};

const VisitMap = (props) => {
  const context = useContext(GlobalContext);

  const initMap = (points) => {
    if (document.getElementById('map')) {
      const map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: points.length ? { lat: points[0].latitude, lng: points[0].longitude } : { lat: 0, lng: 0 },
      });

      const svgMarker = {
        path: 'M26.253 78.072c4.058-23.422 26.253-37.11 26.253-51.684C52.506 11.814 40.752 0 26.253 0 11.753 0 0 11.814 0 26.388 0 40.962 20.902 54.88 26.253 78.072z',
        fillColor: LIGHT_THEME.palette.themePrimary,
        fillRule: 'evenodd',
        fillOpacity: 1,
        strokeWeight: 0,
        rotation: 0,
        scale: 1,
        anchor: new google.maps.Point(5, 30),
      };

      for (const element of points) {
        const _marker = new google.maps.Marker({
          position: { lat: element.latitude, lng: element.longitude },
          map,
          icon: svgMarker,
          label: {
            color: LIGHT_THEME.palette.white,
            className: classNames.markerLabel,
            fontWeight: '500',
            fontSize: '20px',
            text: `${element?.totalView || 0}`,
            fontFamily: 'NotoSansCJKkr-Medium',
          },
        });
        console.assert(true, _marker);
      }
    }
  };

  const { REACT_APP_GOOGLE_API_KEY } = process.env;

  const getLocation = () => {
    const { fileId } = props;
    const { getToken } = context;
    if (fileId !== undefined) {
      new RestService()
        .setPath(`/file/${fileId}/viewer-location`)
        .setToken(getToken())
        .get()
        .then((response) => {
          if (response.data?.length > 0) {
            initMap(response.data);
          }
        });
    }
  };

  const handleLoadCompleted = (err) => {
    if (err) {
      console.error(err);
    } else {
      didLoadOnce = true;
      getLocation();
    }
  };

  const loadScript = () => {
    const src = `https://maps.googleapis.com/maps/api/js?key=${REACT_APP_GOOGLE_API_KEY}`;
    load(src, handleLoadCompleted);
  };

  useEffect(() => {
    if (!didLoadOnce) {
      loadScript();
    } else {
      getLocation();
    }
  }, []);

  return (
    <Stack>
      <Stack styles={{ root: { marginBottom: 24, paddingTop: 40 } }}>
        <Text variant="mediumPlus" styles={{ root: { fontWeight: FontWeights.semibold } }}>
          Visit Map
        </Text>
      </Stack>

      <Stack id="map" styles={googleMapWrapper} />
    </Stack>
  );
};

VisitMap.propTypes = {
  fileId: PropTypes.number.isRequired,
};

export default VisitMap;
