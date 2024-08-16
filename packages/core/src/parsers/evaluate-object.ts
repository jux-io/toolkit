/* eslint-disable @typescript-eslint/no-explicit-any */
import { SourceFile, Node } from 'ts-morph';

export function evaluateObject(node: Node, sourceFile: SourceFile): any {
  if (Node.isObjectLiteralExpression(node)) {
    const result: any = {};
    for (const prop of node.getProperties()) {
      //console.log(prop.getText(), prop.getKindName());
      if (Node.isPropertyAssignment(prop)) {
        let name = prop.getName();
        // Remove quotes from special keys
        // "'&:hover'": { color: 'hellotest', typography: '{core.typography.body}' } => '&:hover': { color: 'hellotest', typography: '{core.typography.body}' }
        name = name.replace(/^['"](.*)['"]$/, '$1');
        const value = prop.getInitializer();

        if (value) {
          result[name] = evaluateValue(value, sourceFile);
        }
      }
    }
    return result;
  } else if (Node.isArrayLiteralExpression(node)) {
    return node
      .getElements()
      .map((element) => evaluateValue(element, sourceFile));
  }

  return node.getText();
}

function evaluateValue(node: Node, sourceFile: SourceFile): any {
  if (Node.isObjectLiteralExpression(node)) {
    return evaluateObject(node, sourceFile);
  } else if (Node.isArrayLiteralExpression(node)) {
    return evaluateObject(node, sourceFile);
  } else if (Node.isIdentifier(node)) {
    const referencedValue = findReferencedValue(node, sourceFile);
    return referencedValue !== null ? referencedValue : node.getText();
  } else if (Node.isStringLiteral(node)) {
    // Remove extra quotes from string literals
    // backgroundColor: "'{core.color.brand_100}'" => backgroundColor: '{core.color.brand_100}'
    return node.getText().replace(/^['"](.*)['"]$/, '$1');
  } else {
    return node.getText();
  }
}

function findReferencedValue(identifier: Node, sourceFile: SourceFile) {
  const declaration = identifier.getSymbol()?.getDeclarations()?.[0];
  if (declaration && Node.isVariableDeclaration(declaration)) {
    const initializer = declaration.getInitializer();
    if (initializer) {
      return evaluateValue(initializer, sourceFile);
    }
  }
  return null;
}
