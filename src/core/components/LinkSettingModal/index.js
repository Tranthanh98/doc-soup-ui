import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { CustomModal } from 'features/shared/components';
import { Stack } from '@fluentui/react';
import GlobalContext from 'security/GlobalContext';
import RestService from 'features/shared/services/restService';
import LinkSettingForm from './LinkSettingForm';

export default function LinkSettingModal(props) {
  const { title, isOpen, linkId, onToggle, isSubmitting, onSubmit, name } = props;

  const context = useContext(GlobalContext);

  const [values, setValues] = useState({
    download: false,
    disabled: false,
    nda: false,
    email: false,
  });

  const [initialSecure, setInitialSecure] = useState({});

  const _getSetting = () => {
    const { getToken } = context;
    if (linkId) {
      new RestService()
        .setPath(`/link/${linkId}/setting`)
        .setToken(getToken())
        .get()
        .then((response) => {
          if (response.data) {
            const { secure, disabled, download, expriedAt, watermarkId, name } = response.data;
            let newValues = {
              ...values,
              disabled,
              download,
              expriedAt,
              watermarkId,
              name,
            };

            if (secure) {
              newValues = {
                ...newValues,
                nda: secure.nda,
                email: secure.email,
              };

              setInitialSecure(secure);
            }

            setValues(newValues);
          }
        });
    }
  };

  useEffect(() => {
    _getSetting();
  }, [linkId]);

  const _handleChangeInput = (event, value) => {
    const { name } = event.target;
    const data = { ...values, [name]: value };
    if (data.nda) {
      data.email = true;
    }

    setValues(data);
  };

  const __handleChangeLinkStatus = (value) => {
    const data = { ...values, disabled: !value };
    setValues(data);
  };

  const _savePermission = () => {
    const secure = {
      ...initialSecure,
      nda: values.nda,
      email: values.email,
    };

    const data = {
      ...values,
      secure: JSON.stringify(secure),
    };

    onSubmit(data);
  };

  return (
    <CustomModal
      title={title}
      isOpen={isOpen}
      onDismiss={onToggle}
      isSubmitting={isSubmitting}
      primaryButtonProps={{
        iconProps: { iconName: 'CheckMark' },
        text: 'Save permissions',
        onClick: _savePermission,
        disabled: isSubmitting,
      }}
    >
      <Stack style={{ width: 650, height: 350 }}>
        <LinkSettingForm
          linkId={linkId}
          name={name}
          values={values}
          onChange={_handleChangeInput}
          onChangeLinkStatus={__handleChangeLinkStatus}
        />
      </Stack>
    </CustomModal>
  );
}
LinkSettingModal.propTypes = {
  title: PropTypes.string,
  name: PropTypes.string,
  isOpen: PropTypes.bool.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  linkId: PropTypes.string,
  onSubmit: PropTypes.func.isRequired,
};
LinkSettingModal.defaultProps = {
  title: '',
  linkId: '',
  name: '',
};
