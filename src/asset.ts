/**
 * Resolve a public asset path against Vite's base URL so it works both at the
 * dev root (`/`) and under a GitHub Pages project subpath (`/<repo>/`).
 * Pass a root-relative path like `/brand/logo.png`.
 */
export function asset(path: string): string {
  return import.meta.env.BASE_URL.replace(/\/$/, '') + '/' + path.replace(/^\//, '');
}
