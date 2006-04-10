

ECCO = function() {
	
	var loaded = {
		'ecco' : false,
		'console' : false,
		'fileman' : false,
		'editor' : false
	}
	
	this.initialize = function() {
		ajax = new AJAX();
		content = new Content();
		content.initialize();
	}
	
	this.set = function(mod) {
		loaded[mod] = true;
		if(loaded['fileman'] && loaded['console']) { // fazer aqui a verificacao de todos os xmls necessarios para iniciar
			this.run();
		}
	}
	
	this.run = function() {
		fileman = new Fileman();
		fileman.update();
	
	}
	
}
