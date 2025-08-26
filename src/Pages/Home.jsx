import React,{useEffect} from 'react'
import SectionHome1 from '../Components/SectionHome1.jsx'
import SectionHome2 from '../Components/SectionHome2.jsx'
import SectionHome3 from '../Components/SectionHome3.jsx'
import TrendingHome from '../Components/TrendingHome.jsx'

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
 const [banner, setBanner] = React.useState([]);
useEffect(() => {
  axios.get("https://ipapi.co/json/")
    .then((response) => {
      const data = response.data;
      
      setLocation(continentMapping[data?.country] || "Not available");
    })
    .catch((error) => {
      console.log(error.message);
      setLocation("Asia");
    });
    const pagebanner = async () => {
          try { 
            const res = await axios.get("https://duco-backend.onrender.com/api/strings");
           
            setBanner(res.data.storage);
          } catch (err) {
            console.error("Failed to fetch banner data:", err);
          }
        };
        pagebanner();
}, []);



  return (
    <div className='h-full bg-[#0A0A0A] w-full  '>
        <SectionHome1 imglink={banner[0]}/>
        < SectionHome2 />
          < TrendingHome/>
        <SectionHome3/>
   

       
      

    </div>
  )
}

export default Home