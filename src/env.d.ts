/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly PACKAGE_VERSION: string;
  readonly VITE_PUBLIC_PATH: string
  readonly VITE_CMSBOOK_URL: string
  readonly VITE_CMSBOOK_INDEX_FILENAME: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
