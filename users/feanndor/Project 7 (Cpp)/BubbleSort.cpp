// Bubble Sort Function for Descending Order 
void BubbleSort(apvector <int> &array)
{
      int i, j, flag = 1;    // set flag to 1 to begin initial pass
      int temp;             // holding variable
      int arrayLength = array.length( ); 
      for(i = 1; (i <= arrayLength) && flag; i++)
     {
          flag = 0;
          for (j=0; j < (arrayLength -1); j++)
         {
               if (array[j+1] > array[j])      // ascending order simply changes to <
              { 
                    temp = array[j];             // swap elements
                    array[j] = array[j+1];
                    array[j+1] = temp;
                    flag = 1;               // indicates that a swap occurred.
               }
          }
     }
     return;   //arrays are passed to functions by address; nothing is returned
}