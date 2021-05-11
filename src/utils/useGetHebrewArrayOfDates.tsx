import React from 'react'
import {HDate} from '@hebcal/core';


/**
 * @param fromDate 
 * @param endDate 
 * @return {string[]}
 * this hook takes in 2 dates and returns an array hebrew of dates in between
 * the return array will be of strings using ".toJSON().slice(0, 10)"
 */

 interface Date {
  addDays(): Date;
}

const useGetHebrewArrayOfDates = (fromDate:string, endDate:string) => {

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
      dateArray.push(
        new HDate(currentDate)
          .renderGematriya()
          .replace(/[\u0591-\u05C7]/g, '')
          .slice(0,-6)
      );
      //@ts-ignore
      currentDate = currentDate.addDays(1);
      
  }
  

  return dateArray;
}

export default useGetHebrewArrayOfDates
