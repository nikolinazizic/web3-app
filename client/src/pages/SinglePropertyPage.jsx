import { useState,useEffect } from "react";
import { useStateContext } from "../context";
import { PROPERTY_REGISTRY_ABI } from "../context/constants";
import { useWeb3ModalProvider} from '@web3modal/ethers/react';
import { BrowserProvider, Contract} from 'ethers';
import {useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Modal from "../components/Modal";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { notify1, notify2, notify3} from "../notifications";
import { Link } from "react-router-dom";

const contractAddress = "0xb6A45FcDb88fa1218fc39851564857deFA6Ed6F3";
function SingleProperty() {
    const {id} = useParams();
    const { address, chainId, isConnected } = useStateContext();
    const { walletProvider } = useWeb3ModalProvider();
    const [propertyDetails,setPropertyDetails] = useState([]);
    const [editDetails,setEditDetails] = useState(false);
    const [editPrice,setEditPrice] = useState(false);
    const [fileImg,setFileImg] = useState();
    const [loading,setLoading] = useState(false);
    const [propertyName,setPropertyName] = useState('');
    const [category,setCategory] = useState('');
    const [location,setLocation] = useState('');
    const [area,setArea] = useState('');
    const [description,setDescription] = useState('');
    const [time,setTime] = useState([]);
    const [imageFile,setImageFile] = useState('');
    const [price,setPrice] = useState('');
    const [img,setImg] = useState('');
    const [history,setHistory] = useState();
    const [showHistory,setShowHistory] = useState(false);
    const getPropertyDetails = async() =>{
      try{
        if (!walletProvider ||!isConnected) {
          console.error("Wallet is not connected.");
          return;
        }
        const ethersProvider = new BrowserProvider(walletProvider);
        const signer = await ethersProvider.getSigner();
        const contract = new Contract(contractAddress, PROPERTY_REGISTRY_ABI, signer);
        const propertyDetails = await contract.getPropertyDetails(id);
        setPropertyDetails(propertyDetails);
      }catch(e){
        console.log(e);
      }
    }
    const readFile = (file) =>{
      const fileImage = file;
      setFileImg(fileImage);
      setImageFile(URL.createObjectURL(fileImage));
    }
    const getHistory = async() =>{
      try{
        if (!walletProvider ||!isConnected) {
          console.error("Wallet is not connected.");
          return;
        }
        const ethersProvider = new BrowserProvider(walletProvider);
        const signer = await ethersProvider.getSigner();
        const contract = new Contract(contractAddress, PROPERTY_REGISTRY_ABI, signer);
        const propertyDetails = await contract.getLastTransfer(id);
        const stringDate = parseInt(propertyDetails[2]);
        const date = new Date(stringDate*1000);
        setTime(date);
        setHistory(propertyDetails);
      }catch(e){
        console.log(e);
      }
    }
    const updatePrice = async(e) =>{
      e.preventDefault();
        try{
          if (!walletProvider ||!isConnected) {
            console.error("Wallet is not connected.");
            return;
          }
          const ethersProvider = new BrowserProvider(walletProvider);
          const signer = await ethersProvider.getSigner();
          const contract = new Contract(contractAddress, PROPERTY_REGISTRY_ABI, signer);
          await contract.changePrice(address,id,parseInt(price)).then((result)=>{
            setEditPrice(false);
            notify2();
          });
        }catch(e){
          console.log(e);
        }
      }
    const buyNow = async() =>{
        try{
          if (!walletProvider ||!isConnected) {
            console.error("Wallet is not connected.");
            return;
          }
            const ethersProvider = new BrowserProvider(walletProvider);
            const signer = await ethersProvider.getSigner();
            const contract = new Contract(contractAddress, PROPERTY_REGISTRY_ABI, signer);
            const propertyDetails = await contract.getPropertyDetails(id);
            const options = {value: parseInt(propertyDetails[8])};
            await contract.purchaseProperty(address,id,options).then(()=>{
              notify3();
            })
          }catch(e){
            console.log(e);
          }
    }

    const submitProperty = async(e) =>{
      e.preventDefault();
      try{
        if (!walletProvider ||!isConnected) {
          console.error("Wallet is not connected.");
          return;
        }
          const ethersProvider = new BrowserProvider(walletProvider);
          const signer = await ethersProvider.getSigner();
          const contract = new Contract(contractAddress, PROPERTY_REGISTRY_ABI, signer);
          await contract.modifyDetails(address,id,propertyName,category,location,description,img).then((result)=>{
            setEditDetails(false);
            notify1();
          });
        }catch(e){
          console.log(e);
        }
  }
  const sendFileToIPFS = async (e) => {
      e.preventDefault();
          try {
              setLoading(true);
              const formData = new FormData();
              formData.append("file", fileImg);
              const resFile = await axios({
                  method: "post",
                  url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
                  data: formData,
                  headers: {
                      'pinata_api_key': '2373676aca64c557c861',
                      'pinata_secret_api_key': '85af9adc33ef8fb3b1d8e250788161f6a3ce2bdc06850980ef890af0b8d36a37',
                      "Content-Type": "multipart/form-data"
                  },
              });
  
              const ImgHash = `https://gateway.pinata.cloud/ipfs/${resFile.data.IpfsHash}`;
           setImg(ImgHash);
           setLoading(false);
           alert("Image successfully uploaded to Pinata IPFS");
          } catch (error) {
              console.log("Error sending File to IPFS: ");
              console.log(error);
          }
    }
    useEffect(()=>{
        getPropertyDetails();
        getHistory();
    },[address,chainId])
    return (
        <>
    <div className={editDetails ? 'blur' : editPrice ? 'blur': showHistory ? 'blur': ''}>
    <Navbar/>
    { address != undefined ? (<div className='max-w-7xl mx-auto pt-20 '>
          <div className="2xl:container 2xl:mx-auto lg:px-20 md:py-12 md:px-6 px-4 bg-white">
              <div className="flex justify-center items-center lg:flex-row lg:gap-20 flex-col gap-8">
                  <div className="w-full sm:w-96 md:w-8/12 lg:w-8/12 items-center">
                      <p className="text-gray-600">{propertyDetails[3]}</p>
                      <h2 className="font-semibold lg:text-4xl text-3xl lg:leading-9 leading-7 text-gray-800 mt-4">{propertyDetails[2]}</h2>
                      <div className="flex flex-row gap-2 mt-5">
                      <svg className="h-8 w-8 text-gray-600"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  strokeWidth="2"  strokeLinecap="round"  strokeLinejoin="round">  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />  <circle cx="12" cy="10" r="3" /></svg>
                         <p className="mt-1 text-gray-600">{propertyDetails[4]}</p>
                      </div>
                      <p className="text-gray-600 mt-5">{propertyDetails[6]}</p>
                      <div className=" flex flex-row gap-2 mt-5">
                      <p className=" font-semibold lg:text-xl text-l lg:leading-6 leading-5 mt-3 text-gray-600">{parseInt(propertyDetails[8])} ETH</p>
                      {propertyDetails[0] != address ? <></> : <button className="w-28 bg-blue-400 hover:bg-gray-600 py-2 px-4 rounded-full" onClick={()=>setEditPrice(true)}>Edit price</button>}
                      </div>
                          <hr className=" bg-gray-200 w-full my-2" />
                          <p className="text-gray-600 mt-8">{propertyDetails[5]}</p>
                          <hr className=" bg-gray-200 w-full my-2" />
                          {propertyDetails[0] != address ? <button className=" bg-blue-400 hover:bg-gray-600 py-2 px-4 w-full lg:mt-10 mt-5 rounded-full" onClick={buyNow}>Buy property</button> : <button className=" bg-blue-400 hover:bg-gray-600 py-2 px-4 w-full lg:mt-10 mt-5 rounded-full" onClick={()=>setEditDetails(true)}>Edit details</button>}
            
                  </div>
                  <div className="sm:w-96 md:w-8/12  lg:w-11/12">
                      <img className="w-full h-full object-cover" src={propertyDetails[7]} alt="Wooden Chair Previw" />
              </div>
              </div>
              <div className="flex  justify-center items-center w-full">
                  <div className="w-full sm:w-96 md:w-8/12 lg:w-full grid lg:grid-cols-2 md:grid-cols-2 grid-cols-1 lg:gap-28 sm:gap-x-6 sm:gap-y-12 gap-y-12 sm:mt-14 mt-10">
                      <div>
                          <p className="text-gray-800">🔑Property registered by:</p>
                          <p className="text-gray-600 mt-4 break-words">{(propertyDetails[0])}</p>
                      </div>
                      <div>
                          <p className="text-gray-800">If you are interested in the history of transfers of this property between different owners, click the button below.</p>
                          <button className="w-30 bg-blue-400 hover:bg-gray-600 py-2 px-4 rounded-full mt-4 mr-4" onClick={()=>setShowHistory(true)}>View history</button>
                          <Link to={"/transactions/" + parseInt(propertyDetails[1])}>
                            <button className="w-30 bg-blue-400 hover:bg-gray-600 py-2 px-4 rounded-full mt-4">
                              Transactions
                            </button></Link>
                      </div>
                  </div>
              </div>
          </div>
          <Footer/>
          </div>) : (
          <Modal/>
        )}
        <ToastContainer />
        </div>
        {editDetails ?
            <form onSubmit={submitProperty}>
  <div className="absolute top-40 left-0 bg-opacity-50 w-full flex justify-center items-center">
      <div className="grid rounded-lg shadow-xl md:w-[60%] lg:w-[45%] w-[80%] bg-white">
        <div className="flex justify-center py-4">
          <div className="flex bg-white rounded-full md:p-4 p-2 border-2 border-blue-200">
            <svg className="w-8 h-8 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 109.06 122.88"><path d="M34.43 47.86L52.8 37.6V18.31a9.233 9.233 0 01-5.46-3.16L17.91 32.18c.35.98.54 2.03.54 3.13 0 .92-.13 1.8-.38 2.64l16.36 9.91zm11.35-35.38a9.231 9.231 0 01-.59-3.25c0-2.55 1.03-4.86 2.7-6.53S51.87 0 54.42 0c2.55 0 4.86 1.03 6.53 2.7a9.205 9.205 0 012.7 6.53c0 1.12-.2 2.19-.56 3.18l29.57 17.1c.21-.25.42-.5.65-.73a9.205 9.205 0 016.53-2.7c2.55 0 4.86 1.03 6.53 2.7a9.205 9.205 0 012.7 6.53c0 2.55-1.03 4.85-2.7 6.52a9.194 9.194 0 01-5.32 2.62v33.91c2.07.27 3.92 1.22 5.32 2.62 1.67 1.67 2.7 3.98 2.7 6.52a9.222 9.222 0 01-9.23 9.23 9.205 9.205 0 01-7.15-3.39l-29.61 17.12c.36.99.56 2.06.56 3.18 0 2.55-1.03 4.86-2.7 6.53a9.205 9.205 0 01-6.53 2.7c-2.55 0-4.86-1.03-6.53-2.7s-2.7-3.98-2.7-6.53c0-1.14.21-2.24.59-3.25L16.35 93.38a9.205 9.205 0 01-7.13 3.36c-2.55 0-4.86-1.03-6.53-2.7C1.03 92.37 0 90.06 0 87.51s1.03-4.85 2.7-6.52a9.242 9.242 0 015.25-2.62V44.44a9.18 9.18 0 01-5.25-2.62A9.164 9.164 0 010 35.3c0-2.55 1.03-4.86 2.7-6.53a9.205 9.205 0 016.53-2.7 9.205 9.205 0 017.16 3.4l29.39-16.99zm15.76 2.61a9.192 9.192 0 01-5.55 3.23V37.6l18.33 10.62 16.85-9.74c-.37-.99-.56-2.07-.56-3.18 0-1.08.19-2.13.53-3.09l-29.6-17.12zm36.69 29.3a9.159 9.159 0 01-4.92-2.56c-.19-.19-.37-.38-.54-.59l-16.82 9.72v20.78l16.89 9.75c.15-.17.3-.34.46-.5a9.194 9.194 0 014.92-2.56V44.39h.01zm-7.07 46.27c-.36-.98-.55-2.04-.55-3.14 0-1.16.21-2.27.61-3.3l-16.34-9.43-18.89 10.98v18.79a9.192 9.192 0 015.55 3.23l29.62-17.13zm-43.82 17.06a9.233 9.233 0 015.46-3.16V85.68l-18.96-11-16.09 9.29c.45 1.09.71 2.29.71 3.55 0 1.12-.2 2.19-.56 3.18l29.44 17.02zM10.76 78.41c1.93.32 3.66 1.25 4.99 2.58.1.1.19.2.28.3l16.39-9.46V50.36L16.64 40.8c-.27.37-.57.71-.89 1.03a9.255 9.255 0 01-4.99 2.58v34zM9.24 41.34c.04 0 .08-.01.12-.01h.08a6 6 0 004.06-1.76 6.023 6.023 0 001.77-4.27c0-1.67-.68-3.18-1.77-4.27-1.09-1.09-2.6-1.77-4.27-1.77s-3.18.68-4.27 1.77a6.023 6.023 0 00-1.77 4.27c0 1.67.68 3.18 1.77 4.27a6.03 6.03 0 004.28 1.77zm49.44 68.05a6.023 6.023 0 00-4.27-1.77c-1.67 0-3.18.68-4.27 1.77-1.09 1.09-1.77 2.6-1.77 4.27s.68 3.18 1.77 4.27 2.6 1.77 4.27 1.77c1.67 0 3.18-.68 4.27-1.77 1.09-1.09 1.77-2.6 1.77-4.27s-.67-3.18-1.77-4.27zm0-104.43a6.023 6.023 0 00-4.27-1.77c-1.67 0-3.18.68-4.27 1.77s-1.77 2.6-1.77 4.27c0 1.67.68 3.18 1.77 4.27a6.023 6.023 0 004.27 1.77c1.67 0 3.18-.68 4.27-1.77a6.023 6.023 0 001.77-4.27c0-1.67-.67-3.18-1.77-4.27zm45.42 78.29a6.023 6.023 0 00-4.27-1.77c-1.67 0-3.18.68-4.27 1.77a6.023 6.023 0 00-1.77 4.27c0 1.67.68 3.18 1.77 4.27a6.023 6.023 0 004.27 1.77c1.67 0 3.18-.68 4.27-1.77a6.023 6.023 0 001.77-4.27c0-1.67-.67-3.18-1.77-4.27zm-90.6 0c-1.09-1.09-2.6-1.77-4.27-1.77s-3.18.68-4.27 1.77a6.023 6.023 0 00-1.77 4.27c0 1.67.68 3.18 1.77 4.27s2.6 1.77 4.27 1.77 3.18-.68 4.27-1.77a6.023 6.023 0 001.77-4.27 6.065 6.065 0 00-1.77-4.27zm80.95-45.22c.08.08.14.18.2.28.06.1.1.2.14.31.23.34.49.66.77.95a6.023 6.023 0 004.27 1.77c1.67 0 3.18-.68 4.27-1.77a6.023 6.023 0 001.77-4.27c0-1.67-.68-3.18-1.77-4.27a6.023 6.023 0 00-4.27-1.77c-1.67 0-3.18.68-4.27 1.77a6.023 6.023 0 00-1.77 4.27c.01.99.25 1.91.66 2.73zM35.41 71.49a1.687 1.687 0 01.43.88l17.13 10.07V62.56L35.41 52.11v19.38zm37.56-19.11L55.96 62.57v19.89l17.01-10.05V52.38zM54.39 39.99l-16.6 9.93 16.69 10.05 16.21-9.84-16.3-10.14z" fillRule="evenodd" clipRule="evenodd"></path></svg>
          </div>
        </div>
        <div className="flex justify-center">
          <div className="flex">
            <h1 className=" font-bold md:text-2xl text-xl text-neutral-800">Edit property details</h1>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8 mt-5 mx-7">
          <div className="grid grid-cols-1">
            <label htmlFor="propertyName" className="uppercase md:text-sm text-xs text-neutral-700 text-light font-semibold">Name</label>
            <input id="propertyName" className="py-2 px-3 rounded-lg border-2 bg-white text-neutral-600 border-blue-200 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent" type="text" placeholder="Property Name" value={propertyName} onChange={(e)=>setPropertyName(e.target.value)} required/>
          </div>
         
          
          <div className="grid grid-cols-1">
            <label htmlFor="propertyLocation" className="uppercase md:text-sm text-xs text-neutral-700 text-light font-semibold">Location</label>
            <input id="propertyLocation" className="py-2 px-3 rounded-lg border-2 bg-white text-neutral-600 border-blue-200 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent" type="text" placeholder="Property Location" value={location} onChange={(e)=>setLocation(e.target.value)} required/>
          </div>
        </div>
        <div className="grid grid-cols-1 mt-5 mx-7">
            <label htmlFor="" className="uppercase md:text-sm text-xs text-neutral-700 text-light font-semibold">Category:</label>
            <select className="py-2 px-3 rounded-lg border-2 text-neutral-600 bg-white border-blue-200 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent" value={category} onChange={(e)=>setCategory(e.target.value)} required>
                <option>Select Category</option>
                <option value='House'>House</option>
                <option value='Land'>Land</option>
                <option value='Residential Building'>Residential Building</option>
            </select>
            {/* <input type="text" id='username' className="border w-full text-base px-2 py-1 focus:outline-none focus:border-gray-200 rounded-md"/> */}

        </div>
    
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8 mt-5 mx-7">
          <div className="grid grid-cols-1">
            <label htmlFor="propertyArea" className="uppercase md:text-sm text-xs text-neutral-700 text-light font-semibold">Area</label>
            <input id="propertyArea" className="py-2 px-3 bg-white text-neutral-600 rounded-lg border-2 border-blue-200 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent" type="text" placeholder="Property size" value={area} onChange={(e)=>setArea(e.target.value)} required />
          </div>
          
        </div>
        <div className="grid grid-cols-1 mt-5 mx-7">
        <label htmlFor="message" className="uppercase md:text-sm text-xs text-neutral-700 text-light font-semibold">Description</label>
<textarea id="message" rows="4" className="py-2 px-3 bg-white text-neutral-600 rounded-lg border-2 border-blue-200 mt-1 focus:outline-none focus:ring-2  focus:ring-blue-400" type="text" placeholder="Write something about property..." value={description} onChange={(e)=>setDescription(e.target.value)} required></textarea>
    </div>
        <div className="grid grid-cols-1 mt-5 mx-7">
          <label htmlFor="propertyImage" className="uppercase md:text-sm text-xs text-neutral-700 text-light font-semibold mb-1">Upload Photo</label>
            <div className='flex items-center justify-center w-full'>
                <label className='flex flex-col border-4 border-dashed border-blue-200 w-full h-32 hover:bg-gray-100 hover:border-blue-200 group'>
                    <div className='flex flex-col items-center justify-center pt-7'>
                      <svg className="w-10 h-10 text-blue-400 group-hover:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                      <p className='lowercase text-sm text-gray-400 group-hover:text-blue-400 pt-1 tracking-wider'>Select a photo</p>
                    </div>
                  <input id="propertyImage" type='file' className="hidden" onChange={(e)=>readFile(e.target.files[0])} required />
                </label>
            </div>
        </div>
          <div className="grid grid-cols-1 mt-5 mx-7">
        <button className="text-lg bg-gradient-to-r   bg-blue-400 py-2 px-3 rounded-full" disabled={loading} onClick={sendFileToIPFS}>{loading ? <div className="loader"></div>:<div>Upload</div>}</button>
          </div>
<div className="flex items-center justify-center mt-5 mx-20">
  {imageFile != '' ? <img src={imageFile} className="rounded-md" /> : <></>}
</div>
    
        <div className="flex items-center justify-center  md:gap-8 gap-4 pt-5 pb-5">
          <button className="w-28  ml-2 text-lg bg-gray-400 hover:bg-gray-600 py-2 px-4 rounded-full" onClick={()=>setEditDetails(false)}>Cancel</button>
          <input type="submit" className="w-28 text-lg  ml-2 bg-blue-400 hover:bg-blue-600 py-2 px-4 rounded-full cursor-pointer focus:bg-neutral-400" value="Submit"/>
        </div>
      </div>
    </div></form>:<></>}
    {editPrice ? 
<form onSubmit={updatePrice}>
<div className="fixed top-40 left-0 bg-opacity-50 w-full flex justify-center items-center">
    <div className="rounded-lg shadow-xl md:w-[60%] lg:w-[45%] w-[80%] bg-white">
        <h1 className="font-bold md:text-2xl text-xl block text-center  mt-5  text-neutral-800">Edit Price</h1>
        <div className="mt-3 ml-4">
            <label htmlFor="propertyPrice" className="uppercase md:text-sm text-xs text-neutral-700 text-light font-semibold">Price:</label>
            <input id="propertyPrice" className="mt-3 w-[98%] py-2 px-3 bg-white text-neutral-600 rounded-lg border-2 border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent" type="text" placeholder="Add new price" value={price} onChange={(e)=>setPrice(e.target.value)} required />
        </div> 
        <div className="flex items-center justify-center  md:gap-8 gap-4 pt-5 pb-5">
          <button className="w-28  ml-2 text-lg bg-gray-400 hover:bg-gray-600 py-2 px-4 rounded-full" onClick={()=>setEditPrice(false)}>Cancel</button>
          <input type="submit" className="w-28 text-lg  ml-2 bg-blue-400 hover:bg-blue-600 py-2 px-4 rounded-full cursor-pointer focus:bg-neutral-400" value="Submit" required/>
        </div>
    </div>
</div></form>:<></>}
{showHistory ? <div className="fixed top-40 left-0 bg-opacity-50 w-full flex justify-center items-center">
    <div className="rounded-lg shadow-xl md:w-[60%] lg:w-[45%] w-[80%] bg-white">
        <h1 className="font-bold md:text-2xl text-xl block text-center  mt-5  text-neutral-800">Transfer history</h1>
       {history[0] != '0x0000000000000000000000000000000000000000' ? 
       <>
       <div className="mt-3 ml-4">
          <label className="uppercase md:text-sm text-xs text-neutral-700 text-light font-semibold">Previous Owner</label>
          <p className="text-gray-500 text-sm mt-2 break-words">{history[0]}</p>
        </div>
        <div className="mt-3 ml-4">
          <label className="uppercase md:text-sm text-xs text-neutral-700 text-light font-semibold">Current Owner</label>
          <p className="text-gray-500 text-sm mt-2 break-words">{history[1]}</p>
        </div>
        <div className="mt-3 ml-4 mb-5">
          <label className="uppercase md:text-sm text-xs text-neutral-700 text-light font-semibold">Time</label>
          <p className="text-gray-500 text-sm mt-2 break-words">{time.toString()}</p>
        </div>
       </>:<>
       <span className="font-semibold text-xl flex justify-center items-center h-14 text-neutral-700">No History</span>
       </>}
       <div className="flex justify-center items-center">
       <button className="w-28  ml-2 mb-2 text-lg bg-gray-400 hover:bg-gray-600 py-2 px-4 rounded-full align-content:center" onClick={()=>setShowHistory(false)}>Cancel</button>
       </div>
    </div>
</div>:<></>}
          </>
      );
    }
export default SingleProperty;
