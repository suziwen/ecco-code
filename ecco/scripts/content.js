
Content = function() {

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
		var out = getMessage(mod, id);
		if(arguments[2]) out = out.replace('\['+id+'\]',arguments[2]);
		document.getElementById('messages').innerHTML = out;
	}
	
	this.confirmation = function(mod, id, param) {
		var out = this.getMessage(mod, id);
		for(var i=0;i<param.length;i++) {
			out = out.replace('\['+param[i]['name']+'\]',param[i]['value'])
		}
		out+='<button>'+this.getMessage(mod, 'cancelButton')+'</button>';
		out+='<button>'+this.getMessage(mod, 'okButton')+'</button>';
		alert(out)
		document.getElementById('confirmation').innerHTML = out;
		this.invert('confirmation','block');
		
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
	
	this.invert = function(id) {
		if(arguments[1]) document.getElementById(id).style.display = arguments[1];
		else document.getElementById(id).style.display = (document.getElementById(id).style.display!='block') ? 'block' : 'none';
	}
	
}

