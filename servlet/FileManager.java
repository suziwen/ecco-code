import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileFilter;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Arrays;
import java.util.Comparator;
import java.util.Iterator;
import java.util.List;

import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.FileItemFactory;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.apache.commons.mail.EmailAttachment;
import org.apache.commons.mail.EmailException;
import org.apache.commons.mail.MultiPartEmail;

//TODO Arrumar os out.write() na última versão.

/**
 * File manager class
 * 
 * @author William Okuyama
 * 
 */
public class FileManager extends HttpServlet {

	private static final long serialVersionUID = 1L;

	private static String login = "feanndor"; // aqui eh uma variavel de
												// sessao, por enquanto estatica

	private static String usersPath = System.getProperty("user.dir")
			+ File.separator + "htdocs" + File.separator + "ecco"
			+ File.separator + "users" + File.separator + login
			+ File.separator;

	private static File dir = new File(usersPath);

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
		try {
			File[] dirs = dir.listFiles();
			Arrays.sort( dirs, new Comparator() {
				public int compare( Object obj1, Object obj2 ) {
					return ((File)obj1).compareTo((File)obj2);
				}
			});
			
			for (int i = 0; i < dirs.length; i++) {
				if (dirs[i].isDirectory()) {
					if (!dirs[i].getName().equals(".config")) {
						out.write("<project name=\"" + dirs[i].getName()
								+ "\">");
					} else {
						continue;
					}
				} else {
					continue;
				}
				listDir(dirs[i], out);
				out.write("</project>");
			}
		} catch (Exception e) {
			out.println("<info>error</info>");
			return;
		}
	}

	public void listDir(File dir, PrintWriter out) { 
		try {
			if (dir.isDirectory()) {
				File[] files = dir.listFiles();
				Arrays.sort( files, new Comparator() {
					public int compare( Object obj1, Object obj2 ) {
						return ((File)obj1).compareTo((File)obj2);
					}
				});
				
				for (int i = 0; i < files.length; i++) {
					if (files[i].isDirectory()) {
						existDirectories = true;
						isDirectory++;
						out.write("<directory name=\"" + files[i].getName()
								+ "\">");
						listDir(new File(files[i].toString()), out);
					}
				}
			}
			listFiles(dir, out);
			if (existDirectories && isDirectory > 0) {
				out.write("</directory>");
				isDirectory--;
			}
		} catch (Exception e) {
			out.println("<info>error</info>");
			return;
		}
	}

	public void listFiles(File dir, PrintWriter out) {
		if (dir.isDirectory()) {
			File[] files = dir.listFiles();
			Arrays.sort( files, new Comparator() {
				public int compare( Object obj1, Object obj2 ) {
					return ((File)obj1).compareTo((File)obj2);
				}
			});
			
			for (int i = 0; i < files.length; i++) {
				if (!files[i].isDirectory()) {
					out.write("<file name=\"" + files[i].getName() + "\"/>");
				}
			}
		} else {
			out.write("<file name=\"" + dir.getName() + "\"/>");
		}
	}

	public boolean rename(String from, String to, PrintWriter out) {
		File currentName = new File(dir.getPath() + File.separator + from);
		File newName = new File(dir.getPath() + File.separator + to);
		return currentName.renameTo(newName);
	}

	public boolean move(String from, String to, PrintWriter out) {
		File resourceToMove = new File(dir.getPath() + File.separator + from);
		File resourceDestination = new File(dir.getPath() + File.separator + to);

		boolean success = resourceToMove.renameTo(new File(resourceDestination,
				resourceToMove.getName()));
		if (!success) {
			return false;
		}
		return true;
	}

	public boolean newFile(String path, PrintWriter out) {
		File file = new File(dir.getPath() + File.separator + path);
		try {
			return file.createNewFile();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			return false;
		}
	}

	public boolean newDirectory(String path, PrintWriter out) {
		File file = new File(dir.getPath() + File.separator + path);
		return file.mkdir();
	}

	public boolean newProject(String name) {
		File project = new File(dir.getPath() + File.separator + name);
		return project.mkdir();
	}

	public boolean deleteDirectory(File path) {
		if (path.exists()) {
			File[] files = path.listFiles();
			for (int i = 0; i < files.length; i++) {
				if (files[i].isDirectory()) {
					deleteDirectory(files[i]);
				} else {
					files[i].delete();
				}
			}
		}
		return (path.delete());
	}

	public boolean remove(String path, PrintWriter out) {
		File item = new File(dir.getPath() + File.separator + path);
		if (item.isDirectory()) {
			return deleteDirectory(item);
		} else {
			return item.delete();
		}
	}

	public void doGet(HttpServletRequest req, HttpServletResponse res)
			throws IOException {
		res.setContentType("text/xml");
		String action = req.getParameter("action");
		if (action != null) {
			if (action.equals("list")) {
				PrintWriter out = res.getWriter();
				out.write("<?xml version=\"1.0\" encoding=\"iso-8859-1\"?>");
				out.write("<projects name=\"Projetos\">");
				listProjects(dir, out);
				out.write("</projects>");
			}

			if (action.equals("remove")) {
				PrintWriter out = res.getWriter();
				out.write("<?xml version=\"1.0\" encoding=\"iso-8859-1\"?>");
				String item = req.getParameter("item");
				if (remove(item, out)) {
					out.write("<info>ok</info>");
				} else {
					out.write("<info>error</info>");
				}
			}

			if (action.equals("rename")) {
				PrintWriter out = res.getWriter();
				out.write("<?xml version=\"1.0\" encoding=\"iso-8859-1\"?>");
				String from = req.getParameter("from");
				String to = req.getParameter("to");
				if (rename(from, to, out)) {
					out.write("<info>ok</info>");
				} else {
					out.write("<info>error</info>");
				}
			}

			if (action.equals("newFile")) {
				PrintWriter out = res.getWriter();
				out.write("<?xml version=\"1.0\" encoding=\"iso-8859-1\"?>");
				String path = req.getParameter("item");
				if (newFile(path, out)) {
					out.write("<info>ok</info>");
				} else {
					out.write("<info>error</info>");
				}
			}

			if (action.equals("newDirectory")) {
				PrintWriter out = res.getWriter();
				out.write("<?xml version=\"1.0\" encoding=\"iso-8859-1\"?>");
				String path = req.getParameter("item");
				if (newDirectory(path, out)) {
					out.write("<info>ok</info>");
				} else {
					out.write("<info>error</info>");
				}
			}

			if (action.equals("move")) {
				PrintWriter out = res.getWriter();
				out.write("<?xml version=\"1.0\" encoding=\"iso-8859-1\"?>");
				String from = req.getParameter("from");
				String to = req.getParameter("to");
				if (move(from, to, out)) {
					out.write("<info>ok</info>");
				} else {
					out.write("<info>error</info>");
				}
			}

			if (action.equals("newProject")) {
				PrintWriter out = res.getWriter();
				out.write("<?xml version=\"1.0\" encoding=\"iso-8859-1\"?>");
				String projetcName = req.getParameter("item");
				if (newProject(projetcName)) {
					out.write("<info>ok</info>");
				} else {
					out.write("<info>error</info>");
				}
			}

			if (action.equals("send")) {
				PrintWriter out = res.getWriter();
				out.write("<?xml version=\"1.0\" encoding=\"iso-8859-1\"?>");
				String path = req.getParameter("item");
				String to = req.getParameter("to");
				EmailAttachment attachment = new EmailAttachment();

				File file = new File(usersPath + path);

				String temp = usersPath + ".config" + File.separator + "temp"
						+ file.getName() + ".zip";
				File testDirectory = new File(usersPath + ".config");
				if (!testDirectory.isDirectory()) {
					File userDirectory = new File(usersPath + ".config");
					userDirectory.mkdir();
				}
				if (file.isDirectory()) {
					ZipUtility a = new ZipUtility(usersPath + path, temp);
					attachment.setPath(temp);
					attachment.setDisposition(EmailAttachment.ATTACHMENT);
					attachment.setDescription("Files");
					attachment.setName(file.getName() + ".zip");

				} else {
					attachment.setPath(file.getAbsolutePath());
					attachment.setDisposition(EmailAttachment.ATTACHMENT);
					attachment.setDescription("Files");
					attachment.setName(file.getName());
				}

				// Create the email message
				MultiPartEmail email = new MultiPartEmail();
				email.setAuthentication("eccodom", "eccowide");
				email.setHostName("smtp.sao.terra.com.br");
				try {
					email.addTo(to, "EccoUser");
					email.setFrom("ecco@ecco.org", "ECCO - "+file.getName());
					email.setSubject("Project File(s)");
					email.setMsg("Here, the files that you requested, thank you.");

					// add the attachment
					email.attach(attachment);

					// send the email
					email.send();
					
					out.write("<info>ok</info>");
					
				} catch (EmailException e) {
					// TODO Auto-generated catch block
					//e.printStackTrace();
					//out.write(e.toString());
					out.write("<info>error</info>");
				}
			}

			if (action.equals("download")) {
				File tempo = null;
				BufferedInputStream is;
				final ServletOutputStream outi = res.getOutputStream();
				res.setContentType("application/octet-stream");

				String path = req.getParameter("item");

				File file = new File(usersPath + path);

				String temp = usersPath + ".config" + File.separator + "temp"
						+ file.getName() + ".zip";
				File testDirectory = new File(usersPath + ".config");
				if (!testDirectory.isDirectory()) {
					File userDirectory = new File(usersPath + ".config");
					userDirectory.mkdir();
				}
				if (file.isDirectory()) {
					ZipUtility a = new ZipUtility(usersPath + path, temp);
					tempo = new File(temp);
					is = new BufferedInputStream(new FileInputStream(tempo));
					res.setHeader("Content-Disposition",
							"attachment; filename=\"" + file.getName()
									+ ".zip\"");
				} else {
					res.setHeader("Content-Disposition",
							"attachment; filename=\"" + file.getName() + "\"");
					is = new BufferedInputStream(new FileInputStream(file));
				}
				byte[] buf = new byte[128 * 1024]; // o 4K buffer
				int bytesRead;
				while ((bytesRead = is.read(buf)) != -1) {
					outi.write(buf, 0, bytesRead);
				}
				is.close();
				outi.close();
				tempo.delete();
			}
		}
	}

	public void doPost(HttpServletRequest req, HttpServletResponse res)
			throws IOException {
		List items = null;
		String path = "projeto1/folderTest1/";
		// String path = req.getParameter("path");
		res.setContentType("text/html");
		PrintWriter out = res.getWriter();

		if (ServletFileUpload.isMultipartContent(req)) {

			// Create a factory for disk-based file items
			FileItemFactory factory = new DiskFileItemFactory();

			// Create a new file upload handler
			ServletFileUpload upload = new ServletFileUpload(factory);

			// Seta tamanho maximo
			// upload.setSizeMax();

			// Parse the request
			try {
				items = upload.parseRequest(req);
			} catch (Exception e) {

				e.printStackTrace();
			}
			String fileName = null;
			// Process the uploaded items
			Iterator iter = items.iterator();
			while (iter.hasNext()) {
				FileItem item = (FileItem) iter.next();
				if (!item.isFormField()) {
					fileName = item.getName();
					// Path para o arquivo
					File uploadedFile = new File(usersPath + path + "/"
							+ fileName);
					try {
						item.write(uploadedFile);
						out.write("<script>top.Content.showMessage('fileman','uploadOK','"
										+ fileName
										+ "');top.Content.hideConfirmation(); top.Fileman.update();</script>");
					} catch (Exception e) {
						// TODO Auto-generated catch block
						out.write("<script>top.Content.showMessage('fileman','uploadError','"
										+ fileName
										+ "');top.Content.hideConfirmation();</script>");
						e.printStackTrace();
					}
				} else if (item.isFormField()) {
					path = item.getString();
				}
			}
		}
	}
}
