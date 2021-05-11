import React from 'react'
import {HebrewCalendar, HDate, Zmanim} from '@hebcal/core';
import CountDownTimerTrigger from '../utils/CountDownTimerTrigger'
import useTimeFromDate from '../utils/useTimeFromDate'

// displays the zmanim
const ShowZmanim = () => {
  // gets todays date
  const today = new HDate()
  // sets up zmanim for today and location
  const zman = new Zmanim(today, 51.210480, 4.417621)


  // subtracts provided Minutes From provided Date
  // returns a date object
  const subtractMinutesFromDate = (date:Date, mins:number) => {
    const newDate = new Date(date)
    newDate.setMinutes(newDate.getMinutes() - mins)
    return newDate
  }
   
  
  return (
    <table>
      <thead>
        <tr>
          <th>בשעה</th>
          <th>בעוד</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr className="inner-table">
          <td className="sof-time">{
            useTimeFromDate(
              subtractMinutesFromDate(
                zman.sofZmanShma(), 36
            ))}
          </td>
          <td>
            <CountDownTimerTrigger
              time={
                subtractMinutesFromDate(
                  zman.sofZmanShma(), 36)
              }
              start={30}
            />
          </td>
          <td className="sof">סוף זמן קר"ש<br />(מג"א)</td>
        </tr>
        <tr className="inner-table">
          <td className="sof-time">{useTimeFromDate(zman.sofZmanShma())}</td>
          <td>
            <CountDownTimerTrigger
              time={
                zman.sofZmanShma()
              }
              start={30} />
          </td>
          <td className="sof">סוף זמן קר"ש<br />(גר"א)</td>
        </tr>
        <tr className="inner-table">
          <td className="sof-time">{useTimeFromDate(zman.sofZmanTfilla())}</td>
          <td>
            <CountDownTimerTrigger
              time={
                zman.sofZmanTfilla()
              }
              start={59} />
          </td>
          <td className="sof">סוף זמן תפילה</td>
        </tr>
      </tbody>
    </table>
  )
}

export default ShowZmanim
