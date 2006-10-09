
Fileman = function() {

	Fileman = this;
	var divMain = Object;
	var divMenu = Object;
	var obj = Object;
	var out = String;
	
	this.initialize = function() {
		divMain = $('fileman');
		divMenu = $('fileman-menu');
		obj = null;
		out = '';
		this.update();
	}
	
	this.update = function() {
		AJAX.get(cfg['docFileman'], { 
			parameters: 'action=list',
			onEnd:'Fileman.parse(xmlDoc.documentElement);Fileman.write();', 
			onError:'Content.showMessage("fileman","fileNotFoundError",cfg["docFileman"])' 
			});
	}
	
	this.write = function() {
		divMain.innerHTML = out;
		out = '';
	}
	
	this.parse = function(tree) {
		if(tree.nodeType!=1) { /* Workaround for firefox CR/NL. Remove this chars between XML tags */ }
		else if(tree.tagName!='file') {
			if(tree.tagName=='project') {
				project = tree.getAttribute('name');
			}
			if(tree.tagName=='projects') {
				project = '';
			}
			out += '<a oncontextmenu="Fileman.menu(this,event);return false;" onclick="Fileman.action(this)" class="'+tree.tagName+'">'+tree.getAttribute('name')+'</a>';
			out += '<div '+this.collapse(project,tree.getAttribute('name'))+'>';
			var nodes = tree.childNodes.length;
			for(var i=0; i<nodes; i++) {
				this.parse(tree.childNodes[i]);
			}
			out += '</div>';
		}
		else {
			out+='<a oncontextmenu="Fileman.menu(this,event);return false;" onclick="Fileman.action(this)" class="'+tree.tagName+'">'+tree.getAttribute('name')+'</a>';
		}
	}
	
	this.collapse = function(project, branchName) {
		if(project == '')  {
			return 'class="opened" id="projects"'; // "all projects" always open
		}
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
			alert('ação sobre todos os projetos');
		else if(obj.className=='project') // ação sobre projeto especifico
			obj.nextSibling.className = (obj.nextSibling.className!='closed') ? 'closed' : 'opened';
		else if(obj.className=='directory') // ação sobre diretório especifico
			obj.nextSibling.className = (obj.nextSibling.className!='closed') ? 'closed' : 'opened';
		else 
			Editor.open(this.getFileInfo(obj,'full'));
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
	
	this.menuAction = function(obj,update,action,name) {
		var info = obj.documentElement.firstChild.nodeValue;
		if(info == 'ok') {
			Content.showMessage('fileman',action+'OK',name);
			if(update) {
				Fileman.update();
				}
		}
		else { // info = 'error'
			Content.showMessage('fileman',action+'Error',name);
		}
	}
	
	this.download = function() {
		Content.showMessage("fileman","downloadItem",'xxx');
		var action = 'download';
		var item = Fileman.getFileInfo(obj,'full');	
		location.href = '/servlet/FileManager?action='+action+'&item='+item
		//alert('action='+action+'&item='+item);
	}

	this.mail = function() {
		var param = [ {},{} ];
		param[0]['name'] = 'sendItem';
		param[0]['value'] = this.getFileInfo(obj,'name');
		param[1]['name'] = 'sendTo';
		param[1]['value'] = '<br /><input id="action-input" value="eccowide@gmail.com">';
		Content.showConfirmation('fileman','sendItem',param);
		$('cancel').onclick = Content.hideConfirmation;
		$('ok').onclick = function() { 
			var action = 'email';
			var to = $('action-input').value;
			var item = Fileman.getFileInfo(obj,'full');
			param = 'action='+action+'&item='+item+'&to='+to;
			Fileman.execute(true,action,param,item);
		}
	}
	
	this.rename = function() {
		var param = [ {},{} ];
		param[0]['name'] = 'renameFrom';
		param[0]['value'] = this.getFileInfo(obj,'name');
		param[1]['name'] = 'renameTo';
		param[1]['value'] = '<br /><input id="action-input">';
		Content.showConfirmation('fileman','renameItem',param);
		$('cancel').onclick = Content.hideConfirmation;
		$('ok').onclick = function() { 
			var action = 'rename';
			var item = param[0]['value'];
			var from = Fileman.getFileInfo(obj,'full');
			var to = Fileman.getFileInfo(obj,'path') + $('action-input').value;
			param = 'action='+action+'&from='+from+'&to='+to;
			Fileman.execute(true,action,param,item);
		}

	}
	
	this.move = function() {
		var param = [ {},{} ];
		param[0]['name'] = 'moveFrom';
		param[0]['value'] = this.getFileInfo(obj,'full');
		param[1]['name'] = 'moveTo';
		param[1]['value'] = '<br /><select id="action-input">'+this.getDirectoryList(obj)+'</select>';
		Content.showConfirmation('fileman','moveItem',param);
		$('cancel').onclick = Content.hideConfirmation;
		$('ok').onclick = function() { 
			var action = 'move';
			var item = param[0]['value'];
			var from = item;
			var to = $('action-input')[$('action-input').selectedIndex].value;
			param = 'action='+action+'&from='+from+'&to='+to;
			Fileman.execute(true,action,param,item);
		}
	}

	this.newProject = function() {
		var param = [ {},{} ];
		param[0]['name'] = 'newProjectItem';
		param[0]['value'] = '<br /><input id="action-input">';
		Content.showConfirmation('fileman','newProjectItem',param);
		$('cancel').onclick = Content.hideConfirmation;
		$('ok').onclick = function() { 
			var action = 'newProject';
			var item = $('action-input').value;
			param = 'action='+action+'&item='+item;
			Fileman.execute(true,action,param,item);
		}
	}

	this.newDirectory = function() {
		var param = [ {},{} ];
		param[0]['name'] = 'newDirectoryItem';
		param[0]['value'] = '<br /><input id="action-input">';
		Content.showConfirmation('fileman','newDirectoryItem',param);
		$('cancel').onclick = Content.hideConfirmation;
		$('ok').onclick = function() { 
			var action = 'newDirectory';
			var item = $('action-input').value;
			param = 'action='+action+'&item='+Fileman.getFileInfo(obj,'full')+'/'+item;
			Fileman.execute(true,action,param,item);
		}
	}
	
	this.newFile = function() {
		var param = [ {},{} ];
		param[0]['name'] = 'newFileItem';
		param[0]['value'] = '<br /><input id="action-input">';
		Content.showConfirmation('fileman','newFileItem',param);
		$('cancel').onclick = Content.hideConfirmation;
		$('ok').onclick = function() { 
			var action = 'newFile';
			var item = $('action-input').value;
			param = 'action='+action+'&item='+Fileman.getFileInfo(obj,'full')+'/'+item;
			Fileman.execute(true,action,param,item);
		}
	}
	
	this.upload = function() {
		var param = [ {},{} ];
		param[0]['name'] = 'uploadItem';
		param[0]['value'] = '<form id="uploadForm" enctype="Multipart/form-data" method="Post" action="/servlet/FileManager" target="hiddenIframe">';
		param[0]['value'] += '<input type="hidden" name="path" value="'+Fileman.getFileInfo(obj,'full')+'"><br />';
		param[0]['value'] += '<input type="file" name="myfile" id="myfile">';
		param[0]['value'] += '<br></form><iframe name="hiddenIframe" style="display:none"></iframe>';
		Content.showConfirmation('fileman','uploadItem',param);
		$('cancel').onclick = Content.hideConfirmation;
		$('ok').onclick = function() {
			$('uploadForm').submit();
		}
/*
		$('ok').onclick = function() { 
			var action = 'upload';
			var item = $('myfile').value;
//			var item = Fileman.getFileInfo(obj,'full');
			param = 'action='+action+'&item='+item;
			Fileman.execute(true,action,param,item);
		} */

	}

	this.remove = function() {
		var param = [ {} ];
		param[0]['name'] = 'removeItem';
		param[0]['value'] = this.getFileInfo(obj,'name');
		Content.showConfirmation('fileman','removeItem',param);
		$('cancel').onclick = Content.hideConfirmation;
		$('ok').onclick = function() {
			var action = 'remove';
			var item = Fileman.getFileInfo(obj,'full');
			param = 'action='+action+'&item='+item;
			Fileman.execute(true,action,param,item);
		}
	}

	this.execute = function(update,action,param,item) {
		//alert(param)
		AJAX.get(cfg['docFileman'],{ 
				parameters:param,
				onEnd:'Fileman.menuAction(xmlDoc,"'+update+'","'+action+'","'+item+'");', 
				onError:'Content.showMessage("fileman","'+action+'Error","'+item+'")'
				});
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

}