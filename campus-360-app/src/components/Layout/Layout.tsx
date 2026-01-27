import React from 'react';

const Navbar = () => (
  <nav className="bg-gray-800 text-white p-4">
    {/* Navbar content will go here */}
    <p>Navbar</p>
  </nav>
);

const Footer = () => (
  <footer className="bg-gray-800 text-white p-4 mt-8">
    {/* Footer content will go here */}
    <p>Footer</p>
  </footer>
);

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
      <Footer />
    </div>
  );
};
