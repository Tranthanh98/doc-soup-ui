import React from 'react';
import { Stack, TextField, Icon, getTheme, FontWeights } from '@fluentui/react';
import { Form, Formik } from 'formik';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { BREAKPOINTS_RESPONSIVE } from 'core/constants/Theme';
import { CustomText } from 'features/shared/components';

const theme = getTheme();
const stackStyles = {
  root: {
    padding: '20px 0',
  },
};

const stackItemStyles = {
  root: {
    [BREAKPOINTS_RESPONSIVE.mdDown]: {
      width: '90%',
    },
    [BREAKPOINTS_RESPONSIVE.lg]: {
      width: '75%',
    },
    [BREAKPOINTS_RESPONSIVE.xlUp]: {
      width: '50%',
    },
  },
};

const labelStyles = {
  root: { fontSize: 20, fontWeight: FontWeights.bold, textAlign: 'center' },
};

const textFieldStyles = {
  prefix: { background: '#fff', padding: '0px 2px 0px 8px' },
  field: {
    padding: 0,
  },
  root: { padding: 0, width: '100%' },
  placeholder: { fontSize: 14 },
  fieldGroup: { minHeight: 40 },
};

function SearchBox(props) {
  const { submit, keywordSearch, totalResults } = props;

  const validationSchema = Yup.object().shape({ keyword: Yup.string().required('Please enter your keywords') });

  const _onSubmit = (values) => {
    submit(values.keyword);
  };

  return (
    <Formik
      initialValues={{ keyword: keywordSearch !== '' ? keywordSearch : '' }}
      validationSchema={validationSchema}
      enableReinitialize
      onSubmit={_onSubmit}
    >
      {({ values, handleSubmit, handleChange }) => {
        return (
          <Form onSubmit={handleSubmit}>
            <Stack
              tokens={{ childrenGap: '12px' }}
              horizontalAlign="center"
              verticalAlign="center"
              disableShrink
              styles={stackStyles}
            >
              <Stack.Item styles={stackItemStyles} disableShrink>
                <div style={{ marginBottom: 20, textAlign: 'center' }}>
                  <CustomText styles={labelStyles}>Search</CustomText>
                </div>
                <TextField
                  styles={textFieldStyles}
                  name="keyword"
                  placeholder="Search"
                  value={values.keyword}
                  onChange={handleChange}
                  onRenderPrefix={() => (
                    <Icon
                      iconName="search-svg"
                      styles={{ root: { fill: theme.palette.neutralSecondaryAlt, width: 20, height: 20 } }}
                    />
                  )}
                />
              </Stack.Item>
              {keywordSearch && keywordSearch !== '' && (
                <Stack.Item disableShrink styles={stackItemStyles}>
                  <CustomText variant="smallPlus" color="textSecondary">
                    Showing{' '}
                  </CustomText>
                  {totalResults > 0 && (
                    <CustomText variant="smallPlus" color="orangeLight">
                      {`${totalResults} `}
                    </CustomText>
                  )}
                  <CustomText variant="smallPlus" color="textSecondary">
                    result for
                  </CustomText>
                  <CustomText variant="smallPlus" color="orangeLight">
                    {` "${keywordSearch}" `}
                  </CustomText>
                </Stack.Item>
              )}
            </Stack>
          </Form>
        );
      }}
    </Formik>
  );
}

SearchBox.propTypes = {
  submit: PropTypes.func.isRequired,
  keywordSearch: PropTypes.string,
  totalResults: PropTypes.number,
};

SearchBox.defaultProps = {
  keywordSearch: '',
  totalResults: 0,
};

export default SearchBox;
