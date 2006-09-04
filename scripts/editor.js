
Editor = function() {
	
	Editor = this;
	var files = Array;
	var fileCount = Number;
	var currentFile = Number;
	var tools = Array;
	
	this.initialize = function() {
		files = [];
		fileCount = 0;
		currentFile = 0;
		tools = Content.showTools();
		this.updateTools();
	}
	
	this.updateTools = function() {
		for(i=0;i<tools.length;i++) {
			if(tools[i] != 'options') {
				$(tools[i]).disabled = true;
			}
		}

		if(arguments[0]) {
			for(i=0;i<arguments[0].length;i++) {
				if(arguments[0][i]!='') $(arguments[0][i]).disabled = false;
			}
		}
	}
	
	this.open = function(fullName) {

		for(var i=0;i<files.length;i++) { // nao abre arquivos ja abertos
			if(fullName == files[i].name && files[i].open) {
				this.focus(i);
				return;
			}
		}

		this.edit(fullName);
	}
	
	this.getFileExtension = function(fullName) {
		return fullName.substring(fullName.lastIndexOf('.')+1,fullName.length);
	}
	
	this.parse = function(obj,fullName) { // remove this. Its not being used
		var text = '';
		text = obj.firstChild.nodeValue;
		if(text == 'error') {
			Content.showMessage("editor","fileOpenError",fullName);
		}
		else {
			this.edit(text, fullName);
		}
	}
	
	this.options = function() {
		alert('TODO: editor options');
	}
	
	this.edit = function(fullName) {
		var extension = this.getFileExtension(fullName);
		var fileInfo = Content.getFileInfo(extension);

		files[fileCount] =  { name:'',type:'',changed:'',actions:'',open:'',fname:'' };
		files[fileCount].name = fullName;
		files[fileCount].type = fileInfo[0];
		files[fileCount].changed = false;
		files[fileCount].actions = fileInfo[1]; // this should come from Content.xxx() for each file different actions
		files[fileCount].open = true;
		files[fileCount].fname = this.formatFileName(fullName);
		
		this.updateTools(files[fileCount].actions);
		
		var divIFrame = document.createElement('iframe');
		divIFrame.id = 'text'+fileCount;
		divIFrame.className = 'open';
		divIFrame.src = (files[fileCount].type=='binary') ? cfg['path']+'/users/'+cfg['user']+'/'+fullName : cfg['docEditor']+'?action=open&type='+files[fileCount].type+'&file='+fullName ;
		
		$('text').appendChild(divIFrame);
		this.updateTabs();
		this.focus(fileCount);
		fileCount++
	}
	
	this.getExtension = function(fullName) {
		// pegar a extensao do arquivo.
	}
	
	this.close = function(id) {
//		if(files[id].changed != this.getText().length) {confirm('texto mudou');}

  		$('text').removeChild($('text'+id));
		$('tab-list').removeChild($('tab'+id));
		files[id].open = false;
		var tmp = id;
		
		while (!files[tmp].open && tmp < files.length-1) { // tenta encontrar a proxima aba com texto
			tmp++;
		}

		if(!files[tmp].open) { // se nao achou aba com texto, olha para as abas anteriores
			tmp = id;
			while (!files[tmp].open && tmp > 0) {
				tmp--;
			}
		}
		if(!files[currentFile].open && files[tmp].open) {
			this.focus(tmp);
		}
	}
	
	this.updateTabs = function() {
		var out = '<table cellpadding=0 cellspacing=0 border=0><tr id="tab-list">';
		for(var i=0;i<files.length;i++) {
			if(files[i].open) {
				out += '<td id="tab'+i+'"><a href="javascript:void(0)" onclick="Editor.focus('+i+')">'+files[i].fname+'</a>';
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
		if(files[id].open) {
			$('text'+id,'display','none');
			$('tab'+id,'backgroundColor','#ddd');
			}
	}
	
	this.getText = function() {
		IFrameObj = $('text'+currentFile)

		if (IFrameObj.contentDocument) // For NS6
		    IFrameDoc = IFrameObj.contentDocument; 
		else if (IFrameObj.contentWindow) // For IE5.5 and IE6
		    IFrameDoc = IFrameObj.contentWindow.document;
		else if (IFrameObj.document) // For IE5
		    IFrameDoc = IFrameObj.document;
		else  return true;
		
		return IFrameDoc.body.innerHTML;
	}
	
	this.save = function() {
		text = getText();
		text = text.replace(/<br>/gi,'\n');
		text = text.replace(/<\/p>/gi,'\r');		
		text = text.replace(/<p>/gi,'\n');
		text = text.replace(/&nbsp;/gi,'');		
		text = text.replace(/<.*?>/g,'');
		text = text.replace(/&lt;/g,'<');
		text = text.replace(/&gt;/g,'>');
//		text = text.replace(/\n+/,'');

		// files[currentFile].changed = text.length;
		
		AJAX.get(cfg['docEditor'], { 
			parameters:'action=save&file='+files[currentFile].name+'&content='+text,
			method:'post',
//			onStart:'Content.showMessage("editor","fileOpening","'+fullName+'")',
			onEnd:'Content.showMessage("editor","fileSaveOK","'+files[currentFile].name+'")', //Content.clearMessage()
			onError:'Content.showMessage("editor","fileNotFoundError",cfg["docEditor"])' 
			})
	
	}
}


