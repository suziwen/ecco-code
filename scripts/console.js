
Console = function() {
	Console = this; // provê acesso estático a esta classe para a classe AJAX
	
	// metodo que executa os comandos vindos da interface
	this.execute = function() {
	
		var command = document.getElementById('command').value; // pega o comando que foi digitado no form
		alert(command);
			
		//AJAX.get('servlet/console-output.xml', { // TROCAR AQUI PELA SERVLET QUE RETORNA O XML
		AJAX.get('/servlet/Console', {
				parameters:'command='+command,
				onEnd:'Console.parse(xmlDoc.documentElement);', 
				onError:'alert("Nao encontrou o xml/servlet")' 
				})
	}

	
	// metodo que parseia o xml vindo do servidor e envia de volta para a interface
	// o xml que vem do servidor não pode ter espaço nem quebra de linha entre o header e a tag como mostrado abaixo
	// <?xml version="1.0" encoding="iso-8859-1"?>((((aqui nao pode ter espaco ou quebra))))<out> .....
	this.parse = function(obj) { 
		var out = obj.firstChild.nodeValue;
		document.getElementById('output').innerHTML = out;
	}
}