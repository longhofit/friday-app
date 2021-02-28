import ApiService from "./api.service";

export default class HomeService extends ApiService {
  public getAllRequest(token: string) {
    return this.apiGet<any>('/request/my', { start: '2021-01-01', end: '2021-12-31' }, true, token);
  }
}