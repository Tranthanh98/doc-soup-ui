import React from 'react';
import PropTypes from 'prop-types';
import { Stack, Text, FontWeights, SearchBox } from '@fluentui/react';

const listNameStyles = {
  root: {
    marginTop: 48,
    fontWeight: FontWeights.semibold,
  },
};
export default function SearchHeader(props) {
  const { name, onSearch } = props;
  if (!name && !onSearch) {
    return null;
  }
  return (
    <Stack wrap horizontal horizontalAlign="space-between" verticalAlign="end" tokens={{ childrenGap: 8 }}>
      {name && (
        <Text block variant="mediumPlus" styles={listNameStyles}>
          {name}
        </Text>
      )}
      {onSearch && (
        <Stack.Item>
          <SearchBox iconProps={{ iconName: 'search-svg' }} placeholder="Search" onSearch={onSearch} />
        </Stack.Item>
      )}
    </Stack>
  );
}
SearchHeader.propTypes = {
  name: PropTypes.string,
  onSearch: PropTypes.func,
};
SearchHeader.defaultProps = {
  name: undefined,
  onSearch: undefined,
};
