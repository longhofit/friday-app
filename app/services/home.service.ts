import ApiService from "./api.service";

export default class HomeService extends ApiService {
  public getAllMyRequest() {
    return this.apiGet<any>('/request/my', { start: '2021-01-01', end: '2021-12-31' }, true);
  }

  public getAllRequestLeaveByDate(param: { start: string, end: string }) {
    return this.apiGet<any>('/request/all', param, true);
  }

  public applyLeave(leaveForm) {
    return this.apiPost<any>('/request', leaveForm, null, true);
  }

  public deleteLeave(id) {
    return this.apiDelete<any>('/request', null, { id }, true);
  }
}