import ApiService from "./api.service";

export default class ProfileService extends ApiService {
  public getEmployee() {
    return this.apiGet<any>('/employee/me',null, true);
  }
  public updateMySlackID(body: any) {
    return this.apiPut<any>('/employee/me/slackId',body, null, true);
  } 
}