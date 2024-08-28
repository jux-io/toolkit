import { CLIError } from '@oclif/core/errors';

export class ConfigNotFoundError extends CLIError {
  public configPath: string;
  constructor(configPath: string) {
    const message = `No config file found. Did you forget to run jux init?`;
    super(message);

    this.configPath = configPath;
    this.name = 'ConfigNotFoundError';
  }
}
