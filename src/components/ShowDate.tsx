import React from 'react'
import {HDate} from '@hebcal/core';

// this will get the hebrew date from hebcal
const ShowDate = () => {

  const date = new HDate();

  return (
    <>
      <div className="show-Hdate">
        {date.renderGematriya().replace(/[\u0591-\u05C7]/g, '')}
      </div>
      <div className="show-Edate">
        {new Date().toLocaleDateString('en-GB', {
          day: 'numeric', month: 'short', year: 'numeric'
        })}
      </div>
    </>
  )
}

export default ShowDate
