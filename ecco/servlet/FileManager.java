import java.io.File;
import java.io.FileFilter;
import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

//TODO Arrumar os out.write() na última versão.

/**
 * File manager class
 * 
 * @author William Okuyama
 *
 */
public class FileManager extends HttpServlet {

	private static final long serialVersionUID = 1L;
	
	private static String login = "feanndor"; // aqui eh uma variavel de sessao, por enquanto estatica
	private static String usersPath = System.getProperty("user.dir")+File.separator+"htdocs"+File.separator+"ecco"+File.separator+"users"+File.separator;
	private static File dir = new File(usersPath+login+File.separator);
	static boolean existDirectories = false;
	static int isDirectory = 0;

	public FileFilter filterFiles(File dir) {
		return (new FileFilter() {
			public boolean accept(File pathname) {
				return !(pathname.isDirectory());
			}
		});
	}

	public void listProjects(File dir, PrintWriter out) {
		try{
			File[] dirs = dir.listFiles();
			for (int i = 0; i < dirs.length; i++) {
				if (dirs[i].isDirectory()) {
					out.write("<project name=\""+dirs[i].getName()+"\">");
				} else {
					continue;
				}
				listDir(dirs[i],out);
				out.write("</project>");
			}
			File[] files = dir.listFiles(filterFiles(dir));
			for (int i = 0; i < files.length; i++) {
				System.out.println(files[i].getName());
			}
		}catch(Exception e){
			out.println("<info>error</info>");
			return;
		}
	}

	public void listDir(File dir, PrintWriter out) {
		try {
			if (dir.isDirectory()) {
				File[] files = dir.listFiles();
				for (int i = 0; i < files.length; i++) {
					if (files[i].isDirectory()) {
						existDirectories = true;
						isDirectory++;
						out.write("<directory name=\""+files[i].getName()+"\">");
						listDir(new File(files[i].toString()),out);
					}
				}
			}
			listFiles(dir,out);
			if (existDirectories && isDirectory>0) {
				out.write("</directory>");
				isDirectory--;
			}
		} catch (Exception e) {
			out.println("<info>error</info>");
			return;
		}
	}

	public void listFiles(File dir,PrintWriter out) {
		if (dir.isDirectory()) {
			File[] files = dir.listFiles();
			for (int i = 0; i < files.length; i++) {
				if (!files[i].isDirectory()) {
					out.write("<file name=\""+files[i].getName()+"\"/>");
				}
			}
		} else {
			out.write("<file name=\""+dir.getName()+"\"/>");
		}
	}
	
	public boolean rename(String from, String to, PrintWriter out){
		File currentName = new File(dir.getPath()+File.separator+from);
		File newName = new File(dir.getPath()+File.separator+to);
		return currentName.renameTo(newName);
	}
	
	public boolean move(String from, String to, PrintWriter out){
		File resourceToMove = new File(dir.getPath()+File.separator+from);
		File resourceDestination = new File(dir.getPath()+File.separator+to);

	    boolean success = resourceToMove.renameTo(new File(resourceDestination, resourceToMove.getName()));
	    if (!success) {
	       return false;
	    }
	    return true;
	}
	
	public boolean newFile(String path, PrintWriter out){
		File file = new File(dir.getPath()+File.separator+path);
		try {
			return file.createNewFile();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return false;
		}
	}
	
	public boolean newDirectory(String path, PrintWriter out){
		File file = new File(dir.getPath()+File.separator+path);
		return file.mkdir();
	}
	
	public boolean newProject(String name){
		File project = new File(dir.getPath()+File.separator+name);
		return project.mkdir();
	}
	
	public boolean deleteDirectory(File path) {
	    if( path.exists() ) {
	      File[] files = path.listFiles();
	      for(int i=0; i<files.length; i++) {
	         if(files[i].isDirectory()) {
	           deleteDirectory(files[i]);
	         }
	         else {
	           files[i].delete();
	         }
	      }
	    }
	    return( path.delete() );
	 }
	
	public boolean remove(String path, PrintWriter out){
		File item = new File(dir.getPath()+File.separator+path);
		if(item.isDirectory()){
			return deleteDirectory(item);
		}else{
			return item.delete();
		}
	}
	

	
	public void doGet(HttpServletRequest req, HttpServletResponse res) throws IOException{
		res.setContentType("text/xml");
		PrintWriter out = res.getWriter();
		out.write("<?xml version=\"1.0\" encoding=\"iso-8859-1\"?>");	
		String action = req.getParameter("action");
		if(action != null){
			if(action.equals("list")){
				out.write("<projects name=\"Projetos\">");
				listProjects(dir, out);
				out.write("</projects>");
			}
			
			if(action.equals("remove")){
				String item = req.getParameter("item");
				if(remove(item, out)){	
					out.write("<info>ok</info>");
				}else{
					out.write("<info>error</info>");
				}
			}
			
			if(action.equals("rename")){
				String from = req.getParameter("from");
				String to = req.getParameter("to");
				if(rename(from,to,out)){
					out.write("<info>ok</info>");
				}else{
					out.write("<info>error</info>");
				}
			}
			
			if(action.equals("newFile")){
				String path = req.getParameter("item");
				if(newFile(path, out)){
					out.write("<info>ok</info>");
				}else{
					out.write("<info>error</info>");
				}
			}
			
			if(action.equals("newDirectory")){
				String path = req.getParameter("item");
				if(newDirectory(path, out)){
					out.write("<info>ok</info>");
				}else{
					out.write("<info>error</info>");
				}
			}
			
			if(action.equals("move")){
				String from = req.getParameter("from");
				String to = req.getParameter("to");
				if(move(from, to, out)){
					out.write("<info>ok</info>");
				}else{
					out.write("<info>error</info>");
				}
			}
			
			if(action.equals("newProject")){
				String projetcName = req.getParameter("item");
				if(newProject(projetcName)){
					out.write("<info>ok</info>");
				}else{
					out.write("<info>error</info>");
				}
			}
		}
	}
}

