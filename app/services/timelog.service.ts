import ApiService from "./api.service";

export default class TimeLogService extends ApiService {
  public getMyProject() {
    return this.apiGet<any>('/project/mine',null, true);
  }
  public CreateTimeEntry(body: any) {
    return this.apiPost<any>('/time-entry/', body, null, true);
  }
  public getTimeEntries(start: string, to: string) {
    return this.apiGet<any>(`/time-entry?start=${start}&to=${to}`,null, true);
  }
  public DeleteTimeEntry(id: string) {
    return this.apiDelete<any>(`/time-entry/${id}`,null, true);
  }
  public UpdateTimeEntry(body: any, id: string) {
    return this.apiPut<any>(`/time-entry/${id}`, body, null, true);
  }
}