
Fileman = function() {

	Fileman = this;
	var divMain = Object;
	var divMenu = Object;
	var obj = Object;
	var out = String;
	this.aux = String;
	
	this.initialize = function() {
		divMain = $('fileman');
		divMenu = $('fileman-menu');
		obj = null;
		out = '';
		this.aux = '';
		this.update();
	}
	
	this.update = function() {
		AJAX.get(cfg['docFileman'], { 
			onEnd:'Fileman.parse(xmlDoc.documentElement);Fileman.write();', 
			onError:'Content.showMessage("fileman","fileNotFoundError",cfg["docFileman"])' 
			})
	}
	
	this.write = function() {
		divMain.innerHTML = out;	
		out = '';
	}
	
	this.parse = function(tree) {
		if(tree.nodeType!=1) { /* Workaround for firefox CR/NL. Remove this chars between XML tags */ }
		else if(tree.hasChildNodes()) {
			if(tree.tagName=='project')
				project = tree.getAttribute('name');
			if(tree.tagName=='projects')
				project = '';
			out += '<a oncontextmenu="Fileman.menu(this,event);return false;" onclick="Fileman.action(this)" class="'+tree.tagName+'">'+tree.getAttribute('name')+'</a>';
			out += '<div '+this.collapse(project,tree.getAttribute('name'))+'>';
			var nodes = tree.childNodes.length;
			for(var i=0; i<nodes; i++) 
				this.parse(tree.childNodes[i]);
			out += '</div>';
		}
		else {
			out+='<a oncontextmenu="Fileman.menu(this,event);return false;" onclick="Fileman.action(this)" class="'+tree.tagName+'">'+tree.getAttribute('name')+'</a>';
		}
	}
	
	this.collapse = function(project, branchName) {
		if(project == '') 
			return 'class="opened" id="projects"'; // "all projects" always open
		else if($(project+'-'+branchName)) {
			obj = $(project+'-'+branchName);
			return 'class="'+obj.className+'" id="'+obj.id+'"';
		}
		else {
			return 'class="closed" id="'+project+'-'+branchName+'"';
		}
	}
	
	this.action = function(obj) {
		if(obj.className=='projects') 
			alert('a��o sobre todos os projetos');
		else if(obj.className=='project') // a��o sobre projeto especifico
			obj.nextSibling.className = (obj.nextSibling.className!='closed') ? 'closed' : 'opened';
		else if(obj.className=='directory') // a��o sobre diret�rio especifico
			obj.nextSibling.className = (obj.nextSibling.className!='closed') ? 'closed' : 'opened';
		else {
			alert('editar o arquivo: '+this.getFileInfo(obj,'full')) // a��o sobre arquivos
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
		$('fileman-menu','display','block')
		timeoutId = 0;
		divMenu.style.top = posY-5 +'px';
		divMenu.style.left = posX-5 +'px';
	}

	this.menu = function(o,e) {
		divMenu.innerHTML = Content.getMenuItems(o.className);
		obj = o;
		this.setMenuPosition(e);
		divMenu.onmouseout = function() { 
			timeoutId = setTimeout("$('fileman-menu','display','none')",100) 
		}
		divMenu.onmouseover = function() { 
			clearTimeout(timeoutId); 
		}
	}
	
	this.menuAction = function(obj,update,mod,idok,iderror,params) {
		var info = obj.documentElement.firstChild.nodeValue;
		if(info == 'ok') {
			Content.showMessage(mod,idok,params);
			if(update) {
				Fileman.update();
				}
		}
		else { // info = 'error'
			Content.showMessage(mod,iderror,params);
		}
	}
	
	this.download = function() {
		$('fileman-menu','display','none');
		this.aux = this.getFileInfo(obj,'name');
		Content.showMessage("fileman","downloadItem",this.aux);
		var action = 'download';
		var item = Fileman.getFileInfo(obj,'full');			
		alert('action='+action+'&item='+item);
		/*
		AJAX.get('servlet/fileman-ok.xml',{ 
				parameters:'action='+action+'&item='+item,
				onEnd:'Content.showMessage("fileman","downloadOK",Fileman.aux);', 
				onError:'Content.showMessage("fileman","downloadError",Fileman.aux)' 
				})*/
	}

	this.mail = function() {
		var param = [ {},{} ];
		param[0]['name'] = 'sendItem';
		param[0]['value'] = this.getFileInfo(obj,'name');
		param[1]['name'] = 'sendTo';
		param[1]['value'] = '<br /><input type="text" name="to" id="action-input">';
		this.aux = param[0]['value'];
		Content.showConfirmation('fileman','sendItem',param);
		$('cancel').onclick = Content.hideConfirmation;
		$('ok').onclick = function() { 
			var action = 'mail';
			var to = $('action-input').value;
			alert('action='+action+'&to='+to);
			AJAX.get('servlet/fileman-ok.xml',{ 
					parameters:'action='+action+'&to='+to,
					onEnd:'Fileman.menuAction(xmlDoc,false,"fileman","sendOK","sendError",Fileman.aux);', 					
					onError:'Content.showMessage("fileman","sendError",Fileman.aux)' 
					})
		}
	}
	
	this.rename = function() {
		var param = [ {},{} ];
		param[0]['name'] = 'renameFrom';
		param[0]['value'] = this.getFileInfo(obj,'name');
		param[1]['name'] = 'renameTo';
		param[1]['value'] = '<br /><input type="text" name="to" id="action-input">';
		this.aux = param[0]['value'];
		Content.showConfirmation('fileman','renameItem',param);
		$('cancel').onclick = Content.hideConfirmation;
		$('ok').onclick = function() { 
			var action = 'rename';
			var from = Fileman.getFileInfo(obj,'full');
			var to = Fileman.getFileInfo(obj,'path') + $('action-input').value;
//			alert('action='+action+'&from='+from+'&to='+to)
			AJAX.get('servlet/fileman-ok.xml',{ 
					parameters:'action='+action+'&from='+from+'&to='+to,
					onEnd:'Fileman.menuAction(xmlDoc,true,"fileman","renameOK","renameError",Fileman.aux);', 
					onError:'Content.showMessage("fileman","renameError",Fileman.aux)'
					})
		}

	}
	
	this.getDirectoryList = function(obj) {
		var out = '';
		var fullPath = '';
		var allItems = divMain.getElementsByTagName('a');
		var thisFile = this.getFileInfo(obj,'full');
		// re = new RegExp("^"+a) 
		//if(b.match(re)) alert(1);
		for(var i=1;i<allItems.length;i++)	{
			if (allItems[i].className == 'directory' || allItems[i].className == 'project') {
				fullPath = this.getFileInfo(allItems[i],'full')
				if(fullPath != thisFile) { // colocar aqui regular expression para evitar move impossivel tipo um diretorio pra dentro de um diretorio dentro do primeiro diretorio e tb mover para o local atual
					out += '<option value="'+fullPath+'">/'+fullPath+'/</option>';
				}
			}
		}
		return out;
	}	
	
	
	this.move = function() {
		var param = [ {},{} ];
		param[0]['name'] = 'moveFrom';
		param[0]['value'] = this.getFileInfo(obj,'full');
		param[1]['name'] = 'moveTo';
		param[1]['value'] = '<br /><select id="action-input">'+this.getDirectoryList(obj)+'</select>';
		this.aux = param[0]['value'];
		Content.showConfirmation('fileman','moveItem',param);
		$('cancel').onclick = Content.hideConfirmation;
		$('ok').onclick = function() { 
			var action = 'move';
			var from = Fileman.getFileInfo(obj,'full');
			var to = $('action-input')[$('action-input').selectedIndex].value;
			AJAX.get('servlet/fileman-ok.xml',{ 
					parameters:'action='+action+'&from='+from+'&to='+to,
					onEnd:'Fileman.menuAction(xmlDoc,true,"fileman","moveOK","moveError",Fileman.aux);', 					
					onError:'Content.showMessage("fileman","moveError",Fileman.aux)' 
					})
		}
	}

	this.newProject = function() {
	}

	this.newDirectory = function() {
	}

	this.newFile = function() {
	}

	this.remove = function() {
		var param = [ {} ];
		param[0]['name'] = 'removeItem';
		param[0]['value'] = this.getFileInfo(obj,'name');
		this.aux = param[0]['value'];
		Content.showConfirmation('fileman','removeItem',param);
		$('cancel').onclick = Content.hideConfirmation;
		$('ok').onclick = function() {
			var action = 'remove';		
			var item = Fileman.getFileInfo(obj,'full');
			AJAX.get('servlet/fileman-ok.xml',{ 
					parameters:'action='+action+'&item='+item,			
					onEnd:'Fileman.menuAction(xmlDoc,true,"fileman","removeOK","removeError",Fileman.aux);', 										
					onError:'Content.showMessage("fileman","removeError",Fileman.aux)' 
					})
		}
	}
}