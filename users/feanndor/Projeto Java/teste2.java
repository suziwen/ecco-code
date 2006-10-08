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

public class Editor extends HttpServlet {
	private static final long serialVersionUID = 1L;
	PrintWriter out = null;
	HttpServletResponse response = null;
	public String login = "feanndor"; // aqui eh uma variavel de sessao, por enquanto estatica
	public String pathComplement = "htdocs"+File.separator+"ecco"+File.separator+"users";
	