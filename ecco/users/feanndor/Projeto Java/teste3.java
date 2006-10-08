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