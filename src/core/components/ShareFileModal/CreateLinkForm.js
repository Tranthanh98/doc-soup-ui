/* eslint-disable max-lines */
import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import {
  getTheme,
  ThemeContext,
  Stack,
  Text,
  Separator,
  TextField,
  DatePicker,
  defaultDatePickerStrings,
  Checkbox,
  FontWeights,
  Dropdown,
} from '@fluentui/react';
import dayjs from 'dayjs';
import { MODAL_NAME, TIME_FORMAT } from 'core/constants/Const';
import RestService from 'features/shared/services/restService';
import GlobalContext from 'security/GlobalContext';
import AutoCompleteLinkAccount from 'features/shared/components/AutoCompleteLinkAccount';
import { CustomButton } from 'features/shared/components';
import ManageViewerModal from './ManageViewerModal';
import CustomWatermarkForm from './CustomWatermarkForm';
import TimePickerCustom from '../TimePickerCustom';

const theme = getTheme();
const sectionStyles = {
  root: {},
};
const allowViewerTextStyles = {
  root: {
    textAlign: 'right',
    color: theme.palette.neutralSecondaryAlt,
    paddingLeft: 28,
  },
};
const allowCheckboxWrapperStyles = {
  root: { width: 90 },
};
const titleSectionStyles = {
  root: {
    fontWeight: FontWeights.semibold,
  },
};
const advancedSettingCheckbox = {
  root: {
    marginTop: theme.spacing.s1,
  },
};
const accessControlChildren = {
  root: {
    marginLeft: theme.spacing.l2,
  },
};

const datePickerStyles = {
  textField: { height: 30, width: 116 },
  icon: { right: -30 },
};

export default function CreateLinkForm(props) {
  const [modalName, setModalName] = useState();
  const [ndaList, setNdaList] = useState([]);
  const [imageWatermarkUrl, setImageUrl] = useState(undefined);
  const [expireTime, setExpireTime] = useState(undefined);

  const context = useContext(GlobalContext);

  const { getToken, isMobile } = context;

  const { values, onChange, onSetLinkAccountName, errors, documentId } = props;

  const _toggleModal = (name) => {
    setModalName(name);
  };

  const _handleChangeManageViewer = (viewers) => {
    onChange({ target: { name: 'allowedViewers' } }, viewers);
    _toggleModal();
  };

  const _handleSelectDate = (date) => {
    if (expireTime) {
      date.setHours(expireTime.substring(0, expireTime.indexOf(':')));
      date.setMinutes(expireTime.substring(expireTime.indexOf(':') + 1));
    }
    const expiredAt = new Date() > date ? new Date() : date;
    const hoursValue = `0${expiredAt.getHours()}`.slice(-2);
    const minuteValue = `0${expiredAt.getMinutes()}`.slice(-2);
    setExpireTime(`${hoursValue}:${minuteValue}`);
    onChange({ target: { name: 'expiredAt' } }, expiredAt);
  };

  const _handleSelectTime = (time = '') => {
    if (values.expiredAt) {
      const date = new Date(values.expiredAt);
      date.setHours(time.substring(0, time.indexOf(':')));
      date.setMinutes(time.substring(time.indexOf(':') + 1));
      const expiredAt = new Date() > date ? new Date() : date;
      const hoursValue = `0${expiredAt.getHours()}`.slice(-2);
      const minuteValue = `0${expiredAt.getMinutes()}`.slice(-2);
      setExpireTime(`${hoursValue}:${minuteValue}`);
      onChange({ target: { name: 'expiredAt' } }, expiredAt);
    }
  };

  const _formatDate = (date) => {
    return dayjs(date).format(TIME_FORMAT.YEAR_MONTH_DAY_SLASH);
  };

  const _formatTime = (time) => {
    return time ? dayjs(time).format(TIME_FORMAT.TIME) : undefined;
  };

  const _handleChangeAccessControl = (_event, value) => {
    onChange({ target: { name: 'allowViewer' } }, value);
    onChange({ target: { name: 'requireEmailAuthentication' } }, value);
  };

  const today = new Date(Date.now());

  const _getImageWatermark = () => {
    if (documentId) {
      new RestService()
        .setPath(`/file/${documentId}/thumb/1`)
        .setToken(getToken())
        .setResponseType('arraybuffer')
        .get()
        .then(({ data }) => {
          const URL = window.URL || window.webkitURL;
          const imageUrl = URL.createObjectURL(new Blob([data], { type: 'image/jpeg', encoding: 'UTF-8' }));
          setImageUrl(imageUrl);
        });
    } else {
      new RestService()
        .setPath('/file/latest-document-thumbnail')
        .setToken(getToken())
        .setResponseType('arraybuffer')
        .get()
        .then(({ data }) => {
          const URL = window.URL || window.webkitURL;
          const imageUrl = URL.createObjectURL(new Blob([data], { type: 'image/jpeg', encoding: 'UTF-8' }));
          setImageUrl(imageUrl);
        });
    }
  };

  useEffect(() => {
    const { getToken } = context;

    new RestService()
      .setPath('/setting/nda')
      .setToken(getToken())
      .get()
      .then((res) => {
        if (res.data) {
          const ndaList = res.data.map((i) => ({ key: i.id, text: i.name }));
          setNdaList(ndaList);
        }
      });

    _getImageWatermark();
  }, []);

  return (
    <ThemeContext.Consumer>
      {(theme) => (
        <>
          <Stack grow horizontal={!isMobile} tokens={{ childrenGap: 20 }}>
            <Stack grow disableShrink tokens={{ childrenGap: theme.spacing.m }} styles={sectionStyles}>
              <Text block variant="mediumPlus" styles={titleSectionStyles}>
                Basic Settings
              </Text>
              <Stack.Item>
                <AutoCompleteLinkAccount
                  url="/link/link-account/suggestion-search?keyword="
                  onSelect={onChange}
                  name="linkAccountsId"
                  selectedValue={values.linkAccountsId}
                  inputProps={{
                    label: 'Account',
                    autoFocus: true,
                    placeholder: 'Account',
                    required: true,
                    errorMessage: errors?.linkAccountsId,
                    styles: { fieldGroup: { height: 30 }, field: { fontSize: 13 } },
                  }}
                  searchTextDefault={values.name}
                  onSetLinkAccountName={onSetLinkAccountName}
                />
              </Stack.Item>
              <Checkbox
                name="allowDownload"
                checked={values.allowDownload}
                label="Allow Download"
                onChange={onChange}
              />
              <Stack.Item>
                <Stack grow horizontal wrap styles={{ root: { marginBottom: 16 } }}>
                  <Stack.Item styles={allowCheckboxWrapperStyles}>
                    <Checkbox name="allowExpired" checked={values.allowExpired} label="Expires" onChange={onChange} />
                  </Stack.Item>
                  <Stack.Item grow>
                    <DatePicker
                      name="expiredAt"
                      disabled={!values.allowExpired}
                      placeholder="Select a date..."
                      ariaLabel="Select a date"
                      // DatePicker uses English strings by default. For localized apps, you must override this prop.
                      strings={defaultDatePickerStrings}
                      minDate={today}
                      value={values.expiredAt}
                      onSelectDate={_handleSelectDate}
                      formatDate={_formatDate}
                      textField={{ inputClassName: { fontSize: 13, paddingRight: 8 } }}
                      styles={datePickerStyles}
                    />
                    <TimePickerCustom
                      placeholder="Select a time..."
                      selectedDate={values.expiredAt}
                      expireTime={expireTime}
                      onSelectTime={_handleSelectTime}
                      disabled={!values.allowExpired || !values.expiredAt}
                      formatTime={_formatTime}
                    />
                  </Stack.Item>
                </Stack>
                <Stack grow horizontal wrap verticalAlign="start" styles={{ root: { marginBottom: 16 } }}>
                  <Stack.Item styles={allowCheckboxWrapperStyles} style={{ paddingTop: 6 }}>
                    <Checkbox
                      name="allowPasscode"
                      checked={values.allowPasscode}
                      label="Passcode"
                      onChange={onChange}
                    />
                  </Stack.Item>
                  <Stack.Item grow={1}>
                    <TextField
                      name="passcode"
                      value={values.passcode}
                      disabled={!values.allowPasscode}
                      placeholder="Passcode"
                      onChange={onChange}
                      errorMessage={
                        values.allowPasscode && !values.passcode && errors?.passcode ? errors?.passcode : null
                      }
                      styles={{ fieldGroup: { height: 30 }, field: { fontSize: 13 } }}
                    />
                  </Stack.Item>
                </Stack>
              </Stack.Item>
            </Stack>
            <Separator vertical={!isMobile} styles={isMobile ? { root: { height: 1 } } : undefined} />
            <Stack grow disableShrink tokens={{ childrenGap: theme.spacing.m }} styles={sectionStyles}>
              <Text block variant="mediumPlus" styles={titleSectionStyles}>
                Advanced Settings
              </Text>
              <Stack>
                <Checkbox
                  name="requiredNDA"
                  checked={values.requiredNDA}
                  label="Require NDA to review"
                  styles={advancedSettingCheckbox}
                  onChange={onChange}
                />
                <Dropdown
                  disabled={!values.requiredNDA}
                  placeholder="Select a nda"
                  name="ndaId"
                  options={ndaList}
                  onChange={onChange}
                  defaultSelectedKey={values.ndaId}
                  styles={{ root: { paddingTop: 8 }, title: { height: 30, lineHeight: 28 } }}
                />
              </Stack>
              <Stack>
                <Checkbox
                  name="accessControl"
                  checked={Boolean(values.requireEmailAuthentication || values.allowViewer)}
                  label="Access Control"
                  styles={advancedSettingCheckbox}
                  onChange={_handleChangeAccessControl}
                />
                <Stack.Item styles={accessControlChildren}>
                  <Stack
                    horizontal
                    horizontalAlign="space-between"
                    verticalAlign="center"
                    tokens={{ childrenGap: theme.spacing.l2 }}
                  >
                    <Stack.Item>
                      <Checkbox
                        name="allowViewer"
                        checked={values.allowViewer}
                        label="Allow viewer"
                        styles={advancedSettingCheckbox}
                        onChange={onChange}
                      />
                      {values.allowViewer && (
                        <Text block variant="small" styles={allowViewerTextStyles}>
                          {values.allowedViewers.length} allowed viewer(s)
                        </Text>
                      )}
                    </Stack.Item>
                    <CustomButton
                      size="small"
                      text="Manage"
                      disabled={!values.allowViewer}
                      onClick={() => _toggleModal(MODAL_NAME.MANAGE_VIEWER)}
                    />
                  </Stack>
                  <Checkbox
                    name="requireEmailAuthentication"
                    checked={Boolean(values.requireEmailAuthentication)}
                    label="Require email authentication"
                    styles={advancedSettingCheckbox}
                    onChange={onChange}
                  />
                </Stack.Item>
              </Stack>
              <Stack horizontal horizontalAlign="space-between" verticalAlign="center">
                <Checkbox name="allowWatermark" checked={values.allowWatermark} label="Watermark" onChange={onChange} />
                <CustomButton
                  size="small"
                  text="Customize"
                  disabled={!values.allowWatermark}
                  onClick={() => _toggleModal(MODAL_NAME.CUSTOM_WATERMARK)}
                />
              </Stack>
              <CustomWatermarkForm
                disabled={!values.allowWatermark}
                watermark={values.watermark}
                isOpenModal={modalName === MODAL_NAME.CUSTOM_WATERMARK}
                onToggle={_toggleModal}
                onChangeWatermark={onChange}
                imageWatermarkUrl={imageWatermarkUrl}
              />
            </Stack>
          </Stack>
          <ManageViewerModal
            isOpen={modalName === MODAL_NAME.MANAGE_VIEWER}
            defaultViewers={values.allowedViewers}
            onToggle={_toggleModal}
            onChangeViewers={_handleChangeManageViewer}
          />
        </>
      )}
    </ThemeContext.Consumer>
  );
}
CreateLinkForm.propTypes = {
  onChange: PropTypes.func.isRequired,
  onSetLinkAccountName: PropTypes.func.isRequired,
  values: PropTypes.shape({
    name: PropTypes.string,
    allowDownload: PropTypes.bool,
    allowExpired: PropTypes.bool,
    expiredAt: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    allowPasscode: PropTypes.bool,
    passcode: PropTypes.string,
    allowWatermark: PropTypes.bool,
    requiredNDA: PropTypes.bool,
    accessControl: PropTypes.bool,
    allowViewer: PropTypes.bool,
    requireEmailAuthentication: PropTypes.bool,
    allowedViewers: PropTypes.oneOfType([PropTypes.array]),
    watermark: PropTypes.oneOfType([PropTypes.object]),
    ndaId: PropTypes.number,
    linkAccountsId: PropTypes.number,
  }),
  errors: PropTypes.oneOfType([PropTypes.object]),
  documentId: PropTypes.number,
};
CreateLinkForm.defaultProps = {
  values: {
    allowedViewers: [],
  },
  errors: {},
  documentId: undefined,
};
