
Editor = function() {
	
	Editor = this;
	var openFiles = Array;
	var fileCount = Number;
	var currentFile = Number;
	
	this.initialize = function() {
		openFiles = [];
		fileCount = 0;
		currentFile = 0;
	}
	
	this.open = function(fullName) {
		for(var i=0;i<openFiles.length;i++) { // nao abre arquivos ja abertos
			if(fullName == openFiles[i]) {
				this.focus(i);
//				return;
			}
		}
		openFiles[fileCount] = fullName;
		var divText = document.createElement('div');
		var fileName = this.formatFileName(fullName);
		var divData = document.createTextNode($(fileName).innerHTML);
		divText.id = 'text'+fileCount;
		divText.appendChild(divData);
		$('text').appendChild(divText);
		this.updateTabs();
		this.focus(fileCount);
		fileCount++
	}
	
	this.close = function(id) {
  		$('text').removeChild($('text'+id));
		$('tab-list').removeChild($('tab'+id));
		openFiles[id] = false;
		var tmp = id;
		while (!openFiles[tmp] && tmp < openFiles.length) { // tenta encontrar a proxima aba com texto
			tmp++;
		}
		if(!openFiles[tmp]) { // se nao achou aba com texto, olha para as abas anteriores
			tmp = id;
			while (!openFiles[tmp] && tmp >= 0) {
				tmp--;
			}
		}
		if(!openFiles[currentFile] && openFiles[tmp]) {
			this.focus(tmp);
		}
	}
	
	this.updateTabs = function() {
		var out = '<table><tr id="tab-list">';
		for(var i=0;i<openFiles.length;i++) {
			if(openFiles[i]) {
				out += '<td id="tab'+i+'"><a href="javascript:void(0)" onclick="Editor.focus('+i+')">'+this.formatFileName(openFiles[i])+'</a>';
				out += ' <a href="javascript:void(0)" onclick="Editor.close('+i+')">x</a></td>';
			}
		}
		out += '</tr></table>';
		$('tabs').innerHTML = out;
	}
	
	this.focus = function(id) {
		this.blur(currentFile);
		currentFile = id;
		$('tab'+currentFile,'backgroundColor','gold');
		$('text'+currentFile,'display','block');
	}
	
	this.formatFileName = function(fullName) {
		return fullName.substring(fullName.lastIndexOf('/')+1,fullName.length);
	}
	
	this.blur = function(id) {
		if(openFiles[id]) {
			$('text'+id,'display','none');
			$('tab'+id,'backgroundColor','silver');
			}
	}
	
	this.save = function() {
	
	
	}
}