
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
			$(tools[i]).style.display = 'none';			
		}

		if(arguments[0]) {
			for(i=0;i<arguments[0].length;i++) {
				if(arguments[0][i]!='') {
					$(arguments[0][i]).style.display = 'inline';				
				}
			}
		}
	}

	this.open = function(fullName) {

		for(var i=0;i<files.length;i++) { // do not open already open files
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
		files[fileCount].changed = 0;
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
	
	this.close = function(id) {
		/* TODO: alert if text changed
		if(files[id].changed != 0 && files[id].changed != this.getText(id).length) {
			alert(files[id].changed +"!="+ this.getText(id).length);
			if ( confirm('Close file without saving?') == false ) return
			}*/

  		$('text').removeChild($('text'+id));
		$('tab-list').removeChild($('tab'+id));
		files[id].open = false;
		var tmp = id;
		
		while (!files[tmp].open && tmp < files.length-1) { // find next tab
			tmp++;
		}

		if(!files[tmp].open) { // didnt find next tab, look to previous tabs
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
		this.updateTools(files[id].actions);	
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
	
	this.getText = function(id) {
		IFrameObj = $('text'+id)

		if (IFrameObj.contentDocument) // For FF, NS6
		    IFrameDoc = IFrameObj.contentDocument; 
		else if (IFrameObj.contentWindow) // For IE5.5 and IE6
		    IFrameDoc = IFrameObj.contentWindow.document;
		else if (IFrameObj.document) // For IE5
		    IFrameDoc = IFrameObj.document;
		else  return true;
		
		return IFrameDoc.body.innerHTML;
	}
	
	this.compile = function() {
		if(files[currentFile].name.indexOf('.cpp')!=-1) { // remove this soon
			$('command').value = 'cpp "'+ files[currentFile].name+'" -o "'+ files[currentFile].name.replace(/\..*$/,'')+'"';
		}
		else if(files[currentFile].name.indexOf('.java')!=-1) {
			$('command').value = 'javac "'+files[currentFile].name+'"';
		}
		else {
			$('command').value = "";
		}
		Console.execute();
	}

	this.execute = function() {
		directory = files[currentFile].name.replace(/\/.*/,'');
		if(files[currentFile].name.indexOf('.pl')!=-1) { // remove this soon
			$('command').value = 'cd;perl "'+directory+'/'+ this.formatFileName(files[currentFile].name)+'";cd -';
		}
		else if(files[currentFile].name.indexOf('.py')!=-1) { // remove this soon
			$('command').value = 'cd;python "'+directory+'/'+ this.formatFileName(files[currentFile].name)+'";cd -';
		}
		else if(files[currentFile].name.indexOf('.rb')!=-1) { // remove this soon
			$('command').value = 'cd;ruby "'+directory+'/'+ this.formatFileName(files[currentFile].name)+'";cd -';
		}
		else if(files[currentFile].name.indexOf('.cpp')!=-1) { // remove this soon
			$('command').value = 'cd;"'+directory+'/'+ this.formatFileName(files[currentFile].name).replace(/\..*$/,'')+'";cd -';
		}
		else if(files[currentFile].name.indexOf('.java')!=-1){
			$('command').value = 'cd;java -classpath "'+directory+'" '+ this.formatFileName(files[currentFile].name).replace(/\..*$/,'')+';cd -';
		}
		else {
			$('command').value = '';
		}
		Console.execute();
	}

	this.view = function() {
		open(cfg['path']+'/users/'+cfg['user']+'/'+files[currentFile].name);
	}
	
	this.save = function() {
		text = this.getText(currentFile);
		text = text.replace(/<br>/gi,'\n');
		text = text.replace(/<\/p>/gi,'\r');		
		text = text.replace(/<p>/gi,'\n');
		text = text.replace(/&shy;/g,'');		
		text = text.replace(/&nbsp;/gi,'');		
		text = text.replace(/<.*?>/g,'');
		text = text.replace(/&lt;/g,'<');
		text = text.replace(/&gt;/g,'>');
		//text = text.replace(/\n+/,'');

		AJAX.get(cfg['docEditor'], { 
			parameters:'action=save&file='+files[currentFile].name+'&content='+text,
			method:'post',
//			onStart:'Content.showMessage("editor","fileOpening","'+fullName+'")',
			onEnd:'Content.showMessage("editor","fileSaveOK","'+files[currentFile].name+'")', //Content.clearMessage()
			onError:'Content.showMessage("editor","fileNotFoundError",cfg["docEditor"])' 
			})
	
	}
}


