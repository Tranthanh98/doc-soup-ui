import { Stack, Text, Icon, Spinner, SpinnerSize, ThemeContext } from '@fluentui/react';
import React from 'react';
import PropTypes from 'prop-types';

const folderNameStyle = {
  root: {
    selectors: {
      '&:hover': {
        textDecoration: 'underline',
        cursor: 'pointer',
      },
    },
  },
};

const getStyleItemList = (index, theme) => ({
  root: {
    backgroundColor: index % 2 === 0 ? 'inherit' : theme.palette.neutralLight,
    padding: 12,
    selectors: {
      '&:hover': {
        backgroundColor: theme.palette.themeLighterAlt,
      },
    },
  },
});

function CellOfListView({ item, loadingFileId, icon, index, onClick }) {
  return (
    <ThemeContext.Consumer>
      {(theme) => {
        const styleItemList = getStyleItemList(index, theme);

        return (
          <Stack
            onClick={onClick}
            horizontal
            verticalAlign="center"
            styles={styleItemList}
            tokens={{ childrenGap: 10 }}
          >
            <Stack.Item disableShrink>
              {loadingFileId === item.id ? (
                <Spinner size={SpinnerSize.medium} />
              ) : (
                <Icon iconName={icon} styles={{ root: { width: 24, height: 24 } }} />
              )}
            </Stack.Item>
            <Text styles={folderNameStyle}>{item.name}</Text>
          </Stack>
        );
      }}
    </ThemeContext.Consumer>
  );
}

CellOfListView.propTypes = {
  item: PropTypes.oneOfType([PropTypes.object]).isRequired,
  loadingFileId: PropTypes.number,
  icon: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  onClick: PropTypes.func,
};

CellOfListView.defaultProps = {
  onClick: undefined,
  loadingFileId: undefined,
};

export default CellOfListView;
