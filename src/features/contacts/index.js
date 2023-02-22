import React, { Component } from 'react';
import { getTheme, Stack, Text, FontWeights, Checkbox, Pivot, PivotItem } from '@fluentui/react';
import GlobalContext from 'security/GlobalContext';
import RestService from 'features/shared/services/restService';
import RestServiceHelper from 'features/shared/lib/restServiceHelper';
import { success } from 'features/shared/components/ToastMessage';
import { FILTER_MODE } from 'core/constants/Const';
import Resource from 'core/constants/Resource';
import { LoadingPage } from 'features/shared/components';
import ContactList from './components/ContactList';
import EmptyContact from './components/EmptyContact';

const theme = getTheme();
const stackControlStyles = {
  root: {
    paddingBottom: theme.spacing.l2,
  },
};
const pageTitleStyles = {
  root: {
    fontWeight: FontWeights.bold,
  },
};

class Contacts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contacts: [],
      includeArchived: false,
      userId: undefined,
      selectedPivotKey: FILTER_MODE.all,
      loadingContact: true,
    };
  }

  componentDidMount() {
    const { selectedPivotKey } = this.state;
    this._listContacts(selectedPivotKey);
    this._getUserId();
  }

  _getUserId = async () => {
    const { getUserInfo } = this.context;
    const user = await getUserInfo();
    if (user) {
      this.setState({ userId: user.id });
    }
  };

  _listContacts = (mode, includeArchived = false) => {
    const { getToken } = this.context;
    new RestService()
      .setPath(`/contact?includeArchived=${includeArchived}&mode=${mode}`)
      .setToken(getToken())
      .get()
      .then((res) => {
        if (res.data) {
          this.setState({ contacts: res.data, loadingContact: false });
        }
      })
      .catch((err) => RestServiceHelper.handleError(err));
  };

  _updateArchivedStatus = (contact) => {
    if (contact && !contact.archived) {
      window.confirm({
        title: Resource.TITLE_ARCHIVE_CONTACT,
        yesText: 'Archive Contact',
        noText: 'Cancel',
        subText: Resource.WARNING_ARCHIVE_CONTACT,
        yesAction: () => this._confirmArchivedUnArchivedContact(contact),
      });
    } else {
      this._confirmArchivedUnArchivedContact(contact);
    }
  };

  _confirmArchivedUnArchivedContact = (contact) => {
    const { getToken } = this.context;
    const { includeArchived, selectedPivotKey } = this.state;
    new RestService()
      .setPath(`contact/${contact.contactId}/archive`)
      .setToken(getToken())
      .put({ archived: !contact.archived })
      .then((res) => {
        if (res.data || res.status === 202) {
          this._listContacts(selectedPivotKey, includeArchived);
          if (!contact.archived) {
            success('Contact archived successfully');
          } else {
            success('Contact unarchived successfully');
          }
        }
      })
      .catch((err) => RestServiceHelper.handleError(err));
  };

  _onArchivedContactChange = (ev, isChecked = false) => {
    const { selectedPivotKey } = this.state;
    this.setState({ includeArchived: isChecked });
    this._listContacts(selectedPivotKey, isChecked);
  };

  _setSelectedPivot = (item) => {
    const { includeArchived } = this.state;
    this.setState({ selectedPivotKey: item.props.itemKey });
    this._listContacts(item.props.itemKey, includeArchived);
  };

  render() {
    const { contacts, includeArchived, userId, selectedPivotKey, loadingContact } = this.state;
    return loadingContact ? (
      <LoadingPage />
    ) : (
      <>
        <Stack horizontal horizontalAlign="space-between" tokens={{ childrenGap: 8 }} styles={stackControlStyles}>
          <Text variant="xLarge" styles={pageTitleStyles}>
            Contacts
          </Text>
        </Stack>
        {contacts.length > 0 ? (
          <>
            <Stack
              className="hiddenMdDown"
              horizontal
              horizontalAlign="end"
              style={{ width: '100%', position: 'relative' }}
            >
              <Checkbox
                styles={{ root: { position: 'absolute', marginTop: 13, zIndex: 1 } }}
                label="Include archived contacts"
                value={includeArchived}
                onChange={this._onArchivedContactChange}
              />
            </Stack>
            <Pivot
              aria-label="Contacts Pivot"
              selectedKey={selectedPivotKey}
              onLinkClick={this._setSelectedPivot}
              styles={{ itemContainer: { paddingBottom: 18 } }}
            >
              <PivotItem headerText="All" itemKey={FILTER_MODE.all}>
                <Stack className="hiddenLgUp" style={{ marginTop: 13 }} horizontal>
                  <Checkbox
                    label="Include archived contacts"
                    value={includeArchived}
                    onChange={this._onArchivedContactChange}
                  />
                </Stack>
                <ContactList items={contacts} userId={userId} onUpdateArchivedStatus={this._updateArchivedStatus} />
              </PivotItem>
              <PivotItem headerText="Personal" itemKey={FILTER_MODE.personal}>
                <ContactList items={contacts} userId={userId} onUpdateArchivedStatus={this._updateArchivedStatus} />
              </PivotItem>
            </Pivot>
          </>
        ) : (
          <EmptyContact
            title="No Contacts"
            subTitle="Show visitors' contact information about the shared link."
            imageProps={{
              src: '/img/no-contact.png',
              srcSet: '/img/no-contact2x.png 2x, /img/no-contact3x.png 3x',
              alt: 'Empty data room content',
            }}
            primaryButtonProps={{
              size: 'large',
              iconProps: { iconName: 'share-svg' },
              text: 'Share',
            }}
          />
        )}
      </>
    );
  }
}
Contacts.contextType = GlobalContext;
export default Contacts;
