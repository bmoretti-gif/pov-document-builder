export function parseDestinationCatalog(markdown) {
  const entries = [];
  let section = null;
  for (const line of markdown.split('\n')) {
    if (/^## Available Destinations\s*$/.test(line)) { section='available'; continue; }
    if (/^### Internal Destinations\s*$/.test(line)) { section='internal'; continue; }
    if (/^#{2,3} /.test(line)) section=null;
    if(section==='available' && line.startsWith('|')) {
      const cells=line.split('|').slice(1).map(c=>c.trim());
      const link=cells[0]?.match(/^\[([^\]]+)\]\((destinations-[\w-]+|sources-sqs)\)$/);
      if(!link) continue;
      // The overview currently links Amazon SQS to its Source page; use the verified Destination page.
      const slug=link[2]==='sources-sqs'?'destinations-sqs':link[2];
      entries.push({name:link[1],slug,kind:'destination',protocol:cells[1]||'',streaming:cells[2]||'',filesystem:cells[3]||'',loadBalanced:cells[4]||'',url:`https://docs.cribl.io/stream/${slug}/`});
    }
    if(section==='internal') {
      const link=line.match(/^- \[([^\]]+)\]\((destinations-[\w-]+)\)/);
      if(link) entries.push({name:link[1],slug:link[2],kind:'internal-destination',protocol:'',streaming:'',filesystem:'',loadBalanced:'',url:`https://docs.cribl.io/stream/${link[2]}/`});
    }
  }
  if(!entries.some(e=>e.slug==='destinations-s3') || !entries.some(e=>e.slug==='destinations-splunk-hec')) throw new Error('Official Destinations index format changed; refusing an incomplete catalog');
  return entries;
}

export function buildDestinationCatalog(markdown,checkedAt=new Date().toISOString()) {
  const entries={},translations={};
  for(const destination of parseDestinationCatalog(markdown)) {
    const title=`Configure ${destination.name} Destination in Cribl Stream`;
    const protocol=destination.protocol || 'Not specified in the overview';
    const mode=destination.kind==='internal-destination'?'Internal':destination.streaming || 'Not specified in the overview';
    const content=`Official Destination reference: ${destination.name}\nProtocol: ${protocol}\nDelivery mode: ${mode}\nFilesystem-based: ${destination.filesystem || 'Not marked in the overview'}\nLoad-balanced: ${destination.loadBalanced || 'Not marked in the overview'}\n\nThis is a configuration checklist, not a complete POV runbook.\n- [ ] Review authentication, endpoints, ports, payload format, permissions, and deployment restrictions in the official documentation.\n- [ ] Confirm supported backpressure and persistent queue behavior; filesystem-based Destinations do not support persistent queues.\n- [ ] Configure the Destination, route test events, and verify delivery and retry behavior in the receiving system.\n\n[Official documentation](${destination.url})`;
    entries[`official_${destination.slug.replaceAll('-','_')}`]={category:'CRIBL DESTINATION CONFIGS',label:destination.name,title,content,origin:'official',sourceKind:destination.kind,documentationUrl:destination.url};
    for(const lang of ['pt','es']) {
      const p=lang==='pt';
      const localizedMode=mode.replace(/Streaming or non-streaming/i,p?'Streaming ou não streaming':'Streaming o no streaming').replace(/Non-Streaming/i,p?'Não streaming':'No streaming').replace('Internal',p?'Interna':'Interna').replace('Not specified in the overview',p?'Não especificado no índice':'No especificado en el índice');
      const localizedProtocol=protocol.replace('HTTPS only',p?'Somente HTTPS':'Solo HTTPS').replace('Not specified in the overview',p?'Não especificado no índice':'No especificado en el índice');
      const filesystem=destination.filesystem || (p?'Não marcado no índice':'No indicado en el índice');
      const loadBalanced=destination.loadBalanced.replace('(TCP only)',p?'(Somente TCP)':'(Solo TCP)') || (p?'Não marcado no índice':'No indicado en el índice');
      const translatedTitle=`Configurar Destination ${destination.name} ${p?'no':'en'} Cribl Stream`;
      const translatedContent=p
        ? `Referência oficial de Destination: ${destination.name}\nProtocolo: ${localizedProtocol}\nModo de entrega: ${localizedMode}\nBaseada em filesystem: ${filesystem}\nBalanceamento de carga: ${loadBalanced}\n\nEste item oferece um checklist de configuração; o roteiro completo do POV precisa ser elaborado.\n- [ ] Revisar autenticação, endpoints, portas, formato do payload, permissões e restrições de implantação na documentação oficial.\n- [ ] Confirmar o comportamento de backpressure e persistent queues; Destinations baseadas em filesystem não suportam persistent queues.\n- [ ] Configurar a Destination, rotear eventos de teste e verificar a entrega e as tentativas de reenvio no sistema receptor.\n\n[Documentação oficial](${destination.url})`
        : `Referencia oficial de Destination: ${destination.name}\nProtocolo: ${localizedProtocol}\nModo de entrega: ${localizedMode}\nBasado en filesystem: ${filesystem}\nBalanceo de carga: ${loadBalanced}\n\nEste elemento ofrece una lista de configuración; es necesario elaborar el procedimiento completo del POV.\n- [ ] Revisar autenticación, endpoints, puertos, formato del payload, permisos y restricciones de despliegue en la documentación oficial.\n- [ ] Confirmar el comportamiento de backpressure y persistent queues; los Destinations basados en filesystem no admiten persistent queues.\n- [ ] Configurar el Destination, enrutar eventos de prueba y verificar la entrega y los reintentos en el sistema receptor.\n\n[Documentación oficial](${destination.url})`;
      translations[JSON.stringify([lang,title])]=translatedTitle;
      translations[JSON.stringify([lang,content])]=translatedContent;
    }
  }
  return {checkedAt,indexUrl:'https://docs.cribl.io/stream/destinations/',entries,translations};
}
