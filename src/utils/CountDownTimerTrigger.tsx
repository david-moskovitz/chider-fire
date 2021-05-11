import React from 'react'
import CountDownTimer from './CountDownTimer'
import useInterval from './useInterval'

/**
 * this component will wrap the count down
 * it will only show the count down if its between
 * 30 min before till the zman
 */

interface Props {
  time: Date;
  start: number;
}

const CountDownTimerTrigger:React.FC<Props> = (props) => {
  const [show, setShow] = React.useState<string>('')


  const calculateStartTime = (date:Date, start:number) => {
    const startCountDown = new Date(date)
    startCountDown.setMinutes(startCountDown.getMinutes() - start)
    return startCountDown
  }


  useInterval(() => {
    const now = new Date()
    const startTime = calculateStartTime(props.time, props.start)
    if (
      now < props.time && 
      now > startTime
    ) {
      setShow('count')
    } else if (
      now < props.time &&
      now < startTime
    ) {
      setShow('')
    } else if (
      now > props.time
    ) {
      setShow('passed')
    }

  }, 10000)



  switch (show) {
    case '':
      return <div />;
    case 'passed':
      return <span style={{ color: 'red'}}>עבר הזמן</span>;
    case 'count':
      return (
        <CountDownTimer
          time={props.time}
          start={props.start}
        />
      )
    default:
      return <div />
  }
}

export default CountDownTimerTrigger
