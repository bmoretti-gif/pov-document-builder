export interface DocsSnapshot { checkedAt:string; pages:{url:string;content:string;error?:string}[]; }
export function loadDocsSnapshot(baseUrl:string,fetcher?:typeof fetch):Promise<DocsSnapshot>;
