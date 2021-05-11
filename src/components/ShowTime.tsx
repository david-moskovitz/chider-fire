import React from 'react'
import useInterval from '../utils/useInterval'

// this component returns the current time in hh:mm format

const ShowTime = () => {
  // current time
  const [time, setTime] = React.useState<string>("")

  // compute new time
  useInterval(() => {
    const dt = new Date(),
      h = (dt.getHours() < 10 ? '0' : '') + dt.getHours(),
      m = (dt.getMinutes() < 10 ? '0' : '') + dt.getMinutes(),
      s = (dt.getSeconds() < 10 ? '0' : '') + dt.getSeconds();
    // set time to new time
    setTime(`${h}:${m}:${s}`)
  }, 1000)
  
  return (
    <span className="show-time">{time}</span>
  )
}

export default ShowTime
