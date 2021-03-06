import ApiService from "./api.service";

export default class EmployeesService extends ApiService {
  public getAllEmployee(token: string) {
    return this.apiGet<any>('/employee',null, true, token);
  } 
  public updateSlackID(token: string, body: any) {
    return this.apiPut<any>('/employee/slackId',body, null, true, token);
  } 
}