ECCO = function() {
	
	ECCO = this;
	var loaded = Array;
		
	this.initialize = function() {
	
		loaded = {
			'ecco'    : false,
			'console' : false,
			'fileman' : false,
			'editor'  : false
		}
	
		new AJAX();
		new Content();
		Content.initialize();
	}
	
	this.set = function(mod) {
		loaded[mod] = true;
		if(loaded['fileman'] && loaded['console'] && loaded['editor'] && loaded['ecco']) { // fazer aqui a verificacao de todos os xmls necessarios para iniciar
			this.run();
		}
	}
	
	this.run = function() {
		new Fileman();
		Fileman.initialize();
		new Editor();
		Editor.initialize();
		new Console();
		Console.initialize();

	}
	
	this.detect = function() {
		// detectar resolucao do monitor ... minimo 800x600
		// detectar outras configuracoes de browser necessarias para rodar o ECCO
	}
}

// metodo global
$ = function(id) {
	if(!arguments[1]) return document.getElementById(id);
	else document.getElementById(id).style[arguments[1]] = arguments[2];
}
