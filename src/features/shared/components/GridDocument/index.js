import React from 'react';
import PropTypes from 'prop-types';
import { ThemeContext, Stack, Shimmer, ShimmerElementType, Icon, Text } from '@fluentui/react';

const gridItemStyles = (theme, isAllowSelect) => ({
  root: {
    minWidth: '20vw',
    border: `1px solid ${theme.palette.neutralQuaternaryAlt}`,
    borderRadius: 4,
    padding: '8px 16px',
    cursor: isAllowSelect ? 'pointer' : 'default',
    selections: {
      '&:hover': {
        background: isAllowSelect && theme.palette.neutralLighter,
      },
    },
  },
});

function getShimmerElements() {
  return [
    { type: ShimmerElementType.line, height: 40, width: '33%' },
    { type: ShimmerElementType.gap, width: '3%' },
    { type: ShimmerElementType.line, height: 40, width: '33%' },
    { type: ShimmerElementType.gap, width: '3%' },
    { type: ShimmerElementType.line, height: 40, width: '33%' },
  ];
}

export default function GridDocument(props) {
  const { documents, iconName, onSelectItem } = props;
  if (!documents) {
    return (
      <Stack tokens={{ childrenGap: 24 }}>
        <Shimmer shimmerElements={getShimmerElements()} />
        <Shimmer shimmerElements={getShimmerElements()} />
        <Shimmer shimmerElements={getShimmerElements()} />
      </Stack>
    );
  }
  if (!documents.length) {
    return null;
  }
  return (
    <ThemeContext.Consumer>
      {(theme) => (
        <Stack wrap horizontal tokens={{ childrenGap: 24 }}>
          {documents &&
            documents.map((doc, index) => (
              <Stack.Item key={index}>
                <Stack
                  horizontal
                  verticalAlign="center"
                  tokens={{ childrenGap: 8 }}
                  styles={gridItemStyles(theme, !!onSelectItem)}
                  onClick={() => onSelectItem && onSelectItem(doc)}
                >
                  <Icon iconName={iconName} styles={{ root: { width: 32, height: 32 } }} />
                  <Text variant="medium">{doc?.displayName || doc?.name}</Text>
                </Stack>
              </Stack.Item>
            ))}
        </Stack>
      )}
    </ThemeContext.Consumer>
  );
}
GridDocument.propTypes = {
  documents: PropTypes.oneOfType([PropTypes.array]),
  iconName: PropTypes.string.isRequired,
  onSelectItem: PropTypes.func,
};
GridDocument.defaultProps = {
  documents: undefined,
  onSelectItem: undefined,
};
