import React, { Component } from 'react';
import PropTypes from 'prop-types';
import GlobalContext from 'security/GlobalContext';
import RestService from 'features/shared/services/restService';
import RestServiceHelper from 'features/shared/lib/restServiceHelper';
import eventBus from 'features/shared/lib/eventBus';
import domainEvents from 'features/shared/domainEvents';
import { CustomModal, CustomText } from 'features/shared/components';
import { Stack, Separator, Text, FontWeights, Nav, Persona, PersonaSize } from '@fluentui/react';
import { MODAL_NAME } from 'core/constants/Const';
import { BREAKPOINTS_RESPONSIVE } from 'core/constants/Theme';
import ListLinkEmpty from './ListLinkEmpty';
import LinkSettingForm from './LinkSettingForm';

const linkNameStyles = {
  root: {
    maxWidth: 150,
    overflow: 'hidden',
  },
};
const listLinkStyles = (props) => {
  const { isSelected, theme } = props;
  return {
    compositeLink: {
      backgroundColor: isSelected ? theme.palette.themeLighterAlt : 'transparent',
    },
    link: {
      padding: '0 10px',
      background: isSelected ? 'transparent' : 'inherit',
      fontWeight: isSelected && FontWeights.semibold,
      borderBottom: `1px solid ${theme.palette.neutralQuaternaryAlt}`,
      height: 44,
      lineHeight: 'auto',
      selectors: {
        '&::after': {
          border: 0,
        },
      },
    },
  };
};
const stackContainerStyles = {
  root: {
    selectors: {
      [BREAKPOINTS_RESPONSIVE.mdDown]: {
        flexDirection: 'column',
        marginTop: -15,
      },
    },
  },
};
const separatorStyles = {
  root: {
    padding: '0 20px',
    selectors: {
      [BREAKPOINTS_RESPONSIVE.mdDown]: {
        display: 'none',
      },
    },
  },
};
const advancedSettingStyles = {
  root: {
    width: 420,
    selectors: {
      [BREAKPOINTS_RESPONSIVE.mdDown]: {
        minWidth: 'auto',
        width: 'auto',
      },
    },
  },
};

class ModifyPermissionModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataRoomLinks: [],
      ndas: [],
      selectedLink: undefined,
      isSubmitting: false,
      isModifySuccess: false,
      values: {
        active: false,
        requiredEmail: false,
        allowDownload: false,
        requiredNDA: false,
      },
      initialSecure: {},
    };
  }

  componentDidMount() {
    this._listDataRoomLinks();
    this._listNDAs();
    eventBus.subscribe(this, domainEvents.LINK_ONCHANGE_DOMAINEVENT, (event) => {
      this._handleEvent(event);
    });
  }

  componentWillUnmount() {
    eventBus.unsubscribe(this);
  }

  _listDataRoomLinks = () => {
    const { getToken } = this.context;
    const { dataRoomId } = this.props;
    new RestService()
      .setPath(`/data-room/${dataRoomId}/link`)
      .setToken(getToken())
      .get()
      .then((res) => {
        if (res.data) {
          const { selectedLink: oldSelectedLink } = this.state;
          const dataRoomLinks = res.data.map((item) => ({
            ...item,
            key: item.id,
          }));
          this.setState({ dataRoomLinks, isSubmitting: false, isModifySuccess: true });
          if (!oldSelectedLink) {
            this._selectLink(dataRoomLinks[0]);
          }
        }
      })
      .catch((err) => RestServiceHelper.handleError(err));
  };

  _listNDAs = () => {
    const { getToken } = this.context;
    new RestService()
      .setPath('/setting/nda')
      .setToken(getToken())
      .get()
      .then((res) => {
        if (res.data) {
          const ndas = res.data.map((i) => ({ key: i.id, text: i.name }));
          this.setState({ ndas });
        }
      });
  };

  _savePermission = () => {
    const { values, selectedLink, initialSecure } = this.state;
    const { getToken } = this.context;
    this.setState({ isSubmitting: true, isModifySuccess: false });
    const secure = { ...initialSecure, email: values.requiredEmail, nda: values.requiredNDA };
    const putValues = {
      ...selectedLink,
      disabled: !values.active,
      download: values.allowDownload,
      ndaId: values.ndaId,
      secure: JSON.stringify(secure),
    };
    new RestService()
      .setPath(`/link/${selectedLink.id}/setting`)
      .setToken(getToken())
      .put(putValues)
      .then(() => {
        this._listDataRoomLinks();
      })
      .catch((err) => {
        this.setState({ isSubmitting: false });
        RestServiceHelper.handleError(err);
      });
  };

  _toggleHideModal = () => {
    const { onToggle } = this.props;
    onToggle('');
  };

  _selectLink = (selectedLink) => {
    const secure = selectedLink?.secure ? JSON.parse(selectedLink.secure) : {};
    this.setState({
      selectedLink,
      isSubmitting: false,
      isModifySuccess: false,
      values: {
        active: !selectedLink?.disabled,
        requiredEmail: !!secure?.email,
        allowDownload: selectedLink?.download,
        requiredNDA: !!secure?.nda,
        ndaId: selectedLink?.ndaId,
      },
      initialSecure: secure,
    });
  };

  _changeSettingValues = (values) => {
    this.setState({ values });
  };

  _renderLinkItem = (item) => (
    <Stack
      horizontal
      horizontalAlign="space-between"
      verticalAlign="center"
      tokens={{ childrenGap: 8 }}
      styles={{ root: { width: '100%', height: '100%' } }}
      onClick={() => this._selectLink(item)}
    >
      <Text variant="smallPlus" styles={linkNameStyles}>
        {item?.name}
      </Text>
      <Stack disableShrink align="center">
        <Persona hidePersonaDetails size={PersonaSize.size24} text={item?.createdByName} />
      </Stack>
    </Stack>
  );

  /* Events */
  _handleEvent = (event) => {
    const { action, receivers } = event.message;
    if (receivers === undefined || receivers.includes(domainEvents.DES.MODIFY_PERMISSION_MODAL)) {
      switch (action) {
        case domainEvents.ACTION.ADD:
          this._listDataRoomLinks();
          break;
        default:
          break;
      }
    }
  };
  /* End Events */

  render() {
    const { dataRoomLinks, selectedLink, values, isSubmitting, isModifySuccess, ndas } = this.state;
    const { isOpen, onToggle, aggregateContent, files, thumbnailSrcs } = this.props;
    if (!dataRoomLinks?.length) {
      return (
        <CustomModal title="Share this Space" isOpen={isOpen} onDismiss={this._toggleHideModal}>
          <ListLinkEmpty onBtnPrimaryClick={() => onToggle(MODAL_NAME.CREATE_LINK)} />
        </CustomModal>
      );
    }
    return (
      <CustomModal
        title="Modify Permissions"
        isOpen={isOpen}
        onDismiss={this._toggleHideModal}
        isSubmitting={isSubmitting}
        primaryButtonProps={{
          iconProps: isModifySuccess && { iconName: 'CheckMark' },
          text: 'Save permissions',
          onClick: this._savePermission,
          disabled: isSubmitting,
        }}
      >
        <Stack horizontal styles={stackContainerStyles}>
          <Stack.Item styles={{ root: { minWidth: 208 } }}>
            <CustomText block color="textSecondary">
              All Data Room Links
            </CustomText>
            <br />
            <Nav
              selectedKey={selectedLink?.key}
              groups={[{ links: dataRoomLinks }]}
              onRenderLink={this._renderLinkItem}
              styles={listLinkStyles}
            />
          </Stack.Item>
          <Separator vertical styles={separatorStyles} />
          <Stack grow={1} tokens={{ childrenGap: 16 }} styles={advancedSettingStyles}>
            <CustomText block color="textSecondary">
              Advanced Settings
            </CustomText>
            <LinkSettingForm
              linkData={selectedLink}
              ndas={ndas}
              values={values}
              aggregateContent={aggregateContent}
              files={files}
              thumbnailSrcs={thumbnailSrcs}
              onChangeFormValues={this._changeSettingValues}
            />
          </Stack>
        </Stack>
      </CustomModal>
    );
  }
}
ModifyPermissionModal.contextType = GlobalContext;
ModifyPermissionModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  dataRoomId: PropTypes.string,
  aggregateContent: PropTypes.oneOfType([PropTypes.array, undefined]),
  files: PropTypes.oneOfType([PropTypes.array, undefined]),
  thumbnailSrcs: PropTypes.oneOfType([PropTypes.object]),
};
ModifyPermissionModal.defaultProps = {
  dataRoomId: undefined,
  files: undefined,
  aggregateContent: undefined,
  thumbnailSrcs: {},
};
export default ModifyPermissionModal;
