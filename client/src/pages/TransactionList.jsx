import React, { useState, useEffect } from 'react';
import { Alchemy, Network } from 'alchemy-sdk';
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function getEventName(eventId) {
  const eventNames = {
    '0xf78be3c6305ed1d283f13636ed7ad55fea081be8d7083f165b2ad514df8cadd3': 'PropertyRegistered',
    '0x15b6fe3b8618cc52a5f1328db05504f83c78853fad85be573bbee8e1a5deb921': 'PropertyOwnershipTransferred',
    '0x8aa4fa52648a6d15edce8a179c792c86f3719d0cc3c572cf90f91948f0f2cb68': 'PriceChanged',
  };
  return eventNames[eventId] || 'UnknownEvent';
}

function TransactionList() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchEvents = async () => {
      const config = {
        apiKey: 'Ln_N9nopsQWhEiuPukqD2lCfJDcKRzqU',
        network: Network.ETH_SEPOLIA,
      };
      const alchemy = new Alchemy(config);

      try {
        const contractAddress = '0xb6A45FcDb88fa1218fc39851564857deFA6Ed6F3';
        const fromBlock = '0x0';
        const toBlock = 'latest';

        const logs = await alchemy.core.getLogs({
          address: contractAddress,
          fromBlock: fromBlock,
          toBlock: toBlock,
        });

        const detailedEvents = [];

        for (const log of logs) {
          try {
            const transaction = await alchemy.core.getTransaction(log.transactionHash);
            const block = await alchemy.core.getBlock(log.blockNumber);

            const propId = log.topics[1];
            const eventName = getEventName(log.topics[0]);

            const detailedEvent = {
             ...log,
              transactionHash: log.transactionHash,
              eventName: eventName,
              from: transaction.from,
              to: transaction.to,
              date: new Date(block.timestamp * 1000).toLocaleString(),
              blockNumber: log.blockNumber,
              propId: propId,
            };
            detailedEvents.push(detailedEvent);
          } catch (error) {
            console.error('Error fetching transaction or block details:', error);
          }
        }

        setEvents(detailedEvents.filter(event => parseInt(event.propId, 16) === parseInt(id, 10)));
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchEvents();
  }, [id]);

  if (loading) 
    return (
      <div className="fixed inset-0 flex items-center justify-center">
  <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-secondary motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
  </div>
</div>

    );
  if (error) return <p>Error: {error}</p>;

  return (
    <>
    <Navbar/>
    <div className="max-w-7xl mx-auto pt-10 px-6 pb-10">
    <div className="p-4 sm:p-8 md:p-16 mt-20">
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold mb-4">Transactions of property with ID: {events.length > 0? parseInt(events[0].propId, 16) : ''}</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {events.map((event, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg shadow-blue-200/50 p-8 hover:scale-95 transition-all duration-300">
              <p className="break-words text-wrap mb-0 font-semibold text-gray-800 hover:text-black sm:mb-1.5 sm:text-l">
                Transaction Hash: {event.transactionHash}
              </p>
              <p className="text-sm leading-normal text-gray-600">Event Name: <span className="text-blue-600">{event.eventName}</span></p>
              <p className="text-sm leading-normal text-gray-600">Block Number: {event.blockNumber}</p>
              <p className="break-words text-sm leading-normal text-gray-600">From: <span className="text-blue-500">{event.from}</span></p>
              <p className="break-words text-sm leading-normal text-gray-600">To: <span className="text-blue-500">{event.to}</span></p>
              <p className="text-sm leading-normal text-gray-600">Date: {event.date}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
    <Footer />
    </div>
    </>
  );
}

export default TransactionList;
