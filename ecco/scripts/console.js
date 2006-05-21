
Console = function() {
	Console = this;
	var out = String;
	
	this.initialize = function() {
		out = '';
		$('output').readOnly = true;
	}
	
	this.execute = function() {
	
		var command = $('command').value; 

		AJAX.get(cfg['docConsole'], {
				parameters:'action=execute&command='+command,
				onEnd:'Console.parse(xmlDoc.documentElement);', 
				onError:'Content.showMessage("console","fileNotFoundError",cfg["docConsole"])' 
				})
				
		$('command').value = '';
	}

	this.parse = function(obj) { 
		// trocar aqui por append de DOM e tirar o innerHTML
		out += obj.firstChild.nodeValue;
		$('output').innerHTML = out;
		$('output').scrollTop = $('output').scrollHeight;
	}
}