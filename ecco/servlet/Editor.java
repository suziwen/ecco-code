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
import java.util.regex.*;

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

    	if(action == null) {
    		this.error();
    	}
    	else if(action.equals("open")) {
        	response.setContentType("text/html");
    		String file = request.getParameter("file");
    		String editor = request.getParameter("type");
          	this.open(file, editor);
    	}
    	else if(action.equals("save")) {
        	response.setContentType("text/xml");
    		String file = request.getParameter("file");
    		String content = request.getParameter("content");
          	this.save(file, content);
    	}
    	else {
    		response.setContentType("text/xml");
    		this.error();
    	}

    	out.flush();
	
    }

    public void save(String file, String content) {
    	out.write("<?xml version=\"1.0\" encoding=\"ISO-8859-1\"?>\n");
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
    
    
    public void open(String file, String type) {
    	try {
    			File f = new File(usersPath+login+File.separator+file);
    		    // verificar aqui se é arquivo binario e dar erro
    	        BufferedReader in = new BufferedReader(new FileReader(f));
    	        String str;

    	        out.write("<!DOCTYPE html PUBLIC \"-//W3C//DTD XHTML 1.0 Strict//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd\"><html><head>");
				
    	        if(type.equals("text")) {
					out.write("<link type=\"text/css\" rel=\"stylesheet\" href=\"/ecco/styles/rtsh-text.css\" />" +
							"<script>onload = function() { document.designMode = 'on'; }</script>" +
							"</head>");
					out.write("<body contenteditable='true' id='edt'><PRE>");
	    	        while ((str = in.readLine()) != null) {
	    	        	out.write(str+"\r\n");
	    	        }
				
				} else {
					out.write("<link type=\"text/css\" rel=\"stylesheet\" href=\"/ecco/styles/rtsh-"+type+".css\" />" +
							"<script type=\"text/javascript\" src=\"/ecco/scripts/rtsh.js\"></script>" +
							"<script type=\"text/javascript\">RTSH.language = '"+type+"';</script>" +
							"</head>");
					out.write("<body id='ffedt'><pre id='ieedt'>");
				    Pattern lt = Pattern.compile("<");
				    Pattern gt = Pattern.compile(">");
				    Matcher m1;
				    Matcher m2;
				    
	    	        while ((str = in.readLine()) != null) {
	    	        	m1 = lt.matcher(str);
	    	        	str = m1.replaceAll("&lt;");
	    	        	m2 = gt.matcher(str);
					    str = m2.replaceAll("&gt;");
	    	        	out.write(str+"\r\n");
	    	        }
				}

    	        out.write("</pre></body></html>");
    	        in.close();
    	    } 
    	 catch (IOException e) {
    		 	out.write("<html>error</html>");
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

