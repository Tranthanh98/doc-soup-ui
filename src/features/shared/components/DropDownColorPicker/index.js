import React, { useRef, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { makeStyles, Stack, ContextualMenu, SwatchColorPicker } from '@fluentui/react';

const cellStyles = {
  colorCell: {
    borderRadius: 2,
  },
  svg: {
    borderRadius: 2,
  },
};
const getClassNames = makeStyles((theme) => ({
  colorWrapper: {
    width: 32,
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    background: 'transparent',
    border: `1.2px solid ${theme.palette.neutralQuaternaryAlt}`,
    borderRadius: 2,
    padding: 4,
    cursor: 'pointer',
    '&:hover': {
      borderColor: theme.palette.neutralTertiary,
    },
  },
  colorCell: {
    width: 22,
    height: 22,
    borderRadius: 2,
  },
}));

export default function DropDownColorPicker(props) {
  const { colors, selectedColor, onChangeColor } = props;
  const colorRef = useRef();
  const [showContextualMenu, setShowContextualMenu] = useState(false);

  const _onShowContextualMenu = useCallback((e) => {
    e.preventDefault();
    setShowContextualMenu(true);
  }, []);

  const _onHideContextualMenu = useCallback(() => setShowContextualMenu(false), []);

  const _changeColor = (e, id, color) => {
    onChangeColor({ id, color });
  };

  const renderColorPicker = () => (
    <Stack
      styles={{
        root: {
          paddingLeft: 8,
          paddingRight: 8,
        },
      }}
    >
      <SwatchColorPicker
        columnCount={7}
        cellShape="square"
        cellHeight={22}
        cellWidth={22}
        getColorGridCellStyles={cellStyles}
        colorCells={colors}
        selectedId={selectedColor.id}
        onChange={_changeColor}
      />
    </Stack>
  );

  const classNames = getClassNames();
  return (
    <span>
      <button ref={colorRef} type="button" onClick={_onShowContextualMenu} className={classNames.colorWrapper}>
        <div className={classNames.colorCell} style={{ background: selectedColor.color }} />
      </button>
      <ContextualMenu
        items={[
          {
            key: 'colorPicker',
            text: 'Color Picker',
            onRender: renderColorPicker,
          },
        ]}
        hidden={!showContextualMenu}
        target={colorRef}
        onItemClick={_onHideContextualMenu}
        onDismiss={_onHideContextualMenu}
      />
    </span>
  );
}
DropDownColorPicker.propTypes = {
  colors: PropTypes.oneOfType([PropTypes.array]),
  selectedColor: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    color: PropTypes.string,
  }),
  onChangeColor: PropTypes.func.isRequired,
};
DropDownColorPicker.defaultProps = {
  colors: [],
  selectedColor: {},
};
