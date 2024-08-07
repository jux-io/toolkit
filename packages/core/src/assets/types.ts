export interface Asset {
  directory: string;
  files: {
    name: string;
    content: string;
  }[];
}
