# POV Document Builder

Projeto extraído do ZIP fornecido. Requer Node.js 20.19+ ou 22.12+.

## Iniciar

```powershell
npm.cmd ci
npm.cmd run dev
```

Abra http://localhost:8080. Não precisa de Gemini ou chave de API.
Para parar, use Ctrl+C no terminal.

## Docker

```powershell
docker compose up --build -d
docker compose down
```

## Conteúdo

A biblioteca fornecida de 18/06/2026 está integrada com 66 conteúdos. Ela é
mesclada uma única vez com o conteúdo local, preservando edições existentes.
Use Import Library para carregar outras bibliotecas ou Add Content para cadastrar itens. A importação mantém
itens com IDs diferentes; IDs coincidentes são substituídos pelo arquivo importado.
Use Export Library para guardar uma cópia e Save Session/Load Session para
guardar e restaurar os dados do POV. Os dados ficam no navegador.

## Word

Export to Word gera HTML com extensão .doc, conforme o aplicativo original.
Abra no Word e salve como DOCX ou PDF antes de enviar ao cliente.

## Validação

```powershell
npm.cmd test
npm.cmd run build
```

O checklist manual está em SETUP-ACCEPTANCE.md. Estilos e logo são locais.

## Idioma e documentação atual
Escolha English, Português ou Español na barra de prévia. Em Traduções, preencha/revise os textos; tradução local automática depende da API Translator do Chrome. Idioma e traduções acompanham a sessão salva. Alterações no original exigem nova tradução.
Consultar Cribl Docs busca o índice atual do Stream e as URLs oficiais presentes nos snippets selecionados. Cada exportação consulta novamente, sem cache, e bloqueia em caso de falha ou traduções incompletas. As páginas são referências para revisão: o aplicativo não substitui automaticamente portas ou conteúdo contratual. Use o índice para encontrar sources, destinations e requisitos novos, e edite os snippets na biblioteca.
O endpoint funciona via npm run dev ou npm run preview; hospedagem estática isolada não oferece essa consulta. Não há provedor externo de tradução configurado.

## GitHub Pages
Publicacao: https://bmoretti-gif.github.io/pov-document-builder/ . O workflow pages.yml consulta a documentacao oficial durante cada publicacao e diariamente, publica um snapshot com data da consulta e executa testes/build. O navegador carrega esse snapshot; nao consulta o servidor Node no Pages. Referencias indisponiveis e snapshots com mais de 48 horas geram avisos. A exportacao continua disponivel quando algumas paginas falham; revise os links oficiais. Textos da biblioteca nao sao reescritos automaticamente. Snippets locais criados pelo usuario nao entram na consulta do workflow ate serem incorporados a default-library.json.
Para testar localmente o build: npm run docs:update, npm run build -- --base=/pov-document-builder/, npm run preview.

## Biblioteca em português
A seleção Português utiliza as traduções incorporadas de default-translations-pt.json para os 66 snippets padrão, seus títulos e as células descritivas de portas. Funciona sem a API Translator do Chrome. A biblioteca foi traduzida automaticamente com Google Translate e exige revisão técnica. Os nomes de menus/botões, comandos, URLs e placeholders permanecem conforme o original. Traduções editadas na sessão têm prioridade; mudanças no texto original exigem nova tradução. Textos personalizados não são enviados automaticamente a serviços externos: podem ser traduzidos localmente no Chrome compatível ou preenchidos no painel Traduções. ES tamb?m utiliza a biblioteca incorporada em espanhol para os itens padr?o.

## Idiomas do documento
O seletor utiliza EN, PT-BR e ES. PT-BR e ES incluem tradu??es autom?ticas dos 66 itens padr?o. Comandos, URLs e nomes de menus ficam preservados. Textos personalizados e altera??es nos originais precisam de tradu??o pr?pria. As tradu??es da sess?o t?m prioridade sobre a biblioteca incorporada.
