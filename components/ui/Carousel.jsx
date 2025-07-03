import Image from "next/image";
import React from "react";
import Title from "@/components/ui/Title";
import Slider from "react-slick";

const Carousel = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 4000,
    appendDots: (dots) => (
      <div>
        <ul className="flex justify-center gap-2">{dots}</ul>
      </div>
    ),
    customPaging: (i) => (
      <div className="w-4 h-4 border-2 border-white bg-white/30 rounded-full mt-10 hover:bg-white transition-all duration-300 cursor-pointer"></div>
    ),
  };

  // Carousel slides data
  const slides = [
    {
      id: 1,
      backgroundImage: "/image/bg1.jpg",
      title: "Premium Fast Food",
      subtitle: "Experience",
      description:
        "Indulge in our signature burgers crafted with premium ingredients and served with passion. Every bite tells a story of quality and taste that will leave you craving for more.",
      buttonText: "Order Now",
      titleColor: "text-white",
      textAlign: "items-start text-left",
    },
    {
      id: 2,
      backgroundImage: "/image/bg2.jpg",
      title: "Fresh & Delicious",
      subtitle: "Pizza Collection",
      description:
        "Savor our wood-fired pizzas made with the freshest ingredients and traditional recipes. From classic margherita to gourmet specialties, we have something for every pizza lover.",
      buttonText: "Explore Menu",
      titleColor: "text-yellow-100",
      textAlign: "items-center text-center",
    },
    {
      id: 3,
      backgroundImage: "/image/bg3.jpg",
      title: "Crispy Golden",
      subtitle: "Fried Chicken",
      description:
        "Taste our perfectly seasoned, crispy fried chicken that's tender on the inside and golden on the outside. Made with our secret blend of herbs and spices.",
      buttonText: "Try Today",
      titleColor: "text-orange-100",
      textAlign: "items-end text-right",
    },
    {
      id: 4,
      backgroundImage: "/image/bg4.jpg",
      title: "Healthy & Fresh",
      subtitle: "Salad Bar",
      description:
        "Discover our fresh salad collection made with organic vegetables, premium proteins, and house-made dressings. Healthy eating never tasted so good.",
      buttonText: "Go Healthy",
      titleColor: "text-green-100",
      textAlign: "items-start text-left",
    },
    {
      id: 5,
      backgroundImage: "/image/bg5.jpg",
      title: "Sweet Endings",
      subtitle: "Dessert Paradise",
      description:
        "Complete your meal with our heavenly desserts. From decadent chocolate cakes to refreshing ice creams, we have the perfect sweet ending to your dining experience.",
      buttonText: "Sweet Treats",
      titleColor: "text-pink-100",
      textAlign: "items-center text-center",
    },
    {
      id: 6,
      backgroundImage: "/image/bg6.jpg",
      title: "Quick & Easy",
      subtitle: "Delivery Service",
      description:
        "Enjoy all your favorite meals delivered hot and fresh to your doorstep. Fast, reliable delivery service that brings the restaurant experience to your home.",
      buttonText: "Order Delivery",
      titleColor: "text-blue-100",
      textAlign: "items-end text-right",
    },
  ];

  return (
    <div className="h-[120vh] min-h-[800px] w-full -mt-[88px] relative overflow-hidden">
      <Slider {...settings}>
        {slides.map((slide, index) => (
          <div key={slide.id} className="relative h-[120vh] min-h-[800px]">
            {/* Background Image */}
            <div className="absolute top-0 left-0 w-full h-full">
              <Image
                src={slide.backgroundImage}
                alt={`${slide.title} Background`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
                className="object-cover"
                priority={index === 0}
              />
              {/* Dark overlay for better text readability */}
              <div className="absolute inset-0 bg-black/40"></div>
            </div>

            {/* Content */}
            <div
              className={`relative z-10 h-full flex flex-col justify-center px-4 md:px-8 ${slide.textAlign}`}
            >
              <div className="max-w-4xl">
                {/* Subtitle */}
                <p className="text-primary font-semibold text-lg md:text-xl mb-2 uppercase tracking-wider">
                  {slide.subtitle}
                </p>

                {/* Main Title */}
                <Title
                  className={`text-4xl md:text-6xl lg:text-8xl font-dancing mb-6 ${slide.titleColor} drop-shadow-2xl`}
                >
                  {slide.title}
                </Title>

                {/* Description */}
                <p className="text-white/90 text-base md:text-lg lg:text-xl leading-relaxed mb-8 max-w-2xl drop-shadow-lg">
                  {slide.description}
                </p>

                {/* CTA Button */}
                <button className="btn-primary transform hover:scale-105 transition-all duration-300 shadow-2xl text-lg px-8 py-4">
                  {slide.buttonText}
                </button>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute bottom-32 left-8 opacity-20">
              <div className="w-32 h-32 border-4 border-white rounded-full animate-pulse"></div>
            </div>
            <div className="absolute top-40 right-8 opacity-20">
              <div className="w-24 h-24 border-4 border-primary rounded-full animate-bounce"></div>
            </div>
          </div>
        ))}
      </Slider>

      {/* Navigation Arrows */}
      <div className="absolute top-1/2 left-4 transform -translate-y-1/2 z-20">
        <button className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300">
          <svg
            className="w-7 h-7"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
      </div>
      <div className="absolute top-1/2 right-4 transform -translate-y-1/2 z-20">
        <button className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300">
          <svg
            className="w-7 h-7"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      {/* Slide Counter */}
      <div className="absolute top-8 right-8 z-20 bg-black/50 backdrop-blur-sm rounded-full px-6 py-3 text-white text-base">
        <span className="font-bold">01</span>
        <span className="mx-2">/</span>
        <span>06</span>
      </div>
    </div>
  );
};

export default Carousel;
