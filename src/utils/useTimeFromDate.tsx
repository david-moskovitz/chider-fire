import React from 'react'

/**
 * 
 * @param {Date} date 
 * @returns {string}
 * this func returns the time in a string of a given date
 */

const useTimeFromDate = (date:Date) => {
  const DT = new Date(date),
    // adds 0 if les than 10
    h = (DT.getHours() < 10 ? '0' : '') + DT.getHours(),
    m = (DT.getMinutes() < 10 ? '0' : '') + DT.getMinutes();
  return `${h}:${m}`
}

export default useTimeFromDate
