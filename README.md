# Agenda de Endereços

Projeto de Desenvolvimento de Aplicações Móveis da PUC Minas Betim. A agenda permite cadastrar locais por apelido, consultar o CEP pela BrasilAPI e manter os endereços no aparelho.

**Link da entrega:** https://github.com/NataliasilvaOliveira18/agenda-de-enderecos

## Abrir no Samsung com Expo Go

1. No computador, instale o Node.js 24 LTS com npm. No celular Android, instale o Expo Go compatível com o SDK 58.
2. Extraia o ZIP. No VS Code, escolha **Arquivo - Abrir Pasta** e selecione a pasta `agenda`, que contém `App.js` e `package.json`.
3. Abra **Terminal → Novo Terminal** e execute, um comando por vez:

   ```sh
   npm ci
   npm start
   ```

4. Conecte o computador e o celular à mesma rede Wi-Fi. Com o terminal aberto, use o leitor de QR code do Expo Go. Se o Windows bloquear o acesso do Node à rede, permita o acesso na sua rede privada.
5. Se o Expo Go informar incompatibilidade, confira a versão Android correspondente ao SDK 58 em https://expo.dev/go. Se a rede impedir a conexão entre os aparelhos, encerre o servidor com Ctrl+C e tente `npx expo start --tunnel` com internet, aceitando instalar o componente de túnel se solicitado.

## Primeiro teste

1. Em **Meus endereços**, toque em **+ Novo endereço**. Use o nome **Faculdade**, informe um CEP conhecido e toque em **Buscar**. Confira os dados retornados e complete os campos que faltarem. Número aceita **s/n** e complemento é opcional.
2. Salve e procure **faculdade** na lista. Abra o card, toque em **Editar endereço**, altere o número e salve.
3. Feche a experiência e abra **o mesmo projeto** de novo. Confira se o número atualizado continua lá.
4. Com o app já aberto no celular, desligue a internet. Consulte o registro e cadastre outro manualmente. Uma tentativa de buscar um CEP deve apresentar uma mensagem e permitir continuar preenchendo.
5. Nos detalhes, toque em **Excluir endereço** e primeiro cancele. Verifique que o registro continua lá. Repita e confirme para removê-lo.

## Como o código está organizado

| Onde | Responsabilidade |
| --- | --- |
| App.js e src/navigation/ | Provedor de endereços e navegação em pilha com React Navigation. |
| src/screens/ | Lista com FlatList e busca, formulário de cadastro/edição e detalhes. |
| src/components/ | Card, campos identificados, botões e mensagens de lista vazia. |
| src/context/EnderecosContext.js | Compartilha a lista e as operações de salvar e excluir entre as telas. Atualiza a interface após a gravação. |
| `src/services/brasilApi.js` | Consulta o endereço com `fetch`, enviando somente o CEP para `https://brasilapi.com.br/api/cep/v2/{cep}`. |
| src/services/storage.js | Lê e grava a lista em JSON na chave local @agenda:enderecos usando AsyncStorage. |
| src/utils/validacao.js | Verifica os campos obrigatórios, valida os oito dígitos do CEP e formata sua exibição. |

O comando npm ci instala as dependências nas versões registradas no package-lock.json. React Navigation usa native-stack e react-native-screens para a pilha. O safe-area-context reserva espaço para as barras do aparelho. A agenda começa vazia. Os dados ficam no dispositivo e a consulta de novos CEPs requer internet.

## Recursos opcionais

- **Geolocalização:** na tela Novo endereço, o usuário pode tocar em “Usar CEP da minha localização”. A biblioteca `expo-location` solicita permissão para acessar a localização durante o uso. Quando o aparelho identifica um CEP, o aplicativo consulta a BrasilAPI e preenche os dados disponíveis. Se a localização estiver indisponível, o usuário pode preencher o endereço manualmente.
- **Tema claro e escuro:** as três telas acompanham o tema escolhido no celular. O aplicativo usa `useColorScheme` do React Native para selecionar as cores e `expo-system-ui` para dar suporte à configuração automática no Android.
- **Ícones da interface:** a biblioteca `react-native-svg` desenha os ícones de localização, busca, edição e exclusão.

Essas bibliotecas são instaladas junto com as demais dependências ao executar `npm ci`.
