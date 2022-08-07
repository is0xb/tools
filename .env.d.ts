interface ImportMetaEnv extends Readonly<Record<string, string>> {
  readonly VITE_NAME: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
