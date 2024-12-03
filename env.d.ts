/// <reference types="vite/client" />

declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const VueComponent: DefineComponent<{}, {}, any>
  export default VueComponent;
}

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_TIMEOUT: number
  readonly VITE_APP_TOKEN_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}