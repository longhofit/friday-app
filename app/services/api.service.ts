import axios, { AxiosRequestConfig, Method } from 'axios';
import queryString from 'query-string';
import { SERVER_ADDRESS, API_URL } from '../../config';
import { store } from '../../core/store'

interface RequestHeader {
  Accept: string;
  'Content-Type': string;
  Authorization?: string;
}

export default class ApiService {
  protected apiGet<T>(
    url: string,
    params: object = null,
    hasToken: boolean = false,
  ): Promise<T> {
    return this.apiRun<T>('get', url, null, params, hasToken);
  }

  protected apiPost<T>(
    url: string,
    body: any = null,
    params: object = {},
    hasToken: boolean = false,
  ): Promise<T> {
    return this.apiRun<T>('post', url, body, params, hasToken);
  }

  protected apiPut<T>(
    url: string,
    body: any = null,
    params: object = {},
    hasToken: boolean = false,
  ): Promise<T> {
    return this.apiRun<T>('put', url, body, params, hasToken);
  }

  protected apiDelete<T>(
    url: string,
    body: any = null,
    params: object = {},
    hasToken: boolean = false,
  ): Promise<T> {
    return this.apiRun<T>('delete', url, body, params, hasToken);
  }

  private apiRun<T>(
    method: Method,
    url: string,
    body: any = null,
    params: object = {},
    hasToken: boolean = false,
  ): Promise<T> {
    const requestConfig: AxiosRequestConfig = {
      url,
      method,
      baseURL: `${SERVER_ADDRESS}${API_URL}`,
      params,
      data: body,
      headers: this.appendHeaders(hasToken),
      withCredentials: true,
    };
    console.log(requestConfig.data,'requestConfig')
    console.log(body,'body')
    return new Promise<T>((resolve, reject) => {
      axios(requestConfig)
        .then((a) => {
          resolve(a.data);
          if (a.status !== 200) {
            reject(a.data);
          }
        })
        .catch((error) => {
          const errorData = !error.response ? undefined : error.response.data;
          reject(errorData);
        });
    });
  }

  private appendHeaders(hasToken: boolean = false): RequestHeader {
    const { accessToken } = store.getState().session;

    const headers: RequestHeader = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };

    if (hasToken) {
      headers.Authorization = `Bearer ${accessToken}`;
    }

    return headers;
  }
}
