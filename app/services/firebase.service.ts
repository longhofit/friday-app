import ApiService from "./api.service";

export default class FirebaseService extends ApiService {
  public pushNotification(body: any) {
    return this.apiPost<any>('/notification/subscribe', body, null, true);
  }
}