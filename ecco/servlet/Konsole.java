/*
 * Created on 19/04/2006
 *
 */
//import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class Konsole extends HttpServlet {
	private static final long serialVersionUID = 1L;
	static PrintWriter  out = null;
	HttpServletResponse response = null;
//	private static String login = "feanndor"; // aqui eh uma variavel de sessao, por enquanto estatica
//  private static String usersPath = System.getProperty("user.dir")+File.separator+"htdocs"+File.separator+"ecco"+File.separator+"users"+File.separator;
	
    public void main(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
    	out = getOutStream(response);
    	String action = request.getParameter("action");

    	response.setContentType("text/xml");
        out.write("<?xml version=\"1.0\" encoding=\"ISO-8859-1\"?>");
   	
    	if(action == null) {
    		error();
    	}
    	else if(action.equals("execute")) {
    		String command = request.getParameter("command");
          	this.execute(command);
    	}
    	else {
    		error();
    	}

    	out.flush();
	
    }

    public void execute(String command) {
    	try {
    		Process application;
    		String OS = System.getProperty("os.name").toLowerCase();
    		
    		if (OS.indexOf("windows") > -1) {
    			command = "cmd.exe /C "+command;
    		}
        	/*String[] cmd = { "cmd.exe", "/C", command };
        		application = Runtime.getRuntime().exec(cmd);
    		} 
    		else {
    			application = Runtime.getRuntime().exec(command);
    		}*/
    		application = Runtime.getRuntime().exec(command);

    		StringBuffer inBuffer = new StringBuffer();
    		InputStream inStream = application.getInputStream();
    		new InputStreamHandler( inBuffer, inStream );

    		StringBuffer errBuffer = new StringBuffer();
    		InputStream errStream = application.getErrorStream();
    		new InputStreamHandler(errBuffer, errStream );
       	 	try { application.waitFor(); }
        	catch (InterruptedException e) { error(); }
        	out.write("<out><![CDATA["+inBuffer+errBuffer+"]]></out>");
    	}
    	catch (Exception e) {
    		String s = e.getMessage();
    		out.write(s);
		 	error();
	    }
    	
    }
    
    public static void error() {
    	out.write("<info>error</info>");
    	out.flush();
    	out.close();
    }

    protected static PrintWriter getOutStream(HttpServletResponse response) throws ServletException, IOException {
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