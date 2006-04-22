
Fileman = function() {
	var div = document.getElementById('fileman');
	var divMenu = document.getElementById('fileman-menu');
	var obj = Object;
	var out = '';
	this.aux = '';
	
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
			alert('editar o arquivo: '+this.getFileInfo(obj,'full')) // ação sobre arquivos
		}
	}
	
	this.getFileInfo = function(obj,info) {
		if(info=='name') {
			return obj.innerHTML;
		}
		else if(info=='path'||info=='full') {
			var path = '';
			var tmp = obj;
			while (tmp.parentNode.previousSibling.className!='projects') {
				path = tmp.parentNode.previousSibling.innerHTML+'/' + path;
				tmp = tmp.parentNode.previousSibling;
			}
			
			return (info=='full') ? path+obj.innerHTML : path ;
		}
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
		content.display('fileman-menu','invert')
		timeoutId = 0;
		divMenu.style.top = posY-5 +'px';
		divMenu.style.left = posX-5 +'px';
	}
	
	this.download = function() {
		content.display('fileman-menu','none');
		f.aux = this.getFileInfo(obj,'name');
		content.showInfo("fileman","downloadItem",f.aux);
		ajax.get('servlet/fileman-ok.xml',{ onEnd:'content.showInfo("fileman","downloadOK",f.aux);', onError:'content.error("fileman","downloadError",f.aux)' })	
	}
	
	this.menu = function(o,e) {
		divMenu.innerHTML = content.getMenuItems(o.className);
		obj = o;
		this.setMenuPosition(e);
		divMenu.onmouseout = function() { 
			timeoutId = setTimeout("content.display('fileman-menu','none')",100) 
		}
		divMenu.onmouseover = function() { 
			clearTimeout(timeoutId); 
		}
	}
	
	this.mail = function() {
		var param = [ {},{} ];
		param[0]['name'] = 'sendItem';
		param[0]['value'] = this.getFileInfo(obj,'name');
		param[1]['name'] = 'sendTo';
		param[1]['value'] = '<form><input type="text" name="to" id="toHaveFocus"></form>';
		this.aux = param[0]['value'];
		content.showConfirmation('fileman','sendItem',param);
		document.getElementById('cancel').onclick = content.hideConfirmation;
		document.getElementById('ok').onclick = function() { 
			ajax.get('servlet/fileman-ok.xml',{ onEnd:'content.hideConfirmation();content.showInfo("fileman","sendOK",f.aux);f.update()', onError:'content.hideConfirmation();content.error("fileman","sendError",f.aux)' })
		}
	}
	
	this.rename = function() {
		var param = [ {},{} ];
		param[0]['name'] = 'renameFrom';
		param[0]['value'] = this.getFileInfo(obj,'name');
		param[1]['name'] = 'renameTo';
		param[1]['value'] = '<form><input type="text" name="to" id="toHaveFocus"></form>';
		this.aux = param[0]['value'];
		content.showConfirmation('fileman','renameItem',param);
		document.getElementById('cancel').onclick = content.hideConfirmation;
		document.getElementById('ok').onclick = function() { 
		// from : full ; to : this.getPath(obj) + getElementById('toHaveFocus').value
		// passar os parametros pra servlet aqui
		// alert('rename: '+ this.getPath(obj))
		// passar method para post aqui
			ajax.get('servlet/fileman-ok.xml',{ onEnd:'content.hideConfirmation();content.showInfo("fileman","renameOK",f.aux);f.update()', onError:'content.hideConfirmation();content.error("fileman","renameError",f.aux)' })
		}

	}
	
	this.move = function() {
		var param = [ {},{} ];
		param[0]['name'] = 'moveFrom';
		param[0]['value'] = this.getFileInfo(obj,'name');
		param[1]['name'] = 'moveTo';
		param[1]['value'] = '<form><select><option>Colocar aqui lista de diretorios</option></select></form>';
		this.aux = param[0]['value'];
		content.showConfirmation('fileman','moveItem',param);
		document.getElementById('cancel').onclick = content.hideConfirmation;
		document.getElementById('ok').onclick = function() { 
			ajax.get('servlet/fileman-ok.xml',{ onEnd:'content.hideConfirmation();content.showInfo("fileman","moveOK",f.aux);f.update()', onError:'content.hideConfirmation();content.error("fileman","moveError",f.aux)' })
		}
	}

	this.remove = function() {
		var param = [ {} ];
		param[0]['name'] = 'removeItem';
		param[0]['value'] = this.getFileInfo(obj,'name');
		this.aux = param[0]['value'];
		content.showConfirmation('fileman','removeItem',param);
		document.getElementById('cancel').onclick = content.hideConfirmation;
		document.getElementById('ok').onclick = function() { 
			ajax.get('servlet/fileman-ok.xml',{ onEnd:'content.hideConfirmation();content.showInfo("fileman","removeOK",f.aux);f.update()', onError:'content.hideConfirmation();content.error("fileman","removeError",f.aux)' })
		}
		
	}
	
	
}