AJAX = function() {
	
	AJAX = this;
	var xmlDoc = Object;

	this.get = function(url, options) {
		var parameters = options.parameters || false;
		var method = options.method || 'get';
	  	var async = options.async || true;
	  	var onStart = options.onStart || false;
	  	var onEnd = options.onEnd || false;
	  	var onError = options.onError || false;
		var request;
		
	  	if(window.XMLHttpRequest) {
	  		request = new XMLHttpRequest();
		}
	  	else if(window.ActiveXObject) {
	  		request = new ActiveXObject('Microsoft.XMLHTTP');
		}
	  	else { 
			alert(cfg['browser_error']); return false; 
		}
	
	  	if(onStart) {
			eval(onStart);
		}
	  
	  	request.open(method, url+( parameters ? '?'+parameters : '' ), async);
	  	request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	  	request.onreadystatechange = function() {
		    if (request.readyState == 4) {
				if (request.status == 200) {
					xmlDoc = request.responseXML;
		          	if(onEnd) {
		          		eval(onEnd);
					}
		        	return true;
		        }
				else {
		         	if(onError) {
		         		eval(onError);
					}
		          	return false;
		        }
			}
	  	};
	  	request.send(null);
	}
}