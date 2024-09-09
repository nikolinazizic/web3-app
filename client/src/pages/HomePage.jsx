import React from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import Features from '../components/Features';
import Footer from '../components/Footer';

function HomePage() {
  return (
    <>
      <Navbar/>
      <div className='max-w-7xl mx-auto pt-20 px-6'>
      <HeroSection/>
      <Features/>
      <Footer/>
    

      </div>
      
    </>
  );
}

export default HomePage;
