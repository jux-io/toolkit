import { Flags } from '@oclif/core';
import { JuxCommand } from '../baseCommand';
import {
  createInternalConfig,
  getCliConfigEnv,
  JuxInternalCliConfig,
  logger,
  auth,
  OrganizationsAPI,
} from '@juxio/core';

export default class Login extends JuxCommand<typeof Login> {
  static description = 'Authenticate CLI with a Jux account';
  static examples = [`<%= config.bin %> <%= command.id %> -d`];

  static flags = {
    defaults: Flags.boolean({
      char: 'd',
      default: false,
      description: 'Use defaults configurations',
      required: false,
    }),

    cwd: Flags.string({
      char: 'c',
      description: 'The directory to initialize the project in',
      default: process.cwd(),
      required: false,
    }),
  };

  async run() {
    const tokenInfo = await auth();

    if (!tokenInfo) {
      this.exit();
    }

    const config: JuxInternalCliConfig = {
      tokens: {
        access_token: tokenInfo.access_token,
        refresh_token: tokenInfo.refresh_token,
        expires_at: tokenInfo.expires_at,
      },
      organizationId: null,
    };

    const apiConfig = getCliConfigEnv();

    const organizationAPI = new OrganizationsAPI(
      this.config,
      config,
      apiConfig
    );
    const organizations = await organizationAPI.getOrganizations();

    if (organizations.length === 0) {
      logger.error(
        `No organization found. You need to create an organization first.`
      );
      return;
    }

    // Since we don't have a way to select an organization yet, we'll just use the first one
    config.organizationId = organizations[0].id;

    createInternalConfig(this.config.configDir, config);
  }
}
