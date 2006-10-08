def BubbleSort(array)
    size = array.size() # find the size of the array
    pass = size
    while pass > 2 # If we're down to less than 2 pieces of data to sort this won't work, and it's finished
        (pass-1).times do |current|
                if array[current] > array[current+1]
                      array[current],array[current+1] = array[current+1], array[current] # swap them around
                end # if
        end # times
     end # while
     return array
end 