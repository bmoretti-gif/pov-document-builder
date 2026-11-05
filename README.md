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
