
Fileman = function() {
	var div = document.getElementById('fileman');
	var obj = Object;
	var out = '';
	
	this.update = function() {
//	alert(1)
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
			out += '<a onclick="f.menu(this,event)" ondblclick="f.action(this)" class="'+tree.tagName+'">'+tree.getAttribute('name')+'</a>';
			out += '<div '+this.collapse(project,tree.getAttribute('name'))+'>';
			var nodes = tree.childNodes.length;
			for(var i=0; i<nodes; i++) 
				this.parse(tree.childNodes[i]);
			out += '</div>';
		}
		else {
			out+='<a onclick="f.menu(this)" ondblclick="f.action(this)" class="'+tree.tagName+'">'+tree.getAttribute('name')+'</a>';
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
			var path = '';
			var objw = obj;
			while (objw.parentNode.previousSibling.className!='projects') {
				path = objw.parentNode.previousSibling.innerHTML+'/' + path;
				objw = objw.parentNode.previousSibling;
			}
			alert('ação sobre o arquivo: '+path+ obj.innerHTML) // ação sobre arquivos
		}
	}
	
	this.position = function(e) {
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
		document.getElementById('fileman-menu').style.top = posY+10 +'px';
		document.getElementById('fileman-menu').style.left = posX +'px';
		document.getElementById('fileman-menu').onmouseout = function() { 
			setTimeout("content.invert('fileman-menu')",600) 
			};
	}
	
	this.menu = function(obj,e) {
		if(obj.className=='projects') {
			this.position(e);
			}
		else
			this.action(obj)
	}

}