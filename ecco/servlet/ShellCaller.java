/*
 * Created on 01/05/2006
 *
 * 
 */
import java.io.IOException;
import java.io.BufferedReader;
import java.io.InputStreamReader;

public class ShellCaller {
	private StringBuffer sb;
	private StringBuffer esb;
	private int estado;
	private String erro; 
	
	
	private Process exec(String[] command, boolean wait){
		Process p;
		
		erro = null;
		
		sb = new StringBuffer();
		esb = new StringBuffer();
		
		try{
			p = Runtime.getRuntime().exec(command);
		}catch(IOException e){
			erro = "Command error";
			return null;
		}
		
		if(wait){
			try{
				p.waitFor();
			}catch(InterruptedException e){
				Thread.currentThread().interrupt();
			}
		}
		
		if(p != null){
			try{
				estado = p.exitValue();
				BufferedReader b = new BufferedReader(new InputStreamReader(p.getInputStream()));
				String linha = b.readLine();
				while(linha != null){
					sb.append(linha+"\n");
					linha = b.readLine();
				}
				
				b = new BufferedReader(new InputStreamReader(p.getErrorStream()));
				linha = b.readLine();
				while(linha != null){
					esb.append(linha+"\n");
					linha = b.readLine();
				}
				
				p.getInputStream().close();
				p.getOutputStream().close();
				p.getErrorStream().close();
			}catch(IOException e){
				erro = "Stream error";
				return null;
			}
		}
		
		return p;
	}
	
	public String exec(String [] command){
		String s = "";
		
		exec(command, true);
		/*if(estado != 0){
			s = "Programa terminou com valor: "+estado+"\n";
		}*/
		if(esb != null && !esb.toString().equals(""))
			s = s + esb.toString()+"\n";
		if(sb != null)
			s = s + sb.toString()+"\n";
		return s;
	}
}
