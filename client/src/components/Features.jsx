import React from 'react';

const Features = () => {
    const features=[
        {id: 1, title: "Robust protection", image: "src/assets/blockchain-pictures/feature1.jpg", link: "https://www.ibm.com/topics/blockchain-security" },
        {id: 2, title: "Clear transactions", image: "src/assets/blockchain-pictures/feature2.jpg", link: "https://www.ibm.com/blog/how-transparency-through-blockchain-helps-the-cybersecurity-community/" },
        {id: 3, title: "Decentralized autonomy", image: "src/assets/blockchain-pictures/feature3.jpg", link: "https://aws.amazon.com/blockchain/decentralization-in-blockchain/#:~:text=In%20a%20decentralized%20blockchain%20network,the%20members%20in%20the%20network." },

    ];
  return (
    <div className='px-4 lg:px-14 max-w-screen-2x1 mx-auto my-12 mt-20 border-t py-10 border-neutral-700'>
      <div className='text-center md:w-1/2 mx-auto '>
        <h2 className='text-4xl font-semibold mb-4'>
        Key Features of Blockchain Technology
        </h2>
        <p className='text-lg  text-neutral-400 mb-8 md:w-3/4 mx-auto'>Discover the essence of blockchain technology, featuring decentralization, security, and transparency.</p>
      </div>
      <div>
        <div className='grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-20 items-center justify-between'>
        {
            features.map(feature => <div key={feature.id} className='mx-auto relative cursor-pointer'>
                <img src={feature.image} alt="" className='hover:scale-95 transition-all duration-300 rounded-md border border-purple-300' />
                <div className='text-center px-4 py-8 bg-white text-neutral-700 shadow-lg rounded-md md:w-3/4 mx-auto absolute left-0 right-0 -bottom-12'>
                <h3 className='mb-3  font-semibold'>{feature.title}</h3>
                <div className='flex items-center justify-center gap-8 '>
                <a href={feature.link} target="_blank" rel="noopener noreferrer" className='font-bold text-blue-700 hover:text-blue-900'>
                    Explore{" "}
                    <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width="17"
                    height="11"
                    viewBox='0 0 17 11'
                    fill="none"
                    className='inline-block m1-2'
                    >
                        <path
                        d="M12 9.39905L15.2929 6.10615C15.6834 5.71563 15.6834 5.0824 15.2929 4.69194L12 1.39905M15 5.39905L1 5.39905"
                        stroke="#01122c"
                        />

                    </svg>
                </a>
                </div>
                </div>
                 </div>)
        }
        
      </div>
      
    </div>
    </div>
  );
}

export default Features;

