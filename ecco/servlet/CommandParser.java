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
		// TODO: Criar exception personalizada para resolver este problema usando throw
		if(command == null) return "";
		
		Process application = null;
		StringBuffer inBuffer = new StringBuffer();
		StringBuffer errBuffer = new StringBuffer();
		String result = ""; 
		String OS = System.getProperty("os.name").toLowerCase();
		
		for(int i = 0; i < command.length; i++){
			
			String strCd = command[i].trim().toLowerCase();
			if(strCd.length() > 1 && strCd.substring(0,2).equals("cd")){
				strCd = command[i].trim();
				result += strCd.length() > 2? parseCd(strCd.substring(2).trim(), currentDir): parseCd(null, currentDir);
				continue;
			}
			
			if (OS.indexOf("windows") > -1) {
				command[i] = "cmd.exe /C "+command[i];
			}
	    	/*String[] cmd = { "cmd.exe", "/C", command };
	    		application = Runtime.getRuntime().exec(cmd);
			} 
			else {
				application = Runtime.getRuntime().exec(command);
			}*/
			application = Runtime.getRuntime().exec(command[i], null, new File(currentDir));
	
			if(application == null) continue;
			
			InputStream inStream = application.getInputStream();
			new InputStreamHandler( inBuffer, inStream );
	
			InputStream errStream = application.getErrorStream();
			new InputStreamHandler(errBuffer, errStream );
	   	 	application.waitFor();
	   	 	
	   	 	result += (inBuffer.toString()+errBuffer.toString());
		}
    	
   	 	return result;
	}
	
	public String exec(String command, String currentDir) throws Exception{
		// TODO: Criar exception personalizada para resolver este problema usando throw
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
		
		/* if(strCd != null && !strCd.equals("..")){
			File dir = new File(currentDir +"/"+ strCd);
			
			strCd = dir.exists() && dir.isDirectory()? currentDir +"/"+ strCd: strCd;
		} */
		
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
		
		// TODO: Verificar se o cara esta no seu dir e caso tenha saido, devolvê-lo a ele
		if(!tmpCurDir.startsWith(this.homeDir)){
			tmpCurDir = currentDir;
		}
		
		
		this.currentDir = tmpCurDir;
			
		return msg; // TODO: verificar necessidade de retornar algo aqui
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
