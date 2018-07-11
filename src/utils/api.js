import { NetInfo } from 'react-native';

class Api {
  static headers() {
    return {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      dataType: 'json',
    };
  }

  static get(route) {
    return this.xhr(route, { headers: null, body: null }, 'GET');
  }

  static getWithParams(route, params) {
    return this.xhr(route, params, 'GET');
  }

  static put(route, params) {
    return this.xhr(route, params, 'PUT');
  }

  static patch(route, params) {
    return this.xhr(route, params, 'PATCH');
  }

  static post(route, params) {
    return this.xhr(route, params, 'POST');
  }

  static delete(route, params) {
    return this.xhr(route, params, 'DELETE');
  }

  static xhr(route, params, verb) {
    const host = 'https://sandbox.diabetesninja.net/api/v1/';

    const url = `${host}${route}`;
    const options = Object.assign({ method: verb }, Api.getParams(params));

    options.headers = !params.headers
      ? Api.headers()
      : Object.assign(
        {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          dataType: 'json',
        },
        params.headers,
      );
    return Api.NetworkConfirmedApiCall(url, options, params);
  }

  static NetworkConfirmedApiCall(url, options, params) {
    return NetInfo.isConnected.fetch().then((isConnected) => {
      if (isConnected) {
        return Api.ApiCall(url, options, params);
      }

      const error = { status: 999, message: 'Inget nätverk' };
      throw error;
    });
  }

  static ApiCall(url, options, params) {
    return fetch(url, options).then((resp) => {
      if (resp.status >= 200 && resp.status < 400) {
        if (params.noBody) {
          return resp;
        }

        // eslint-disable-next-line no-underscore-dangle
        if (resp._bodyText === '') {
          return '';
        }

        return resp.json();
      }

      throw resp;
    });
  }

  static getParams(params) {
    if (!params) return null;
    if (!params.body) return null;
    return { body: JSON.stringify(params.body) };
  }
}
export default Api;
