'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation'; // Import useRouter

const menuItems = [
  {
    name: 'Spaghetti Bolognese',
    description: 'Classic Italian pasta with rich meat sauce, served with parmesan.',
    price: '$15.99',
    slug: 'spaghetti-bolognese',
    image: '/spaghetti-bolognese_menu_page.jpg',
  },
  {
    name: 'Grilled Salmon',
    description: 'Fresh salmon grilled to perfection, served with seasonal vegetables.',
    price: '$19.99',
    slug: 'grilled-salmon',
    image: '/grilled-salmon_menu_page.jpg',
  },
  {
    name: 'Margherita Pizza',
    description: 'Wood-fired pizza with fresh mozzarella, basil, and a tomato sauce base.',
    price: '$12.99',
    slug: 'margherita-pizza',
    image: '/margherita-pizza_menu_page.jpg',
  },
  {
    name: 'Caesar Salad',
    description: 'Crisp romaine lettuce with homemade Caesar dressing, croutons, and parmesan.',
    price: '$9.99',
    slug: 'caesar-salad',
    image: '/caesar-salad_menu_page.jpg',
  },
  {
    name: 'Tiramisu',
    description: 'Classic Italian dessert with coffee-soaked ladyfingers and mascarpone cream.',
    price: '$7.99',
    slug: 'tiramisu',
    image: '/tiramisu_menu_page.jpg',
  },
];

const MenuPage = () => {
  const router = useRouter(); // Initialize useRouter

  const handleItemClick = (slug) => {
    router.push(`/menu/${slug}`); // Programmatically navigate
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4">
          Our Delicious <span className="text-orange-600 italic">Menu</span>
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Discover the menu of RestoVibe!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
        {menuItems.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition duration-300 ease-in-out cursor-pointer" // Added cursor-pointer
            onClick={() => handleItemClick(item.slug)} // Added onClick handler
          >
            <div className="relative h-48 md:h-56">
              <Image
                src={item.image}
                alt={item.name}
                layout="fill"
                objectFit="cover"
                className="rounded-t-xl"
              />
            </div>
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                {item.name} {/* Removed Link from the title */}
              </h2>
              <p className="text-gray-700 text-sm mb-3 line-clamp-2">{item.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-orange-600">{item.price}</span>
                {/* Removed the "View Details" Link */}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuPage;