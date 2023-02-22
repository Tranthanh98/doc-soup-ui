import { Icon, Persona, PersonaSize, Stack, Text } from '@fluentui/react';
import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { LIGHT_THEME } from 'core/constants/Theme';
import { CustomButton } from 'features/shared/components';
import { MODAL_NAME } from 'core/constants/Const';
import GlobalContext from 'security/GlobalContext';
import RestService from 'features/shared/services/restService';
import CreateNewCompanyModal from './CreateNewCompanyModal';

const wrapStyles = (_companies) => ({
  root: {
    marginBottom: 20,
    width: '100%',
    maxHeight: 292,
    overflowY: _companies?.length > 4 ? 'scroll' : 'auto',
  },
});

const wrapItemCompanyStyles = {
  root: {
    borderBottom: `1px solid ${LIGHT_THEME.palette.neutralQuaternaryAlt}`,
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: `${LIGHT_THEME.palette.themeLighterAlt}`,
    },
  },
};

const wrapCompanyInfoStyles = {
  root: {
    display: 'flex',
    justifyContent: 'center',
    position: 'relative',
    width: '100%',
  },
};

const nameItemStyle = {
  root: {
    color: `${LIGHT_THEME.palette.neutralPrimary}`,
    letterSpacing: -0.5,
    fontSize: 14,
    fontWeight: 500,
  },
};

const emailItemStyle = {
  root: {
    color: `${LIGHT_THEME.palette.neutralSecondaryAlt}`,
    letterSpacing: -0.5,
    fontSize: 13,
  },
};

const iconItemStyle = {
  root: {
    color: `${LIGHT_THEME.palette.neutralSecondaryAlt}`,
    position: 'absolute',
    right: 8,
    top: '50%',
    transform: 'translateY(-50%)',
  },
};

const iconStyles = {
  root: {
    width: 28,
    height: 28,
    fontWeight: 500,
    position: 'absolute',
    right: 0,
    top: '50%',
    transform: 'translateY(-50%)',
  },
};

const btnStyles = {
  root: {
    width: '100%',
  },
  label: {
    fontSize: 14,
    letterSpacing: -0.5,
    fontWeight: 500,
    fontFamily: `SourceHanSansKR`,
  },
};

export default function CompanyList(props) {
  const context = useContext(GlobalContext);

  const { companies, selectCompany, onRefreshAllCompanies } = props;
  const [modalName, setModalName] = useState('');
  const [accountInfo, setAccountInfo] = useState({});

  const _getAccountInfo = () => {
    const { getToken } = context;
    new RestService()
      .setPath(`/account`)
      .setToken(getToken())
      .get()
      .then((res) => {
        setAccountInfo(res.data);
      });
  };

  useEffect(() => {
    _getAccountInfo();
  }, []);

  const _toggleDialog = (name) => {
    setModalName(name);
  };

  return (
    <>
      <Stack styles={wrapStyles(companies)}>
        {companies &&
          companies.map((company, index) => {
            return (
              <Stack
                horizontal
                horizontalAlign="start"
                key={index}
                styles={wrapItemCompanyStyles}
                onClick={() => selectCompany(company)}
              >
                <Persona
                  hidePersonaDetails
                  size={PersonaSize.size40}
                  styles={{ root: { margin: '16px 8px' } }}
                  text={company.name}
                />
                <Stack styles={wrapCompanyInfoStyles}>
                  <Text styles={nameItemStyle}>{company.name}</Text>
                  <Text styles={emailItemStyle}>{accountInfo.email}</Text>
                  {company.id === accountInfo.activeCompanyId ? (
                    <Text styles={iconItemStyle}> Active </Text>
                  ) : (
                    <Icon styles={iconStyles} iconName="ChevronRightMed" />
                  )}
                </Stack>
              </Stack>
            );
          })}
      </Stack>
      <CustomButton
        primary
        text="Create New Company"
        size="large"
        styles={btnStyles}
        onClick={() => _toggleDialog(MODAL_NAME.CREATE_NEW_COMPANY)}
      />
      <CreateNewCompanyModal
        isOpen={modalName === MODAL_NAME.CREATE_NEW_COMPANY}
        onDismiss={_toggleDialog}
        onRefreshAllCompanies={onRefreshAllCompanies}
      />
    </>
  );
}
CompanyList.propTypes = {
  companies: PropTypes.oneOfType([PropTypes.array]).isRequired,
  selectCompany: PropTypes.func.isRequired,
  onRefreshAllCompanies: PropTypes.func.isRequired,
};
