
Console = function() {
	Console = this;
	var out = String;
	var userpath = String;
	var currentpath = String;
	var lastpath = String;
	
	this.initialize = function() {
		out = '';
		$('output').readOnly = true;
		userpath = cfg['path'] + '/users/'  + cfg['user'];
		currentpath = userpath;
		lastpath = currentpath;
	}
	
	this.execute = function() {
	
		var command = $('command').value;
		var currentPathEncoded = currentpath.replace(/\//g, '%2F');
		var userPathEncoded = userpath.replace(/\//g, '%2F');
		var lastPathEncoded = lastpath.replace(/\//g, '%2F');
		
		//alert(userPathEncoded);

		//alert(lastpath);
		AJAX.get(cfg['docConsole'], {
				parameters:'action=execute&command='+command+'&currentpath='+currentPathEncoded+'&userpath='+userPathEncoded+'&lastpath='+lastPathEncoded,
				onEnd:'Console.parse(xmlDoc.documentElement);', 
				onError:'Content.showMessage("console","fileNotFoundError",cfg["docConsole"])' 
				})
				
		$('command').value = '';
	}

	this.parse = function(obj) { 
		// trocar aqui por append de DOM e tirar o innerHTML
//		out += 
		// TODO: descobrir como obter o currentpath da tag <currentpath>
		
		var currentPathNode = obj.getElementsByTagName('currentpath')[0];
		var lastPathNode = obj.getElementsByTagName('lastpath')[0];
		//alert(currentPathNode);
		currentpath = currentPathNode.firstChild.nodeValue;
		lastpath = lastPathNode.firstChild.nodeValue;
		//alert(obj.firstChild.nodeValue);
		$('output').innerHTML += obj.firstChild.nodeValue;
		$('output').scrollTop = $('output').scrollHeight;
		Fileman.update()
	}
}