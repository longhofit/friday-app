import ApiService from "./api.service";

export default class ProjectService extends ApiService {
  public getProjects() {
    const params = { pageIndex: 1, pageSize: 100 };
    return this.apiGet<any>('/project/', params, true);
  }
}