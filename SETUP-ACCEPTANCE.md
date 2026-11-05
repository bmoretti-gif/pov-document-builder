# Preparação local

Risco: configuração de execução local e renderização de conteúdo importado.

- auto: npm run build compila o aplicativo extraído do ZIP.
- auto: tests/formatter.test.mjs verifica que conteúdo importado é exibido como texto seguro.
- manual: abrir http://localhost:8080, preencher POV Details e conferir o preview.
- manual: importar a biblioteca JSON, selecionar conteúdos e conferir o preview.
- manual: adicionar porta e critério, salvar sessão, recarregar a sessão e exportar para Word.

O guia define a exportação .doc como HTML compatível com Word. Abrir no Word e salvar como DOCX ou PDF antes de enviar ao cliente.
