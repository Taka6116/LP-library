// Prefix a public asset path with the configured basePath so plain <img> tags
// resolve correctly when the app is served from a GitHub Pages project subpath
// (e.g. /LP-library/sansan/...). In dev the prefix is an empty string.
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function asset(path: string): string {
  return `${BASE_PATH}${path}`;
}
