import React from "react";
import Title from "../ui/Title";
import CustomerItem from "./CustomerItem";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import {
  IoIosArrowDropleftCircle,
  IoIosArrowDroprightCircle,
} from "react-icons/io";

const Customer = () => {
  function NextBtn({ onClick }) {
    return (
      <button onClick={onClick}>
        <IoIosArrowDroprightCircle className="text-4xl text-primary w-10 h-10 rounded-full absolute flex justify-center items-center -bottom-12 left-1/2 " />
      </button>
    );
  }

  function PrevBtn({ onClick }) {
    return (
      <button onClick={onClick}>
        <IoIosArrowDropleftCircle className="text-4xl text-primary w-10 h-10 rounded-full absolute flex justify-center items-center -bottom-12 right-1/2" />
      </button>
    );
  }

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3500,
    arrows: true,
    nextArrow: <NextBtn />, // Özel ileri butonu
    prevArrow: <PrevBtn />, // Özel geri butonu
    responsive: [
      {
        breakpoint: 768, // Küçük ekranlar için ayarlar
        settings: {
          slidesToShow: 1,
          arrows: false,
        },
      },
    ],
  };

  return (
    <div className="container mx-auto mb-20 mt-12 px-4">
      <Title className="text-center text-4xl font-bold font-dancing text-primary mb-10">
        What Says Our Customers
      </Title>

      <Slider {...settings}>
        <div className="p-4">
          <CustomerItem src={"/image/client1.jpg"} />
        </div>
        <div className="p-4">
          <CustomerItem src={"/image/client2.jpg"} />
        </div>
        <div className="p-4">
          <CustomerItem src={"/image/client1.jpg"} />
        </div>
        <div className="p-4">
          <CustomerItem src={"/image/client2.jpg"} />
        </div>
      </Slider>
    </div>
  );
};

export default Customer;
