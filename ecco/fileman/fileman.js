
Fileman = {
	div : Object,
	obj : Object,
	out : String,

	init : function(div)  {
		this.div = document.getElementById(div);
		this.out = '';
		this.update();
	},
	
	update : function() {
		Ajax.get(filemanXML,{onEnd:'Fileman.parse(XMLobj.documentElement);Fileman.write();', onError:'Ajax.error()'})
	},
	
	write : function() {
		this.div.innerHTML = this.out;	
		this.out = '';
	},
	
	parse : function(tree) {
		if(tree.nodeType!=1) { 
			/* Workaround for firefox CR/NL. Remove this chars between XML tags */ 
		}
		else if(tree.hasChildNodes()) {
			if(tree.tagName=='project') 
				project = tree.getAttribute('name');
			if(tree.tagName=='projects') 
				project = '';
			this.out += '<a onclick="Fileman.menu(this)" ondblclick="Fileman.act(this)" class="'+tree.tagName+'">'+tree.getAttribute('name')+'</a>';
			this.out += '<div '+this.collapse(project,tree.getAttribute('name'))+'>';
			var nodes = tree.childNodes.length;
			for(var i=0; i<nodes; i++) 
				this.parse(tree.childNodes[i]);
			this.out += '</div>';
		}
		else {
			this.out+='<a onclick="Fileman.menu(this)" ondblclick="Fileman.act(this)" class="'+tree.tagName+'">'+tree.getAttribute('name')+'</a>';
		}
	},
	
	collapse : function(project, branchName) {
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
	
	act : function(obj) {
		if(obj.className=='projects') 
			alert('ação sobre todos os projetos');
		else if(obj.className=='project') // ação sobre projeto especifico
			obj.nextSibling.className = (obj.nextSibling.className!='closed') ? 'closed' : 'opened';
		else if(obj.className=='directory') // ação sobre diretório especifico
			obj.nextSibling.className = (obj.nextSibling.className!='closed') ? 'closed' : 'opened';
		else {
			path = '';
			objw = obj;
			while (objw.parentNode.previousSibling.className!='projects') {
				path = objw.parentNode.previousSibling.innerHTML+'/' + path;
				objw = objw.parentNode.previousSibling;
			}
			alert('ação sobre o arquivo: '+path+ obj.innerHTML) // ação sobre arquivos
		}
	},
	
	
	menu : function(obj) {
		this.act(obj)
	},
	
}