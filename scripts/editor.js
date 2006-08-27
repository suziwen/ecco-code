
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
		this.edit('a',fullName);
/*		AJAX.get(cfg['docEditor'], { 
			parameters:'action=open&file='+fullName,
//			onStart:'Content.showMessage("editor","fileOpening","'+fullName+'")',
			onEnd:'Editor.parse(xmlDoc.documentElement,"'+fullName+'");', //Content.clearMessage()
			onError:'Content.showMessage("editor","fileNotFoundError",cfg["docEditor"])' 
			}) */
	}
	
	this.parse = function(obj,fullName) {
		var text = '';
		text = obj.firstChild.nodeValue;
		if(text == 'error') {
			Content.showMessage("editor","fileOpenError",fullName);
		}
		else {
			this.edit(text, fullName);
		}
	}
	
	this.edit = function(text, fullName) {

		for(var i=0;i<openFiles.length;i++) { // nao abre arquivos ja abertos
			if(fullName == openFiles[i]) {
				this.focus(i);
				return;
			}
		}
		openFiles[fileCount] = fullName;
		var divIFrame = document.createElement('iframe');
		divIFrame.id = 'text'+fileCount;
		divIFrame.className = 'open';
		divIFrame.src = cfg['docEditor']+'?action=open&editor=rich&file='+fullName;
		var fileName = this.formatFileName(fullName);
//		var divData = document.createTextNode(text);
//		divText.appendChild(divData);
		$('text').appendChild(divIFrame);

/*		var divText = document.createElement('textarea');
		divText.id = 'text'+fileCount;
		divText.className = 'open';
		var fileName = this.formatFileName(fullName);
		var divData = document.createTextNode(text);
		divText.appendChild(divData);
		$('text').appendChild(divText); */
		this.updateTabs();
		this.focus(fileCount);
		fileCount++
	}
	
	this.getExtension = function(fullName) {
		// pegar a extensao do arquivo.
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
		var out = '<table cellpadding=0 cellspacing=0 border=0><tr id="tab-list">';
		for(var i=0;i<openFiles.length;i++) {
			if(openFiles[i]) {
				out += '<td id="tab'+i+'"><a href="javascript:void(0)" onclick="Editor.focus('+i+')">'+this.formatFileName(openFiles[i])+'</a>';
				out += ' <a href="javascript:void(0)" onclick="Editor.close('+i+')" class="close">X</a></td>';
			}
		}
		out += '</tr></table>';
		$('tabs').innerHTML = out;
	}
	
	this.focus = function(id) {
		this.blur(currentFile);
		currentFile = id;
		$('tab'+currentFile,'backgroundColor','silver');
		$('text'+currentFile,'display','block');
	}
	
	this.formatFileName = function(fullName) {
		return fullName.substring(fullName.lastIndexOf('/')+1,fullName.length);
	}
	
	this.blur = function(id) {
		if(openFiles[id]) {
			$('text'+id,'display','none');
			$('tab'+id,'backgroundColor','#ddd');
			}
	}
	
	this.save = function() {

		IFrameObj = $('text'+currentFile)

		if (IFrameObj.contentDocument) // For NS6
		    IFrameDoc = IFrameObj.contentDocument; 
		else if (IFrameObj.contentWindow) // For IE5.5 and IE6
		    IFrameDoc = IFrameObj.contentWindow.document;
		else if (IFrameObj.document) // For IE5
		    IFrameDoc = IFrameObj.document;
		else  return true;

		textDoc = IFrameDoc.body.innerHTML;
		textDoc = textDoc.replace(/<br>/gi,'\r\n');
		textDoc = textDoc.replace(/<\/p>/gi,'\r');		
		textDoc = textDoc.replace(/<p>/gi,'\n');
		textDoc = textDoc.replace(/&nbsp;/gi,'');		
		textDoc = textDoc.replace(/<.*?>/g,'');
		textDoc = textDoc.replace(/&lt;/g,'<');
		textDoc = textDoc.replace(/&gt;/g,'>');

		AJAX.get(cfg['docEditor'], { 
			parameters:'action=save&file='+openFiles[currentFile]+'&content='+textDoc,
			method:'post',
//			onStart:'Content.showMessage("editor","fileOpening","'+fullName+'")',
			onEnd:'Content.showMessage("editor","fileSaveOK","'+openFiles[currentFile]+'")', //Content.clearMessage()
			onError:'Content.showMessage("editor","fileNotFoundError",cfg["docEditor"])' 
			})
	
	}
}


