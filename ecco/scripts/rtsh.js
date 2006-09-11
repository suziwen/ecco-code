/*
Real Time Syntax Highlighting JS - RTSHJS v0.72

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
			str = '­'; //·
			document.designMode = 'on';
			document.addEventListener('keydown', this.keyHandler, true);
			window.blur();
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

	syntaxHighlight : function() {
		if(browser.ff) { // FF
			document.execCommand("inserthtml", false, str);
			x = document.getElementById('edt').innerHTML;
			x = x.replace(/<br>/g,'\n');
			x = x.replace(/<.*?>|<\/.*?>/g,'');
			x = x.replace(/\n/g,'<br>');			
		}
		else if(browser.ie) { // IE
			if(!arguments[0]) document.selection.createRange().text = str;
			x = document.getElementById('edt').innerHTML;
			x = x.replace(/<P>/g,'\n');
			x = x.replace(/<\/P>/g,'\r');
			x = x.replace(/<\/?.*?>/g,'');
			x = '<P>'+x;
			x = x.replace(/\n/g,'<P>');
			x = x.replace(/\r/g,'<\/P>');			
			x = x.replace(/<P><\/P>/g,'<P>&nbsp;<\/P>');			
			}

		for(i=0;i<languages[this.language].length;i++) 
			x = x.replace(languages[this.language][i],languages[this.language][i+1]);
		
		document.getElementById('edt').innerHTML = '<PRE>'+x+'</PRE>';		
	},
	
	plainText : function() { // return syntax highlighted code to original code
		code = document.getElementsByTagName('body')[0].innerHTML;
		code = code.replace(/<br>/gi,'\n');
		code = code.replace(/<\/p>/gi,'\r');		
		code = code.replace(/<p>/gi,'\n');
		code = code.replace(/&nbsp;/gi,'');
		code = code.replace(/­/g,'');
		code = code.replace(/<.*?>/g,'');
		code = code.replace(/&lt;/g,'<');
		code = code.replace(/&gt;/g,'>');
		if(browser.ie) code = code.replace(/\n+/,'');
		return code;
	}
	
}

// language specific regular expressions
// TODO: distribute languages in specific files.js
languages = { 
	java : [
	/([\"\'].*?[\"\'])/g,'<s>$1</s>', // strings
	/(abstract|continue|for|new|switch|assert|default|goto|package|synchronized|boolean|do|if|private|this|break|double|implements|protected|throw|byte|else|import|public|throws|case|enum|instanceof|return|transient|catch|extends|int|short|try|char|final|interface|static|void|class|finally|long|strictfp|volatile|const|float|native|super|while)([ \.\"\'\{\(;­&<])/g,'<b>$1</b>$2', // reserved words
	/\/\/(.*?)(<br>|<\/P>)/g,'<i>//$1</i>$2', // comments 
	/\/\*(.*?)\*\//g,'<i>/*$1*/</i>' // comments
],
	php : [
	/(&lt;[^!\?]*?&gt;)/g,'<b>$1</b>', // all tags
	/(&lt;style;*?&gt;)(.*?)(&lt;\/style&gt;)/g,'<em>$1</em><em>$2</em><em>$3</em>', // style tags
	/(&lt;script;*?&gt;)(.*?)(&lt;\/script&gt;)/g,'<u>$1</u><u>$2</u><u>$3</u>', // script tags
	/([\"\'].*?[\"\'])/g,'<s>$1</s>', // strings
	/(&lt;\?.*?\?&gt;)/g,'<strong>$1</strong>', // php tags	
	/(&lt;\?php|\?&gt;)/g,'<cite>$1</cite>', // php tags		
	/(\$.*?)([ \)\(\[\{\+\-\*\/&!\|%=;])/g,'<var>$1</var>$2',
	/(and|or|xor|__FILE__|exception|__LINE__|array|as|break|case|class|const|continue|declare|default|die|do|echo|else|elseif|empty|enddeclare|endfor|endforeach|endif|endswitch|endwhile|eval|exit|extends|for|foreach|function|global|if|include|include_once|isset|list|new|print|require|require_once|return|static|switch|unset|use|var|while|__FUNCTION__|__CLASS__|__METHOD__|final|php_user_filter|interface|implements|extends|public|private|protected|abstract|clone|try|catch|throw|this)([ \.\"\'\{\(;­&<])/g,'<ins>$1</ins>$2', // reserved words
	/\/\/(.*?)(<br>|<P>)/g,'<i>//$1</i>$2', // comments 
	/\/\*(.*?)\*\//g,'<i>/*$1*/</i>', // comments
	/(&lt;!--.*?--&gt.)/g,'<i>$1</i>' // comments 
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
