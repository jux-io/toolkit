import { JuxCLIConfig } from '../config';
import { parseScreens } from './parse-screens.ts';
import { outdent } from 'outdent';

export interface ConditionsManagerOptions {
  screens: JuxCLIConfig['screens'];
}

interface ConditionValue {
  resolvedValue: string;
  category: string;
}

enum ConditionCategory {
  SCREENS = 'screens',
}

export class ConditionsManager {
  public conditions = new Map<string, ConditionValue>();

  public conditionByCategory = new Map<string, Map<string, ConditionValue>>();

  constructor(options: ConditionsManagerOptions) {
    this.parseScreens(options.screens);
  }

  parseScreens(screens: ConditionsManagerOptions['screens']) {
    Object.entries(parseScreens(screens)).forEach(([key, value]) => {
      this.conditions.set(key, {
        resolvedValue: value,
        category: ConditionCategory.SCREENS,
      });
    });

    this.conditionByCategory.set(
      'screens',
      this.getConditionByCategory(ConditionCategory.SCREENS)
    );
  }

  getConditionByCategory(category: string) {
    return new Map(
      Array.from(this.conditions.entries()).filter(
        ([, value]) => value.category === category
      )
    );
  }

  /**
   * Get the type declaration for the utilities
   */
  public getConditionsTypeDeclaration(): string {
    const screensKeys = Array.from(
      this.conditionByCategory.get(ConditionCategory.SCREENS)?.keys() ?? []
    );

    if (screensKeys.length === 0) {
      return '';
    }

    return outdent`
        export interface Conditions {
          screens: [${screensKeys.map((key) => `'${key}'`).join(', ')}];
        }
      `;
  }

  get isEmpty() {
    return this.conditions.size === 0;
  }
}
