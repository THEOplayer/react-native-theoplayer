export function addQueryToUrl(url: URL, parameters: Record<string, string>): void {
  for (const key of Object.keys(parameters)) {
    url.searchParams.set(key, parameters[ key ]);
  }
}
