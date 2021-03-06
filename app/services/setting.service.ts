import ApiService from "./api.service";

export default class SettingService extends ApiService {
  public getPolicy() {
    return this.apiGet<any>('/policy',null, true);
  }
  public updatePolicy(body: any) {
    return this.apiPut<any>('/policy',body, null, true);
  } 
}