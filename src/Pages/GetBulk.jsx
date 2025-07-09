import React, { useState } from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import { FaThumbsUp, FaShippingFast, FaRecycle } from 'react-icons/fa';
import { MdPrint } from 'react-icons/md';
import { LuBrush } from 'react-icons/lu';
const GetBulk = () => {
 const features = [
  {
    icon: <FaThumbsUp className="text-3xl text-[#E5C870]" />,
    title: 'Certified Inks',
    desc: 'T-Shirts printed by OEKO-TEX certified inks',
  },
  {
    icon: <MdPrint className="text-3xl text-[#E5C870]" />,
    title: 'Print Technology',
    desc: (
      <>
        10+ advanced{' '}
        <span className="text-orange-400 font-semibold">printing techniques</span> to choose
      </>
    ),
  },
  {
    icon: <FaShippingFast className="text-3xl text-[#E5C870]" />,
    title: 'Fast Delivery',
    desc: 'Get custom t-shirts delivered in 7 days',
  },
  {
    icon: <LuBrush className="text-3xl text-[#E5C870]" />,
    title: 'Design Support',
    desc: 'We will help you create the perfect design.',
  },
  {
    icon: <FaRecycle className="text-3xl text-[#E5C870]" />,
    title: 'Eco-Friendly',
    desc: 'Eco-friendly mailers are used for shipping',
  },
];
    const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', form);
    // Add your form submission logic here
  };

  const whatsappLink = `https://wa.me/919999999999?text=Hi, I am interested in bulk custom t-shirt printing.`; // Replace number


  return (
    <>
    <div className="mt-10 flex flex-col items-center justify-center px-4 py-10 ">
      <h1 className="text-3xl md:text-4xl font-bold text-center text-white mb-2">
        Get Bulk Custom T-Shirt Printing Quote
      </h1>
      <p className="text-center text-gray-50 mb-8">
        Fill out the form below, and we’ll get back to you with all the details quickly and hassle-free!
      </p>

      <form
        onSubmit={handleSubmit}
        className="bg-[#E5C870] rounded-2xl shadow-md p-6 md:p-10 max-w-5xl w-full space-y-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Your name"
            className="border rounded-md px-4 py-2 w-full"
            required
          />
          <div className="flex border rounded-md overflow-hidden">
            <span className="px-3 flex items-center bg-gray-100 border-r">🇮🇳</span>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Your contact number"
              className="px-4 py-2 w-full outline-none"
              required
            />
          </div>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Your email"
            className="border rounded-md px-4 py-2 w-full"
            required
          />
        </div>

        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          placeholder="Write your requirements..."
          rows={4}
          className="w-full border rounded-md px-4 py-2"
        ></textarea>

        <div className="flex items-center gap-4 mt-2">
          <button
            type="submit"
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-md font-semibold"
          >
            Submit
          </button>

          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text- bg-green-600  px-2 py-2   rounded-lg  font-semibold"
          >
            
            Contact us  <FaWhatsapp className="text-xl" />
          </a>
        </div>
      </form>
    </div>

  <section className="py-14 px-4 md:px-10 lg:px-20 text-center ">
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
        Why Choose Us?
      </h2>
      <p className="text-white mb-10">
        Printing and Fulfilling Custom T Shirt orders from 2011,
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 text-center">
        {features.map((feature, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center space-y-3 bg-[#0f0f0f] p-6 rounded-xl shadow-lg hover:scale-105 transition-transform duration-300"
          >
            {feature.icon}
            <h3 className="text-[#E5C870] font-semibold text-lg">{feature.title}</h3>
            <p className="text-sm text-white max-w-[200px]">{feature.desc}</p>
          </div>
        ))}
      </div>
    </section>
    

    </>
  )
}

export default GetBulk