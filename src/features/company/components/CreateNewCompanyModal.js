import { ChoiceGroup, Stack, Text, TextField } from '@fluentui/react';
import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { CustomButton, CustomModal, CustomText } from 'features/shared/components';
import RestService from 'features/shared/services/restService';
import GlobalContext from 'security/GlobalContext';
import restServiceHelper from 'features/shared/lib/restServiceHelper';
import { LIGHT_THEME } from 'core/constants/Theme';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { success } from 'features/shared/components/ToastMessage';
import Resource from 'core/constants/Resource';

const stackStyles = {
  root: {
    background: `${LIGHT_THEME.palette.neutralLight}`,
    width: '100%',
    maxWidth: 332,
    borderRadius: 4,
  },
};
const headerTitleSelectUserStyles = {
  root: {
    marginTop: 24,
    marginBottom: 8,
    fontSize: 13,
    letterSpacing: -0.5,
    fontWeight: 500,
    color: `${LIGHT_THEME.palette.neutralPrimary}`,
  },
};
const textHeaderDes = {
  root: {
    fontSize: 13,
    letterSpacing: -0.5,
    color: `${LIGHT_THEME.palette.neutralSecondaryAlt}`,
  },
};

const desTextStyles = {
  root: {
    maxWidth: 332,
    width: '100%',
    marginBottom: 20,
    marginTop: `5px !important`,
  },
};

const btnStyles = {
  label: {
    fontSize: 14,
    letterSpacing: -0.5,
    fontWeight: 500,
    fontFamily: `SourceHanSansKR`,
  },
};

const optionChoices = [
  {
    key: 'you',
    text: 'You',
  },
  {
    key: 'other',
    text: 'Another user',
  },
];

const validationSchema = (isOtherOwner) => {
  if (isOtherOwner) {
    return Yup.object().shape({
      companyName: Yup.string().required(),
      owner: Yup.string().email('Please enter a valid email address').required(),
    });
  }

  return Yup.object().shape({
    companyName: Yup.string().required(),
  });
};

const createInitValue = (isOtherOwner) => {
  if (isOtherOwner) {
    return {
      owner: '',
      companyName: '',
    };
  }

  return {
    owner: null,
    companyName: '',
  };
};

function CreateNewCompanyModal(props) {
  const context = useContext(GlobalContext);
  const { isOpen, onDismiss, onRefreshAllCompanies } = props;
  const [isOtherOwner, setIsOtherOwner] = useState(false);
  const { isMobile } = context;

  const _createNewCompany = (values) => {
    const { getToken } = context;
    new RestService()
      .setPath('/company/create-switch')
      .setToken(getToken())
      .post(values)
      .then(() => {
        success(`New company has been created successfully.`);
        onRefreshAllCompanies();
      })
      .catch((err) => restServiceHelper.handleError(err))
      .finally(() => {
        onDismiss();
        setIsOtherOwner(false);
      });
  };

  const _changeOption = (option) => {
    setIsOtherOwner(option.key !== 'you');
  };

  return (
    <CustomModal isOpen={isOpen} onDismiss={onDismiss} title="Create a new company" isFull={false}>
      <Formik
        initialValues={createInitValue(isOtherOwner)}
        validationSchema={validationSchema(isOtherOwner)}
        enableReinitialize
        onSubmit={_createNewCompany}
      >
        {({ values, errors, isSubmitting, handleSubmit, handleChange }) => {
          return (
            <Form onSubmit={handleSubmit}>
              <Stack tokens={{ padding: 12 }} styles={stackStyles}>
                <CustomText block variant="smallPlus" color="textSecondary" styles={textHeaderDes}>
                  {Resource.CREATE_A_NEW_COMPANY}
                </CustomText>
              </Stack>
              <Stack>
                <Text styles={headerTitleSelectUserStyles}> Billing Owner </Text>
                <ChoiceGroup
                  styles={{
                    root: { marginBottom: 5 },
                    flexContainer: { '& > div': { marginBottom: 16 } },
                  }}
                  defaultSelectedKey="you"
                  options={optionChoices}
                  onChange={(_event, option) => _changeOption(option)}
                  required
                />
                {isOtherOwner ? (
                  <Stack>
                    <TextField
                      label=""
                      value={values.owner}
                      onChange={handleChange}
                      name="owner"
                      placeholder="user@email.com"
                      errorMessage={errors.owner}
                    />
                    <Stack styles={desTextStyles}>
                      <CustomText block variant="smallPlus" color="textSecondary" styles={{ root: { fontSize: 12 } }}>
                        {Resource.CREATE_COMPANY_FOR_ANOTHER_USER}
                      </CustomText>
                    </Stack>
                  </Stack>
                ) : null}
                <TextField
                  label="New Company Name"
                  placeholder="Company name"
                  onChange={handleChange}
                  value={values.companyName}
                  name="companyName"
                  styles={{
                    root: { fontSize: 12 },
                    wrapper: { label: { fontSize: 12 } },
                    fieldGroup: { marginTop: 2 },
                  }}
                  errorMessage={errors.companyName}
                />
              </Stack>
              <Stack grow={1} horizontal horizontalAlign="end" tokens={{ childrenGap: 8 }} style={{ marginTop: 36 }}>
                <CustomButton text="Cancel" onClick={onDismiss} size="large" styles={btnStyles} />
                <CustomButton
                  primary
                  text={isMobile ? 'Create company' : 'Create new company'}
                  size="large"
                  disabled={isSubmitting}
                  type="submit"
                  styles={btnStyles}
                />
              </Stack>
            </Form>
          );
        }}
      </Formik>
    </CustomModal>
  );
}
CreateNewCompanyModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onDismiss: PropTypes.func.isRequired,
  onRefreshAllCompanies: PropTypes.func.isRequired,
};
export default CreateNewCompanyModal;
