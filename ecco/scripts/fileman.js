
Fileman = function() {
	var div = document.getElementById('fileman');
	var divMenu = document.getElementById('fileman-menu');
	var obj = Object;
	var out = '';
	
	this.update = function() {
		ajax.get(cfg['docFileman'],{ onEnd:'f.parse(xmlDoc.documentElement);f.write();', onError:'content.error("fileman","fileNotFound",cfg["docFileman"])' })
	}
	

	this.write = function() {
		div.innerHTML = out;	
		out = '';
	}
	
	this.parse = function(tree) {
		if(tree.nodeType!=1) { /* Workaround for firefox CR/NL. Remove this chars between XML tags */ }
		else if(tree.hasChildNodes()) {
			if(tree.tagName=='project')
				project = tree.getAttribute('name');
			if(tree.tagName=='projects')
				project = '';
			out += '<a oncontextmenu="f.menu(this,event);return false;" onclick="f.action(this)" class="'+tree.tagName+'">'+tree.getAttribute('name')+'</a>';
			out += '<div '+this.collapse(project,tree.getAttribute('name'))+'>';
			var nodes = tree.childNodes.length;
			for(var i=0; i<nodes; i++) 
				this.parse(tree.childNodes[i]);
			out += '</div>';
		}
		else {
			out+='<a oncontextmenu="f.menu(this,event);return false;" onclick="f.action(this)" class="'+tree.tagName+'">'+tree.getAttribute('name')+'</a>';
		}
	}
	
	this.collapse = function(project, branchName) {
		if(project == '') 
			return 'class="opened" id="projects"'; // all projects always open
		else if(document.getElementById(project+'-'+branchName)) {
			obj = document.getElementById(project+'-'+branchName);
			return 'class="'+obj.className+'" id="'+obj.id+'"';
		}
		else {
			return 'class="closed" id="'+project+'-'+branchName+'"';
		}
	}
	
	this.action = function(obj) {
		if(obj.className=='projects') 
			alert('ação sobre todos os projetos');
		else if(obj.className=='project') // ação sobre projeto especifico
			obj.nextSibling.className = (obj.nextSibling.className!='closed') ? 'closed' : 'opened';
		else if(obj.className=='directory') // ação sobre diretório especifico
			obj.nextSibling.className = (obj.nextSibling.className!='closed') ? 'closed' : 'opened';
		else {
			alert('editar o arquivo: '+this.getPath(obj)) // ação sobre arquivos
		}
	}
	
	this.getPath = function(obj) {
		var path = '';
		var tmp = obj;
		while (tmp.parentNode.previousSibling.className!='projects') {
			path = tmp.parentNode.previousSibling.innerHTML+'/' + path;
			tmp = tmp.parentNode.previousSibling;
		}
		return path+obj.innerHTML;
	}
	
	this.setMenuPosition = function(e) {
		var posX;
		var posY;
		if (typeof(event)!='undefined') {
			posX = event.clientX + document.body.scrollLeft;
			posY = event.clientY + document.body.scrollTop;
		} 
		else {
		    posX = e.pageX;
		    posY = e.pageY;
		}
		content.invert('fileman-menu')
		timeoutId = 0;
		divMenu.style.top = posY-5 +'px';
		divMenu.style.left = posX-5 +'px';
	}
	
	this.menu = function(o,e) {
		divMenu.innerHTML = content.getMenuItems(o.className);
		obj = o;
		this.setMenuPosition(e);
		divMenu.onmouseout = function() { 
			timeoutId = setTimeout("content.invert('fileman-menu','none')",100) 
		}
		divMenu.onmouseover = function() { 
			clearTimeout(timeoutId); 
		}
	}
	
	this.mail = function() {
		alert('enviando por e-mail: '+ this.getPath(obj));
	}
	
	this.rename = function() {
		content.invert('fileman-menu','none');
		var param = [ {},{} ];
		param[0]['name'] = 'renameFrom';
		param[0]['value'] = this.getPath(obj);
		param[0]['value'] = param[0]['value'].substring(param[0]['value'].lastIndexOf('/')+1||0,param[0]['value'].length);
		param[1]['name'] = 'renameTo';
		param[1]['value'] = '<form><input type="hidden" name="from" value="'+this.getPath(obj)+'"><input type="text" name="to" id="toHaveFocus"></form>';
		content.confirmation('fileman','renameItem',param);
//		alert('rename: '+ this.getPath(obj))
	}

	this.move = function() {
		alert('movendo: '+ this.getPath(obj))
	}

	this.remove = function() {
		alert('removendo: '+ this.getPath(obj))
	}
	
	
}