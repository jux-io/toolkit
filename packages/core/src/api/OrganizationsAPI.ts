import { JuxAPI } from './JuxAPI.ts';

interface Organization {
  id: number;
}

export class OrganizationsAPI extends JuxAPI {
  async getOrganizations(): Promise<Organization[]> {
    return this.axios
      .get<Organization[]>(`${this.apiServer}/organizations`)
      .then((res) => res.data);
  }
}
