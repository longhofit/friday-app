import ApiService from "./api.service";

interface AddNewProjectReq {
  code: string,
  name: string,
  owner: string,
  status: string,
  projectBase: string,
  type: string,
  timeLogFrequency: string,
  ticketPrefix: string,
}

export default class ProjectService extends ApiService {
  public getProjects() {
    const params = { pageIndex: 1, pageSize: 100 };
    return this.apiGet<any>('/project/', params, true);
  }

  public createNewProject(body: AddNewProjectReq) {
    return this.apiPost<any>('/project/', body, null, true);
  }
}