import React, { Component } from 'react';
import GlobalContext from 'security/GlobalContext';
import RestService from 'features/shared/services/restService';
import RestServiceHelper from 'features/shared/lib/restServiceHelper';
import { Stack, ThemeContext } from '@fluentui/react';
import { WatermarkForm } from 'core/components';
import { BREAKPOINTS_RESPONSIVE } from 'core/constants/Theme';

const stackItemStyles = (theme) => ({
  root: {
    padding: 40,
    width: '100%',
    backgroundColor: theme.palette.grayLight,
    [BREAKPOINTS_RESPONSIVE.md]: {
      padding: `20px 24px`,
    },
    [BREAKPOINTS_RESPONSIVE.sm]: {
      padding: `20px 24px`,
    },
  },
});
const wrapperForm = {
  root: {
    width: '100%',
    [BREAKPOINTS_RESPONSIVE.md]: {
      maxWidth: 390,
      margin: 'auto',
    },
    [BREAKPOINTS_RESPONSIVE.sm]: {
      maxWidth: 282,
      margin: 'auto',
    },
  },
};
class Watermark extends Component {
  constructor(props) {
    super(props);
    this.state = {
      defaultWatermark: undefined,
      imageWatermarkUrl: undefined,
    };
  }

  componentDidMount() {
    this._getDefaultWatermark();
    this._getImageWatermark();
  }

  _getImageWatermark = () => {
    const { getToken } = this.context;

    new RestService()
      .setPath('/file/latest-document-thumbnail')
      .setToken(getToken())
      .setResponseType('arraybuffer')
      .get()
      .then(({ data }) => {
        const URL = window.URL || window.webkitURL;
        const imageUrl = URL.createObjectURL(new Blob([data], { type: 'image/jpeg', encoding: 'UTF-8' }));
        this.setState({ imageWatermarkUrl: imageUrl });
      });
  };

  _getDefaultWatermark = () => {
    const { getToken } = this.context;
    new RestService()
      .setPath('/setting/watermark/default')
      .setToken(getToken())
      .get()
      .then((res) => {
        let defaultWatermark = {};
        if (res.data && res.data?.text !== '{}') {
          defaultWatermark = { id: res.data.id, ...JSON.parse(res.data.text) };
        }
        this.setState({ defaultWatermark });
      })
      .catch((err) => RestServiceHelper.handleError(err));
  };

  _submitWatermark = (values, formProps) => {
    const { getToken } = this.context;
    const formData = new FormData();
    // formData.append('image', new Blob());
    formData.append('isDefault', true);
    formData.append('text', JSON.stringify(values));
    if (values.id) {
      // update watermark
      new RestService()
        .setPath(`/setting/watermark/${values.id}`)
        .setToken(getToken())
        .put(formData)
        .then(() => {
          formProps.setStatus(true);
        })
        .catch((err) => RestServiceHelper.handleError(err))
        .finally(() => formProps.setSubmitting(false));
    } else {
      // add watermark
      new RestService()
        .setPath('/setting/watermark/')
        .setToken(getToken())
        .post(formData)
        .then(() => {
          formProps.setStatus(true);
        })
        .catch((err) => RestServiceHelper.handleError(err))
        .finally(() => formProps.setSubmitting(false));
    }
  };

  render() {
    const { defaultWatermark, imageWatermarkUrl } = this.state;
    return (
      <ThemeContext.Consumer>
        {(theme) => {
          return (
            <Stack styles={stackItemStyles(theme)}>
              <Stack.Item styles={wrapperForm}>
                <WatermarkForm
                  isDataLoaded={!!defaultWatermark}
                  defaultWatermark={defaultWatermark || {}}
                  onSubmit={this._submitWatermark}
                  imageUrl={imageWatermarkUrl}
                />
              </Stack.Item>
            </Stack>
          );
        }}
      </ThemeContext.Consumer>
    );
  }
}
Watermark.contextType = GlobalContext;
export default Watermark;
