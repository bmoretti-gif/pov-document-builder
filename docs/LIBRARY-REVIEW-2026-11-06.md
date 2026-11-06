# Revisão das demais seções — 6 de novembro de 2026

31 roteiros de preparação e portas foram revisados com a documentação pública atual da Cribl. Os textos revisados estão disponíveis em EN, PT-BR e ES. São notas de preparação do POV com links para as instruções completas; não substituem os guias oficiais.

| Seção | Resultado da revisão | Referência |
| --- | --- | --- |
| Environment: organização e convite | Removida lista fixa de regiões e promessa de upgrade via Admin. Permissões devem corresponder ao escopo do POV. | [Configuração Cloud](https://docs.cribl.io/stream/cloud-initial-setup.md), [Permissions](https://docs.cribl.io/iam/permissions.md) |
| Environment: Stream local/híbrido | Requisitos atuais, disco local, CentOS Linux 7 descontinuado e bootstrap gerado pelo Leader. Git >= 1.8.3.1 continua sendo o mínimo publicado; não foi tratado como obsoleto. | [Requirements](https://docs.cribl.io/stream/requirements.md), [Distributed deployment](https://docs.cribl.io/stream/deploy-distributed.md), [Hybrid](https://docs.cribl.io/stream/cloud-enterprise.md) |
| Environment: Edge Linux/Windows/Kubernetes | Retirados tokens de exemplo e versão Helm congelada. Requisitos mínimos: aproximadamente 1 GHz, 1024 MB RAM, 5 GB por volume operacional. API local padrão 9420. | [Edge requirements](https://docs.cribl.io/edge/requirements.md), [Linux](https://docs.cribl.io/edge/deploy-linux.md), [Windows](https://docs.cribl.io/edge/deploy-windows.md), [Kubernetes](https://docs.cribl.io/edge/deploy-running-kubernetes.md) |
| Required Ports | Controle/configuração em 4200; bootstrap Cloud em 443 e local em 9000. Removida saída Lake atribuída incorretamente ao Leader local e URL de telemetria sem comprovação. Portas dos dados dependem das integrações. | [Ports](https://docs.cribl.io/stream/ports.md) |
| Senders: GCP | Assinatura Pub/Sub dedicada por consumidor independente; tópico pode ser compartilhado. | [Pub/Sub](https://docs.cribl.io/stream/sources-google_pubsub.md) |
| Senders: Panorama/Strata | Endpoint/porta reais e cadeia TLS atual, sem certificados históricos fixos. Suporte HEC e configuração PAN-OS dependem da versão do cliente. | [Syslog](https://docs.cribl.io/stream/sources-syslog.md), [HEC](https://docs.cribl.io/stream/sources-splunk-hec.md) |
| Senders: Splunk | Diferenciar redirecionamento e clonagem; retirar IPs de exemplo. | [Splunk TCP](https://docs.cribl.io/stream/sources-splunk.md) |
| Senders: Azure Event Hubs | Endpoint Kafka 9093, consumer group dedicado, autenticação suportada e permissões mínimas. Não adotar RootManageSharedAccessKey como padrão. | [Event Hubs](https://docs.cribl.io/stream/sources-azure-event-hubs.md) |
| Senders: S3/SQS | Corrigido s3:SendMessage para sqs:SendMessage na política da fila. Incluídos ChangeMessageVisibility, GetQueueUrl, tagging opcional e KMS quando aplicável. | [S3 Source](https://docs.cribl.io/stream/sources-s3.md) |
| Senders: Zscaler | Separar appliance NSS e Cloud NSS; feed, formato e autenticação precisam corresponder ao produto instalado. | [Zscaler Source](https://docs.cribl.io/stream/sources-zscaler-hec.md) |
| Receivers: Sentinel | DCR kind:direct recomendado quando adequado; DCE para necessidades como Private Link. Esquema, stream, TimeGenerated e Monitoring Metrics Publisher na DCR. | [Azure Workspace](https://docs.cribl.io/stream/usecase-azure-workspace.md) |
| Receivers: S3 | PutObject e permissões condicionais ListBucket/GetBucketLocation; validar criptografia, staging e flush. | [S3 Destination](https://docs.cribl.io/stream/destinations-s3.md) |
| Receivers: Splunk HEC | Endpoint/token/índice reais; guia alerta para não habilitar Indexer Acknowledgement no token nesta integração. | [Splunk HEC Destination](https://docs.cribl.io/stream/destinations-splunk-hec.md) |
| Receivers: CrowdStrike, Sumo e Datadog | Atualizados os pontos de configuração e referências; endpoints e autenticação são os gerados no tenant do cliente. | [CrowdStrike](https://docs.cribl.io/stream/destinations-crowdstrike-next-gen-siem.md), [Sumo](https://docs.cribl.io/stream/destinations-sumo-logic.md), [Datadog](https://docs.cribl.io/stream/destinations-datadog.md) |
| Search: resultados em cache | $vt_results reutiliza resultados sem repetir a busca original, mas ainda pode consumir créditos. Permissões e TTL importam; a amostra não é o dataset completo. | [$vt_results](https://docs.cribl.io/search/vt_results.md) |
| Search: S3/Azure/GCS | Permissões Search independentes de Stream; provider externo distinto de dataset com ingestão. Tratamento explícito de paths, formatos e tempo. Archive do Azure exige reidratação. | [S3](https://docs.cribl.io/search/set-up-s3.md), [Azure](https://docs.cribl.io/search/set-up-azure-blob.md), [GCS](https://docs.cribl.io/search/set-up-google-cloud-storage.md), [Conceitos](https://docs.cribl.io/search/basic-concepts.md) |
| Lake: datasets | JSON/Parquet e até três Lake Partitions continuam documentados. Removidas generalizações sobre retenção e indexação. Considerar Storage Location e Dataset Type federado. | [Managing datasets](https://docs.cribl.io/lake/managing-datasets.md) |
| Lake: DDSS | Uma Source por Workspace, Storage Location padrão, somente leitura por Stream/Search e efeitos distintos de exclusão no Lake e no Splunk. | [Splunk Cloud Direct Access](https://docs.cribl.io/lake/splunk-cloud.md) |
| Success Criteria | Revisados os oito tipos do menu e os cinco registros legados N/A. Não contêm requisitos de produto desatualizados; permanecem como escopo definido pelo usuário. Os registros N/A não são usados como resultados de sucesso. Cada POV deve definir baseline, meta mensurável, conjunto de dados e evidência de aceite. | Critérios da sessão, definidos com o cliente |

## Atualizações e limites

O workflow diário continua consultando a documentação oficial e agora inclui os links corrigidos de Environment, Search e Lake. A data do snapshot indica a consulta das páginas; não significa que os roteiros escritos foram revisados semanticamente todos os dias. A data desta revisão é 6/11/2026.

Os guias Cribl sustentam os pontos de integração. Esta revisão não certifica todos os menus, licenças ou requisitos dos fornecedores externos; esses pontos estão sinalizados nos roteiros para validação com o ambiente instalado.

Na documentação GCS consultada, a lista de permissões customizadas não inclui explicitamente leitura de objetos, embora os papéis recomendados incluam Storage Legacy Object Reader. O roteiro usa os papéis documentados e exige teste de leitura, evitando reproduzir uma política customizada potencialmente incompleta.

## Persistência e verificação

Os padrões intactos armazenados no navegador recebem a revisão. Edições e exclusões do cliente são preservadas. Nenhum reset de sessão é necessário. A biblioteca anterior é identificada por fingerprints, sem arquivar tokens de bootstrap antigos.

Validação: 11 arquivos de testes passaram, incluindo migração em duas revisões, preservação de alterações/exclusões, permissões, portas, referências Search, DCR e disponibilidade das traduções. Build de produção passou. O snapshot consultou 44 páginas sem falhas após a correção de dois links antigos do Microsoft 365; essa correção de links não representa uma nova revisão completa dos roteiros legados dessas duas Sources. Não foi executada validação visual de navegador nesta revisão.
