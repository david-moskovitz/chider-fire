import React from 'react'

/**
 * @param fromDate 
 * @param endDate 
 * @return {string[]}
 * this hook takes in 2 dates and returns an array of dates in between
 * the return array will be of strings using ".toJSON().slice(0, 10)"
 */

interface Date {
  addDays(): Date;
}

const useGetArrayOfDates = (fromDate:string, endDate:string) => {

  const startDate = new Date(fromDate)
  const stopDate = new Date(endDate)

  /**
   * @param days
   * adds days amount of days to this date
   */
   Object.defineProperty(Date.prototype, 'addDays', {
    enumerable: false,   
    configurable: true,  
    writable: true,      
    value: function(days: number) {
      const date = new Date(this.valueOf());
      date.setDate(date.getDate() + days);
      return date;
    }
  })

  const dateArray = new Array();

  
  let currentDate = startDate;
  while (currentDate <= stopDate) {
      dateArray.push(currentDate.toJSON().slice(0, 10));
      //@ts-ignore
      currentDate = currentDate.addDays(1);
      
  }
  

  return dateArray;
}

export default useGetArrayOfDates
