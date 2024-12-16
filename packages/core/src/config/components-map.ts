import path from 'path';
import { FileManager } from '../fs';
import { ComponentsMap, ComponentMapEntry } from '../api/shared-types';
import { relativePathWithPrefix } from '../utils/relative-path-with-prefix';

export class ComponentsMapManager {
  private readonly fs: FileManager;
  private readonly mapPath: string;

  constructor({
    componentsMapFile,
    fs,
  }: {
    componentsMapFile: string;
    fs: FileManager;
  }) {
    this.fs = fs;
    this.mapPath = componentsMapFile;
  }

  async readMap(): Promise<ComponentsMap> {
    try {
      const content = await this.fs.readFile(this.mapPath);
      return JSON.parse(content);
    } catch {
      // If file doesn't exist or is invalid, return empty map
      return {};
    }
  }

  async writeMap(map: ComponentsMap): Promise<void> {
    await this.fs.writeFile(
      path.resolve(this.mapPath, '..'),
      path.basename(this.mapPath),
      JSON.stringify(map, null, 2)
    );
  }

  getComponentMapFile() {
    return this.mapPath;
  }

  async updateComponent(name: string, entry: ComponentMapEntry): Promise<void> {
    const map = await this.readMap();
    const relativePath = path.relative(
      path.resolve(this.mapPath, '..'),
      entry.path
    );
    map[name] = {
      ...entry,
      path: relativePathWithPrefix(relativePath),
    };
    await this.writeMap(map);
  }
}
