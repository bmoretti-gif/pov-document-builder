export async function loadDocsSnapshot(baseUrl, fetcher = fetch) {
  const response = await fetcher(`${baseUrl}cribl-docs-snapshot.json`, {cache:'no-store'});
  if(!response.ok) throw new Error('Nao foi possivel carregar as referencias de documentacao.');
  const result = await response.json();
  if(!result.checkedAt || !Array.isArray(result.pages) || !result.pages.length) throw new Error('Snapshot de documentacao invalido.');
  return result;
}
