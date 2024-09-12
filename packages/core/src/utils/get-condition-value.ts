import { ConditionsManager } from '../conditions';
import { WalkCallback } from './walk-object.ts';
import { ParseRawStyleObjectOptions } from './parse-raw-style-object.ts';

/**
 * This is a helper function used in conjunction with {@link parseRawStyleObject} to get the value of a condition
 * ```
 * // Considering we have a screen condition named "desktop" in jux.config.ts
 * const conditionValue = getConditionValue(conditionsManager, key = 'desktop', value = { color: 'red' });
 *
 * // Returns { type: 'replace', key: '@media (width >= 768px) and (width <= 1024px)', value: { color: 'red' } }
 * ```
 */
export function getConditionValue(
  conditionsManager: ConditionsManager,
  key: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any,
  onError: ParseRawStyleObjectOptions['onError']
): ReturnType<WalkCallback> {
  const condition = conditionsManager.conditions.get(key);

  if (condition && typeof value !== 'object') {
    onError?.(`Condition "${key}" must be an object.`);
    return {
      type: 'remove',
    };
  } else if (condition) {
    return {
      type: 'replace',
      key: condition.resolvedValue,
      value: value,
    };
  }
}
