import { error as toastError } from '../components/ToastMessage';

class RestServiceHelper {
  constructor() {
    this._errorMessage = {
      400: 'You’ve sent a bad request.',
      401: 'Your session were expired!',
      403: 'We’re sorry, You don’t have access to the page you requested. Please go back.',
      404: 'Sorry, The page you’re looking for doesn’t exist.',
      500: 'Our operators have been notified and are working to fix this. Please try again in a few minutes',
    };
  }

  handleResponse(response) {
    if (response.status >= 200 && response.status < 300) {
      return { data: response.data };
    }

    return { error: response.data };
  }

  handleError(error, formProps, isShowPopup = true) {
    let { message } = error;
    let fieldErrors;

    if (!error.response) {
      window.alert(message);
      return;
    }

    const { status, data } = error.response;

    const errorMessage = data?.message || this._errorMessage[status];
    if (status === 401) {
      window.confirm({
        title: this._errorMessage[401],
        subText: 'Please reload the page.',
        yesAction: () => window.location.reload(),
      });
      return;
    }
    if (status === 500) {
      window.location.href = '/internal-error';
      return;
    }

    if (error.response && error.response.data) {
      message = error.response.data.message || error.response.data?.data;
      fieldErrors = error.response.data.fieldErrors || {};
    }

    if (formProps) {
      if (typeof fieldErrors === 'object') {
        Object.keys(fieldErrors).forEach((key) => {
          formProps.setFieldError(key, fieldErrors[key]);
        });
      }
      if (message) {
        toastError(message);
        return;
      }
    } else {
      window.alert(message || this._errorMessage[status]);
      return;
    }

    if (errorMessage && isShowPopup) {
      window.alert(errorMessage);
    }
  }
}

export default new RestServiceHelper();
