import ApiService from "./api.service";

export default class SettingService extends ApiService {
  public getPolicy(token: string) {
    return this.apiGet<any>('/policy',null, true, token);
  } 
}