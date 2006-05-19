/*
 * Created on 19/04/2006
 *
 */

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class Editor extends HttpServlet {
	private static final long serialVersionUID = 1L;
	PrintWriter out = null;
	HttpServletResponse response = null;
	private static String login = "feanndor"; // aqui eh uma variavel de sessao, por enquanto estatica
 	private static String usersPath = System.getProperty("user.dir")+File.separator+"htdocs"+File.separator+"ecco"+File.separator+"users"+File.separator;
	
    public void main(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
    	out = getOutStream(response);
    	String action = request.getParameter("action");

    	response.setContentType("text/xml");
        out.write("<?xml version=\"1.0\" encoding=\"ISO-8859-1\"?>\n");
   	
    	if(action == null) {
    		this.error();
    	}
    	else if(action.equals("open")) {
    		String file = request.getParameter("file");
          	this.open(file);
    	}
    	else if(action.equals("save")) {
    		String file = request.getParameter("file");
    		String content = request.getParameter("content");
          	this.save(file, content);
    	}
    	else {
    		this.error();
    	}

    	out.flush();
	
    }

    public void save(String file, String content) {
    	try {
    			File f = new File(usersPath+login+File.separator+file);
    			File outputFile = f;
    			FileWriter fout = new FileWriter(outputFile);
    			fout.write(content);
    	        fout.close();
    			out.write("<info>ok</info>");
    	    } 
    	 catch (IOException e) {
    		 	this.error();
    	    }
    }
    
    
    public void open(String file) {
	 	
    	try {
    			File f = new File(usersPath+login+File.separator+file);
    		    // verificar aqui se é arquivo binario e dar erro
    	        BufferedReader in = new BufferedReader(new FileReader(f));
    	        String str;
    	        
    			out.write("<text><![CDATA[");
    	        while ((str = in.readLine()) != null) {
    	            out.write(str+"\r\n");
    	        }
    	        out.write("]]></text>");
    	        in.close();
    	    } 
    	 catch (IOException e) {
    		 	this.error();
    	    }
    }

    public void error() {
    	out.write("<info>error</info>");
    	out.flush();
    	out.close();
    }

    protected PrintWriter getOutStream(HttpServletResponse response) throws ServletException, IOException {
    	try {
            return new PrintWriter(new OutputStreamWriter(response.getOutputStream()));
        }
        catch (IllegalStateException e) {
            return response.getWriter();
        }

    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        this.main(request, response);
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
    	this.main(request, response);
    }

    
}

