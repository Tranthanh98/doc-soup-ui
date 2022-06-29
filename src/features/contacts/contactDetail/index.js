import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getTheme, Stack, Text, FontWeights, Persona, PersonaSize, TooltipHost, TooltipDelay } from '@fluentui/react';
import GlobalContext from 'security/GlobalContext';
import RestService from 'features/shared/services/restService';
import RestServiceHelper from 'features/shared/lib/restServiceHelper';
import { CustomIconButton, CustomText } from 'features/shared/components';
import { success } from 'features/shared/components/ToastMessage';
import { NDAButton } from 'core/components';
import Resource from 'core/constants/Resource';
import { sortGroupData } from 'features/shared/lib/utils';
import ContactBiz from 'core/biz/ContactBiz';
import FileList from './components/FileList';

const theme = getTheme();
const stackControlStyles = {
  root: {
    paddingTop: theme.spacing.l2,
    paddingBottom: theme.spacing.l2,
  },
};
const pageTitleStyles = {
  root: {
    fontWeight: FontWeights.semibold,
    marginRight: 5,
  },
};

class ContactDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contact: undefined,
      files: [],
      thumbnailSrc: {},
      userId: undefined,
    };
  }

  componentDidMount() {
    this._getContact();
    this._listFiles();
    this._getUserId();
  }

  componentWillUnmount() {
    const { thumbnailSrc } = this.state;
    const listThumbnail = Object.values(thumbnailSrc);
    if (listThumbnail.length) {
      listThumbnail.forEach((src) => {
        const URL = window.URL || window.webkitURL;
        URL.revokeObjectURL(src);
      });
    }
  }

  _getUserId = async () => {
    const { getUserInfo } = this.context;
    const user = await getUserInfo();
    if (user) {
      this.setState({ userId: user.id });
    }
  };

  onGetMenuActions = () => {
    const { contact } = this.state;
    const result = {
      items: [
        {
          key: 'archive',
          text: contact && contact.archived ? 'Unarchive Contact' : 'Archive Contact',
          onClick: () => this._onArchivedOrUnarchiveContact(),
        },
      ],
    };

    return result;
  };

  _listFiles = () => {
    const { match } = this.props;
    const { id } = match.params;
    const params = new URL(document.location).searchParams;
    const selectedFileIdParam = params.get('selectedFileId');
    const { getToken } = this.context;
    new RestService()
      .setPath(`/contact/${id}/file`)
      .setToken(getToken())
      .get()
      .then((res) => {
        if (res.data) {
          const fileGroups = res.data.map((file, index) => {
            return {
              ...file,
              level: 0,
              startIndex: index,
              active: false,
              count: 1,
              key: `group${index}`,
              isCollapsed: !(selectedFileIdParam === file.fileId.toString()),
            };
          });

          this.setState({ files: ContactBiz.standardizeFilesOfContact(fileGroups) });
          this._getFileThumbnails(fileGroups);
        }
      })
      .catch((err) => RestServiceHelper.handleError(err));
  };

  _getFileThumbnails = (files) => {
    const { getToken } = this.context;
    files?.forEach((file) => {
      new RestService()
        .setPath(`/file/${file.fileId}/thumb/1?version=${file.version}`)
        .setToken(getToken())
        .setResponseType('arraybuffer')
        .get()
        .then(({ data }) => {
          const URL = window.URL || window.webkitURL;
          const imageUrl = URL.createObjectURL(new Blob([data], { type: 'image/jpeg', encoding: 'UTF-8' }));
          this.setState((state) => ({ thumbnailSrc: { ...state.thumbnailSrc, [file.fileId]: imageUrl } }));
        });
    });
  };

  _getContact = () => {
    const { match } = this.props;
    const { id } = match.params;
    const { getToken } = this.context;
    new RestService()
      .setPath(`/contact/${id}`)
      .setToken(getToken())
      .get()
      .then((res) => {
        if (res.data) {
          const contact = { ...res.data, ...res.data.contact };
          delete contact.contact;
          this.setState({ contact });
        }
      })
      .catch((err) => RestServiceHelper.handleError(err));
  };

  _confirmArchivedUnArchivedContact = () => {
    const { getToken } = this.context;
    const { contact } = this.state;
    new RestService()
      .setPath(`contact/${contact.id}/archive`)
      .setToken(getToken())
      .put({ archived: !contact.archived })
      .then((res) => {
        if (res.data || res.status === 202) {
          this._getContact();
          if (!contact.archived) {
            success('Contact archived succesfully');
          } else {
            success('Contact unarchived succesfully');
          }
        }
      })
      .catch((err) => RestServiceHelper.handleError(err));
  };

  _onArchivedOrUnarchiveContact = () => {
    const { contact } = this.state;
    if (contact && !contact.archived) {
      window.confirm({
        title: Resource.TITLE_ARCHIVE_CONTACT,
        yesText: 'Archive Contact',
        noText: 'Cancel',
        subText: Resource.WARNING_ARCHIVE_CONTACT,
        yesAction: () => this._confirmArchivedUnArchivedContact(),
      });
    } else {
      this._confirmArchivedUnArchivedContact();
    }
  };

  _renderLinkNames = (names) => {
    if (!names || !names.length) {
      return null;
    }
    const linkNames = [...names];
    linkNames.sort(function (a, b) {
      return a.length - b.length;
    });
    const twoFirstLinks = linkNames.splice(0, 2);

    return (
      <Stack horizontal verticalAlign="center">
        <CustomText variant="small" color="textSecondary">
          {twoFirstLinks.join(', ')}
        </CustomText>
        {linkNames.length > 0 ? (
          <TooltipHost
            styles={{ root: { minWidth: 70 } }}
            delay={TooltipDelay.zero}
            tooltipProps={{
              onRenderContent: () =>
                linkNames.map((link, index) => (
                  <div key={index}>
                    {index + 1}. {link}
                  </div>
                )),
            }}
          >
            <CustomText variant="small" color="textSecondary" styles={{ root: { paddingLeft: 5 } }}>
              +{linkNames.length}
            </CustomText>
          </TooltipHost>
        ) : null}
      </Stack>
    );
  };

  _handleSort = (_ev, column, columns) => {
    const { files } = this.state;
    const newGroups = sortGroupData({ sortedColumn: column, columns, groups: files });
    this.setState({ files: newGroups });
  };

  render() {
    const { files, contact, userId, thumbnailSrc } = this.state;
    return (
      <>
        <Stack wrap horizontal horizontalAlign="space-between" tokens={{ childrenGap: 8 }} styles={stackControlStyles}>
          <Stack horizontal verticalAlign="center" tokens={{ childrenGap: 8 }}>
            <Persona hidePersonaDetails size={PersonaSize.size40} initialsColor={15} text={contact?.name} />
            <Stack.Item>
              <div>
                <Text variant="mediumPlus" styles={pageTitleStyles}>
                  {contact?.email}
                </Text>
                {contact?.signedNDA && <NDAButton />}
              </div>
              {this._renderLinkNames(contact?.linkNames)}
            </Stack.Item>
          </Stack>

          {userId === contact?.accountId ? (
            <Stack horizontal tokens={{ childrenGap: 8 }}>
              <CustomIconButton
                menuIconProps={{ iconName: 'more-svg' }}
                title="Actions"
                ariaLabel="Actions"
                menuProps={this.onGetMenuActions()}
              />
            </Stack>
          ) : null}
        </Stack>

        <Stack>
          <FileList items={files} thumbnailSrc={thumbnailSrc} isFullBody onSort={this._handleSort} />
        </Stack>
      </>
    );
  }
}

ContactDetail.propTypes = {
  match: PropTypes.oneOfType([PropTypes.object]).isRequired,
};

ContactDetail.contextType = GlobalContext;
export default ContactDetail;
