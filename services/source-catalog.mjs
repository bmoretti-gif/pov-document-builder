export function parseSourceCatalog(markdown) {
  let kind = null;
  const entries = [];
  const groups = {'Collector Sources':'collector','Push Sources':'push','Pull Sources':'pull','System Sources':'system','Internal Sources':'internal'};
  for (const line of markdown.split('\n')) {
    const heading = line.match(/^#{2,4}\s+(.+?)(?:\s+\{.*)?$/);
    if (heading) kind = groups[heading[1]] ?? null;
    if (/^For background/.test(line)) kind = null;
    const match = line.match(/^- \[([^\]]+)\]\((sources-[\w-]+|collectors-[\w-]+)\)(.*)$/);
    if (!kind || !match) continue;
    entries.push({name:match[1], slug:match[2],kind,details:match[3].trim(),url:`https://docs.cribl.io/stream/${match[2]}/`});
  }
  if (!entries.some(e => e.slug === 'sources-syslog') || !entries.some(e => e.slug === 'sources-kafka')) throw new Error('Official Sources index format changed; refusing an incomplete catalog');
  return entries;
}

export function buildSourceCatalog(markdown, checkedAt = new Date().toISOString()) {
  const entries = {}, translations = {};
  const names={en:{push:'Push',pull:'Pull',system:'System',internal:'Internal',collector:'Collector'},pt:{push:'Push',pull:'Pull',system:'Sistema',internal:'Interna',collector:'Collector'},es:{push:'Push',pull:'Pull',system:'Sistema',internal:'Interna',collector:'Collector'}};
  for (const source of parseSourceCatalog(markdown)) {
    const title=`Configure ${source.name} in Cribl Stream`;
    const content=`Official reference: ${source.name}\nType: ${names.en[source.kind]}\n${source.details}\n\nThis is a configuration checklist, not a complete POV runbook.\n- [ ] Review the official documentation for prerequisites, authentication, ports, deployment restrictions, and Leader dependencies.\n- [ ] Configure the integration using the documented settings for your environment.\n- [ ] Capture sample events, validate parsing and routing, and confirm delivery to the intended Destination.\n\n[Official documentation](${source.url})`;
    entries[`official_${source.slug.replaceAll('-', '_')}`]={category:source.kind==='collector'?'CRIBL COLLECTOR CONFIGS':'CRIBL SOURCE CONFIGS',label:source.name,title,content,origin:'official',sourceKind:source.kind,documentationUrl:source.url};
    for(const language of ['pt','es']) {
      const translatedDetails=source.details.replace(/HTTPS only/g,language==='pt'?'Somente HTTPS':'Solo HTTPS').replace(/on-prem only/g,language==='pt'?'Somente on-prem':'Solo on-prem').replace(/requires active Leader(?: for job management)?/g,language==='pt'?'Requer Leader ativo para gerenciar jobs':'Requiere un Leader activo para gestionar jobs').replace(/executes any shell script you provide and returns the output of that script\/command/g,language==='pt'?'Executa o script fornecido e retorna sua saída':'Ejecuta el script proporcionado y devuelve su salida');
      const translatedTitle=`${language==='pt'?'Configurar':'Configurar'} ${source.name} ${language==='pt'?'no':'en'} Cribl Stream`;
      const translatedContent=language==='pt'
        ? `Referência oficial: ${source.name}\nTipo: ${names.pt[source.kind]}\n${translatedDetails}\n\nEste item oferece um checklist de configuração; o roteiro completo do POV precisa ser elaborado.\n- [ ] Revisar a documentação oficial: pré-requisitos, autenticação, portas, restrições de implantação e dependências do Leader.\n- [ ] Configurar a integração conforme as opções documentadas para o ambiente.\n- [ ] Capturar eventos de exemplo, validar parsing e roteamento e confirmar a entrega à Destination prevista.\n\n[Documentação oficial](${source.url})`
        : `Referencia oficial: ${source.name}\nTipo: ${names.es[source.kind]}\n${translatedDetails}\n\nEste elemento ofrece una lista de configuración; es necesario elaborar el procedimiento completo del POV.\n- [ ] Revisar la documentación oficial: requisitos, autenticación, puertos, restricciones de despliegue y dependencias del Leader.\n- [ ] Configurar la integración según las opciones documentadas para el entorno.\n- [ ] Capturar eventos de ejemplo, validar parsing y enrutamiento y confirmar la entrega al Destination previsto.\n\n[Documentación oficial](${source.url})`;
      translations[JSON.stringify([language,title])]=translatedTitle;
      translations[JSON.stringify([language,content])]=translatedContent;
    }
  }
  return {checkedAt,indexUrl:'https://docs.cribl.io/stream/sources/',entries,translations};
}
