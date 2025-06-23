export const areArraysEqual = (array1: any[], array2: any[]) => {
    // verify if 2 arrays have the same length
    if (array1.length !== array2.length) {
      return false;
    }
  
    // compare each elements of the arrays
    for (let i = 0; i < array1.length; i++) {
      // if those elements are not equal, the arrays are not equal
      if (array1[i] !== array2[i]) {
        return false;
      }
    }
  
    // if we arraive here, the arrays are equal
    return true;
  }
  