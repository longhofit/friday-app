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

  public updateProject(body: AddNewProjectReq) {
    return this.apiPut<any>(`/project/${body.code}`, body, null, true);
  }

  public getProject(id: string) {
    return this.apiGet<any>(`/project/${id}`, null, true);
  }

  public addMember(body, id: string) {
    return this.apiPost<any>(`/project/${id}/member`, body, null, true);
  }

  public updateMember(body, id: string) {
    return this.apiPut<any>(`/project/${id}/participant`, body, null, true);
  }

  public deleteMember(id: string, memberId) {
    return this.apiDelete<any>(`/project/${id}/member`, memberId, null, true);
  }
}