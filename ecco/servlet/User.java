/*
 * Created on 19/04/2006
 *
 */

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class User extends HttpServlet {
	private static final long serialVersionUID = 1L;
	PrintWriter out = null;
	HttpServletResponse response = null;
	public String login = "feanndor"; // aqui eh uma variavel de sessao, por enquanto estatica
	
    public void main(HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
    	out = getOutStream(response);
    	String action = request.getParameter("action");

    	response.setContentType("text/xml");
        out.write("<?xml version=\"1.0\" encoding=\"ISO-8859-1\"?>\n");
   	
    	if(action == null) {
    		this.error();
    	}
    	else if(action.equals("login")) {
    		String username = request.getParameter("username");
    		String password = request.getParameter("password");
          	this.open(username,password);
    	}
    	else {
    		this.error();
    	}

    	out.flush();
	
    }

    public void open(String username, String password) {

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