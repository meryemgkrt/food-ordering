
import About from '@/pages/about'
import Campaigns from '@/components/Campaigns'
import Customer from '@/components/customer/Customer'
import MenuWrapper from '@/components/product/MenuWrapper'
import Reservation from '@/components/Reservation'
import Caroucel from '@/components/ui/Carousel'
import Head from 'next/head'
import React from 'react'

const Home = ({ categoryList, productList }) => {
  return (
    <div>
      <Caroucel />
      <Campaigns />
      <MenuWrapper categoryList={categoryList} productList={productList} />
      <Reservation />
      <About />

      <Customer />
    </div>
  );
};

export default Home
