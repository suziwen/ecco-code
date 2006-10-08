    public void open() {
	 	String serverPath = System.getProperty("user.dir");
    	try {
    			File file = new File(serverPath+File.separator+pathComplement+File.separator+login+File.separator+"teste.txt");
    		    // verificar aqui se é arquivo binario e dar erro
    	        BufferedReader in = new BufferedReader(new FileReader(file));
    	        String str;
    			
    	        while ((str = in.readLine()) != null) {
    	            out.write(str+"\n");
    	        }
    	        in.close();
    	    } 
    	 catch (IOException e) {
    		 this.error();
    	    }

    }