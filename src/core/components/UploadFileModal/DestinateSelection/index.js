import React from 'react';
import PropTypes from 'prop-types';
import { ThemeContext, Stack, DefaultButton, Text, FontWeights } from '@fluentui/react';
import ChangeDestinationModal from './ChangeDestinationModal';

const stackDestinationStyles = (theme) => ({
  root: {
    marginTop: theme.spacing.s2,
    marginBottom: theme.spacing.l1,
    paddingLeft: theme.spacing.s1,
    border: `1px solid ${theme.palette.neutralQuaternaryAlt}`,
    borderRadius: 2,
  },
});
const btnChangeDesStyles = (theme) => ({
  root: {
    minHeight: 28,
    height: '100%',
    padding: '0 14px',
    color: theme.palette.neutralPrimary,
    border: 0,
    borderLeft: `1px solid ${theme.palette.neutralQuaternaryAlt}`,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    backgroundColor: theme.palette.neutralLight,
    selectors: {
      ':hover': {
        backgroundColor: theme.palette.neutralTertiary,
      },
    },
  },
});
const subTextStyles = (theme) => ({
  root: {
    color: theme.palette.neutralSecondaryAlt,
    overflow: 'hidden',
  },
});
const titleStyles = (theme) => ({
  root: {
    color: theme.palette.neutralSecondaryAlt,
    fontWeight: FontWeights.semibold,
  },
});

export default function DestinateSelection(props) {
  const {
    isOpen,
    teamFolders,
    myFolders,
    folderPath,
    folderPathString,
    selectedFolder,
    onToggle,
    onChangeDestination,
  } = props;
  return (
    <ThemeContext.Consumer>
      {(theme) => (
        <>
          <Text variant="small" styles={titleStyles(theme)}>
            Destination
          </Text>
          <Stack
            horizontal
            horizontalAlign="space-between"
            verticalAlign="center"
            tokens={{ childrenGap: 16 }}
            styles={stackDestinationStyles(theme)}
          >
            <Text variant="smallPlus" styles={subTextStyles(theme)}>
              {folderPathString}
            </Text>
            <Stack.Item disableShrink align="stretch">
              <DefaultButton text="Change" styles={btnChangeDesStyles(theme)} onClick={onToggle} />
            </Stack.Item>
          </Stack>
          <ChangeDestinationModal
            {...props}
            isOpen={isOpen}
            teamFolders={teamFolders}
            myFolders={myFolders}
            folderPath={folderPath}
            selectedFolder={selectedFolder}
            onDismiss={onToggle}
            onChangeDestination={onChangeDestination}
          />
        </>
      )}
    </ThemeContext.Consumer>
  );
}
DestinateSelection.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  teamFolders: PropTypes.oneOfType([PropTypes.array]),
  myFolders: PropTypes.oneOfType([PropTypes.array]),
  folderPath: PropTypes.oneOfType([PropTypes.array]),
  folderPathString: PropTypes.string,
  selectedFolder: PropTypes.oneOfType([PropTypes.object]),
  onToggle: PropTypes.func.isRequired,
  onChangeDestination: PropTypes.func.isRequired,
};
DestinateSelection.defaultProps = {
  teamFolders: [],
  myFolders: [],
  folderPath: [],
  folderPathString: '',
  selectedFolder: {},
};
