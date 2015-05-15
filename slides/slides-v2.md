# Plano

* Apresentação pessoal.
	* Quem sou?
	* Pra quem trabalho?
	* O que faço?

* Slide 1:
	* P2P significa peer-to-peer: Uma arquitetura de rede normalmente associada a compartilhamento de arquivos (Emule, BitTorrent, etc).
	* Peer é uma palavra do inglês que significa "um igual"; alguém ou alguma coisa que não é por natureza superior ou inferior a outra.
	* Peers em uma rede P2P tem autonomia e direitos iguais.

* Slide 2:
	* P2P em browsers hoje é possível graças a uma tecnologia chamada WebRTC, que é o foco dessa palestra.
	* Nós vamos chegar no WebRTC. Mas, primeiro, vale a pena focar um pouquinho em como P2P difere da nossa forma habitual de trabalho.

* Slide 3:
	* O nosso modelo de conectividade padrão é chamado Cliente-Servidor.
	* Quando acessamos um site, nosso navegador localiza um servidor associado a um endereço web e realiza uma requisição (um pedido).
	* A resposta do servidor não é só uma resposta, mas software desenvolvido pelos donos do site.
	* Cada ação, cada movimento nosso, é interpretado pelo software do site e envolve novos pedidos ao servidor, que também os interpreta e decide pra onde guiar nossos navegadores.
	* Isso é perfeitamente adequado aos problemas que a web originalmente visou solucionar.
		* Se estamos navegando por terras desconhecidas, descobrindo coisas novas, é difícil imaginar modelo mais adequado do que esse.
		* Não precisamos de conhecimento prévio ou de programas pré-instalados pra vivermos novas experiências através de nossos navegadores, e isso é ótimo.

* Slide 4:
	* Mas, hoje, a web é uma plataforma com muito mais funções do que o simples acesso a websites.
	* Muitos sites são, na verdade, aplicativos que conectam pessoas e processam dados (ou seja, software clássico).
	* Ou seja, diversos sites desempenham funções que não são novidade pra nós. Não estamos mais explorando nada; apenas jogando fora nossas antigas ferramentas de comunicação e computação e confiando na presença de websites que nos servem software semelhante.
	* Eu entendo que a plataforma web seja muito agradável tanto pros usuários quanto pros desenvolvedores, mas essa dependência absoluta que temos de servidores me deixa bastante desconfortável.
	* Os operadores desses servidores tem muito poder sobre nossas vidas, e esse poder não para de crescer.
	* E aparentemente eu não sou o único a pensar isso, considerando essa imagem que eu achei na Internet...

* Slide 5:
	* [cow-catle.jpg]

* Slide 6:
	* Por isso, qualquer coisa que nos dê um pouco mais de independência sem a necessidade de migrar pra uma plataforma inferior é algo que eu considero muito bem-vindo e que me chama muito a atenção. WebRTC é uma dessas coisas.
	* Unindo-se WebRTC com plataformas como NW.js, que permite o desenvolvimento de aplicativos desktop utilizando apenas tecnologias web e NodeJS, é possível obter um fluxo de desenvolvimento muito familiar a desenvolvedores web, mas sem os problemas aos quais o modelo cliente-servidor pode sujeitar (e sujeita!) seus usuários, como:
		* Violações de privacidade.
		* Censura.
		* Restrições artificiais.
		* Mudanças indesejáveis nos termos de uso.
		* Término de serviço.
		* Etc.

* Slide 7:
	* Estes slides estão sendo servidos pelo GitHub.
	* Pra quem não sabe, o GitHub permite a hospedagem de páginas como essas, mas não permite qualquer forma de processamento do lado do servidor.
	* Em outras palavras, ele não executa código Node, PHP, Ruby, etc... Ele apenas serve arquivos estáticos, como HTML, CSS, JavaScript, imagens, etc.
	* Normalmente, isso significa que os usuários do site não podem interagir, pois não existe um servidor que os conecte.
	* Contudo, utilizando uma biblioteca chamada PeerJS, é possível criar um sistema de chat, por exemplo, sem precisarmos implementar qualquer tipo de servidor.
	* Sendo assim, é possível criar um sistema de chat e hospedá-lo no GitHub.
	* Pra isso é necessário bem pouco código, então que tal tentarmos fazer isso?

* Slide 8:
	* [Live coding do sistema de chat]

* Slide 9:
	* A bem da verdade, se pegássemos esse código, colocássemos em um simples arquivo HTML e enviássemos por email pra um amigo, poderíamos conversar com ele do mesmo jeito. Nada de se preocupar com servidores ou hospedagens.
	* Ótimo pra quem tá aprendendo, quer arriscar fazer um aplicativo online, que conecta pessoas de verdade, mas que ainda se confunde com Nodes, NPMs, Expresses ou, Deus proteja, LAMPs / WAMPs da vida...

* Slide 10:
	* Como isso funciona?
	* Na verdade, mesmo que enviássemos o arquivo HTML pra um amigo, pelo menos dois servidores estariam sendo utilizados pra nos auxiliar a abrir nossa conexão P2P.
	* O primeiro é um servidor do PeerJS, que é chamado de "servidor de sinalização".
	* Os servidores de sinalização são como pontos de encontro pra usuários que gostariam de iniciar conexões P2P.
	* Normalmente, os clientes dos servidores de sinalização recebem uma ID que pode ser usada por outros usuários pra iniciar conexões.

* Slide 11:
	* Além do servidor de sinalização, é necessário outro servidor que auxilia peers a se conectarem: O servidor STUN.
	* Devido ao número limitado de endereços IPv4 disponíveis, nem todos os dispositivos conectados à Internet possuem um endereço IPv4 único.
	* Em redes domésticas, por exemplo, é extremamente comum o roteador possuir um endereço externo a ser compartilhado por todos os computadores conectados àquela rede local.
	* Quando uma mensagem externa é enviada ao IP de um roteador doméstico, o roteador precisa saber pra qual endereço interno repassar aquela mensagem.
	* Esses roteadores possuem internamente um programa que gerencia as conexões ativas de forma a saber pra quem repassar mensagens vindas de fora.
	* Por exemplo, se Fulano acessou o site XXX (Fulano safado!), o roteador sabe que deve encaminhar a resposta de suas requisições, vindas de fora, pro endereço interno de Fulano.
	* Esse gerenciamento se chama NAT (Network Address Translation).

* Slide 12:
	* Infelizmente, ele só funciona de maneira automática quando a conexão é originária de dentro da rede local.
	* Se uma mensagem completamente nova chega de fora da rede ao roteador, como ele vai saber pra qual endereço interno repassar aquela mensagem?
	* A menos que você tenha configurado o seu roteador manualmente, associando um protocolo e porta específicos a um endereço interno, o roteador simplesmente não tem como saber pra quem repassar aquela mensagem.
	* O que os servidores STUN fazem é coordenar dois peers de forma que eles enviem pacotes com o timing necessário pra "perfurar o NAT".
	* O NAT é capaz de se autoconfigurar quando um programa da rede local envia a primeira mensagem de uma conexão, então se ambos os peers enviarem mensagens mais ou menos ao mesmo tempo, a conexão é estabelecida.
	* Essas técnicas são bem antigas. Foram empregadas há muito tempo por software de VoIP e algumas bibliotecas de networkin pra jogos (RakNet é uma), mas é a primeira vez que elas são acessíveis a páginas web.
	* O servidor STUN padrão do PeerJS é um servidor STUN gratuito do Google.

* Slide 13:
	* O processo de conexão consiste em duas pessoas conectando-se a um mesmo servidor de sinalização, através do qual eles descobrem o endereço IP uma da outra e trocam chaves criptográficas.
	* Depois, elas se conectam a um servidor STUN pra efetivamente abrir a conexão.
	* A partir daí, as mensagens trocadas entre elas são completamente P2P.
	* O processo pode ser repetido diversas vezes pra criar swarms como aqueles vistos em transferências BitTorrent.
	* E falando em BitTorrent, alguém inclusive já implementou um cliente BitTorrent 100% web-based utilizando WebRTC: Ele se chama WebTorrent!

* Slide 14:
	* O padrão WebRTC foi uma iniciativa do Google pra viabilizar a implementação do Hangouts sem a necessidade de plugins de navegador.
	* Sendo assim, o foco sempre foi em comunicação em tempo real de áudio e vídeo.
	* Apesar disso, felizmente, a W3C viu o potencial da tecnologia além dessa aplicação inicial e padronizou também uma API chamada WebRTC Data Channels.
	* É através delas que a transferência de dados arbitrários, como strings ou dados binários quaisquer, podem ser realizadas.

* Slide 15:
	* Através dessas APIs, é possível não só transferir áudio e vídeo, como também implementar:
		* Mensagens instantâneas.
		* Compartilhamento de arquivos de qualquer tipo.
		* Editores colaborativos (de texto, imagens, áudio, vídeo, ou o que for!)
		* Plataformas de ensino à distância.
		* Não todos, mas diversos tipos de jogos online (mesmo os que envolvem azar!)
