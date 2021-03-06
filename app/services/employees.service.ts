import ApiService from "./api.service";

export default class EmployeesService extends ApiService {
  public getAllEmployee() {
    return this.apiGet<any>('/employee',null, true);
  } 
  public updateSlackID(body: any) {
    return this.apiPut<any>('/employee/slackId',body, null, true);
  } 
}