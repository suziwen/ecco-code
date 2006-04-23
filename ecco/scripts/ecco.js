// detectar resolucao do monitor ... minimo 800x600
ECCO = function() {
	
	var loaded = Array;
		
	this.initialize = function() {
	
		loaded = {
			'ecco' : false,
			'console' : false,
			'fileman' : false,
			'editor' : false
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
	}
	
}

