    public void main(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
    	out = getOutStream(response);
    	String action = request.getParameter("action");

    	response.setContentType("text/html");
        out.write("<?xml version=\"1.0\" encoding=\"ISO-8859-1\"?>\n");
   	
    	if(action == null) {
    		this.error();
    	}
    	else if(action.equals("open")) {
          	this.open();
    	}
    	else {
    		this.error();
    	}

    	out.flush();
	
    }
