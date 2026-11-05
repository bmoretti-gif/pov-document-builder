export type DocumentLanguage = 'en' | 'pt' | 'es';
export const localeFor = (lang: DocumentLanguage) => ({en:'en-US',pt:'pt-BR',es:'es-ES'}[lang]);
const labels: Record<string, [string, string]> = {
  'CRIBL COLLECTOR CONFIGS':['CONFIGURA\u00c7\u00d5ES DE COLLECTORS CRIBL','CONFIGURACIONES DE COLLECTORS CRIBL'],
  'CUSTOMER':['CLIENTE','CLIENTE'],
  'PROOF OF VALUE ENGAGEMENT DOCUMENT':['DOCUMENTO DA PROVA DE VALOR','DOCUMENTO DE LA PRUEBA DE VALOR'],
  'POV Details':['Detalhes do POV','Detalles del POV'],
  'CRIBL TEAM':['EQUIPE CRIBL','EQUIPO CRIBL'],
  'CUSTOMER TEAM':['EQUIPE DO CLIENTE','EQUIPO DEL CLIENTE'],
  'Solution Engineer':['Engenheiro de soluções','Ingeniero de soluciones'],
  'Executive Sponsor':['Patrocinador executivo','Patrocinador ejecutivo'],
  'Technical Lead':['Responsável técnico','Responsable técnico'],
  'Kickoff Date':['Data de início','Fecha de inicio'],
  'POV Architecture':['Arquitetura do POV','Arquitectura del POV'],
  'ENVIRONMENT':['AMBIENTE','ENTORNO'],
  'REQUIRED PORTS':['PORTAS NECESSÁRIAS','PUERTOS NECESARIOS'],
  'Required Ports':['Portas necessárias','Puertos necesarios'],
  'SENDERS & DATASOURCES':['REMETENTES E FONTES DE DADOS','EMISORES Y FUENTES DE DATOS'],
  'CRIBL SOURCE CONFIGS':['CONFIGURAÇÕES DE SOURCES CRIBL','CONFIGURACIONES DE SOURCES CRIBL'],
  'RECEIVERS & DATA DESTINATIONS':['RECEPTORES E DESTINOS DE DADOS','RECEPTORES Y DESTINOS DE DATOS'],
  'CRIBL DESTINATION CONFIGS':['CONFIGURAÇÕES DE DESTINATIONS CRIBL','CONFIGURACIONES DE DESTINATIONS CRIBL'],
  'SEARCH':['CONSULTA E ANÁLISE','CONSULTA Y ANÁLISIS'],
  'LAKE':['ARMAZENAMENTO LAKE','ALMACENAMIENTO LAKE'],
  'SUCCESS CRITERIA':['CRITÉRIOS DE SUCESSO','CRITERIOS DE ÉXITO'],
  'Success Criteria':['Critério de sucesso','Criterio de éxito'],
  'Source':['Origem','Origen'], 'Destination':['Destino','Destino'],
  'Port':['Porta','Puerto'], 'Purpose':['Finalidade','Finalidad'],
  'Details':['Detalhes','Detalles'], 'Status':['Status','Estado'],
  'TBD':['A definir','Por definir'],
  'Data Onboarding':['Integração de dados','Integración de datos'],
  'Routing':['Roteamento','Enrutamiento'], 'Optimization':['Otimização','Optimización'],
  'Masking & Obfuscation':['Mascaramento e ofuscação','Enmascaramiento y ofuscación'],
  'Replay | Rehydrate':['Replay e reidratação','Replay y rehidratación'],
  'Transformation':['Transformação','Transformación'],
  'Search and Analysis':['Consulta e análise','Consulta y análisis'],
  'Retention & Compliance':['Retenção e conformidade','Retención y cumplimiento']
};
export const documentLabel = (text: string, lang: DocumentLanguage) => lang === 'en' ? text : labels[text]?.[lang === 'pt' ? 0 : 1] ?? text;
export const translationKey = (text: string, lang: DocumentLanguage) => JSON.stringify([lang,text]);

// Keep commands, inline code, URLs, placeholders and CSV tables unchanged.
export async function translateMarkup(text: string, translate: (text: string) => Promise<string>): Promise<string> {
  let code = false;
  let table = false;
  const output: string[] = [];
  for (const line of text.split('\n')) {
    const trimmed = line.trim();
    if (trimmed === '```' || trimmed === 'CODE:') { code = !code; output.push(line); continue; }
    if (trimmed === 'TABLE:') { table = true; output.push(line); continue; }
    if (table && !trimmed) table = false;
    if (code || table || !trimmed) { output.push(line); continue; }
    const tokens: string[] = [];
    const protectedLine = line.replace(/`[^`]*`|https?:\/\/[^\s)]+|\[[A-Z_]+\]/g, token => {
      tokens.push(token); return `POVTOKEN${tokens.length - 1}END`;
    });
    const prefix = protectedLine.match(/^(\s*(?:- \[[ xX]\] |[-*] |\d+\. )?)/)?.[0] ?? '';
    let translated = await translate(protectedLine.slice(prefix.length));
    for (let i=0;i<tokens.length;i++) {
      const token = `POVTOKEN${i}END`;
      if (!translated.includes(token)) throw new Error('A tradução alterou um trecho técnico protegido.');
      translated = translated.replace(token,tokens[i]);
    }
    output.push(prefix + translated);
  }
  return output.join('\n');
}

interface LocalTranslator { translate(text:string):Promise<string>; destroy():void; }
interface TranslatorFactory { create(options:{sourceLanguage:string;targetLanguage:string}):Promise<LocalTranslator>; }
export async function createLocalTranslator(lang: DocumentLanguage):Promise<LocalTranslator> {
  const factory = (globalThis as typeof globalThis & {Translator?:TranslatorFactory}).Translator;
  if (!factory) throw new Error('A tradução local requer Chrome com a API Translator habilitada.');
  return factory.create({sourceLanguage:'en',targetLanguage:lang});
}
