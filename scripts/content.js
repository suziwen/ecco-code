
Content = function() {

	var messages = {
		'fileman' : Object,
		'console' : Object
	}
	
	// get all static xml content for menus and error messages
	this.initialize = function() {
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
		
	// set messages retrieved from initialize() to local vars
	this.set = function(mod, xmlDoc) {
		messages[mod] = xmlDoc;
		ecco.set(mod);
	}
	// display error messages 
	this.error = function(mod, id) {
		var obj;
		var out;
		obj = messages[mod];
		obj = obj.documentElement.getElementsByTagName('messages')[0];
		obj = obj.getElementsByTagName('msg');

		for(var i=0; i<obj.length; i++) {
			if(obj[i].getAttribute('id')==id) {
				out = obj[i].firstChild.nodeValue;
			}
		}

		if(arguments[2]) out = out.replace('\['+id+'\]',arguments[2]);
		document.getElementById('messages').innerHTML = out;
	}
	
	this.invert = function(id) {
		document.getElementById(id).style.display = (document.getElementById(id).style.display!='block') ? 'block' : 'none';
	}
	
}

