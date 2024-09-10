import { Utilities } from '../config';
import { TokensManager } from '../tokens';
import { outdent } from 'outdent';
import { capitalize } from 'lodash';

interface UtilitiesManagerOptions {
  tokens: TokensManager;
  utilities: Utilities;
}

export class UtilitiesManager {
  private utilities: Utilities;
  private tokens: TokensManager;
  constructor(options: UtilitiesManagerOptions) {
    this.utilities = options.utilities;
    this.tokens = options.tokens;
  }

  /**
   * Get the type declaration for the utilities
   */
  public getUtilitiesTypeDeclaration(): string {
    const values = Object.entries(this.utilities)
      .map(([key, value]) => {
        if (Array.isArray(value.acceptedValues)) {
          return `${key}?: ${value.acceptedValues.map((v) => `'${v}'`).join(' | ')};`;
        }

        if (value.acceptedValues.category) {
          return `${key}?: ${capitalize(value.acceptedValues.category)}Token;`;
        }
      })
      .join('\n');

    return outdent`
        export interface Utilities {
        ${values}
        }
      `;
  }

  get isEmpty(): boolean {
    return Object.keys(this.utilities).length === 0;
  }
}
