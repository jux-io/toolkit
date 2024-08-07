const STRING_UNDERSCORE_REGEXP = /([a-z\d])([A-Z]+)/g;
const STRING_DASH_REGEXP_ = /-|\s+/g;

/**
 * Converts an array of strings to a union type string.
 * @method underscore

 ```javascript
 arrayToUnionType(['value-1', 'value-2]); // '"value-1" | "value-2"'
 ```
 */
export function arrayToUnionType(values: IterableIterator<string> | string[]) {
  return Array.from(values)
    .map((value) => JSON.stringify(value))
    .join(' | ');
}

/**
 More general than decamelize. Returns the lower\_case\_and\_underscored string.

 ```javascript
 'My Theme.Hello Test'.underscore(); => 'my_theme.hello_test'
 'css-class'.underscore(); => 'css_class'
 'some string'.underscore(); => 'some_string'
 ```
 */
export function underscore(value: string) {
  return value
    .replace(STRING_UNDERSCORE_REGEXP, '$1_$2')
    .replace(STRING_DASH_REGEXP_, '_')
    .toLowerCase();
}

/**
 Returns the Capitalized form of a string

 ```javascript
 'my theme'.capitalize() => 'My theme'
 'color'.capitalize() => 'Color'
 ```
 */
export function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
