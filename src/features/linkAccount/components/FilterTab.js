import { makeStyles, Stack } from '@fluentui/react';
import React from 'react';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
  active: {
    backgroundColor: theme.palette.neutralPrimaryAlt,
    color: theme.palette.white,
    border: `1px solid ${theme.palette.neutralPrimaryAlt}`,
  },
  inactive: {
    backgroundColor: theme.palette.white,
    color: theme.palette.neutralSecondaryAlt,
    border: `1px solid ${theme.palette.neutralQuaternary}`,
  },
  firstItem: {
    borderRadius: '4px 0 0 4px',
  },
  latestItem: {
    borderRadius: '0 4px 4px 0',
  },
}));

export default function FilterTab({ tabs, selectedKey, itemStyles, onSelect }) {
  const classes = useStyles();

  const _getStyles = (index) => {
    if (index === 0) {
      return classes.firstItem;
    }
    if (index === tabs?.length - 1) {
      return classes.latestItem;
    }
    return undefined;
  };

  const _getWidthOfItem = () => {
    return `${100 / tabs?.length || 1}%`;
  };

  return (
    <Stack horizontal verticalAlign="center" styles={{ root: { width: '100%' } }}>
      {tabs?.length > 0 &&
        tabs.map((tab, index) => {
          return (
            <Stack
              className={`${selectedKey === tab.key ? classes.active : classes.inactive} ${_getStyles(index)}`}
              styles={{
                ...itemStyles,
                root: { height: 30, width: _getWidthOfItem(), cursor: 'pointer', ...itemStyles?.root },
              }}
              horizontalAlign="center"
              verticalAlign="center"
              onClick={() => onSelect(tab.key)}
              grow
              key={tab.key}
            >
              {tab.name}
            </Stack>
          );
        })}
    </Stack>
  );
}

FilterTab.propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.oneOfType([PropTypes.any]).isRequired,
      key: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    })
  ).isRequired,
  selectedKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  itemStyles: PropTypes.oneOfType([PropTypes.object]),
  onSelect: PropTypes.func.isRequired,
};

FilterTab.defaultProps = {
  itemStyles: {},
};
