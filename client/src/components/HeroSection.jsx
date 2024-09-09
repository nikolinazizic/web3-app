import React from 'react';
import video1 from "../assets/video1.mp4";
import video2 from "../assets/video2.mp4";
import video3 from "../assets/video3.mp4";

const HeroSection = () => {
  return (
    <div className="flex flex-col items-center mt-6 lg:mt-20">
        
        <h1 className="text-4xl sm:text-6xl lg:text-7xl text-center tracking-wide">
            Property Registry 
            <span className='bg-gradient-to-r from-blue-200 to-blue-900 text-transparent bg-clip-text'>{" "}Blockchain Dapp</span>
        </h1>
        <div className='flex justify-center my-10'>
        <a href="https://www.blockchain.com/" target="_blank" rel="noopener noreferrer"
   className='bg-gradient-to-r from-purple-400 to-purple-900 px-2 py-3 mx-2 rounded-md text-transparent bg-clip-text hover:bg-blue-700 hover:text-white hover:scale-105'>Blockchain</a>
<a href="https://www.techtarget.com/iotagenda/definition/blockchain-dApp" target="_blank" rel="noopener noreferrer"
   className='bg-gradient-to-r  from-blue-400 to-blue-900 px-2 py-3 mx-2 rounded-md text-transparent bg-clip-text  hover:bg-blue-700 hover:text-white hover:scale-105'>Dapp</a>
<a href="https://soliditylang.org/" target="_blank" rel="noopener noreferrer"
   className='bg-gradient-to-r  from-green-400 to-green-900 px-2 py-3 mx-2 rounded-md text-transparent bg-clip-text  hover:bg-blue-700 hover:text-white hover:scale-105'>Solidity</a>
<a href="https://ipfs.tech/" target="_blank" rel="noopener noreferrer"
   className='bg-gradient-to-r  from-pink-400 to-pink-900 px-2 py-3 mx-2 rounded-md text-transparent bg-clip-text  hover:bg-blue-700 hover:text-white hover:scale-105'>IPFS</a>


        </div>
        <p className=' text-lg text-center text-neutral-400 max-w-4xl'>Welcome to Property Registration - your reliable partner in tracking building permits. Our platform enables you to easily monitor and manage all steps in the real estate registration process, streamlining your journey from start to finish. With dependable tools and an intuitive interface, Property Registration makes the property registration process faster, more efficient, and more transparent than ever before.</p>
        <div className='flex mt-10 justify-center'>
            <video autoPlay loop muted className='rounded-lg w-1/2 border border-purple-300 hover:scale-95 transition-all duration-300 shadow-purple-300 mx-2 my-4'>
                <source src={video1} type='video/mp4'/>
                Your browser does not support the video tag.
            </video>
            <video autoPlay loop muted className='rounded-lg w-1/2 border border-purple-300 hover:scale-95 transition-all duration-300 shadow-purple-300 mx-2 my-4'>
                <source src={video3} type='video/mp4'/>
                Your browser does not support the video tag.
            </video>

        </div>
        
    </div>
  );
}

export default HeroSection;
