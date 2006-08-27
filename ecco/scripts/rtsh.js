/*
Real Time Syntax Highlighting JS - RTSHJS v0.68

You can use and modify this code as you want. 
Just keep my credits somewhere around. Thanks.

Fernando M.A.d.S. - fermads@gmail.com

http://syntaxhighlighting.blogspot.com/2006/08/real-time-syntax-highlighting.html
*/

RTSH = { 
	range : null,
	language : null,

	initialize : function() {
		this.detect();
		if(browser.ff) { // FF
			str = '·'; //·
			document.designMode = 'on';
			document.addEventListener('keydown', this.keyHandler, true);
		} 
		else if(browser.ie) { // IE
			str = '­';
			document.onkeydown = this.keyHandler;
		}
		else {
			// TODO: textarea without syntax highlighting for non supported browsers
			return;
		}
		this.syntaxHighlight(1);
		window.scroll(0,0);
	}, 

	detect : function() {
		browser = { ie:false, ff:false };
		if(navigator.appName.indexOf("Microsoft") !=- 1) browser.ie = true;
		else if (navigator.appName == "Netscape") browser.ff = true;
	},

	keyHandler : function(evt) {
		evt = (evt) ? evt : (window.event) ? event : null;
	  	if(evt) {
	    	charCode = (evt.charCode) ? evt.charCode : ((evt.keyCode) ? evt.keyCode : ((evt.which) ? evt.which : 0));
		    if((charCode == 13 || charCode == 32) && (!evt.ctrlKey && !evt.altKey)) {
			 	RTSH.syntaxHighlight();
			  	RTSH.findString();
			}
			else if(charCode==90 && evt.ctrlKey) { // kill undo
				evt.returnValue = false; //IE
				if(browser.ff)evt.preventDefault();
			}
		}
	},

	findString : function() {
		if(browser.ff) { // FF
			self.find(str);
		}
		if(browser.ie) { // IE
		    range = self.document.body.createTextRange();
			strFound = range.findText(str);
		   	if (strFound) range.select();
		}
	},

	syntaxHighlight : function() { // TODO: try to remove special char before adding another
		if(browser.ff) { // FF
//			document.execCommand("inserthtml", false, '#');
			if(!arguments[0]) {
				o = document.createTextNode(str);
				window.getSelection().getRangeAt(0).insertNode(o);
			}
			x = document.getElementById('edt').innerHTML;
			x = x.replace(/<[bis]>|<\/[bis]>/g,'');
			x = x.replace(/<\/?span.*?>/g,'');
			x = x.replace(/<\/?pre>/g,'');
		}
		else if(browser.ie) { // IE
			if(!arguments[0]) document.selection.createRange().text = str;
			x = document.getElementById('edt').innerHTML;
			x = x.replace(/<\/?STRONG>|<\/?EM>|<\/?FONT.*?>/g,'');
			x = '<P>'+x;
			x = x.replace(/<\/?PRE>/ig,'');
			x = x.replace(/<P><P>/,'<P>'); 
			x = x.replace(/<\/?[bis]>/ig,'');
			x = x.replace(/\n/g,'<P>');
			x = x.replace(/\r/g,'</P>');
			x = x.replace(/<P><\/P>/g,'<P>&nbsp;</P>');
			}

		for(i=0;i<languages[this.language].length;i++) x = x.replace(languages[this.language][i],languages[this.language][i+1]);

		document.getElementById('edt').innerHTML = '<PRE>'+x+'</PRE>';
	}
}

// language specific regular expressions
languages = { 
	java : [
	/([\"\'].*?[\"\'])/g,'<s>$1</s>', // strings
	/(public|class|import|protected|private|static|final|new|extends|float|long|return|continue|null|false|true|throws|boolean|void|try|if|for|switch|catch|int|else)([ \"\'\{\(;·&<])/g,'<b>$1</b>$2', // reserved words	
	/\/\/(.*?)(<br>|<\/P>)/g,'<i>//$1</i>$2', // comments 
	/\/\*(.*?)\*\//g,'<i>/*$1*/</i>' // comments
],
	html : [
	/(&lt;[^!]*?&gt;)/g,'<b>$1</b>', // all tags
	/(&lt;style;*?&gt;)(.*?)(&lt;\/style&gt;)/g,'<em>$1</em><em>$2</em><em>$3</em>', // style tags
	/(&lt;script;*?&gt;)(.*?)(&lt;\/script&gt;)/g,'<u>$1</u><u>$2</u><u>$3</u>', // script tags
	/=(["'].*?["'])/g,'=<s>$1</s>', // atributes
	/(&lt;!--.*?--&gt.)/g,'<i>$1</i>' // comments 
] }


onload = function() {
	RTSH.initialize();
	}
