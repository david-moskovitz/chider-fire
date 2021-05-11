import React from 'react'
import useInterval from './useInterval'

interface Props {
  time: Date;
  start: number;
}

const CountDownTimer = (props:Props) => {

  const [timeLeft, setTimeLeft] = React.useState<string>('')


  useInterval(() => {
    const timeDifferenceInMilliseconds = 
      props.time.getTime() - new Date().getTime();
    
    const differenceInMinutes =
      Math.floor(timeDifferenceInMilliseconds / 1000 / 60)

    const differenceInSeconds = 
      Math.floor(timeDifferenceInMilliseconds / 1000 % 60)
    
    setTimeLeft(`
      ${differenceInMinutes < 10 ? '0' : ''}${differenceInMinutes}:
      ${differenceInSeconds < 10 ? '0' : ''}${differenceInSeconds}
    `)
    
  }, 1000)

  return (
    <span style={{ color: 'red', fontSize: '25px'}}>
     {timeLeft}
    </span>
  )
}

export default CountDownTimer
