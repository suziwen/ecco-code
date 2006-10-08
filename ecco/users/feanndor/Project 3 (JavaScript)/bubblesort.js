var ranarray = new Array(100);

// Generate random numbers to fill ranarray.

function genNumbers(listbox) {
  var i;

  for(i = 0; i < ranarray.length; i++) {
    ranarray[i] = Math.random()*100;
    // Round to nearest integer.

    ranarray[i] = Math.round(ranarray[i]);
  }

  // Update the select box list.

  updateList(listbox);
}


function sortNumbers(listbox) {
  var x, y, holder;
  // The Bubble Sort method.

  for(x = 0; x < ranarray.length; x++) {
    for(y = 0; y < (ranarray.length-1); y++) {
      if(ranarray[y] > ranarray[y+1]) {
        holder = ranarray[y+1];
        ranarray[y+1] = ranarray[y];
        ranarray[y] = holder;
      }
    }
  }

  // Update the select box list.

  updateList(listbox);
}

// Assign values in array to values in the select box.

function updateList(listbox) {
  var i;
  for(i = 0; i < ranarray.length; i++) {
    if(listbox.options[i] == null) {
      listbox.options[i] = new Option(ranarray[i]);
    } else {
      listbox.options[i].text = ranarray[i];
    }
  }

}