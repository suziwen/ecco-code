import java.io.File;
import java.io.FileOutputStream;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;
import java.io.*;

public class ZipUtility {
	private ZipOutputStream cpZipOutputStream = null;

	private String strSource = "";

	private String strTarget = "";

	private static long size = 0;

	private static int numOfFiles = 0;
	
	public ZipUtility(){
		
	}
	
	public ZipUtility(String sourcePath, String targetPath) {
		strSource = sourcePath;
		strTarget = targetPath;
		try {
			File cpFile = new File(strSource);
			if (!cpFile.isFile() && !cpFile.isDirectory()) {
				System.out.println("\nSource file/directory Not Found!");
				return;
			}
			FileOutputStream fos = new FileOutputStream(strTarget);
			cpZipOutputStream = new ZipOutputStream(fos);
			cpZipOutputStream.setLevel(9);
			zipFiles(cpFile);
			cpZipOutputStream.finish();
			cpZipOutputStream.close();
			System.out.println("\n Finished creating zip file " + strTarget
					+ " from source " + strSource);
			System.out.println("\n Total of  " + numOfFiles
					+ " files are Zipped ");
			System.out.println("\n Total of  " + size + " bytes are Zipped  ");
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	private void zipFiles(File cpFile) {

		int byteCount;
		final int DATA_BLOCK_SIZE = 2048;
		FileInputStream cpFileInputStream;

		if (cpFile.isDirectory()) {
			if (cpFile.getName().equalsIgnoreCase(".metadata")) { // if directory name is .metadata, skip it.
				return;
			}
			File[] fList = cpFile.listFiles();
			for (int i = 0; i < fList.length; i++) {
				zipFiles(fList[i]);
			}
		}

		else {
			try {
				if (cpFile.getAbsolutePath().equalsIgnoreCase(strTarget)) {
					return;
				}
				System.out.println("Zipping " + cpFile);
				size += cpFile.length();
				// String strAbsPath = cpFile.getAbsolutePath();
				numOfFiles++;
				String strAbsPath = cpFile.getPath();
				String strZipEntryName = strAbsPath.substring(strSource
						.length() + 1, strAbsPath.length());

				// byte[] b = new byte[ (int)(cpFile.length()) ];

				cpFileInputStream = new FileInputStream(cpFile);
				ZipEntry cpZipEntry = new ZipEntry(strZipEntryName);
				cpZipOutputStream.putNextEntry(cpZipEntry);

				byte[] b = new byte[DATA_BLOCK_SIZE];
				while ((byteCount = cpFileInputStream.read(b, 0,
						DATA_BLOCK_SIZE)) != -1) {
					cpZipOutputStream.write(b, 0, byteCount);
				}

				//cpZipOutputStream.write(b, 0, (int)cpFile.length());
				cpZipOutputStream.closeEntry();
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
	}
}