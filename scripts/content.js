
Content = function() {

	Content = this;
	var divConfirmation = Object;
	var divMessages = Object;
	var timeoutId = Number;
	var messages = Array;
	
	// get all static xml content for menus and error messages
	this.initialize = function() {
		divConfirmation = $('confirmation');
		divMessages = $('messages');
		timeoutId = 0;
		messages = {
			'fileman' : Object,
			'console' : Object,
			'editor'  : Object
		}

	
		// talvez juntar todas as mensagens dentro do ecco.xml ao inves de colocar separado
		AJAX.get(cfg['docFilemanContent'], { 
				async:false, 
				onEnd:'Content.set("fileman", xmlDoc);', 
  			    onError:'alert(cfg["msgFilemanError"])' 
				})
				
		AJAX.get(cfg['docConsoleContent'], { 
				async:false, 
				onEnd:'Content.set("console", xmlDoc);', 
				onError:'alert(cfg["msgConsoleError"])' 
				})

		AJAX.get(cfg['docEditorContent'], { 
				async:false, 
				onEnd:'Content.set("editor", xmlDoc);', 
				onError:'alert(cfg["msgEditorError"])' 
				})
				  
		AJAX.get(cfg['docEccoContent'], { 
				async:false, 
				onEnd:'Content.set("ecco", xmlDoc);', 
				onError:'alert(cfg["msgEccoError"])' 
				})
	}
		

	this.set = function(mod, xmlDoc) {
		messages[mod] = xmlDoc;
		ECCO.set(mod);
	}

	this.getMessage = function(mod, id) {
		var out = '';
		var obj = messages[mod];
		obj = obj.documentElement.getElementsByTagName('messages')[0];
		obj = obj.getElementsByTagName('msg');

		for(var i=0; i<obj.length; i++) {
			if(obj[i].getAttribute('id')==id) {
				out = obj[i].firstChild.nodeValue;
			}
		}
		return out;
	}

	
	this.showMessage = function(mod, id) {
		var out = this.getMessage(mod, id);
		this.hideConfirmation()
		if(arguments[2]) out = out.replace('\['+id+'\]',arguments[2]);
		divMessages.style.backgroundColor = (id.indexOf('Error')!=-1) ? '#ffa8a8' : 'gold';
		divMessages.style.border = '1px solid silver';
		divMessages.innerHTML = out;
		clearTimeout(timeoutId);
		timeoutId = setTimeout('Content.clearMessage()',10000);
	}
	
	this.clearMessage = function() {
		divMessages.innerHTML = '';
		divMessages.style.backgroundColor = 'transparent';
		divMessages.style.border = '0';
	}
	
	this.showConfirmation = function(mod, id, param) {
		var out = '<h6>'+this.getMessage(mod, id)+'</h6>';
		for(var i=0;i<param.length;i++) {
			out = out.replace('\['+param[i]['name']+'\]',param[i]['value'])
		}
		out+='<button id="cancel">'+this.getMessage(mod, 'cancelButton')+'</button>';
		out+='<button id="ok">'+this.getMessage(mod, 'okButton')+'</button>';
		divConfirmation.innerHTML = out;
		divConfirmation.style.left = document.body.clientWidth/2 - 200;
		divConfirmation.style.top = document.body.clientHeight/2 - 200;
		$('focusout').style.display='block';
		$('confirmation','display','block');
		if($('action-input')) $('action-input').focus();
		
	}

	this.hideConfirmation = function() {	
		$('focusout','display','none');
		$('confirmation','display','none');			
	}

	this.getFileInfo = function(extension) {
		var obj = messages['editor'];
		obj = obj.documentElement.getElementsByTagName('files')[0];
		obj = obj.getElementsByTagName('item');
		
		for(var i=0; i<obj.length; i++) {
			if(obj[i].getAttribute('extensions').indexOf(extension+'|')!=-1) {
				return [ obj[i].getAttribute('type'), obj[i].getAttribute('actions').split('|') ];
			}
		}
		return [ 'text', ['save'] ];
	}
	
	this.showTools = function() {
		var out = '';
		var obj = messages['editor'];
		var tools = [];
		obj = obj.documentElement.getElementsByTagName('tools')[0];
		obj = obj.getElementsByTagName('item');
		for(var i=0; i<obj.length; i++) {
			id = obj[i].getAttribute('id');
			value = obj[i].firstChild.nodeValue;
			tools[i] = id;
			out += '<button id="'+id+'" onclick="Editor.'+id+'()"><img src="images/'+id+'.gif" align="top" /> '+value+'</button>';
		}
		$('tools').innerHTML = out;
		return tools;
		
	}
	
	this.getMenuItems = function(type) {
		var out = '';
		var obj = messages['fileman'];
		obj = obj.documentElement.getElementsByTagName('menu')[0];
		obj = obj.getElementsByTagName(type)[0];		
		obj = obj.getElementsByTagName('item');
		for(var i=0; i<obj.length; i++) {
			out += '<a href="javascript:void(0)" onclick="'+obj[i].getAttribute('action')+'" onmouseover="clearTimeout(timeoutId)">'+obj[i].firstChild.nodeValue+'</a>';
		}
		return out;
		
	}
	
}

