import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  getTheme,
  Stack,
  TextField,
  PrimaryButton,
  DefaultButton,
  IconButton,
  Link,
  FontWeights,
  Separator,
} from '@fluentui/react';
import { CustomModal, CustomDetailsList, CustomText } from 'features/shared/components';
import { TextMessage } from 'core/constants/Resource';
import { BREAKPOINTS_RESPONSIVE } from 'core/constants/Theme';

const theme = getTheme();
const removeIconButtonStyles = {
  root: {
    height: '100%',
  },
  icon: {
    color: theme.palette.red,
  },
};
const textFieldStyles = {
  root: {
    minWidth: 310,
    width: '100%',
    [BREAKPOINTS_RESPONSIVE.mdDown]: {
      minWidth: 0,
    },
  },
  fieldGroup: {
    height: 30,
  },
};
const guideStyles = {
  root: {
    maxWidth: 360,
    marginTop: 8,
    marginBottom: 16,
  },
};
const renderRemoveIconButton = (item, onRemove) => (
  <IconButton
    iconProps={{ iconName: 'Cancel' }}
    title="Remove"
    ariaLabel="Remove"
    styles={removeIconButtonStyles}
    onClick={() => onRemove(item)}
  />
);

class ManageViewerModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mailAddress: '',
      listMailAddress: [],
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (props.defaultViewers !== state.defaultViewers) {
      return {
        defaultViewers: props.defaultViewers,
        listMailAddress: props.defaultViewers,
      };
    }
    return null;
  }

  _toggleModal = () => {
    const { onToggle } = this.props;
    this.setState({ defaultViewers: undefined, isCopied: false });
    onToggle();
  };

  _removeMailAddress = (item) => {
    const { listMailAddress } = this.state;
    const newList = listMailAddress.filter((e) => e.mailAddress !== item.mailAddress);
    this.setState({ listMailAddress: newList, isCopied: false });
  };

  _removeAllMailAddress = () => {
    this.setState({ listMailAddress: [], isCopied: false });
  };

  _handleChangeText = (event) => {
    const { value } = event.target;
    this.setState({ mailAddress: value });
  };

  _addMailAddress = (event) => {
    const { mailAddress } = this.state;
    event.preventDefault();
    if (mailAddress) {
      const regexDomain = /^\w+([.-]?\w+)*(\.\w{2,3})+$/;
      let newList = mailAddress.trim().replaceAll(' ', '').split(',');
      newList = newList
        .filter((i) => i)
        .map((item) => {
          if (item.match(regexDomain)) {
            return { mailAddress: item, isDomain: true };
          }
          return { mailAddress: item };
        });
      this.setState((state) => {
        const listMail = [...state.listMailAddress];

        // eslint-disable-next-line no-restricted-syntax
        for (const item of newList) {
          if (!listMail.find((m) => m.mailAddress === item.mailAddress)) {
            listMail.push(item);
          }
        }

        return {
          listMailAddress: listMail,
          mailAddress: '',
          isCopied: false,
        };
      });
    }
  };

  _copyToClipboard = () => {
    const { listMailAddress } = this.state;
    const listMailCopy = listMailAddress.map((e) => e.mailAddress).join(', ');
    navigator.clipboard.writeText(JSON.stringify(listMailCopy));
    this.setState({ isCopied: true });
  };

  render() {
    const { mailAddress, listMailAddress, isCopied } = this.state;
    const { isOpen, onChangeViewers } = this.props;
    const columnsSchema = [
      {
        key: 'mailAddress',
        name: 'Mail Address',
        fieldName: 'mailAddress',
        ariaLabel: 'Mail',
        isRowHeader: true,
        data: 'string',
      },
      {
        key: 'action',
        name: 'action',
        iconName: 'Page',
        fieldName: 'action',
        minWidth: 16,
        onRender: (item) => renderRemoveIconButton(item, this._removeMailAddress),
      },
    ];

    return (
      <CustomModal
        title="Allowed viewers"
        isOpen={isOpen}
        onDismiss={this._toggleModal}
        primaryButtonProps={{
          text: 'OK',
          onClick: () => onChangeViewers(listMailAddress),
        }}
      >
        <form onSubmit={this._addMailAddress}>
          <Stack horizontal verticalAlign="end" horizontalAlign="end" tokens={{ childrenGap: 8 }}>
            <TextField
              autoFocus
              label="Email Address/Domain"
              placeholder="Allowed viewers"
              name="mailAddress"
              value={mailAddress}
              styles={textFieldStyles}
              onChange={this._handleChangeText}
            />
            <PrimaryButton
              type="submit"
              text="Add"
              styles={{ root: { marginBottom: 0, height: 30, borderRadius: 2 } }}
              disabled={!mailAddress}
            />
          </Stack>
        </form>
        <CustomText block variant="small" color="textSecondary" styles={guideStyles}>
          {TextMessage.ADD_EMAIL_MESSAGE}
        </CustomText>
        <Stack styles={{ root: { height: '35vh' } }}>
          {listMailAddress?.length > 0 && (
            <>
              <CustomText
                block
                variant="smallPlus"
                color="textSecondary"
                styles={{ root: { fontWeight: FontWeights.semibold } }}
              >
                Allow List ({listMailAddress.length})
              </CustomText>
              <Separator />
              <CustomDetailsList
                detailListProps={{ isHeaderVisible: false }}
                compact
                maxHeight="24vh"
                columns={columnsSchema}
                items={listMailAddress}
              />
              <br />
              <Stack horizontal verticalAlign="center" horizontalAlign="space-between">
                <DefaultButton
                  styles={{ root: { height: 30, borderRadius: 2 } }}
                  text={isCopied ? 'Copied!' : 'Copy to Clipboard'}
                  onClick={this._copyToClipboard}
                />
                <Link onClick={this._removeAllMailAddress}>
                  <CustomText block variant="small" color="textDanger">
                    Remove all
                  </CustomText>
                </Link>
              </Stack>
            </>
          )}
        </Stack>
      </CustomModal>
    );
  }
}
ManageViewerModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  onChangeViewers: PropTypes.func.isRequired,
  defaultViewers: PropTypes.oneOfType([PropTypes.array]),
};
ManageViewerModal.defaultProps = {
  defaultViewers: [],
};
export default ManageViewerModal;
