
Fileman = function() {

	var divMain = Object;
	var divMenu = Object;
	var obj = Object;
	var out = String;
	Fileman.aux = String;
	
	Fileman.initialize = function() {
		divMain = document.getElementById('fileman');
		divMenu = document.getElementById('fileman-menu');
		obj = null;
		out = '';
		Fileman.aux = '';
		this.update();
	}
	
	Fileman.update = function() {
		AJAX.get(cfg['docFileman'],{ onEnd:'Fileman.parse(xmlDoc.documentElement);Fileman.write();', onError:'Content.showMessage("fileman","fileNotFoundError",cfg["docFileman"])' })
	}
	

	Fileman.write = function() {
		divMain.innerHTML = out;	
		out = '';
	}
	
	Fileman.parse = function(tree) {
		if(tree.nodeType!=1) { /* Workaround for firefox CR/NL. Remove this chars between XML tags */ }
		else if(tree.hasChildNodes()) {
			if(tree.tagName=='project')
				project = tree.getAttribute('name');
			if(tree.tagName=='projects')
				project = '';
			out += '<a oncontextmenu="Fileman.menu(this,event);return false;" onclick="Fileman.action(this)" class="'+tree.tagName+'">'+tree.getAttribute('name')+'</a>';
			out += '<div '+Fileman.collapse(project,tree.getAttribute('name'))+'>';
			var nodes = tree.childNodes.length;
			for(var i=0; i<nodes; i++) 
				this.parse(tree.childNodes[i]);
			out += '</div>';
		}
		else {
			out+='<a oncontextmenu="Fileman.menu(this,event);return false;" onclick="Fileman.action(this)" class="'+tree.tagName+'">'+tree.getAttribute('name')+'</a>';
		}
	}
	
	Fileman.collapse = function(project, branchName) {
		if(project == '') 
			return 'class="opened" id="projects"'; // "all projects" always open
		else if(document.getElementById(project+'-'+branchName)) {
			obj = document.getElementById(project+'-'+branchName);
			return 'class="'+obj.className+'" id="'+obj.id+'"';
		}
		else {
			return 'class="closed" id="'+project+'-'+branchName+'"';
		}
	}
	
	Fileman.action = function(obj) {
		if(obj.className=='projects') 
			alert('ação sobre todos os projetos');
		else if(obj.className=='project') // ação sobre projeto especifico
			obj.nextSibling.className = (obj.nextSibling.className!='closed') ? 'closed' : 'opened';
		else if(obj.className=='directory') // ação sobre diretório especifico
			obj.nextSibling.className = (obj.nextSibling.className!='closed') ? 'closed' : 'opened';
		else {
			alert('editar o arquivo: '+Fileman.getFileInfo(obj,'full')) // ação sobre arquivos
		}
	}
	
	Fileman.getFileInfo = function(obj,info) {
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
	
	Fileman.setMenuPosition = function(e) {
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
		Content.display('fileman-menu','invert')
		timeoutId = 0;
		divMenu.style.top = posY-5 +'px';
		divMenu.style.left = posX-5 +'px';
	}

	Fileman.menu = function(o,e) {
		divMenu.innerHTML = Content.getMenuItems(o.className);
		obj = o;
		this.setMenuPosition(e);
		divMenu.onmouseout = function() { 
			timeoutId = setTimeout("Content.display('fileman-menu','none')",100) 
		}
		divMenu.onmouseover = function() { 
			clearTimeout(timeoutId); 
		}
	}
	
	Fileman.download = function() {
		Content.display('fileman-menu','none');
		this.aux = this.getFileInfo(obj,'name');
		Content.showMessage("fileman","downloadItem",Fileman.aux);
		AJAX.get('servlet/fileman-ok.xml',{ onEnd:'Content.showMessage("fileman","downloadOK",Fileman.aux);', onError:'Content.showMessage("fileman","downloadError",Fileman.aux)' })	
	}

	Fileman.mail = function() {
		var param = [ {},{} ];
		param[0]['name'] = 'sendItem';
		param[0]['value'] = this.getFileInfo(obj,'name');
		param[1]['name'] = 'sendTo';
		param[1]['value'] = '<form><input type="text" name="to" id="toHaveFocus"></form>';
		this.aux = param[0]['value'];
		Content.showConfirmation('fileman','sendItem',param);
		document.getElementById('cancel').onclick = Content.hideConfirmation;
		document.getElementById('ok').onclick = function() { 
			AJAX.get('servlet/fileman-ok.xml',{ onEnd:'Content.hideConfirmation();Content.showMessage("fileman","sendOK",Fileman.aux);Fileman.update()', onError:'Content.hideConfirmation();Content.showMessage("fileman","sendError",Fileman.aux)' })
		}
	}
	
	Fileman.rename = function() {
		var param = [ {},{} ];
		param[0]['name'] = 'renameFrom';
		param[0]['value'] = this.getFileInfo(obj,'name');
		param[1]['name'] = 'renameTo';
		param[1]['value'] = '<form><input type="text" name="to" id="toHaveFocus"></form>';
		this.aux = param[0]['value'];
		Content.showConfirmation('fileman','renameItem',param);
		document.getElementById('cancel').onclick = Content.hideConfirmation;
		document.getElementById('ok').onclick = function() { 
		// from : full ; to : this.getPath(obj) + getElementById('toHaveFocus').value
		// passar os parametros pra servlet aqui
		// alert('rename: '+ this.getPath(obj))
		// passar method para post aqui
			AJAX.get('servlet/fileman-ok.xml',{ onEnd:'Content.hideConfirmation();Content.showMessage("fileman","renameOK",Fileman.aux);Fileman.update()', onError:'Content.hideConfirmation();Content.showMessage("fileman","renameError",Fileman.aux)' })
		}

	}
	
	Fileman.move = function() {
		var param = [ {},{} ];
		param[0]['name'] = 'moveFrom';
		param[0]['value'] = this.getFileInfo(obj,'name');
		param[1]['name'] = 'moveTo';
		param[1]['value'] = '<form><select><option>Colocar aqui lista de diretorios</option></select></form>';
		this.aux = param[0]['value'];
		Content.showConfirmation('fileman','moveItem',param);
		document.getElementById('cancel').onclick = Content.hideConfirmation;
		document.getElementById('ok').onclick = function() { 
			AJAX.get('servlet/fileman-ok.xml',{ onEnd:'Content.hideConfirmation();Content.showMessage("fileman","moveOK",Fileman.aux);Fileman.update()', onError:'Content.hideConfirmation();Content.showMessage("fileman","moveError",Fileman.aux)' })
		}
	}

	Fileman.remove = function() {
		var param = [ {} ];
		param[0]['name'] = 'removeItem';
		param[0]['value'] = this.getFileInfo(obj,'name');
		this.aux = param[0]['value'];
		Content.showConfirmation('fileman','removeItem',param);
		document.getElementById('cancel').onclick = Content.hideConfirmation;
		document.getElementById('ok').onclick = function() { 
			AJAX.get('servlet/fileman-ok.xml',{ onEnd:'Content.hideConfirmation();Content.showMessage("fileman","removeOK",Fileman.aux);Fileman.update()', onError:'Content.hideConfirmation();Content.showMessage("fileman","removeError",Fileman.aux)' })
		}
		
	}
	
}