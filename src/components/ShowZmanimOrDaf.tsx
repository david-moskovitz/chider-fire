import React from 'react'
import ShowZmanim from './ShowZmanim'
import ShowDaf from './ShowDaf'
import useInterval from '../utils/useInterval'

const ShowZmanimOrDaf = () => {
  const [showDaf, setShowDaf] = React.useState<boolean>(false)
  useInterval(() => {
    const now = new Date().getHours()
    if (now >= 12) {
      setShowDaf(true)
    } else {
      setShowDaf(false)
    }
  }, 10000)
  return (
    <>
      {showDaf ? <ShowDaf /> : <ShowZmanim />}
    </>
  )
}

export default ShowZmanimOrDaf
