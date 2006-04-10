
Fileman = function() {
	
	var div = document.getElementById('fileman');
	var obj = Object;
	var out = '';
	
	this.update = function() {
		ajax.get(cfg['docFileman'],
				{ onEnd:'fileman.parse(xmlDoc.documentElement);fileman.write();', 
				  onError:'content.error("fileman","fileNotFound",cfg["docFileman"])' })
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
			out += '<a onclick="fileman.menu(this)" ondblclick="fileman.action(this)" class="'+tree.tagName+'">'+tree.getAttribute('name')+'</a>';
			out += '<div '+this.collapse(project,tree.getAttribute('name'))+'>';
			var nodes = tree.childNodes.length;
			for(var i=0; i<nodes; i++) 
				this.parse(tree.childNodes[i]);
			out += '</div>';
		}
		else {
			out+='<a onclick="fileman.menu(this)" ondblclick="fileman.action(this)" class="'+tree.tagName+'">'+tree.getAttribute('name')+'</a>';
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
	},
	
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
	
	
	this.menu = function(obj) {
		this.action(obj)
	}

}