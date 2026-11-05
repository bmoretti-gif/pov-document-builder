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
