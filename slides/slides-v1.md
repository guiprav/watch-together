# Plano

* Apresentação pessoal.
	* Quem sou?
	* Pra quem trabalho?
	* O que faço?

* Apresentação do assunto.
	* "Vim aqui pra falar sobre comunicação P2P arbitrária entre browsers utilizando WebRTC."
	* Pra compreender o que é P2P e quais são suas vantagens, é necessário compará-lo ao modelo cliente-servidor.
		* O que é o modelo cliente-servidor?
			* Exemplo típico: Navegadores acessando servidores HTTP.
			* O modelo cliente-servidor normalmente modela uma relação de desigualdade:
				* De um lado está o cliente (consumidor) e, do outro, está o servidor.
				* Um cumpre o papel de servir e outro de consumir.
				* O cliente pede e o servidor responde.
		* O que é o modelo P2P?
			* Exemplo típico: BitTorrent.
			* O modelo P2P modela normalmente uma relação de igualdade:
				* Os participantes da rede consomem dados de outros e servem dados para outros.
		* Mas não necessariamente:
			* Na prática, o modelo cliente-servidor pode ser usado pra modelar relações de igualdade.
			* Assim como o modelo P2P pode ser usado pra modelar relações de desigualdade.
			* Contudo, cliente-servidor incentiva desigualdade, enquanto P2P incentiva igualdade.
	* O mecanismo que possibilita P2P em navegadores se chama WebRTC.
		* A criação e padronização do WebRTC foi uma iniciativa do Google para que o Hangouts não precisasse de plugins para funcionar.
		* Em outras palavras, o foco do WebRTC é áudio e vídeo.
		* É por isso que, além da comunicação, o acesso a câmera e ao microfone é feito através da API WebRTC.
		* Contudo, onde passam sinais digitais de áudio e vídeo, passam sinais digitais de qualquer outro tipo. Inclusive JSON :)
		* E felizmente existe uma API que permite o envio e recebimento de dados arbitrários codificados como strings!
		* É esse tipo de comunicação arbitrária que minha apresentação gostaria de explorar.
		* Softwares de teleconferência vão ser sempre apenas isso. Comunicação P2P, por outro lado, abre possibilidades até então inimagináveis.

* Primeiro exemplo (básico).
	* Deixando a teoria um pouco de lado...
	* <Mostrar exemplo básico de troca de mensagens utilizando PeerJS.>
	* O WebRTC possibilita conexões P2P, mas, por questões diversas, ainda se faz necessária a presença servidores que permitam que peers se encontrem e os ajude a abrir uma conexões.
	* O lado bom é que esses servidores são bem genéricos, e outras pessoas já os escreveram pra nós.
	* No momento, ao invés de utilizar a API do WebRTC diretamente, eu utilizo uma biblioteca chamada PeerJS, que, além de abstrair diferenças entre browsers e simplificar a API do WebRTC, também provê um dos servidores necessários: O servidor de sinalização (signaling).
	* O servidor de sinalização é como o hall de entrada de um hotel:
		* Um lugar onde pessoas em viagens de negócio tipicamente se encontram, apertam as mãos, e partem pra algum outro local onde vão tratar de seus assuntos pessoais.
		* O hotel não tem nada a ver com o assunto dessas pessoas. Ele só era um ponto de encontro.
		* Servidores de sinalização são a mesma coisa: Peers se conectam a ele pra encontrar outros peers e abrir conexões diretas e particulares entre si.
	* Depois dos peers se encontrarem através do servidor de sinalização e decidirem mutuamente abrir uma conexão entre si, eles precisam de outro servidor pra abrir a conexão.
	* Devido ao fato de não haver endereços IPv4 suficientes pra endereçar todos os dispositivos online que usamos hoje em dia, os roteadores utilizados em nossas casas e escritórios possuem um endereço IP externo que é dividido entre todos os dispositivos pertencentes àquela sub-rede.
	* Pra manter uma conexão entre um dispositivo interno aberta com um endereço remoto, foi-se criado um mecanismo chamado NAT (Network Address Translation) que mantém uma relação de conexões abertas e endereços internos da rede, pra que o roteador saiba pra qual endereço interno repassar os pacotes vindos de fora.
	* NATs dificultam conexões P2P, pois não sabem pra qual endereço interno repassar requisições de conexão vindas de fora.
	* NAT funciona automaticamente pra conexões de dentro pra fora, mas não de fora pra dentro.
	* Pra contornar esse problema, o padrão WebRTC utiliza servidores STUN ou TURN:
		* Servidores STUN detectam o tipo de NAT dos peers e coordenam alguns hacks pra abrir a conexão.
		* Servidores TURN simplesmente repassam os dados de um peer pro outro. Geralmente isso só é utilizado como último recurso, quando contornar o NAT não foi possível.
	* O PeerJS vem configurado por padrão pra utilizar o servidor STUN do Google.
	* Por que isso é legal, tecnicamente falando?
		* Porque é fácil de usar (como dá pra ver pelo exemplo anterior).
		* Não necessita de servidores especializados.
			* Possibilita a criação de aplicações completas hospedadas no GitHub.
			* Ou enviadas por email como arquivos HTML ou ZIP mesmo!
			* Também permite que novatos em programação criem aplicações interativas sem precisar encontrar um servidor pra hospedar a aplicação, configurar o ambiente, etc.
		* Possibilita um nível de privacidade um pouco superior.
		* Latência reduzida em comparação com versões de uma mesma aplicação que utilizam um servidor como relay de mensagens.
			* Bom pra jogos online!
			* E outras aplicações com interatividade real-time...
	* Todos esses benefícios tem uma origem comum: A ruptura com o modelo cliente-servidor.
	* Essa ruptura tem consequências interessantes sociologicamente falando.
		* Servidores especializados concentram poder.
		* Redes P2P concentram poder nos nodes individuais que se comunicam.
		* Ou seja, P2P fortalece usuários (eu e você). O modelo client-server fortalece donos de servidores (normalmente grandes empresas).

* Pontos fracos.
	* Firewalls.
	* Servidores de sinalização.
	* Não serve pra qualquer tipo de aplicação: Em muitos casos, usuários possuírem uma conta em um site, onde seus dados são persistidos, é ideal.
