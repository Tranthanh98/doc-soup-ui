import { BREAKPOINTS_RESPONSIVE } from 'core/constants/Theme';

const discountTagStyles = {
  root: {
    padding: '6px 12px',
    borderRadius: 16,
    backgroundColor: 'rgba(247, 159, 26, 0.15)',
    [BREAKPOINTS_RESPONSIVE.mdDown]: {
      backgroundColor: 'inherit',
      padding: 0,
    },
  },
};

const yearlyOptionStyles = {
  root: {
    display: 'flex',
    flexFlow: 'row nowrap',
    alignItems: 'center',
    justifyContent: 'center',
    [BREAKPOINTS_RESPONSIVE.mdDown]: {
      flexFlow: 'column nowrap',
    },
  },
};

const planTierCardStyles = {
  root: {
    width: '100%',
    minHeight: '100%',
    marginRight: 10,
    marginLeft: 10,
    minWidth: '270px',
    [BREAKPOINTS_RESPONSIVE.mdDown]: {
      marginBottom: 20,
      marginRight: 0,
      marginLeft: 0,
    },
    [BREAKPOINTS_RESPONSIVE.xlDown]: {
      minWidth: 'auto',
    },
  },
};

const planTierCardWrapper = {
  root: {
    display: 'flex',
    justifyContent: 'center',
    flexFlow: 'row nowrap',
    marginTop: 42,
    overflowX: 'auto',
    width: '100%',

    [BREAKPOINTS_RESPONSIVE.mdDown]: {
      flexFlow: 'column nowrap',
    },
    [BREAKPOINTS_RESPONSIVE.xlDown]: {
      width: '100%',
      justifyContent: 'flex-start',
    },
  },
};

const plantiersStyles = {
  root: {
    [BREAKPOINTS_RESPONSIVE.xlDown]: {
      width: '100%',
    },
  },
};

export { discountTagStyles, yearlyOptionStyles, planTierCardStyles, planTierCardWrapper, plantiersStyles };
