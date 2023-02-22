import React, { Component } from 'react';
import PropTypes from 'prop-types';
import GlobalContext from 'security/GlobalContext';
import RestService from 'features/shared/services/restService';
import RestServiceHelper from 'features/shared/lib/restServiceHelper';
import { ErrorPage, LoadingPage } from 'features/shared/components';
import { PreviewFileFrame } from 'core/components';

class FilePreview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      docId: undefined,
    };
  }

  componentDidMount() {
    this._getLinkInfo();
  }

  _getLinkInfo = async () => {
    const { match } = this.props;
    const { id } = match.params;
    const { getToken } = this.context;
    new RestService()
      .setPath(`/file/${id}/preview`)
      .setToken(getToken())
      .get()
      .then((res) => {
        const docId = res.data;
        this.setState({ docId });
      })
      .catch((err) => RestServiceHelper.handleError(err))
      .finally(() => this.setState({ isLoading: false }));
  };

  render() {
    const { isLoading, docId } = this.state;
    if (isLoading) {
      return <LoadingPage />;
    }
    if (docId) {
      return <PreviewFileFrame fileInfo={{ docId }} isFilePreview />;
    }
    return <ErrorPage.DocumentNotAvailable />;
  }
}
FilePreview.contextType = GlobalContext;
FilePreview.propTypes = {
  match: PropTypes.oneOfType([PropTypes.object]).isRequired,
};
export default FilePreview;
