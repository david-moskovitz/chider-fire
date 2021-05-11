import React from 'react'

import ImageGridItem from './ImageGridItem'

// interface for each image object
interface imagesObj {
  id?: string;
  dates?: string[];
  imageURL?: string;
  ref?: string;
}

// the props interface that includes a image prop
// that is an array of the image object
interface Props {
  images: imagesObj[]
  for: string;
  msgForNone: string;
}

const ImageGrid:React.FC<Props> = (props) => {


  return (
    <div className={`column-images${props.for === 'imageMazel' ? '' : '-ads'}`}>
      {props.images.length > 0 ?
        props.images.map((image, index) => (
        <ImageGridItem
          key={index}
          images={props.images}
          image={image}
          index={index}
          for={props.for}
        />
      ))
      : <h3>{props.msgForNone}</h3>}
    </div>
  )
}

export default ImageGrid
