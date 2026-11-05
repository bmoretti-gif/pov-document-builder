import { Buffer } from 'node:buffer';
export function officialUrl(value) {
  const url = new URL(value);
  if (url.protocol !== 'https:' || url.hostname !== 'docs.cribl.io' || url.port || url.username || url.password) throw new Error('Only official Cribl documentation URLs are allowed');
  url.hash = ''; return url.href;
}
export function criblDocsPlugin() {
  const middleware = server => { server.middlewares.use('/api/cribl-docs', async (req,res) => {
    res.setHeader('Content-Type','application/json; charset=utf-8');
    if (req.method !== 'POST') {res.statusCode=405;res.end('{}');return;}
    try {
      let body=''; for await (const chunk of req) {body+=chunk; if(Buffer.byteLength(body)>32000) throw new Error('Request too large');}
      const input=JSON.parse(body);
      const urls = [...new Set(['https://docs.cribl.io/agents/stream/llms.txt', ...(input.urls ?? []).map(officialUrl)])];
      if(urls.length>80) throw new Error('Too many pages');
      // Discover current requirements and integration overview pages from the live index.
      const indexResponse=await fetch(urls[0],{redirect:'error',signal:AbortSignal.timeout(20000)});
      if(!indexResponse.ok) throw new Error(`Documentation index HTTP ${indexResponse.status}`);
      const index=await indexResponse.text();
      const discovered=[...index.matchAll(/\[([^\]]+)\]\((https:\/\/docs\.cribl\.io\/[^)]+)\)/g)]
        .filter(match => /ports|system requirements|deployment requirements|sources overview|destinations overview|supported.*sources|supported.*destinations/i.test(match[1]))
        .map(match => officialUrl(match[2])).slice(0,12);
      for(const url of discovered) if(!urls.includes(url)) urls.push(url);
      const pages=[];
      for(let i=0;i<urls.length;i+=5) {
        pages.push(...await Promise.all(urls.slice(i,i+5).map(async url => {
          try {
            const response=await fetch(url,{redirect:'error',signal:AbortSignal.timeout(20000),headers:{Accept:'text/markdown, text/plain, text/html'}});
            if(!response.ok) throw new Error(`HTTP ${response.status}`);
            const raw=await response.text();
            const content=raw.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,'').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi,'').replace(/<[^>]+>/g,' ').slice(0,180000);
            return {url,content};
          } catch(e) {return {url,content:'',error:String(e.message)};}
        })));
      }
      res.end(JSON.stringify({checkedAt:new Date().toISOString(),pages}));
    } catch(e) {res.statusCode=400;res.end(JSON.stringify({error:String(e.message)}));}
  });
  };
  return {name:'cribl-official-docs',configureServer:middleware,configurePreviewServer:middleware};
}
