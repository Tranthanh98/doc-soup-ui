import React, { Component } from 'react';
import { ContextualMenu, Icon, Stack, Text, TextField } from '@fluentui/react';
import RestService from 'features/shared/services/restService';
import GlobalContext from 'security/GlobalContext';
import { debounce } from 'lodash';
import PropTypes from 'prop-types';
import { LIGHT_THEME } from 'core/constants/Theme';
import { error, success } from 'features/shared/components/ToastMessage';

export default class AutoCompleteLinkAccount extends Component {
  constructor(props) {
    super(props);

    this.state = {
      items: [],
      searchText: props.searchTextDefault,
      isShowMenu: false,
      isCreateLinkAccount: false,
    };

    this.ref = React.createRef(null);
    this._debounceGetData = debounce((searchText) => this._requestGetData(searchText), 500, { leading: true });
  }

  componentDidUpdate(prevProps, prevState) {
    const { items, searchText } = this.state;
    const { name, onSelect, searchTextDefault } = this.props;

    if (items.length > 0 && prevState.items !== items) {
      const matchItem = items.find((i) => i.name.toLowerCase().trim() === searchText?.toLowerCase()?.trim());
      if (matchItem && typeof onSelect === 'function' && prevProps.selectedValue === undefined) {
        onSelect({ target: { name } }, matchItem.id);
        this.ref.current.focus();
      }
    }

    if (prevProps.searchTextDefault !== searchTextDefault) {
      this._getDefaultSearchText();
    }
  }

  _requestGetData = async (keyword) => {
    if (keyword?.length < 3) {
      return;
    }

    const { getToken } = this.context;

    const { url } = this.props;
    const urlPath = url + keyword;

    try {
      const request = new RestService().setPath(urlPath).setToken(getToken()).get();
      const response = await request;

      this.setState({ items: response.data });
    } catch (e) {
      this.setState({ items: [] });
    }
  };

  _onInputChange = (e) => {
    const { value } = e.target;
    const { name, onSelect, selectedValue, onSetLinkAccountName } = this.props;

    if (typeof onSelect === 'function' && selectedValue !== undefined) {
      onSelect({ target: { name } }, undefined);
    }

    if (typeof onSetLinkAccountName === 'function') {
      onSetLinkAccountName(value);
    }

    this.setState({ searchText: value, items: [], isShowMenu: Boolean(value) }, () => {
      this.ref.current.focus();
      this._debounceGetData(value);
    });
  };

  _getDefaultSearchText = () => {
    const { searchTextDefault } = this.props;

    this.setState({ searchText: searchTextDefault });
  };

  _createNewLinkAccount = () => {
    const { getToken } = this.context;
    const { searchText } = this.state;
    const { onSelect, name } = this.props;

    this.setState({ isCreateLinkAccount: true });

    new RestService()
      .setPath('/link/link-account')
      .setToken(getToken())
      .post({
        name: searchText,
      })
      .then((res) => {
        success(`Create an Account ${searchText} successful`);
        if (typeof onSelect === 'function') {
          onSelect({ target: { name } }, res.data);
          this.ref.current.focus();
          this._onDismiss();
        }
      })
      .catch(() => {
        error(`Create an Account ${searchText} failed`);
      })
      .finally(() => {
        this.setState({ isCreateLinkAccount: false });
      });
  };

  _onChangeSearchText = (value) => {
    this.setState({ searchText: value });
  };

  _getItems = () => {
    const { items, searchText, isCreateLinkAccount } = this.state;
    const { onSelect, name, allowCreateNewAccount, customContextMenuItem } = this.props;

    const onClickItem = (item) => {
      if (typeof onSelect === 'function') {
        this.setState({ searchText: item.name });
        onSelect({ target: { name } }, item.id);
        this.ref.current.focus();
      }
      this._onDismiss();
    };

    let itemList = [];
    if (typeof customContextMenuItem === 'function') {
      itemList = customContextMenuItem(items, onClickItem);
    } else {
      itemList = items.map((i) => ({
        key: i.id,
        text: i.name,
        onClick: () => onClickItem(i),
      }));
    }

    if (
      (items?.length === 0 || !items.find((i) => i.name.toLowerCase() === searchText?.toLowerCase())) &&
      searchText?.length >= 3 &&
      allowCreateNewAccount
    ) {
      itemList.push({
        key: 'createNew',
        disabled: isCreateLinkAccount,
        text: (
          <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 6 }} styles={{ root: { width: '100%' } }}>
            <Icon
              iconName="CircleAdditionSolid"
              color={LIGHT_THEME.palette.themePrimary}
              styles={{ root: { fontSize: 24, color: LIGHT_THEME.palette.themePrimary } }}
            />
            <Text
              styles={{
                root: { whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '90%' },
              }}
            >
              Create new account named “{searchText}”
            </Text>
          </Stack>
        ),
        onClick: () => {
          this._createNewLinkAccount();
        },
        style: {
          minHeight: 40,
          borderTop: `1px solid ${LIGHT_THEME.palette.neutralQuaternaryAlt}`,
        },
        itemProps: {
          styles: { root: { '&:hover': { backgroundColor: 'unset' } } },
        },
      });
    }

    return itemList;
  };

  _onDismiss = () => {
    this.setState({ items: [], isShowMenu: false });
  };

  render() {
    const { searchText, isShowMenu } = this.state;

    const { inputProps } = this.props;

    return (
      <>
        <TextField {...inputProps} value={searchText} onChange={this._onInputChange} elementRef={this.ref} />
        <ContextualMenu
          isBeakVisible={false}
          target={this.ref}
          hidden={!isShowMenu}
          onDismiss={this._onDismiss}
          styles={{
            root: { width: this.ref?.current?.offsetWidth },
            container: { borderRadius: '0 0 4px 4px' },
            subComponentStyles: {
              callout: {
                calloutMain: { borderRadius: 'none' },
                root: { marginTop: 6, borderRadius: 'none', boxShadow: '0 4px 32px 0 rgba(108, 108, 108, 0.12)' },
              },
            },
          }}
          items={this._getItems()}
          shouldFocusOnMount={false}
        />
      </>
    );
  }
}

AutoCompleteLinkAccount.contextType = GlobalContext;

AutoCompleteLinkAccount.propTypes = {
  onSelect: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  inputProps: PropTypes.oneOfType([PropTypes.object]),
  selectedValue: PropTypes.number,
  searchTextDefault: PropTypes.string,
  onSetLinkAccountName: PropTypes.func.isRequired,
  allowCreateNewAccount: PropTypes.bool,
  customContextMenuItem: PropTypes.func,
};

AutoCompleteLinkAccount.defaultProps = {
  inputProps: {},
  selectedValue: undefined,
  searchTextDefault: '',
  allowCreateNewAccount: true,
  customContextMenuItem: undefined,
};
