<html>
<head>
<title>RTSHJS test</title>
<script>alert(1);</script>
<style>
	h1 {color:red;}
</style>
</head>
<body bgcolor="black" margin="1">

<?php
/* php comment here */
$narray['IBM']="International Business Machines";
$narray['MS']="Micro Sonics";
$narray['CA']="Computer Associated";
$narray['WHO']="World Health Organization";
$narray['UK']="United Kingdon";
$narray['BA']="Something Random";

asort($narray); // more comment

foreach($narray as $key => $value)     {
    print $key . " = " . $value . "<br />";
}
?>

<!-- 
	html comment here
-->

</body>
</html>


