import React from 'react';
import Navbar from '../components/Navbar';
import Main from "../components/Main";
import Footer from '../components/Footer';
import { useStateContext } from '../context';
import Modal from '../components/Modal';

function AllTransactions() {
  const { address } = useStateContext(); 
  return (
    <>
      <Navbar/>
      {address !== undefined ? (
        <div className='max-w-7xl mx-auto pt-20'>
          <Main/>
          <Footer/>
        </div>
      ) : (
        <Modal/> 
      )}
    </>
  );
}

export default AllTransactions;
