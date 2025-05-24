import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-200 text-center p-4 mt-auto">
      <p className="text-gray-700">&copy; {new Date().getFullYear()} SolarApp. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
