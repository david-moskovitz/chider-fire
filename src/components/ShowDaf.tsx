import React from 'react'
import {db} from '../firebase'
import {DafYomi} from '@hebcal/core'
import gematriya from 'gematriya'

const ShowDaf = () => {
  
  const [dates, setDates] = React.useState<any>(undefined)
  React.useEffect(() => {
    db.doc('daf/daf').get().then((doc) => {
      const filter = doc.data()?.body.find((day:any) => (
        day.date == new Date().toJSON().slice(0, 10)
      ))
      const forToday = {
        ahavathTorah: filter?.ahavathTorah,
        halachaYomis: filter?.halachaYomis
      }
      setDates(forToday)
    })
  }, [])

  return (
    <div className="show-daf" dir="rtl">
      <p>
        <b>דף היומי:</b>{' '} 
        <span>{new DafYomi(new Date()).render('he').replace(/\d/g, '') }
        {gematriya(new DafYomi(new Date()).getBlatt())}</span>
      </p>
      <p>
        <b>אהבת תורה:</b>{' '}
        <span>{dates?.ahavathTorah ? dates.ahavathTorah : null}</span>
      </p>
      <p>
        <b>הלכה יומית:</b>{' '}
        <span>{dates?.halachaYomis ? dates.halachaYomis : null}</span>
      </p>
    </div>
  )
}

export default ShowDaf
