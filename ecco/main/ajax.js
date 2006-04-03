Ajax = {
	div : Object,
	list : Object,

	get : function(url, options) {
		var parameters = options.params || false;
		var method = options.meth || "post";
	  	var async = options.mode || true;
	  	var onStart = options.onStart || false;
	  	var onEnd = options.onEnd || false;
	  	var onError = options.onError || false;
		
	  	if(window.XMLHttpRequest) req = new XMLHttpRequest();
	  	else if(window.ActiveXObject) req = new ActiveXObject("Microsoft.XMLHTTP");
	  	else { alert("Browser nao suporta AJAX" ); return false; }
	
	  	if(onStart) eval(onStart);
	  
	  	req.open(method, url+( parameters ? "?"+parameters : "" ), async);
	  	req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	  	req.onreadystatechange = function() {
		    if (req.readyState == 4) {
				if (req.status == 200) {
					XMLobj = req.responseXML;
		          	if(onEnd) eval(onEnd);
		        	return true;
		        }
				else {
		        	//if(onEnd) eval(onEnd); //executar a funcao final mesmo com erro?
		         	if(onError) eval(onError);
		          	return false;
		        }
			}
	  	};
	  	req.send(null);
	},
	
	error : function() {
		alert('ajax error');
	}
	
}