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
	CommandParser cmdParser;
	String serverHome;
//	private static String login = "feanndor"; // aqui eh uma variavel de sessao, por enquanto estatica
//  private static String usersPath = System.getProperty("user.dir")+File.separator+"htdocs"+File.separator+"ecco"+File.separator+"users"+File.separator;
	
	public Konsole(){
		//cmdParser = new CommandParser();
		serverHome = System.getProperty("user.dir") + System.getProperty("file.separator")+"htdocs";
	}
	
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
    		String currentDir = request.getParameter("currentpath");
    		//currentDir = currentDir.replace("/", System.getProperty("file.separator"));
    		String lastDir = request.getParameter("lastpath");
    		//lastDir = lastDir.replace("/", System.getProperty("file.separator"));
    		if(!currentDir.startsWith(serverHome))
    			currentDir = serverHome + currentDir;
    		String homeDir = request.getParameter("userpath");
    		if(!homeDir.startsWith(serverHome))
    			homeDir = serverHome + homeDir;
    		if(!lastDir.startsWith(serverHome))
    			lastDir = serverHome + lastDir;
          	this.execute(command, currentDir, homeDir, lastDir);
    	}
    	else {
    		error();
    	}

    	out.flush();
	
    }

    public void execute(String command, String currentDir, String homeDir, String lastDir) {
    	String messages = "";
    	try {
    		
    		try {
    			cmdParser = new CommandParser(homeDir, lastDir);
    			//cmdParser.setHomeDirandDefaults(homeDir);
    			messages = cmdParser.exec(command, currentDir);
    		}catch (InterruptedException e){
    			error(); 
    		}catch(IOException e){
    			out.write("<out><![CDATA[ERROR:Command not found:"+command+"\n]]><currentpath><![CDATA["+cmdParser.getCurrentPath()+"]]></currentpath>" +
        				"<lastpath><![CDATA["+cmdParser.getLastPath()+"]]></lastpath></out>");
    			out.flush();
    	    	out.close();
    	    	return;
    		}
        	out.write("<out><![CDATA["+messages+"]]><currentpath><![CDATA["+cmdParser.getCurrentPath()+"]]></currentpath>" +
        				"<lastpath><![CDATA["+cmdParser.getLastPath()+"]]></lastpath></out>");
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