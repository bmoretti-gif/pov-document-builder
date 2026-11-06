export const reviewedTranslations = {
  official_sources_trellix: {
    sourceHash:'b0611aeefb0dfeefb7e579ca85359a520a10aaeaae4b143c5cb8dcf3c8bc0a93',
    scope:'configuration',
    pt:`# Configurar a Source Trellix

A Source Trellix recebe dados estruturados de detecção do Trellix Network Detection and Response (NDR) pelo protocolo HTTP Event Collector (HEC). Suporta o endpoint \`/services/collector/event\`. Não suporta \`/services/collector/raw\` nem confirmações do indexador HEC.

## Criar a Source no Cribl Stream

1. Na barra superior, selecione **Products** e **Cribl Stream**. Em **Worker Groups**, selecione o Worker Group.
   - Pelo QuickConnect: abra **Routing > QuickConnect**, selecione **Add Source** e escolha a Source, usando **Select Existing** ou **Add New**.
   - Pelas Routes: selecione **Data > Sources**, depois **Add Source** e **Trellix**.
2. No modal **New Source**, configure **General Settings**:
   - **Input ID**: nome exclusivo para identificar esta definição. Ao clonar a Source, o Cribl adiciona \`-CLONE\` ao Input ID original.
   - **Description**: descrição da Source.
   - **Address**: hostname ou endereço IP de escuta HTTP/HTTPS. O padrão é \`0.0.0.0\`; IPv4 e IPv6 são suportados.
   - **Port**: porta na qual a Source deve escutar.
   - **HEC endpoint**: mantenha \`/services/collector\`. O Cribl deriva desse caminho os endpoints de eventos e de saúde.
3. Em **Optional Settings**:
   - **Allowed indexes**: valores permitidos no campo HEC \`index\`. Aceita curingas; deixe vazio para não validar. Esses valores podem ampliar a validação de índices no nível de token.
   - **Tags**: tags para filtrar e agrupar Sources. Elas não são adicionadas aos eventos processados.
4. Ajuste, se necessário, **TLS**, **Persistent Queue**, **Processing**, **Auth Tokens**, **Advanced** e **Connected Destinations**. Consulte a página completa para todas as opções e restrições de implantação.
5. Selecione **Save** e **Commit & Deploy**.

## TLS no lado do servidor

**Enabled**: habilita TLS; o padrão é desabilitado. Se ativado, configure o certificado do servidor.

- **Certificate**: selecione um certificado existente ou use **Create** para adicionar outro.
- **Certificate path**: caminho dos certificados PEM no servidor; aceita \`$ENV_VARS\`.
- **Private key path**: caminho da chave privada PEM; aceita \`$ENV_VARS\`.
- **Passphrase**: senha para descriptografar a chave privada.

Para mTLS, habilite **Authenticate client (mutual auth)**, se necessário. Configure **Trusted client CA path** e **Validate client certificates**. Este último vem habilitado. Em **Common name**, defina a expressão regular para os campos CN e SAN do certificado do cliente; o padrão é \`/.*/\`.

Use **Minimum TLS version** e **Maximum TLS version** para limitar as versões aceitas.

## Auth Tokens

Adicione um ou mais tokens para autenticação do Trellix NDR. **Sem token configurado, a Source permite acesso sem autenticação.**

Selecione **Add Token** e configure:

- **Authentication method**: escolha **Secret**. Esta Source não suporta tokens inseridos manualmente.
- **Token secret (text secret)**: escolha **Select local secret** ou **Select global secret** e selecione um segredo de texto existente, ou use **Create text secret**.
- **Enable token**: permite acesso com esse token; vem habilitado.
- **Description**: descrição usada como nome de exibição do token.
- **Allowed indexes**: valores permitidos no campo HEC \`index\` para esse token; aceita curingas. Deixe vazio para não validar.
- **Fields**: use **Add Field** para adicionar pares **Field Name** e **Value** aos eventos que usam esse token.

## Configurar o Trellix NDR para encaminhar dados

Depois de salvar a Source, adicione uma integração Splunk no Trellix NDR, conforme [Configure SIEM using Web UI](https://docs.trellix.com/bundle/ndr_4.x_console_pg/page/UUID-2103cb9d-568f-5d93-a2db-aca0f55d47cc.html).

- **IP address or hostname**: endereço pelo qual o Trellix NDR alcança esta Source.
- **Port**: a porta configurada nesta Source.
- **Authentication**: valor do segredo de texto referenciado em **Auth Tokens**.
- **SSL**: habilite se TLS estiver habilitado na Source.
- **Notification**: habilite para enviar alertas, metadados de camada 7 e eventos de fluxo.

## Endpoints HEC

Mantenha **HEC endpoint** como \`/services/collector\`. O Trellix NDR envia eventos estruturados para \`/services/collector/event\`. A Source aceita verificações de saúde em \`/services/collector/health\`.

Requisições a \`/services/collector/raw\` retornam HTTP \`404\`. Requisições a \`/services/collector/ack\` retornam HTTP \`400\` com \`ACK is disabled\`.

Esta é a tradução revisada das seções de configuração. As opções detalhadas de persistent queues, processamento, configurações avançadas e troubleshooting estão na [página oficial completa](https://docs.cribl.io/stream/sources-trellix/).`,
    es:`# Configurar el Source Trellix

El Source Trellix recibe datos estructurados de detección de Trellix Network Detection and Response (NDR) mediante HTTP Event Collector (HEC). Admite \`/services/collector/event\`. No admite \`/services/collector/raw\` ni confirmaciones del indexador HEC.

## Crear el Source en Cribl Stream

1. En la barra superior, seleccione **Products** y **Cribl Stream**. En **Worker Groups**, seleccione el Worker Group.
   - Mediante QuickConnect: abra **Routing > QuickConnect**, seleccione **Add Source** y elija el Source con **Select Existing** o **Add New**.
   - Mediante Routes: seleccione **Data > Sources**, después **Add Source** y **Trellix**.
2. En **New Source**, configure **General Settings**:
   - **Input ID**: nombre único para identificar esta definición. Al clonarla, Cribl añade \`-CLONE\` al Input ID original.
   - **Description**: descripción del Source.
   - **Address**: hostname o dirección IP para recibir HTTP/HTTPS. El valor predeterminado es \`0.0.0.0\`; admite IPv4 e IPv6.
   - **Port**: puerto de escucha del Source.
   - **HEC endpoint**: conserve \`/services/collector\`. Cribl deriva de esta ruta los endpoints de eventos y salud.
3. En **Optional Settings**:
   - **Allowed indexes**: valores permitidos en el campo HEC \`index\`. Admite comodines; déjelo vacío para omitir la validación. Estos valores pueden ampliar la validación de índices a nivel del token.
   - **Tags**: etiquetas para filtrar y agrupar Sources; no se añaden a los eventos procesados.
4. Ajuste **TLS**, **Persistent Queue**, **Processing**, **Auth Tokens**, **Advanced** y **Connected Destinations** si es necesario. Consulte la página completa para todas las opciones y restricciones de despliegue.
5. Seleccione **Save** y **Commit & Deploy**.

## TLS del servidor

**Enabled** activa TLS; está desactivado de forma predeterminada. Si lo activa, configure el certificado del servidor.

- **Certificate**: seleccione un certificado existente o use **Create** para añadir uno.
- **Certificate path**: ruta de los certificados PEM; admite \`$ENV_VARS\`.
- **Private key path**: ruta de la clave privada PEM; admite \`$ENV_VARS\`.
- **Passphrase**: contraseña para descifrar la clave privada.

Para mTLS, active **Authenticate client (mutual auth)** si es necesario. Configure **Trusted client CA path** y **Validate client certificates**, que está activado de forma predeterminada. En **Common name**, defina la expresión regular para CN y SAN del certificado del cliente; el valor predeterminado es \`/.*/\`.

Use **Minimum TLS version** y **Maximum TLS version** para limitar las versiones aceptadas.

## Auth Tokens

Añada uno o más tokens para autenticar Trellix NDR. **Sin un token configurado, el Source permite acceso sin autenticación.**

Seleccione **Add Token** y configure:

- **Authentication method**: elija **Secret**. Este Source no admite tokens introducidos manualmente.
- **Token secret (text secret)**: elija **Select local secret** o **Select global secret**, seleccione un secreto de texto existente o use **Create text secret**.
- **Enable token**: permite acceso con el token; está activado de forma predeterminada.
- **Description**: descripción utilizada como nombre del token.
- **Allowed indexes**: valores permitidos en el campo HEC \`index\` para este token; admite comodines. Déjelo vacío para omitir la validación.
- **Fields**: use **Add Field** para añadir pares **Field Name** y **Value** a los eventos que utilizan el token.

## Configurar Trellix NDR para enviar datos

Después de guardar el Source, añada una integración Splunk en Trellix NDR siguiendo [Configure SIEM using Web UI](https://docs.trellix.com/bundle/ndr_4.x_console_pg/page/UUID-2103cb9d-568f-5d93-a2db-aca0f55d47cc.html).

- **IP address or hostname**: dirección que Trellix NDR utiliza para alcanzar el Source.
- **Port**: puerto configurado en el Source.
- **Authentication**: valor del secreto de texto indicado en **Auth Tokens**.
- **SSL**: actívelo si ha activado TLS en el Source.
- **Notification**: actívelo para enviar alertas, metadatos de capa 7 y eventos de flujo.

## Endpoints HEC

Conserve **HEC endpoint** como \`/services/collector\`. Trellix NDR envía eventos estructurados a \`/services/collector/event\`. El Source admite comprobaciones de salud en \`/services/collector/health\`.

Las solicitudes a \`/services/collector/raw\` devuelven HTTP \`404\`. Las solicitudes a \`/services/collector/ack\` devuelven HTTP \`400\` con \`ACK is disabled\`.

Esta es una traducción revisada de las secciones de configuración. Las opciones detalladas de persistent queues, procesamiento, configuración avanzada y troubleshooting están en la [página oficial completa](https://docs.cribl.io/stream/sources-trellix/).`
  }
};
