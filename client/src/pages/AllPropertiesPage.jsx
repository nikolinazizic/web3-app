import { useState, useEffect } from "react";
import { useStateContext } from "../context";
import { PROPERTY_REGISTRY_ABI } from "../context/constants";
import {
  useWeb3ModalProvider,
} from "@web3modal/ethers/react";
import { BrowserProvider, Contract } from "ethers";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Modal from "../components/Modal";

const contractAddress = "0xb6A45FcDb88fa1218fc39851564857deFA6Ed6F3";

function Home() {
  const { address, chainId, isConnected } = useStateContext();
  const { walletProvider } = useWeb3ModalProvider();
  const [search, setSearch] = useState("");
  const [propertyDetails, setPropertyDetails] = useState([]);

  const getPropertyDetails = async () => {
    try {
      if (!walletProvider) {
        console.error('No wallet provider found');
        return;
      }

      const ethersProvider = new BrowserProvider(walletProvider);
      const signer = await ethersProvider.getSigner();
      const contract = new Contract(
        contractAddress,
        PROPERTY_REGISTRY_ABI,
        signer
      );
      const propertyDetails = await contract.listAllProperties();
      setPropertyDetails(propertyDetails);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (address && chainId) {
      getPropertyDetails();
    }
  }, [address, chainId]);

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto pt-20">
        {address !== undefined ? (
          <div className="flex flex-col items-center justify-center mt-6 lg:mt-20">
            <h2 className="text-4xl font-semibold mb-4 text-center">
              {search === ""
                ? 'Results for "All properties"'
                : `Results for "${search}"`}
            </h2>
            <h2 className="text-lg mb-4 text-neutral-400">
              Filter by categories:
            </h2>
          </div>
        ) : null}
        {address != undefined ? (
          <div className="flex items-center justify-center mt-3">
            <button
              type="button"
              className="w-28  ml-2 mt-2 bg-blue-400 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full focus:bg-neutral-400"
              onClick={() => setSearch("")}
            >
              All
            </button>
            <button
              type="button"
              className="w-28  ml-2 mt-2 bg-blue-400 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full focus:bg-neutral-400"
              onClick={() => setSearch("House")}
            >
              House
            </button>
            <button
              type="button"
              className="w-28  ml-2 mt-2 bg-blue-400 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full focus:bg-neutral-400"
              onClick={() => setSearch("Residential Building")}
            >
              Building
            </button>
            <button
              type="button"
              className="w-28  ml-2 mt-2 bg-blue-400 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full focus:bg-neutral-400"
              onClick={() => setSearch("Land")}
            >
              Land
            </button>
          </div>
        ) : (
          <></>
        )}
        {address ? (
          <div className="max-w-7xl mx-auto pt-10 px-6 pb-10">
            <div className="container mx-auto px-4">
              <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-8">
                {propertyDetails
                  .filter((result) => result[3].includes(search))
                  .map((result) => (
                    <div
                      key={result[1]}
                      className="bg-white rounded-lg shadow-lg shadow-blue-200/50 p-8 hover:scale-95 transition-all duration-300"
                    >
                      <div className="relative overflow-hidden">
                        <img
                          className="object-cover w-full h-37 sm:h-52"
                          src={result[7]}
                          alt="Product"
                        />
                        <div className="absolute inset-0 bg-black opacity-40"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Link to={"/property/" + parseInt(result[1])}>
                            <button className="bg-white text-neutral-700 py-2 px-6 rounded-full font-bold hover:bg-blue-300">
                              View Details
                            </button>
                          </Link>
                        
                        </div>
                      </div>
                      <h3 className="text-xl font-semibold text-neutral-700 mt-4">
                        {result[2]}
                      </h3>
                      <div className="mt-2">
                        <span className="font-semibold  text-sm text-neutral-700">
                          Owner
                        </span>
          
                          
                        <p className="text-gray-500 text-sm mt-2 break-words">
                          {result[0]}
                        </p>
                      </div>
                      <div className="mt-2">
                        <span className="font-semibold  text-sm text-neutral-700">
                          Category
                        </span>
                        <p className="text-gray-500 text-sm mt-2 break-words">
                          {result[3]}
                        </p>
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <span className="text-neutral-700 font-bold text-lg">
                          {result[5]}
                        </span>
                        <span className="text-neutral-700 font-bold text-lg">
                          {parseInt(result[8]) + " ETH"}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        ) : (
          <Modal />
        )}
        {address && <Footer />}
      </div>
    </>
  );
}

export default Home;
