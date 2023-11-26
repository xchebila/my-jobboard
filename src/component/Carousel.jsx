import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import '../style/Carousel.css';

const Carousel = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
  };

  return (
    <div className="carousel-container">
      <Slider {...settings}>
        <div className="carousel-slide">
          <img src="/img/slide3.jpg" alt="Slide 1" />
        </div>
        <div className="carousel-slide">
          <img src="/img/slide2.jpg" alt="Slide 2" />
        </div>
        <div className="carousel-slide">
          <img src="/img/slide1.jpg" alt="Slide 3" />
        </div>
      </Slider>
    </div>
  );
}

export default Carousel;
