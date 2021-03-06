
Console = function() {
	Console = this;
	var out = String;
	var userpath = String;
	var currentpath = String;
	var lastpath = String;
	var commandHistory = HistoryQueue;
	var ouputHistory = HistoryQueue;
	var utils = Utils;
	//var browser;
	
	this.initialize = function() {
		out = '';
		utils = new Utils();
		$('output').readOnly = true;
		$('user').innerHTML = cfg['user'];
		userpath = cfg['path'] + '/users/'  + cfg['user'];
		currentpath = userpath;
		lastpath = currentpath;
		
		$('console').onclick = function() { $('command').focus(); }
		$('console').ondblclick = this.resizeArea;
			
		commandHistory = new HistoryQueue();
		commandHistory.initialize(10);
		
		outputHistory = new HistoryQueue();
		outputHistory.initialize(15);
		
		$('command').onkeydown = this.keyHandler;
		/*browser = { ie:false, ff:false };
		if(navigator.appName.indexOf("Microsoft") !=- 1) browser.ie = true;
		else if (navigator.appName == "Netscape") browser.ff = true;
		
		if(browser.ff) { // FF
			//document.designMode = 'on';
			document.addEventListener('keydown', this.keyHandler, true);
		} 
		else if(browser.ie) { // IE
			document.onkeydown = this.keyHandler;
		}*/
		
	}
	
	this.resizeArea = function() {
		if($('console').style.height=='auto') {
			$('console').style.height = '150px'; 
			$('console').style.top = 'auto'; 
			$('output').style.height = '90%';
			$('output').scrollTop = $('output').scrollHeight;
		} 
		else {
			$('console').style.height = 'auto'; 
			$('console').style.top = '60px';
			$('output').style.height = '98%';
		}
	}
	
	this.execute = function() {
	
		var command = $('command').value;
		// Guardando no hist?rico
		commandHistory.push(command);
		
		// Guardando chamada do comando pra exibir na tela
		outputHistory.push(cfg['user']+"@ecco ~$ "+command+"\n");
		
		// Tratando os comandos cls e clear
		if(utils.trim(command) == 'cls' || utils.trim(command) == 'clear'){
			outputHistory.clear();
			$('output').innerHTML = outputHistory.getAllInOne();
			$('command').value = '';
			return;
		}
		
		var currentPathEncoded = currentpath.replace(/\//g, '%2F');
		var userPathEncoded = userpath.replace(/\//g, '%2F');
		var lastPathEncoded = lastpath.replace(/\//g, '%2F');
		
		//alert(currentpath);

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
		
		currentpath = currentPathNode.firstChild.nodeValue;
		lastpath = lastPathNode.firstChild.nodeValue;
		
		//alert(currentPathNode);
		//alert(lastpath);
		//windows.alert(obj.firstChild.nodeValue);
		//$('output').innerHTML += obj.firstChild.nodeValue;
		outputHistory.push(obj.firstChild.nodeValue);
		//var $teste = outputHistory.getAllInOne();
		//alert($teste);
//		$('output').innerHTML = outputHistory.getAllInOne();
		newNode = document.createElement('div');
		textNodeCmd = document.createTextNode(outputHistory.getLast(1)+'\n')
		textNode = document.createTextNode(outputHistory.getLast()+'\n')
		newNode.appendChild(textNode)
		newNode.appendChild(textNodeCmd)
		$('output').appendChild(newNode);
		$('output').scrollTop = $('output').scrollHeight;
		Fileman.update()
	}
	
	this.keyHandler = function(evt) {
		evt = (evt) ? evt : (window.event) ? event : null;
	  	if(evt) {
	    	charCode = (evt.charCode) ? evt.charCode : ((evt.keyCode) ? evt.keyCode : ((evt.which) ? evt.which : 0));
			if(charCode == 13) {
				Console.execute();
			}
		    if((charCode == 38) && (!evt.ctrlKey && !evt.altKey)) { // precionada tecla up
			 	$('command').value = commandHistory.getLast(1);
			} 
			
			if((charCode == 40) && (!evt.ctrlKey && !evt.altKey)) { // precionada tecla down
			 	$('command').value = commandHistory.getNext();
			} 
			
		}
	}
	
}


// Classe utilizada pelo console
HistoryQueue = function(){
	var queue = Array;
	var currentIndex = Number;
	var first = Number;
	var last = Number;
	var qSize = Number;
	var currentLast = Boolean;
	var count = Number;

	//HistoryQueue = this;
	
	this.initialize = function(size){
		qSize = size + 1;
		queue = new Array(qSize);
		currentIndex = 0;
		first = 0;
		last = 0;
		count = 0;
		currentLast = false;
	}
	
	this.clear = function(){
		queue = new Array(qSize);
		currentIndex = 0;
		first = 0;
		last = 0;
		count = 0;
	}
	
	this.pop = function(){
		var result = null;
		if(first != last){
			result = queue[((first+1) % qSize)];
			if(currentIndex == first) currentIndex = (currentIndex + 1) % qSize
			first = (first + 1) % qSize;

		}else
			result = null;
			
		return result;
	}
	
	this.push = function(item){
		// added by feanndor
		// $('output').removeChild($('output').firstChild);
		/////
		last = (last + 1) % qSize;
		if(first == last) first = (first + 1) % qSize;
		queue[last] = item;
		currentIndex = last;
		currentLast = true;
		//alert(queue);
	}
	
	this.getCurrent = function(){
		return queue[currentIndex];
	}
	
	this.getNext = function(){
		var result = "";
		if(last != first){
			if(currentIndex != last)
				currentIndex = (currentIndex + 1) % qSize;
			result = this.getCurrent();
		}
		
		return result;
	}
	
	this.getLast = function(){
		var result = "";

		if(!arguments[0]) {
			count++;
			if(count>qSize) $('output').removeChild($('output').firstChild);
		}

		if(last != first){
			if(currentLast == true){
				currentLast = false;
				return this.getCurrent();
			}
			if(currentIndex != ((first+1) % qSize))
				currentIndex--;
			if(currentIndex < 0) currentIndex = qSize - 1;
			result = this.getCurrent();
		}
		return result;
	}
	
	this.getAllInOne = function(){
		var all = "";
		var auxAll = "";
		var tmpCurrentIndex = currentIndex;
		if(first != last){
			currentIndex = (first+1) % qSize;
			do{
				auxAll = "";
				if(currentIndex != first){
					auxAll = this.getCurrent();
					currentIndex = (currentIndex + 1) % qSize;
				}else{
					currentIndex = (currentIndex + 1) % qSize;
				}
				//alert(currentIndex+":"+auxAll);
				
				all += typeof(auxAll) != "undefined"? auxAll:"";
			//}while(auxAll != "")
			}while(currentIndex != (last+1))
		}
		
		currentIndex = tmpCurrentIndex;
		
		return all;
	}
}


// Classe de fun??es de utilidade
Utils = function(){
	// Funcionalidade para as strings
	// Removes leading whitespaces
	this.ltrim = function(value) {
		var re = /\s*((\S+\s*)*)/;
		return value.replace(re, "$1");
		
	}
	
	// Removes ending whitespaces
	this.rtrim = function(value){

		var re = /((\s*\S+)*)\s*/;
		return value.replace(re, "$1");
		
	}
	
	// Removes leading and ending whitespaces
	this.trim = function(value) {
		return this.ltrim(this.rtrim(value));
	}
}