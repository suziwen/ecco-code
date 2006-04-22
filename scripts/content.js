
Content = function() {

	var timeoutId = 0;
	var messages = {
		'fileman' : Object,
		'console' : Object
	}
	
	// get all static xml content for menus and error messages
	this.initialize = function() {
		// talvez juntar todas as mensagens dentro do ecco.xml ao inves de colocar separado
		ajax.get(cfg['docFilemanContent'],
				{ async:false, 
				  onEnd:'content.set("fileman", xmlDoc);', 
  			      onError:'alert(cfg["msgFilemanError"])' })
				
		ajax.get(cfg['docConsoleContent'],
				{ async:false, 
				  onEnd:'content.set("console", xmlDoc);', 
				  onError:'alert(cfg["msgConsoleError"])' })

		ajax.get(cfg['docEditorContent'],
				{ async:false, 
				  onEnd:'content.set("editor", xmlDoc);', 
				  onError:'alert(cfg["msgEditorError"])' })
				  
		ajax.get(cfg['docEccoContent'],
				{ async:false, 
				  onEnd:'content.set("ecco", xmlDoc);', 
				  onError:'alert(cfg["msgEccoError"])' })		
	}
		

	this.set = function(mod, xmlDoc) {
		messages[mod] = xmlDoc;
		ecco.set(mod);
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

	
	this.error = function(mod, id) {
		var out = this.getMessage(mod, id);
		if(arguments[2]) out = out.replace('\['+id+'\]',arguments[2]);
		document.getElementById('messages').style.backgroundColor = '#ffa8a8';		
		document.getElementById('messages').innerHTML = out;
		clearTimeout(timeoutId);
		timeoutId = setTimeout('content.clearMessages()',5000);
	}
	
	this.showInfo = function(mod, id) {
		var out = this.getMessage(mod, id);
		if(arguments[2]) out = out.replace('\['+id+'\]',arguments[2]);
		document.getElementById('messages').style.backgroundColor = 'gold';
		document.getElementById('messages').innerHTML = out;
		clearTimeout(timeoutId);
		timeoutId = setTimeout('content.clearMessages()',5000);		
	}

	this.clearMessages = function() {
		document.getElementById('messages').innerHTML = '';
		document.getElementById('messages').style.backgroundColor = 'white';
	}
	
	this.showConfirmation = function(mod, id, param) {
		var out = '<h6>'+this.getMessage(mod, id)+'</h6>';
		for(var i=0;i<param.length;i++) {
			out = out.replace('\['+param[i]['name']+'\]',param[i]['value'])
		}
		out+='<button id="cancel">'+this.getMessage(mod, 'cancelButton')+'</button>';
		out+='<button id="ok">'+this.getMessage(mod, 'okButton')+'</button>';
		document.getElementById('confirmation').innerHTML = out;
		document.getElementById('confirmation').style.left = document.body.clientWidth/2 - 200;
		document.getElementById('confirmation').style.top = document.body.clientHeight/2 - 200;
		document.getElementById('focusout').style.display='block';
		content.display('confirmation','block');
		if(document.getElementById('toHaveFocus')) document.getElementById('toHaveFocus').focus();
		
	}

	this.hideConfirmation = function() {	
		content.display('focusout','none');
		content.display('confirmation','none');			
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
	
	this.display = function(id) {
		if(arguments[1] == 'invert')
			document.getElementById(id).style.display = (document.getElementById(id).style.display!='block') ? 'block' : 'none';
		else 
			document.getElementById(id).style.display = arguments[1];
	}
	
}

