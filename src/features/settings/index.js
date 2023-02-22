import React, { Component } from 'react';
import { Stack, Text, Pivot, PivotItem, FontWeights } from '@fluentui/react';
import GlobalContext from 'security/GlobalContext';
import RestService from 'features/shared/services/restService';
import restServiceHelper from 'features/shared/lib/restServiceHelper';
import { BREAKPOINTS_RESPONSIVE, LIGHT_THEME } from 'core/constants/Theme';
import { HASH_TAG, USER_ROLES, SETTINGS } from 'core/constants/Const';
import Personal from './components/Personal';
import Company from './components/Company';

const stackControlStyles = {
  root: {
    paddingBottom: 26,
  },
};
const pageTitleStyles = {
  root: {
    fontWeight: FontWeights.bold,
  },
};
const pivotSettingStyles = {
  root: {
    marginBottom: 29,
    [BREAKPOINTS_RESPONSIVE.mdDown]: {
      display: 'flex',
      justifyContent: 'center',
    },
  },
  linkIsSelected: {
    borderTop: `3px solid ${LIGHT_THEME.palette.themePrimary}`,
    color: `${LIGHT_THEME.palette.black}`,
    borderRadius: `0 !important`,
  },
  link: {
    marginRight: 8,
    [BREAKPOINTS_RESPONSIVE.mdDown]: {
      width: '50%',
    },
  },
};
const wrapperSettingPageStyles = {
  root: {
    maxWidth: 720,
    width: '100%',
    margin: 'auto',
  },
};

class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isHideCompanyTab: true,
    };
  }

  componentDidMount() {
    this._getAccountInfo();
  }

  _getAccountInfo = () => {
    const { getToken } = this.context;
    new RestService()
      .setPath(`/account`)
      .setToken(getToken())
      .get()
      .then(({ data }) => {
        this.setState({ isHideCompanyTab: data.role !== USER_ROLES.c_admin });
      })
      .catch((error) => {
        restServiceHelper.handleError(error);
      });
  };

  render() {
    const { isHideCompanyTab } = this.state;
    const { location } = this.props;
    const hashTag = location?.hash.includes(HASH_TAG.USER_SETTING);
    return (
      <Stack>
        <Stack styles={wrapperSettingPageStyles}>
          <Stack horizontal horizontalAlign="space-between" tokens={{ childrenGap: 8 }} styles={stackControlStyles}>
            <Text variant="xLarge" styles={pageTitleStyles}>
              Settings
            </Text>
          </Stack>
          <Pivot
            aria-label="Basic Pivot Example"
            styles={pivotSettingStyles}
            defaultSelectedKey={hashTag ? SETTINGS.COMPANY : undefined}
          >
            <PivotItem headerText="Personal" itemKey={SETTINGS.PERSONAL}>
              <Personal />
            </PivotItem>
            {!isHideCompanyTab ? (
              <PivotItem headerText="Company" itemKey={SETTINGS.COMPANY}>
                <Company selectHashTag={hashTag ? HASH_TAG.USER_SETTING : undefined} />
              </PivotItem>
            ) : null}
          </Pivot>
        </Stack>
      </Stack>
    );
  }
}
Settings.contextType = GlobalContext;
export default Settings;
