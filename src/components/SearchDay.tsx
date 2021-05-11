import React from 'react'
import {db} from '../firebase'
import ImageGrid from './ImageGrid'
import MazelGrid from './MazelGrid'
import {HDate} from '@hebcal/core';


import {
  ReactJewishDatePicker,
  BasicJewishDay
} from "react-jewish-datepicker";


// interface for image object
interface imagesObj {
  id?: string;
  dates?: string[];
  imageURL?: string;
  ref?: string;
}

// interface for mazel object
interface mazelObj {
  id?: string;
  dates?: string[];
  message?: any;
}

// interface for message object
interface messageObj {
  message: any;
}

// interface for ads object
interface adsObj {
  imageURL?: string;
}


const SearchDay = () => {

  const [dateString, setDateString] = React.useState<string>(
    new Date().toJSON().slice(0, 10)
  )
  const [JDate, setJDate] = React.useState<BasicJewishDay>()
  // images
  const [images, setImages] = React.useState<imagesObj[]>([])
  // yar time
  const [imagesH, setImagesH] = React.useState<imagesObj[]>([])
  // mazel
  const [messages, setMessages] = React.useState<mazelObj[]>([])
  // message
  const [msg, setMsg] = React.useState<messageObj>({message: ''})
  // ads
  const [ads, setAds] = React.useState<adsObj[]>([])

  React.useEffect(() => {
    if (!!JDate) {
      setDateString(JDate.date.toJSON().slice(0, 10))
    } 
  }, [JDate])

  // get images
  React.useEffect(() => {
    
    db.collection("imageMazel")
      .where("dates", "array-contains", dateString)
      .onSnapshot(snap => {
        const newImage = snap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        setImages(newImage)
      })

    db.collection("imageMazel")
      .where("dates",
        "array-contains",
        new HDate(new Date(dateString)).renderGematriya()
          .replace(/[\u0591-\u05C7]/g, '')
          .slice(0,-6)
      ).onSnapshot(snap => {
        const newImage = snap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        setImagesH(newImage)
      })
  }, [dateString])

  // get mazel
  React.useEffect(() => {
    db.collection("mazelTov")
      .where("dates", "array-contains", dateString)
      .onSnapshot(snap => {
        const newMazel = snap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        setMessages(newMazel)
      })
  }, [dateString])

  // get message 
  React.useEffect(() => {
    db.doc('message/message').onSnapshot((snap) => {
      const newMsg = {
        id: snap.id,
        ...snap.data()
      }
      // @ts-ignore
      setMsg(newMsg)
  
    })
  }, [])

  // get ads 
  React.useEffect(() =>{
    db.collection('ads').onSnapshot((snap) => {
      const newAd = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      // @ts-ignore
      setAds(newAd)
    })
  }, [])



  return (
    <div style={{margin: '40px', height: '100%'}}>
      <h1 style={{alignSelf: 'center', textAlign: 'center'}}>
        {new HDate(new Date(dateString))
            .renderGematriya()
            .replace(/[\u0591-\u05C7]/g, '')
      }</h1>
      <div>
        <label>
          Choose Date
          <ReactJewishDatePicker
            value={new Date(dateString)}
            isHebrew
            onClick={(day: BasicJewishDay) => {
              setJDate(day);
            }}
          />
        </label>
      </div>
      <div className="search-day-grid">
        <div style={{border: '2px solid #3f51b5', borderRadius: '10px', padding: '20px', margin:'10px', maxHeight: '70vh', overflow: 'auto'}}>
          <h3 style={{textAlign: 'center'}}>Images</h3>
          <ImageGrid 
            images={images.concat(imagesH)}
            for="imageMazel"
            msgForNone="no images for today"
          />
        </div>
        <div style={{border: '2px solid #3f51b5', borderRadius: '10px', padding: '20px', margin:'10px', maxHeight: '70vh', overflow: 'auto'}}>
          <h3 style={{textAlign: 'center'}}>Mazel Tov</h3>
          <MazelGrid
            messages={messages}
          />
        </div>
        <div style={{border: '2px solid #3f51b5', borderRadius: '10px', padding: '20px', margin:'10px', maxHeight: '70vh', overflow: 'auto'}}>
        <h3 style={{textAlign: 'center'}}>Ads</h3>
        <div className="column-ads-msg">
        <ImageGrid 
            images={ads}
            for="ads"
            msgForNone="no ads"
          />
        </div>
        </div>
      </div>
    </div>
  )
}

export default SearchDay
