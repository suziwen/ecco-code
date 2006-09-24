#!/usr/bin/perl -w
#
###########################################################################
# Copyright (C) 2004 by 0xSoftware Inc#
# Damo@0xSoftware.com #
# #
# This program is free software; you can redistribute it and/or modify#
# it under the terms of the GNU General Public License as published by#
# the Free Software Foundation; either version 2 of the License, or#
# (at your option) any later version. #
###########################################################################
#
print"Randomizing Numbers\n";
for($i = 0; $i <= 10; $i++)
{
	$Numbers[$i] = int(rand(100));
	print"$Numbers[$i]\n";
}
print"Sorting\n";
#
# $OL == Outer Loop
# $IL == Inner Loop
#
for($OL = 0; $OL <= 10; $OL++)
{
	for($IL = $OL; $IL <= 10; $IL++)
	{
	#
		# ascending <
		# decending >
		#
		if($Numbers[$IL] < $Numbers[$OL])
		{
			$Temp = $Numbers[$IL];
			$Numbers[$IL] = $Numbers[$OL];
			$Numbers[$OL] = $Temp;
		}
	}
}
#
# use i again just reset the value
#
$i = 0;
print"Sorted Out: \n";
foreach $value (@Numbers)
{
	$i++;
	print"In $i place is: $value\n";
}