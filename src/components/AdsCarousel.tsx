import React from 'react'
import useInterval from '../utils/useInterval'

// interface for each image object
interface adsObj {
  imageURL?: string;
}

// the props interface that includes a image prop
// that is an array of the image object
interface Props {
  ads: adsObj[]
}


const AdsCarousel:React.FC<Props> = (props) => {

  // the current index
  const [current, setCurrent] = React.useState<number>(0)

  useInterval(() => {
    if (current < props.ads.length-1) {
      setCurrent(cur => cur + 1)
    } else if (current === props.ads.length-1) {
      setCurrent(0)
    }
  }, 5000)


  return (
    <div className="carousel-container-ads">
      <ul className="carousel-frame-ads">
        {props.ads.length > 0 ? 
          props.ads.map((ad, index) => (
            <li className={`${index === current ? 'ads-show' : 'ads-hide'} ads-car`} key={index}>
              <img className="bechsut-carousel"  alt="" src={ad.imageURL} />
            </li>
          ))
          : null }
      </ul>
    </div>
  )
}

export default AdsCarousel
