import axios, { AxiosRequestConfig, Method } from 'axios';
import queryString from 'query-string';
import { SERVER_ADDRESS, API_URL } from '../../config';

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
    token: string,
  ): Promise<T> {
    return this.apiRun<T>('get', url, null, params, hasToken, token);
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
    token: string,
  ): Promise<T> {
    return this.apiRun<T>('put', url, body, params, hasToken, token);
  }

  protected apiDelete<T>(
    url: string,
    params: object = {},
    hasToken: boolean = false,
  ): Promise<T> {
    return this.apiRun<T>('delete', url, null, params, hasToken);
  }

  private apiRun<T>(
    method: Method,
    url: string,
    body: any = null,
    params: object = {},
    hasToken: boolean = false,
    token?: string,
  ): Promise<T> {
    const requestConfig: AxiosRequestConfig = {
      url,
      method,
      baseURL: `${SERVER_ADDRESS}${API_URL}`,
      params,
      data: body,
      headers: this.appendHeaders(hasToken, token),
      withCredentials: true,
    };
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

  private appendHeaders(hasToken: boolean = false, token?: string): RequestHeader {
    const headers: RequestHeader = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return headers;
  }
}
