
$ = function(id) {
	if(!arguments[1]) return document.getElementById(id);
	else document.getElementById(id).style[arguments[1]] = arguments[2];
}

iTutor = {
	actual : -1,
	config : {arrow:'none',left:null,left:null,right:null,bottom:null},
	pages : [],

	initialize : function() {
		this.loadPages();
		this.status('play');
		this.show();
		this.actual = -1;
		this.go(1);
	},
	
	status : function(id) {
		if(id=='play') {
			$('itstatus').style.display = 'none';
		}
		else {
			$('itstatus').style.display = 'block';		
			$('itstatus').innerHTML = '<a href="javascript:iTutor.show()" id="maximize"><img src="images/maximize.gif" border=0 alt="Maximizar" title="Maximizar"></a>';
			this.blink();
		}

	},
	
	blink : function() {
		for(i=0,w=0;i<5;i++,w+=150) {
			setTimeout('$("itstatus").style.backgroundColor="white"',w);
			w+=150;
			setTimeout('$("itstatus").style.backgroundColor="transparent"',w);
		}
	},
	
	loadPages : function() {
		this.pages = [
			{text:'<h2>Tutorial Java para iniciantes</h2>'+ iTutor.video('/ecco/content/itutor/page1.mpg')+'Introdução',ref:'center'},
			{text:'<h2>Tutorial Java para iniciantes</h2>'+ iTutor.video('/ecco/content/itutor/page2.mpg')+'Criação de um novo Projeto',ref:'fileman'},
			{text:'<h2>Tutorial Java para iniciantes</h2>Clique com o botão direito do mouse sobre seu novo projeto e clique em <em>"Novo arquivo"</em> e nomeie-o como <code>Teste.java</code>.<br><br><strong>Atenção:</strong> note que o "T" de <code>Teste.java</code> é maiúsculo.',ref:'fileman'},
			{text:'<h2>Tutorial Java para iniciantes</h2>Clique sobre o seu projeto e em seguida clique sobre o arquivo Teste.java criado. Ele será aberto no editor.',ref:'fileman'},
			{text:'<h2>Tutorial Java para iniciantes</h2><textarea wrap="off" disabled="disabled">class Teste {\n    public static void main(String args[]) {\n        System.out.println(\"iTutorial teste\");\n    }\n}</textarea><br>Digite o código acima na área do editor',ref:'editor'},
			{text:'<h2>Tutorial Java para iniciantes</h2>Clique no botão salvar <img src="images/save.gif">',ref:'save'},
			{text:'<h2>Tutorial Java para iniciantes</h2>Para compilar o seu programa, digite a linha abaixo no console:<br><br><code>javac Teste.java</code><br><br><strong>Atenção:</strong> java diferencia letras maiúsculas e minúsculas. Tenha certeza em digitar Teste.java com "T" maiúsculo',ref:'console'},			
//			{text:'<h2>Tutorial Java para iniciantes</h2>Clique no botão compilar <img src="images/compile.gif"><br><br>Ao clicar em compilar seu arquivo <code>OlaMundo.java</code> será interpretado pelo compilador javac e será criado o arquivo <code>OlaMundo.class</code>, contendo o bytecode que pode ser executado pelo computador.<br><br><em>Se houver um erro de compilação <a href="javascript:iTutor.go(-2)">clique aqui</a> para voltar ao código e digitá-lo novamente.</em>',ref:'compile'},
			{text:'<h2>Tutorial Java para iniciantes</h2>Clique em executar <img src="images/execute.gif"><br><br>Ao clicar em executar, a virtual machine do Java executará o arquivo em bytecode <code>OlaMundo.class</code>.',ref:'execute'},
			{text:'<h2>Tutorial Java para iniciantes</h2><img src="images/end.gif" height=103 align=center>Tutorial concluído.',ref:'center'},		
		]
	},
	
	getPos : function(obj) {
		var pos = { x: obj.offsetLeft||0, y: obj.offsetTop||0 };
		while(obj = obj.offsetParent) {
			pos.x += obj.offsetLeft||0;
			pos.y += obj.offsetTop||0;
		}
		return pos;
	},

	setConfigs : function(ref) {
		if(ref=='console') this.config = {arrow:'bottom',left:100,top:null,right:null,bottom:6};
		else if(ref=='save') this.config = {arrow:'bottom',left:0,top:null,right:null,bottom:20};
		else if(ref=='view') this.config = {arrow:'bottom',left:0,top:null,right:null,bottom:20};
		else if(ref=='compile') this.config = {arrow:'bottom',left:0,top:null,right:null,bottom:20};
		else if(ref=='execute') this.config = {arrow:'bottom',left:0,top:null,right:null,bottom:20};
		else if(ref=='fileman') this.config = {arrow:'left',left:210,top:10,right:null,bottom:null};
		else if(ref=='editor') this.config = {arrow:'top',left:50,top:null,right:20,bottom:-820};
		else this.config = {arrow:'none',left:window.innerWidth/3,top:window.innerHeight/3-100,right:null,bottom:null};
	},

	close : function() {
		if(!arguments[0]) this.go(-this.actual);
		else this.status('minimize');
		$('itutor').style.display=$('itutor-shadow').style.display='none';
		$('itutor-shadow').innerHTML=$('itutor-shadow').innerHTML='';
	},
	
	placePos : function(ref) {
		if($(ref))	p = this.getPos($(ref));
		else p = this.getPos(document.getElementsByTagName('body')[0]);
		
		$('itutor').style.width = $('itutor-shadow').style.width = (ref=='editor') ? 'auto' : '286px';

		$('itutor').style.top = (this.config.top!=null) ? p.y+this.config.top+'px' : 'auto' ;
		$('itutor').style.left = (this.config.left!=null) ? p.x+this.config.left+'px' : 'auto';
		$('itutor').style.right = (this.config.right!=null) ? this.config.right+'px' : 'auto';
		$('itutor').style.bottom = (this.config.bottom!=null) ? window.innerHeight-p.y+this.config.bottom+'px' : 'auto';

		$('itutor-shadow').style.top = (this.config.top!=null) ? p.y+this.config.top+4+'px' : 'auto' ;
		$('itutor-shadow').style.left = (this.config.left!=null) ? p.x+this.config.left+4+'px' : 'auto';
		$('itutor-shadow').style.right = (this.config.right!=null) ? this.config.right-4+'px' : 'auto';
		$('itutor-shadow').style.bottom = (this.config.bottom!=null) ? window.innerHeight-4-p.y+this.config.bottom+'px' : 'auto';
	},
	
	show : function() {
		$('itutor').style.display=$('itutor-shadow').style.display='block';
		this.status('play');
	},

	
	video : function(url) { // for flash (swf+flv)
		url = url.replace('.mpg','');
		v = '<div id="video"><object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=7,0,0,0" width="280" height="210" id="FLVPlayer">';
	  v += '<param name="movie" value="/ecco/content/itutor/player.swf" />';
	  v += '<param name="salign" value="lt" />';
	  v += '<param name="quality" value="high" />';
	  v += '<param name="scale" value="noscale" />';
	  v += '<param name="FlashVars" value="&MM_ComponentVersion=1&skinName=/ecco/content/itutor/skin&streamName='+url+'&autoPlay=true&autoRewind=false" />';
	  v += '<embed src="/ecco/content/itutor/player.swf" flashvars="&MM_ComponentVersion=1&skinName=/ecco/content/itutor/skin&streamName='+url+'&autoPlay=true&autoRewind=false" quality="high" scale="noscale" width="280" height="210" name="FLVPlayer" salign="LT" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" />';
		v += '</object></div>';
		return v;
	},
	
	/*
	video : function(url) { // for other videos (mpeg, avi, etc)
		v = '<div id="video"><OBJECT ID="MediaPlayer" WIDTH="280" HEIGHT="256" classid="CLSID:6BF52A52-394A-11d3-B153-00C04F79FAA6" ';
		v += 'STANDBY="Loading Windows Media Player components..." TYPE="application/x-oleobject">';
		v += '<PARAM NAME="FileName" VALUE="'+url+'"><PARAM name="autostart" VALUE="true">';
		v += '<PARAM name="ShowControls" VALUE="true"><param name="ShowStatusBar" value="false">';
		v += '<PARAM name="ShowDisplay" VALUE="false">';
		v += '<EMBED TYPE="application/x-mplayer2" SRC="'+url+'" ';
		v += 'NAME="MediaPlayer" WIDTH="280" ';
		v += 'HEIGHT="256" ShowControls="1" ShowStatusBar="0" ';
		v += 'ShowDisplay="0" autostart="1"></EMBED>';
		v += '</OBJECT></div>';
		return v;
	},*/


	go : function(way) {
		this.actual += way;
		if($(this.pages[this.actual].ref)) {
			if($(this.pages[this.actual].ref).style.display=='none') {
				this.actual -= way;
				return alert('Você deve executar todos os passos\nanteriores deste tutorial para prosseguir.');
			}
		}
		this.setConfigs(this.pages[this.actual].ref);			
		this.placePos(this.pages[this.actual].ref);
		var page = '<div id="text"><div id="arrow-'+this.config.arrow+'" class="arrow"></div><div id="page">Página '+(this.actual+1)+'/'+this.pages.length+'</div><a href="javascript:iTutor.close(1)" id="minimize" alt="Minimizar" title="Minimizar"><img src=images/minimize.gif border=0></a>'+this.pages[this.actual].text+'</div>';
		if(this.actual != 0) page += '<button onclick="iTutor.go(-1)" id="previous">anterior</button>';
		if(this.actual != this.pages.length-1) page += '<button onclick="iTutor.go(1)" id="next">próxima</button>';
		else page += '<button onclick="iTutor.close()" id="close">fechar</button>';
		$('itutor').innerHTML = page;
		$('itutor-shadow').style.height = $('itutor').clientHeight-20+'px';
	}	
}
