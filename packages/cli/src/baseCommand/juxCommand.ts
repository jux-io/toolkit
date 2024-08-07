import { Command, Config, Interfaces } from '@oclif/core';
import { logger } from '@juxio/core';

export type CommandFlags<T extends typeof Command> = Interfaces.InferredFlags<
  (typeof JuxCommand)['baseFlags'] & T['flags']
>;

export type CommandArgs<T extends typeof Command> = Interfaces.InferredArgs<
  T['args']
>;

export abstract class JuxCommand<T extends typeof Command> extends Command {
  // define flags that can be inherited by any command that extends BaseCommand

  protected flags!: CommandFlags<T>;
  protected args!: CommandArgs<T>;

  public constructor(argv: string[], config: Config) {
    super(argv, config);
  }

  async catch(error: Error) {
    logger.error(error.message);
  }

  public async init(): Promise<void> {
    await super.init();
    const { args, flags } = await this.parse({
      flags: this.ctor.flags,
      baseFlags: (super.ctor as typeof JuxCommand).baseFlags,
      args: this.ctor.args,
    });
    this.flags = flags as CommandFlags<T>;
    this.args = args as CommandArgs<T>;
  }
}
