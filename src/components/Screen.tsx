import React from 'react'
import ShowTime from "./ShowTime"
import ShowDate from './ShowDate'

import ImageCarousel from './ImageCarousel'
import MazelCarousel from './MazelCarousel'
import AdsCarousel from './AdsCarousel'
import {db} from '../firebase'
import ShowMessage from './ShowMessage'
import {HDate} from '@hebcal/core';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import FullscreenExitIcon from '@material-ui/icons/FullscreenExit';
import Fab from '@material-ui/core/Fab';
import ShowZmanimOrDaf from './ShowZmanimOrDaf'




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

const Screen = () => {
  // images
  const [images, setImages] = React.useState<imagesObj[]>([])
  const [imagesH, setImagesH] = React.useState<imagesObj[]>([])
  // mazel
  const [messages, setMessages] = React.useState<mazelObj[]>([])
  // message
  const [msg, setMsg] = React.useState<messageObj>({message: ''})
  // ads
  const [ads, setAds] = React.useState<adsObj[]>([])


  const [isFullScreen, setIsFullScreen] = React.useState<boolean>(false)
  // get images
  React.useEffect(() => {
    // get images set for today
    db.collection("imageMazel")
      .where("dates", "array-contains", new Date().toJSON().slice(0, 10))
      .onSnapshot(snap => {
        const newImage = snap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
          
        setImages(newImage)
      })
      // get Yahrzeit images
      db.collection("imageMazel")
      .where("dates",
            "array-contains",
            new HDate().renderGematriya()
              .replace(/[\u0591-\u05C7]/g, '')
              .slice(0,-6)
      ).onSnapshot(snap => {
        const newImage = snap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
          
        setImagesH(newImage)
      })
  }, [])

  // get mazel
  React.useEffect(() => {
    db.collection("mazelTov")
      .where("dates", "array-contains", new Date().toJSON().slice(0, 10))
      .onSnapshot(snap => {
        snap.docs.map(doc => {
          const newMazel = {
            id: doc.id,
            dates: doc.data().dates,
            message: doc.data().message,
          }

          if (
            //@ts-ignore
            !Array.from<any>(messages, (msg) => msg.id)
              .includes(newMazel.id)
          ) {

            setMessages((prev: any) => [...prev, newMazel])
          }
        })
      })
  }, [])

  // get message 
  React.useEffect(() => {
    db.doc('message/message').onSnapshot((snap) => {
      const data = snap.data()! // makes sure its not undefined
      const newMsg = {
        message: data.message
      }
      setMsg(newMsg)
    })
  }, [])

  // get ads 
  React.useEffect(() =>{
    db.collection('ads').onSnapshot((snap) => {
      snap.forEach((doc) => {
        const data = doc.data()! // makes sure its not undefined
        const newAd = {
          imageURL: data.imageURL
        }
        setAds((prev: any) => [...prev, newAd])
      })
    })
  }, [])


    
  return (
    <main className="Screen">
      <div className="full-screen-btn">
        <Fab
          onClick={() => 
            isFullScreen ? 
            document.exitFullscreen().then(() => setIsFullScreen(false))
            : document.documentElement.requestFullscreen().then(() => setIsFullScreen(true))}
        >
          {
            isFullScreen ? 
              <FullscreenExitIcon />
            : <FullscreenIcon />
          }
        </Fab>
      </div>
      <div className="rect-border-out">
        <ImageCarousel images={images.concat(imagesH)} />
      </div>
      <div className="mazel-out">
        <MazelCarousel messages={messages} />
      </div>
      <div className="show-date-n-zmanim">
        <div className="show-date">
          <ShowDate />
          <ShowZmanimOrDaf />
        </div>
      </div>
      <div className="messages-center">
        {msg.message !== '' ?
          <ShowMessage msg={msg} />
        : null}
      </div>
      <div className="ads">
        <AdsCarousel ads={ads}/>
      </div>
      <div className="time">
        <ShowTime />
      </div>
    </main>
  )
}

export default Screen
