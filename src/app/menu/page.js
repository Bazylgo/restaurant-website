import React from 'react';
import Link from 'next/link';

const menuItems = [
{
  name: 'Spaghetti Bolognese',
  description: 'Classic Italian pasta with rich meat sauce, served with parmesan.',
  price: '$15.99',
  slug: 'spaghetti-bolognese',
},
{
  name: 'Grilled Salmon',
  description: 'Fresh salmon grilled to perfection, served with seasonal vegetables.',
  price: '$19.99',
  slug: 'grilled-salmon',
},
{
  name: 'Margherita Pizza',
  description: 'Wood-fired pizza with fresh mozzarella, basil, and a tomato sauce base.',
  price: '$12.99',
  slug: 'margherita-pizza',
},
{
  name: 'Caesar Salad',
  description: 'Crisp romaine lettuce with homemade Caesar dressing, croutons, and parmesan.',
  price: '$9.99',
  slug: 'caesar-salad',
},
{
  name: 'Tiramisu',
  description: 'Classic Italian dessert with coffee-soaked ladyfingers and mascarpone cream.',
  price: '$7.99',
  slug: 'tiramisu',
},
];

const MenuPage = () => {
  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-center mb-10 text-gray-800">Our Menu</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {menuItems.map((item, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300 ease-in-out">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              <Link href={`/menu/${item.slug}`} className="text-blue-600">{item.name}</Link>
            </h2>
            <p className="text-gray-600 mb-4">{item.description}</p>
            <p className="text-lg font-semibold text-gray-800">{item.price}</p>
            <p className="text-gray-600 mb-4">Click on the dish&apos;s name for more details.</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuPage;
