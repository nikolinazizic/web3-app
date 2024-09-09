import { useState } from "react"; 
import axios from "axios"; 
import Select from "react-select"; 

export default function Header() {
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState([]);
  const [topicValue, setTopicValue] = useState("");

  const valueOptions = [
    { value: "0xf78be3c6305ed1d283f13636ed7ad55fea081be8d7083f165b2ad514df8cadd3", label: "PropertyRegistered" },
    { value: "0x15b6fe3b8618cc52a5f1328db05504f83c78853fad85be573bbee8e1a5deb921", label: "PropertyOwnershipTransferred" },
    { value: "0x8aa4fa52648a6d15edce8a179c792c86f3719d0cc3c572cf90f91948f0f2cb68", label: "PriceChanged" },
  ];

  const customStyles = {
    option: (provided) => ({
     ...provided,
      color: "#000000",
      backgroundColor: "#ffffff",
      borderColor: "#00c3f8",
    }),
  };

  const changeHandler = (selectedOption) => {
    setTopicValue(selectedOption);
  };

  const handleSubmit = async () => {
    const address = "0xb6A45FcDb88fa1218fc39851564857deFA6Ed6F3";
    const topic0 = topicValue.value;
    const chain = "0xaa36a7";

    try {
      const response = await axios.get(`http://localhost:5001/getlogs`, {
        params: { address, chain, topic0 },
      });
      console.log(response.data);
      setResult(response.data.result);
      setShowResult(true);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <section>
      <h2 className='text-4xl font-semibold mb-4 text-center'>Historical Transactions of Properties</h2>
      <form className="max-w-sm mx-auto">
        <label htmlFor="inputField" className="block mb-2 text-sm font-medium ml-1 text-white">Choose an Event</label>
        <Select className="text-neutral-600" 
                options={valueOptions}
                value={topicValue}
                instanceId="long-value-select"
                onChange={changeHandler}
        />
      </form>
      <div className="max-w-sm mx-auto">
        <button className="w-28 text-lg bg-blue-400 hover:bg-blue-600 py-2 px-4 rounded-full cursor-pointer focus:bg-neutral-400 mt-2" onClick={handleSubmit}>Search</button>
      </div>
      
      <div className="container mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-20">
          {showResult && result.map((log, i) => {
            const propertyId = parseInt(log.topic1, 16);
            return (
              <div key={i} className="bg-white rounded-lg shadow-lg shadow-blue-200/50 p-8 hover:scale-95 transition-all duration-300">
                <p className="break-words text-wrap mb-0 font-semibold text-gray-800 hover:text-black sm:mb-1.5 sm:text-l">Transaction Hash: {log.transaction_hash}</p>
                <p className="text-sm leading-normal text-gray-600">Date: <span className="text-blue-600">{log.block_timestamp.split("T", 1)[0]}</span></p>
                <p className="text-sm leading-normal text-gray-600">Block Number: {log.block_number}</p>
                <p className="break-words text-sm leading-normal text-gray-600">Address: <span className="text-blue-500">{log.address}</span></p>
                <p className="break-words text-sm leading-normal text-gray-600">Property ID: <span className="text-blue-500">{propertyId}</span></p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
