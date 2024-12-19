import { ComponentDependencies } from './JuxAPI';

export interface ComponentFileStructure {
  name: string;
  dependencies: ComponentDependencies[];
  version: string;
  file: {
    name: string;
    content: string;
  };
}

export interface ComponentMapEntry {
  path: string;
  version: string;
}

export interface ComponentsMap extends Record<string, ComponentMapEntry> {}

export interface GeneratedCodeResponse {
  components: ComponentFileStructure[];
  componentsMap: ComponentsMap;
  previousVersions?: Record<string, string>; // componentName -> previous version content
}
