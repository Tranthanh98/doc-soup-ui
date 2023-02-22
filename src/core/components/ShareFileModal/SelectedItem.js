import React from 'react';
import PropTypes from 'prop-types';
import { Stack, Icon, Text, FontSizes } from '@fluentui/react';
import { FILE_TYPE } from 'core/constants/Const';

const iconFolderStyles = (props) => ({
  root: {
    width: 20,
    color: props.theme.palette.themePrimary,
    fontSize: FontSizes.size20,
  },
});
const iconCancelStyles = (props) => ({
  root: {
    fontSize: 9,
    fontWeight: 'bold',
    color: props.theme.palette.neutralSecondaryAlt,
    cursor: 'pointer',
    padding: 6,
    ':hover': {
      color: props.theme.palette.neutralDark,
    },
  },
});

export default function SelectedItem(props) {
  const { type, item, onRemoveItem } = props;
  return (
    <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 8 }}>
      <Stack.Item disableShrink>
        <Icon iconName={type === FILE_TYPE.FOLDER ? 'folder-svg' : 'pdf-svg'} styles={iconFolderStyles} />
      </Stack.Item>
      <Stack.Item styles={{ root: { overflow: 'hidden', maxWidth: 200 } }}>
        <Text variant="small" styles={{ root: { whiteSpace: 'nowrap' } }}>
          {item.displayName || item.name}
        </Text>
      </Stack.Item>
      <Icon iconName="Cancel" styles={iconCancelStyles} onClick={() => onRemoveItem(type, item)} />
    </Stack>
  );
}
SelectedItem.propTypes = {
  type: PropTypes.string,
  item: PropTypes.oneOfType([PropTypes.object]).isRequired,
  onRemoveItem: PropTypes.func.isRequired,
};
SelectedItem.defaultProps = {
  type: FILE_TYPE.PDF,
};
