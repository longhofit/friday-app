import ApiService from "./api.service";

export default class CreatePolicyService extends ApiService {
    public getHolidayFromGoogle() {
        return fetch(`https://www.googleapis.com/calendar/v3/calendars/vi.vietnamese%23holiday%40group.v.calendar.google.com/events?key=AIzaSyCXj0EQwiYHkZN4fXsUSt4bA-Jelt9uLmk`);
    }
    public createPolicy(body) {
        return this.apiPost<any>('/policy', body, null, true);
    }
}