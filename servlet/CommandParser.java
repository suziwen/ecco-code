import java.io.InputStream;
import java.io.File;

public class CommandParser {
	private String[] parsedCommand;
	private String homeDir;
	private String lastDir;
	private String currentDir;
	private String fileSep;
	
	public CommandParser(String homeDir){
		parsedCommand = null;
		this.homeDir = homeDir;
		this.lastDir = homeDir;
		this.currentDir = homeDir;
		this.fileSep = System.getProperty("file.separator");
	}
	
	public CommandParser(String homeDir, String lastDir){
		parsedCommand = null;
		this.homeDir = homeDir;
		this.lastDir = lastDir;
		this.currentDir = homeDir;
		this.fileSep = System.getProperty("file.separator");
	}
	
	public CommandParser(){
		this("");
	}
	
	public boolean parse(String command){
		parsedCommand = command.split(";");
		
		return !(parsedCommand == null || parsedCommand.length < 1);
	}

	public String exec(String[] command, String currentDir) throws Exception{
		// TODO: use specific try/catch here
		if(command == null) return "";
		
		Process application = null;
		String result = ""; 
		InputStream in = null;
		InputStream er = null;
		String OS = System.getProperty("os.name").toLowerCase();
		
		for(int i = 0; i < command.length; i++){ 
			
			String strCd = command[i].trim().toLowerCase();
			if(strCd.length() > 1 && strCd.substring(0,2).equals("cd")){
				strCd = command[i].trim();
				result += strCd.length() > 2? parseCd(strCd.substring(2).trim(), currentDir): parseCd(null, currentDir);
				continue;
			}
			
			if (OS.indexOf("windows") > -1) {
				application = Runtime.getRuntime().exec(new String[] {"cmd.exe","/C",command[i]}, null, new File(currentDir));
			}
			else {
				application = Runtime.getRuntime().exec(new String[] {"sh","-c",command[i]}, null, new File(currentDir));
			}
			if(application == null) continue;
			
		    in = application.getInputStream();
		    er = application.getErrorStream();
		    int ch;
		    StringBuffer sb = new StringBuffer(1024);
		    while ((ch = in.read())!=-1){
		    	sb.append((char) ch);
		    }
		    while ((ch = er.read())!=-1){
		    	sb.append((char) ch);
		    }
		    
		    result += sb;
		}
    	
   	 	return result;
	}
	
	public String exec(String command, String currentDir) throws Exception{
		if(!parse(command))
			return "Invalid command\n";
		
		this.currentDir = currentDir;
		return exec(parsedCommand, currentDir);
	}
	
	/**
	 * @param strCd
	 * @param currentDir
	 * @return
	 */
	public String parseCd(String strCd, String currentDir){
		String tmpCurDir = "";
		File dir = null;
		String parentDir = "";
		String msg = "";

		if(strCd == null || strCd.equals("~")){
			lastDir = currentDir;
			tmpCurDir = homeDir;
		}else if(strCd.equals("-")){
			tmpCurDir = lastDir;
			lastDir = currentDir;
		}else if(strCd.equals("..")){
			dir = new File(currentDir);
			parentDir = dir.exists() && dir.isDirectory()? dir.getParent(): currentDir;
			
			lastDir = currentDir;
			tmpCurDir = parentDir;
		}else if(strCd.equals(fileSep)){
			lastDir = currentDir;
			tmpCurDir = homeDir;
		}else{
			msg = "";
			dir = new File(currentDir +fileSep+ strCd);
			
			if(!dir.exists()){
				msg = "Directory not found\n";
			}else if(!dir.isDirectory()){	
				msg = "Not a directory\n";
			}
			
			if(msg.startsWith("ERROR")){
				return msg;
			}else{
				strCd = currentDir +fileSep+ strCd;
			}
			
			lastDir = currentDir;
			tmpCurDir = strCd;
		}
		
		// TODO: verify if user is in own directory, if not, return user to its directory
		if(!tmpCurDir.startsWith(this.homeDir)){
			tmpCurDir = currentDir;
		}
		
		
		this.currentDir = tmpCurDir;
			
		return msg;
	}
	
	public void setHomeDir(String homeDir){
		this.homeDir = homeDir;
	}
	
	public void setHomeDirandDefaults(String homeDir){
		this.homeDir = homeDir;
		this.lastDir = this.lastDir.equals("")? homeDir: this.lastDir;
		this.currentDir = this.currentDir.equals("")? homeDir: this.currentDir;
	}
	
	public String getCurrentPath(){
		return this.currentDir;
	}
	
	public String getLastPath(){
		return this.lastDir;
	}
	
}
