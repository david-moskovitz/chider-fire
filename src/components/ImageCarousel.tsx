import React from "react";
import useInterval from "../utils/useInterval";
import aa from "../images/aa.jpg";

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
  images: imagesObj[];
}

const ImageCarousel: React.FC<Props> = (props) => {
  // the current index
  const [current, setCurrent] = React.useState<number>(0);

  useInterval(() => {
    if (current < props.images.length - 1) {
      setCurrent((curr) => curr + 1);
    } else if (current === props.images.length - 1) {
      setCurrent(0);
    }
  }, 20000);

  return (
    <div className="carousel-container">
      <ul className="carousel-frame">
        {props.images.length > 0 ? (
          props.images.map((image, index) => (
            <li
              className={`${
                index === current ? "img-show" : "img-hide"
              } img-car`}
              key={index}
            >
              <img className="img-carousel" alt="" src={image.imageURL} />
            </li>
          ))
        ) : (
          <li className="img-show img-car">
            <img className="img-carousel" alt="" src={aa} />
          </li>
        )}
      </ul>
    </div>
  );
};

export default ImageCarousel;
