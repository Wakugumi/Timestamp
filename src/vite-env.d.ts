/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_DIR_CAPTURE: string,
    readonly VITE_DIR_FRAME: string,
    readonly VITE_DIR_FITLER: string
}


interface ImportMeta {
    readonly env: ImportMetaEnv
  }