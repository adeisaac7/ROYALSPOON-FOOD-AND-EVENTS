import React from 'react';

function AboutSection({ restaurant }) {
  return (
    <div className="mt-5 p-8 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
      <p className="text-gray-700 leading-relaxed mb-8 text-lg font-light">
        {restaurant.aboutUs}
      </p>

      <h2 className="text-3xl font-semibold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
        Working Hours
      </h2>
      <p className="text-gray-700 mb-8 text-lg font-light">
        {restaurant.workingHours}
      </p>

      <h2 className="text-3xl font-semibold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
        Contact Us
      </h2>
      <p className="text-gray-700 mb-4 text-lg font-light">
        Phone: <span className="font-medium">+234-704-459-8881</span>
      </p>
      <p className="text-gray-700 text-lg font-light">
        Email: <span className="font-medium">royalspoonfoods4@gmail.com</span>
      </p>
    </div>
  );
}

export default AboutSection;