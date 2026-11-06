export function normalizeOfficialMarkdown(markdown, url) {
  let code=false;
  return markdown.split('\n').map(line=>{
    if(/^\s*```/.test(line)){code=!code;return line;}
    if(code)return line;
    return line
    .replace(/^> For the complete documentation index,.*\n/gm,'')
    .replace(/^> For the complete documentation index,.*$/,'')
    .replace(/^\{[^\n]*\}\s*$/gm,'')
    .replace(/^(#{1,6}\s+.*?)\s+\{#[^}]+\}\s*$/gm,'$1')
    .replace(/<br\s*\/?\s*>/gi,' ')
    .replace(/<\/?(?:div|span|p|details|summary)\b[^>]*>/gi,'')
    .replace(/!?\[([^\]]*)\]\(([^\s)]+)\)/g,(match,label,target)=> {
      if(!/^(?:https?:|\/|#|[\w.-])/.test(target)) return match;
      const absolute=new URL(target,target.startsWith('#') ? url : new URL('../',url)).href;
      return `[${match.startsWith('!')?'Image: ':''}${label || 'Documentation'}](${absolute})`;
    });
  }).join('\n');
}

export async function translateOfficialMarkdown(text, language, request) {
  const tokens=[];
  const protect=value=>`CRIBLTOKEN${tokens.push(value)-1}END`;
  let code=false;
  const lines=text.split('\n').map(line=> {
    if(/^\s*```/.test(line)){code=!code;return protect(line);}
    if(code) return protect(line);
    return line.replace(/`[^`]*`|https?:\/\/[^\s)]+|\*\*[^*]+\*\*|^\s*(?:#{1,6} |[-*>] |\d+\. )|\b(?:Cribl(?:\.Cloud)?|AWS|GCP|TCP|UDP|HTTP\/S|HTTP|HTTPS|S3|SQS|HEC|JSON|KQL|API|CLI|POV)\b/g,protect);
  });
  const chunks=[];let buffer=[];let length=0;
  for(const line of lines){if(length+line.length>2400&&buffer.length){chunks.push(buffer.join('\n'));buffer=[];length=0;}buffer.push(line);length+=line.length+1;}
  if(buffer.length)chunks.push(buffer.join('\n'));
  const translated=[];
  for(let i=0;i<chunks.length;i+=3) translated.push(...await Promise.all(chunks.slice(i,i+3).map(chunk=>request(chunk,language))));
  let output=translated.join('\n');
  if(tokens.some((_,i)=>!new RegExp(`CRIBL\\s*TOKEN\\s*${i}\\s*END`).test(output))) {
    const parts=lines.join('\n').split(/(CRIBLTOKEN\d+END|\n)/);let offset=0;
    const results=[];
    async function worker(){while(offset<parts.length){const i=offset++,part=parts[i];results[i]=/^(?:CRIBLTOKEN\d+END|\s*)$/.test(part)?part:part.match(/^\s*/)[0]+await request(part.trim(),language)+part.match(/\s*$/)[0];}}
    await Promise.all([worker(),worker(),worker()]);output=results.join('');
  }
  for(let i=0;i<tokens.length;i++) output=output.replace(new RegExp(`CRIBL\\s*TOKEN\\s*${i}\\s*END`,'g'),()=>tokens[i]);
  if(/CRIBLTOKEN\d+END/.test(output))throw new Error('Unrestored technical tokens');
  return output;
}
