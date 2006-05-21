import java.io.IOException;
import java.io.InputStream;

class InputStreamHandler extends Thread
{
	private InputStream m_stream;
	private StringBuffer m_captureBuffer;

	InputStreamHandler(StringBuffer captureBuffer, InputStream stream) {
		m_stream = stream;
		m_captureBuffer = captureBuffer;
		start();
	}
		
	public void run() {
		try {
			int nextChar;
			while( (nextChar = m_stream.read()) != -1 ) {
				m_captureBuffer.append((char)nextChar);
			}
		}
		catch(IOException ioe) {
			Konsole.error();
		}
	}
}