# REM v0.1 — protótipo para celular

Este é o primeiro protótipo da Rem: interface de chat, personalidade inicial, entrada por voz quando suportada pelo navegador e resposta falada usando a voz disponível no aparelho.

## O que já funciona
- Interface adaptada para celular.
- Personalidade-base da Rem.
- Envio de mensagens para uma API compatível com o formato OpenAI Chat Completions.
- Leitura das respostas em voz alta com a síntese de voz do navegador.
- Ditado por voz quando o navegador oferece `SpeechRecognition`.
- Configuração de URL, modelo e chave no painel ⚙️.

## Importante sobre a IA
O projeto **não inclui uma chave de API** e não funciona como IA real até você configurar um provedor. O endpoint predefinido é um exemplo de provedor compatível; confirme os modelos, preços e regras atuais no site do seu provedor.

### Segurança
Esta é uma versão de teste pessoal. A chave é armazenada no armazenamento local do navegador e enviada diretamente do navegador ao provedor. Não publique este protótipo com sua chave, não compartilhe o aparelho com pessoas em quem não confia e não use uma chave com permissões ou créditos que você não pode arriscar. Para uma versão pública ou mais segura, precisamos criar um pequeno backend que mantenha a chave no servidor.

## Como testar pelo celular
1. Extraia o ZIP.
2. Hospede os arquivos em um serviço de hospedagem estática HTTPS (por exemplo, um repositório privado/público e Pages, ou outro host estático). Alguns recursos de voz podem não funcionar abrindo o arquivo diretamente.
3. Abra o endereço HTTPS no Chrome do Android.
4. Toque em ⚙️ e configure a URL, o modelo e a chave do provedor de IA escolhido.
5. Salve e mande uma mensagem. Autorize o microfone quando o navegador solicitar.
6. Para colocar um atalho na tela inicial, abra o menu do Chrome e escolha **Adicionar à tela inicial** ou **Instalar app**, se aparecer.

## Limitações atuais
- Não há avatar oficial nem arte da personagem incluída.
- A voz é a voz portuguesa disponível no sistema/navegador; não é a voz original da dubladora.
- A memória das conversas existe apenas durante a sessão atual; atualizar a página reinicia o histórico.
- Comandos do Android e ativação contínua por palavra-chave não estão implementados.
- APIs de terceiros podem bloquear chamadas diretas do navegador (CORS). Se isso acontecer, precisaremos de um backend.

## Próximos passos
1. Colocar o protótipo em funcionamento.
2. Escolher e configurar o provedor de IA.
3. Testar voz e respostas.
4. Adicionar memória persistente com controles de privacidade.
5. Criar uma identidade visual original inspirada na estética desejada.
6. Transformar em PWA mais completa e, depois, considerar um app Android.
