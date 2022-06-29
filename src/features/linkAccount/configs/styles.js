import { FontWeights } from '@fluentui/react';
import { BREAKPOINTS_RESPONSIVE } from 'core/constants/Theme';

const pageTitleStyles = {
  root: {
    fontWeight: FontWeights.bold,
    minWidth: 150,
  },
};

const wrapperFilterStyles = {
  root: {
    display: 'flex',
    flexFlow: 'row nowrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    [BREAKPOINTS_RESPONSIVE.mdDown]: {
      flexFlow: 'column nowrap',
    },
  },
};

const archivedContactStyles = {
  root: {
    display: 'flex',
    justifyContent: 'flex-end',
    [BREAKPOINTS_RESPONSIVE.mdDown]: {
      justifyContent: 'flex-start',
      paddingTop: 20,
      width: '100%',
    },
  },
};

const filterTabStyles = {
  root: {
    [BREAKPOINTS_RESPONSIVE.mdDown]: {
      width: '100%',
    },
  },
};

export { pageTitleStyles, wrapperFilterStyles, archivedContactStyles, filterTabStyles };
