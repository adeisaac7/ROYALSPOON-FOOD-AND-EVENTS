"use client"
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faMapMarkedAlt, faPhone } from '@fortawesome/free-solid-svg-icons';
import { faFacebook, faInstagram } from '@fortawesome/free-brands-svg-icons';
import Image from 'next/image';
import GlobalApi from '@/app/_utils/GlobalApi';

const EventsPage = () => {
  const [eventHero, setEventHero] = useState([]);
  const [eventServices, setEventServices] = useState([]);
  const [eventGallery, setEventGallery] = useState([]);

  useEffect(() => {
    fetchEventData();
  }, []);

  const fetchEventData = async () => {
    const heroData = await GlobalApi.GetEventHero();
    const servicesData = await GlobalApi.GetEventServices();
    const galleryData = await GlobalApi.GetEventsGallery();

    setEventHero(heroData.eventGalleries);
    setEventServices(servicesData.eventServices);
    setEventGallery(galleryData.eventGalleries);
  };

  return (
    <div className="bg-gray-50 text-gray-900 font-poppins">
      {/* Hero Section */}
      <section
        className="relative w-full h-screen flex items-center justify-center bg-cover bg-center text-white"
        // style={{ backgroundImage: `url(${eventHero[0]?.image?.url || '/default-hero.jpg'})` }}
      >
        <div className="bg-black bg-opacity-60 p-8 text-center rounded-lg">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-wide">
            Exquisite Events, Exceptional Catering
          </h1>
          <p className="mt-4 text-xl md:text-2xl">
            Bringing elegance and flavor to your special occasions.
          </p>
          <p className="mt-6 text-lg md:text-xl">
            For orders: contact +234-704-459-8881
          </p>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-12 px-8 md:px-20">
        <h2 className="text-4xl font-bold text-center mb-8">
          Our Event Services
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
          {eventServices.map((service, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition transform hover:scale-105"
            >
              <Image
                src={service.image.url}
                alt={service.title || "Service image"}
                width={500}
                height={300}
                className="w-full h-56 object-cover rounded-md"
              />
              <h3 className="text-2xl font-semibold mt-6">{service.title}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-16 bg-gray-200 px-8 md:px-20">
        <h2 className="text-4xl font-bold text-center mb-8">Event Gallery</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {eventGallery.map((gallery, index) => (
            <Image
              key={index}
              src={gallery.image.url}
              alt={`Event ${index + 1}`}
              width={500}
              height={300}
              className="w-full h-56 object-cover rounded-md hover:scale-105 transition"
            />
          ))}
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 text-center bg-gray-800 text-white">
        <h2 className="text-4xl font-bold mb-6">Contact Us</h2>
        <p className="text-lg">
          <FontAwesomeIcon icon={faMapMarkedAlt} className='mr-2'/>
          Address: Suite 20, New Abba father complex, Opp. Dove executive chalet, Redemption camp, Ogun State, Nigeria
        </p>
        <p className="text-lg mt-2">
        <FontAwesomeIcon icon={faEnvelope} className='mr-2'/>
        royalspoonfoods4@gmail.com</p>
        <p className="text-lg mt-2">
          <FontAwesomeIcon icon={faPhone} className='mr-2' />
         +234-704-459-8881</p>
        <div className="flex justify-center mt-4 space-x-4">
          <a
            href="https://www.facebook.com/p/Royalspoon-foods-and-events-100063686852954/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-700"
          >
            <FontAwesomeIcon icon={faFacebook} size='2x'/>
          </a>
          <a
            href="https://www.instagram.com/royalspoon_foods_events/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-pink-500 hover:text-pink-700"
          >
            <FontAwesomeIcon icon={faInstagram} size='2x'/>
          </a>
        </div>
      </section>
    </div>
  );
};

export default EventsPage;