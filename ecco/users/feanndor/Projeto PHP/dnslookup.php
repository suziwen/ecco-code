<html>
<head>
	<title>
	DNS domain lookup
	</title>
</head>
<body>
<h1>DNS lookup for
<?
	$dns = $_REQUEST['dns'];
	print $dns;
	print "</h1>";
	$dbconn = mysql_connect("clun.scit.wlv.ac.uk","jphb","mumble");
	mysql_select_db("mydatabase");
	$sql = "SELECT capital,name FROM euinfo WHERE dns = '" . $dns . "'";
	$result = mysql_query($sql);
	$nrows = mysql_num_rows($result);
	if($nrows == 1)
	{
		$row = mysql_fetch_array($result);
		$name = $row["name"];
		print "Name = " . $name . "<br>";
		print "Capital = " . $row["capital"] . "<br>";
		print "Flag = <img src = getflag.php?dns=" . $dns . "><br>";
	}
	else
		print "No data available";
?>
</h1>
</body>
</html>