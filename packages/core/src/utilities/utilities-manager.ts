import { Utilities } from '../config';
import { TokensManager } from '../tokens';
import { outdent } from 'outdent';
import { capitalize } from 'lodash';

interface UtilitiesManagerOptions {
  tokens: TokensManager;
  utilities: Utilities;
}

export class UtilitiesManager {
  public utilitiesConfig: Utilities;
  public utilities = new Map<string, Utilities[string]>();
  private tokens: TokensManager;
  constructor(options: UtilitiesManagerOptions) {
    this.utilitiesConfig = options.utilities;

    for (const [key, value] of Object.entries(this.utilitiesConfig)) {
      this.utilities.set(key, value);
    }

    this.tokens = options.tokens;
  }

  /**
   * Get the type declaration for the utilities
   */
  public getUtilitiesTypeDeclaration(): string {
    const values = Object.entries(this.utilitiesConfig)
      .map(([key, value]) => {
        if (Array.isArray(value.acceptedValues)) {
          return `${key}?: ${value.acceptedValues.map((v) => `'${v}'`).join(' | ')};`;
        }

        if (typeof value.acceptedValues === 'string') {
          return `${key}?: ${capitalize(value.acceptedValues)}Token;`;
        }

        return `${key}?: string`;
      })
      .join('\n');

    return outdent`
        export interface Utilities {
            ${values}
        }
      `;
  }

  get isEmpty(): boolean {
    return Object.keys(this.utilitiesConfig).length === 0;
  }
}
