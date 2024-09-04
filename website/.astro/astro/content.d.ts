declare module 'astro:content' {
  interface Render {
    '.mdx': Promise<{
      Content: import('astro').MarkdownInstance<{}>['Content'];
      headings: import('astro').MarkdownHeading[];
      remarkPluginFrontmatter: Record<string, any>;
    }>;
  }
}

declare module 'astro:content' {
  interface RenderResult {
    Content: import('astro/runtime/server/index.js').AstroComponentFactory;
    headings: import('astro').MarkdownHeading[];
    remarkPluginFrontmatter: Record<string, any>;
  }
  interface Render {
    '.md': Promise<RenderResult>;
  }

  export interface RenderedContent {
    html: string;
    metadata?: {
      imagePaths: Array<string>;
      [key: string]: unknown;
    };
  }
}

declare module 'astro:content' {
  type Flatten<T> = T extends { [K: string]: infer U } ? U : never;

  export type CollectionKey = keyof AnyEntryMap;
  export type CollectionEntry<C extends CollectionKey> = Flatten<
    AnyEntryMap[C]
  >;

  export type ContentCollectionKey = keyof ContentEntryMap;
  export type DataCollectionKey = keyof DataEntryMap;

  type AllValuesOf<T> = T extends any ? T[keyof T] : never;
  type ValidContentEntrySlug<C extends keyof ContentEntryMap> = AllValuesOf<
    ContentEntryMap[C]
  >['slug'];

  /** @deprecated Use `getEntry` instead. */
  export function getEntryBySlug<
    C extends keyof ContentEntryMap,
    E extends ValidContentEntrySlug<C> | (string & {}),
  >(
    collection: C,
    // Note that this has to accept a regular string too, for SSR
    entrySlug: E
  ): E extends ValidContentEntrySlug<C>
    ? Promise<CollectionEntry<C>>
    : Promise<CollectionEntry<C> | undefined>;

  /** @deprecated Use `getEntry` instead. */
  export function getDataEntryById<
    C extends keyof DataEntryMap,
    E extends keyof DataEntryMap[C],
  >(collection: C, entryId: E): Promise<CollectionEntry<C>>;

  export function getCollection<
    C extends keyof AnyEntryMap,
    E extends CollectionEntry<C>,
  >(
    collection: C,
    filter?: (entry: CollectionEntry<C>) => entry is E
  ): Promise<E[]>;
  export function getCollection<C extends keyof AnyEntryMap>(
    collection: C,
    filter?: (entry: CollectionEntry<C>) => unknown
  ): Promise<CollectionEntry<C>[]>;

  export function getEntry<
    C extends keyof ContentEntryMap,
    E extends ValidContentEntrySlug<C> | (string & {}),
  >(entry: {
    collection: C;
    slug: E;
  }): E extends ValidContentEntrySlug<C>
    ? Promise<CollectionEntry<C>>
    : Promise<CollectionEntry<C> | undefined>;
  export function getEntry<
    C extends keyof DataEntryMap,
    E extends keyof DataEntryMap[C] | (string & {}),
  >(entry: {
    collection: C;
    id: E;
  }): E extends keyof DataEntryMap[C]
    ? Promise<DataEntryMap[C][E]>
    : Promise<CollectionEntry<C> | undefined>;
  export function getEntry<
    C extends keyof ContentEntryMap,
    E extends ValidContentEntrySlug<C> | (string & {}),
  >(
    collection: C,
    slug: E
  ): E extends ValidContentEntrySlug<C>
    ? Promise<CollectionEntry<C>>
    : Promise<CollectionEntry<C> | undefined>;
  export function getEntry<
    C extends keyof DataEntryMap,
    E extends keyof DataEntryMap[C] | (string & {}),
  >(
    collection: C,
    id: E
  ): E extends keyof DataEntryMap[C]
    ? Promise<DataEntryMap[C][E]>
    : Promise<CollectionEntry<C> | undefined>;

  /** Resolve an array of entry references from the same collection */
  export function getEntries<C extends keyof ContentEntryMap>(
    entries: {
      collection: C;
      slug: ValidContentEntrySlug<C>;
    }[]
  ): Promise<CollectionEntry<C>[]>;
  export function getEntries<C extends keyof DataEntryMap>(
    entries: {
      collection: C;
      id: keyof DataEntryMap[C];
    }[]
  ): Promise<CollectionEntry<C>[]>;

  export function render<C extends keyof AnyEntryMap>(
    entry: AnyEntryMap[C][string]
  ): Promise<RenderResult>;

  export function reference<C extends keyof AnyEntryMap>(
    collection: C
  ): import('astro/zod').ZodEffects<
    import('astro/zod').ZodString,
    C extends keyof ContentEntryMap
      ? {
          collection: C;
          slug: ValidContentEntrySlug<C>;
        }
      : {
          collection: C;
          id: keyof DataEntryMap[C];
        }
  >;
  // Allow generic `string` to avoid excessive type errors in the config
  // if `dev` is not running to update as you edit.
  // Invalid collection names will be caught at build time.
  export function reference<C extends string>(
    collection: C
  ): import('astro/zod').ZodEffects<import('astro/zod').ZodString, never>;

  type ReturnTypeOrOriginal<T> = T extends (...args: any[]) => infer R ? R : T;
  type InferEntrySchema<C extends keyof AnyEntryMap> =
    import('astro/zod').infer<
      ReturnTypeOrOriginal<Required<ContentConfig['collections'][C]>['schema']>
    >;

  type ContentEntryMap = {
    docs: {
      'developers/benchmarks.mdx': {
        id: 'developers/benchmarks.mdx';
        slug: 'developers/benchmarks';
        body: string;
        collection: 'docs';
        data: InferEntrySchema<'docs'>;
      } & { render(): Render['.mdx'] };
      'developers/customization/config/index.mdx': {
        id: 'developers/customization/config/index.mdx';
        slug: 'developers/customization/config';
        body: string;
        collection: 'docs';
        data: InferEntrySchema<'docs'>;
      } & { render(): Render['.mdx'] };
      'developers/customization/presets/index.mdx': {
        id: 'developers/customization/presets/index.mdx';
        slug: 'developers/customization/presets';
        body: string;
        collection: 'docs';
        data: InferEntrySchema<'docs'>;
      } & { render(): Render['.mdx'] };
      'developers/customization/screens/index.mdx': {
        id: 'developers/customization/screens/index.mdx';
        slug: 'developers/customization/screens';
        body: string;
        collection: 'docs';
        data: InferEntrySchema<'docs'>;
      } & { render(): Render['.mdx'] };
      'developers/customization/tokens-and-themes/index.mdx': {
        id: 'developers/customization/tokens-and-themes/index.mdx';
        slug: 'developers/customization/tokens-and-themes';
        body: string;
        collection: 'docs';
        data: InferEntrySchema<'docs'>;
      } & { render(): Render['.mdx'] };
      'developers/getting-started/astro/index.mdx': {
        id: 'developers/getting-started/astro/index.mdx';
        slug: 'developers/getting-started/astro';
        body: string;
        collection: 'docs';
        data: InferEntrySchema<'docs'>;
      } & { render(): Render['.mdx'] };
      'developers/getting-started/nextjs/index.mdx': {
        id: 'developers/getting-started/nextjs/index.mdx';
        slug: 'developers/getting-started/nextjs';
        body: string;
        collection: 'docs';
        data: InferEntrySchema<'docs'>;
      } & { render(): Render['.mdx'] };
      'developers/getting-started/postcss/index.mdx': {
        id: 'developers/getting-started/postcss/index.mdx';
        slug: 'developers/getting-started/postcss';
        body: string;
        collection: 'docs';
        data: InferEntrySchema<'docs'>;
      } & { render(): Render['.mdx'] };
      'developers/getting-started/vite/index.mdx': {
        id: 'developers/getting-started/vite/index.mdx';
        slug: 'developers/getting-started/vite';
        body: string;
        collection: 'docs';
        data: InferEntrySchema<'docs'>;
      } & { render(): Render['.mdx'] };
      'developers/jux-concepts/nested-selectors/index.mdx': {
        id: 'developers/jux-concepts/nested-selectors/index.mdx';
        slug: 'developers/jux-concepts/nested-selectors';
        body: string;
        collection: 'docs';
        data: InferEntrySchema<'docs'>;
      } & { render(): Render['.mdx'] };
      'developers/jux-concepts/responsive-design/index.mdx': {
        id: 'developers/jux-concepts/responsive-design/index.mdx';
        slug: 'developers/jux-concepts/responsive-design';
        body: string;
        collection: 'docs';
        data: InferEntrySchema<'docs'>;
      } & { render(): Render['.mdx'] };
      'developers/jux-concepts/styling/index.mdx': {
        id: 'developers/jux-concepts/styling/index.mdx';
        slug: 'developers/jux-concepts/styling';
        body: string;
        collection: 'docs';
        data: InferEntrySchema<'docs'>;
      } & { render(): Render['.mdx'] };
      'developers/jux-concepts/variants/index.mdx': {
        id: 'developers/jux-concepts/variants/index.mdx';
        slug: 'developers/jux-concepts/variants';
        body: string;
        collection: 'docs';
        data: InferEntrySchema<'docs'>;
      } & { render(): Render['.mdx'] };
      'developers/jux-editor/index.mdx': {
        id: 'developers/jux-editor/index.mdx';
        slug: 'developers/jux-editor';
        body: string;
        collection: 'docs';
        data: InferEntrySchema<'docs'>;
      } & { render(): Render['.mdx'] };
      'developers/quickstart/index.mdx': {
        id: 'developers/quickstart/index.mdx';
        slug: 'developers/quickstart';
        body: string;
        collection: 'docs';
        data: InferEntrySchema<'docs'>;
      } & { render(): Render['.mdx'] };
      'developers/reference/cli/index.mdx': {
        id: 'developers/reference/cli/index.mdx';
        slug: 'developers/reference/cli';
        body: string;
        collection: 'docs';
        data: InferEntrySchema<'docs'>;
      } & { render(): Render['.mdx'] };
      'developers/reference/design-tokens/index.mdx': {
        id: 'developers/reference/design-tokens/index.mdx';
        slug: 'developers/reference/design-tokens';
        body: string;
        collection: 'docs';
        data: InferEntrySchema<'docs'>;
      } & { render(): Render['.mdx'] };
      'developers/reference/preflight-styles/index.mdx': {
        id: 'developers/reference/preflight-styles/index.mdx';
        slug: 'developers/reference/preflight-styles';
        body: string;
        collection: 'docs';
        data: InferEntrySchema<'docs'>;
      } & { render(): Render['.mdx'] };
      'developers/technical-overview.mdx': {
        id: 'developers/technical-overview.mdx';
        slug: 'developers/technical-overview';
        body: string;
        collection: 'docs';
        data: InferEntrySchema<'docs'>;
      } & { render(): Render['.mdx'] };
      'developers/typescript.mdx': {
        id: 'developers/typescript.mdx';
        slug: 'developers/typescript';
        body: string;
        collection: 'docs';
        data: InferEntrySchema<'docs'>;
      } & { render(): Render['.mdx'] };
      'index.mdx': {
        id: 'index.mdx';
        slug: 'index';
        body: string;
        collection: 'docs';
        data: InferEntrySchema<'docs'>;
      } & { render(): Render['.mdx'] };
    };
  };

  type DataEntryMap = {};

  type AnyEntryMap = ContentEntryMap & DataEntryMap;

  export type ContentConfig = typeof import('../../src/content/config.js');
}
