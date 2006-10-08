# BubbleSort with while 2003 to 2005 Python v2.3 on OSX by D Schmelitschek
import whrandom # Random numbers
import cPickle  # Open files for reading a list

b = [5,4,3,6,8,9,2,99,1,7,2,9,22,33,44,5,1,11,12,13,1,8,0]
print b

def BubbleSort( a, n):
  false = 0
  true = 1
  swapped = true 
  while (swapped):
 	swapped = false
 	j = 0
 	while j <n -1:
 		if a[j+1] < a[j]:
 			swapped= true
 			a[j], a[j+1]= a[j+1], a[j]
 		j = j + 1
  print '--------- sorted below ------------'

def readfile(a = []):	
  fileobject = open("myfilenum.txt",'r')
  a = cPickle.load( fileobject)
  printrows(a)
  fileobject.close()
  return a

def printrows(a):
  for j in range (len(a)):
 	if j % 10==0:
 		print
 	print a[j], '\t',
  print# b = readfile(a)

BubbleSort( b, len(b))
printrows(b)
for j in range (100):
	b.append(100-j)
	
print '__________ Appended __________'
	
BubbleSort( b, len(b))
printrows(b)