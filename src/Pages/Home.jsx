import React,{useEffect} from 'react'
import SectionHome1 from '../Components/SectionHome1.jsx'
import SectionHome2 from '../Components/SectionHome2.jsx'
import SectionHome3 from '../Components/SectionHome3.jsx'
import axios from 'axios'
import { usePriceContext } from '../ContextAPI/PriceContext.jsx'


const continentMapping = {
  "IN": "Asia",
  "US": "North America",
  "GB": "Europe",
  "AU": "Australia",
  // Add more country codes and their continents as needed
};

const Home = () => {
 const { toConvert, priceIncrease ,setLocation } = usePriceContext();
      useEffect(() => {
    // Fetch location details from ip-api API using Axios
    axios.get('http://ip-api.com/json')
      .then((response) => {
        const data = response.data;
        const continent = continentMapping[data.countryCode] || 'Not available';
        
        setLocation(continent);
      })
      .catch((error) => {
        console.log(error.message);
      });
  }, []);

  return (
    <div className='h-full bg-[#0A0A0A] w-full  '>
        <SectionHome1/>
        < SectionHome2/>
        <SectionHome3/>
   

       
      

    </div>
  )
}

export default Home