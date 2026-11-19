import Snackbar from "./Snackbar";
import Navigate from "./Navigate";


const DEFAULT_ERROR_MESSAGE = 'Se ha producido un error'

function selectErrorKeyOrMessage(error: any) {
  if (error && error.response && error.response.data) {
    const { data } = error.response;

    if (data.error && data.error.message) {
      return data.error.message;
    }

    if (data.error) {
      return data.error;
    }

    if (data.message) {
      return data.message
    }

    return String(data);
  }

  return error.message || DEFAULT_ERROR_MESSAGE;
}

function selectErrorMessage(error: any) {
  const key = selectErrorKeyOrMessage(error);

  return key;
}

function selectErrorCode(error: any) {
  if (error && error.response && error.response.status) {
    return error.response.status;
  }

  if (typeof error.status === 'number') {
    return error.status
  }

  if (error.statusCode) {
    return error.statusCode
  }

  return 500;
}

export default class Errors {
  static handle(error: any) {
    if (process.env.NODE_ENV !== 'test') {
      console.error(selectErrorMessage(error));
      console.error(error);
    }

    if (selectErrorCode(error) === 401) {
      // deslogeo authService.signout();
      return;
    }

    if (selectErrorCode(error) === 403) {
      Navigate.to('/403');
      return;
    }

    if (selectErrorCode(error) === 404) {
      Navigate.to('/404');
      return;
    }

    if ([400, 429].includes(selectErrorCode(error))) {
      Snackbar.error(selectErrorMessage(error));
      return;
    }

    Navigate.to('/500');
  }

  static errorCode(error: any) {
    return selectErrorCode(error);
  }

  static selectMessage(error: any) {
    return selectErrorMessage(error);
  }

  static showMessage(error: any) {
    Snackbar.error(selectErrorMessage(error));
  }
}
