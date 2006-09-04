
Console = function() {
	Console = this;
	var out = String;
	var userpath = String;
	var currentpath = String;
	var lastpath = String;
	var commandHistory = HistoryQueue;
	var ouputHistory = HistoryQueue;
	//var browser;
	
	this.initialize = function() {
		out = '';
		$('output').readOnly = true;
		userpath = cfg['path'] + '/users/'  + cfg['user'];
		currentpath = userpath;
		lastpath = currentpath;
		
		commandHistory = new HistoryQueue();
		commandHistory.initialize(10);
		
		outputHistory = new HistoryQueue();
		outputHistory.initialize(10);
		
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
	
	this.execute = function() {
	
		var command = $('command').value;
		// Guardando no hist?rico
		commandHistory.push(command);
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
		//$('output').innerHTML += obj.firstChild.nodeValue;
		outputHistory.push(obj.firstChild.nodeValue);
		$('output').innerHTML = outputHistory.getAllInOne();
		$('output').scrollTop = $('output').scrollHeight;
		Fileman.update()
	}
	
	this.keyHandler = function(evt) {
		evt = (evt) ? evt : (window.event) ? event : null;
	  	if(evt) {
	    	charCode = (evt.charCode) ? evt.charCode : ((evt.keyCode) ? evt.keyCode : ((evt.which) ? evt.which : 0));
		    if((charCode == 38) && (!evt.ctrlKey && !evt.altKey)) { // precionada tecla up
			 	$('command').value = commandHistory.getLast();
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

	//HistoryQueue = this;
	
	this.initialize = function(size){
		qSize = size + 1;
		queue = new Array(qSize);
		currentIndex = 0;
		first = 0;
		last = 0;
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
		last = (last + 1) % qSize;
		if(first == last) first = (first + 1) % qSize;
		queue[last] = item;
		currentIndex = last;
		
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
		if(last != first){
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
			}while(auxAll != "")
		}
		
		currentIndex = tmpCurrentIndex;
		
		return all;
	}
}