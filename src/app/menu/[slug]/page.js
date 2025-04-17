import { notFound } from 'next/navigation';
import Image from 'next/image';

const menuItems = {
  'spaghetti-bolognese': {
    name: 'Spaghetti Bolognese',
    description: 'Classic Italian pasta with rich meat sauce, served with parmesan.',
    price: '$15.99',
  },
  'grilled-salmon': {
    name: 'Grilled Salmon',
    description: 'Fresh salmon grilled to perfection, served with seasonal vegetables.',
    price: '$19.99',
  },
  'margherita-pizza': {
    name: 'Margherita Pizza',
    description: 'Wood-fired pizza with fresh mozzarella, basil, and a tomato sauce base.',
    price: '$12.99',
  },
  'caesar-salad': {
    name: 'Caesar Salad',
    description: 'Crisp romaine lettuce with homemade Caesar dressing, croutons, and parmesan.',
    price: '$9.99',
  },
  'tiramisu': {
    name: 'Tiramisu',
    description: 'Classic Italian dessert with coffee-soaked ladyfingers and mascarpone cream.',
    price: '$7.99',
  },
};

export async function generateStaticParams() {
  return Object.keys(menuItems).map((slug) => ({ slug }));
}

// ✅ Page Component
export default async function MenuItemPage({ params }) {
  const { slug } = await params
  const item = menuItems[slug];

  if (!item) {
    notFound(); // Redirect to 404 if not found
  }

const imageSlug = item.name.toLowerCase().replace(/\s+/g, '-');
const imageSrc = `/${imageSlug}_menu_page.jpg`;

  return (
    <div className="min-h-screen bg-gray-100 py-16 px-4 flex items-center justify-center">
      <div className="bg-white shadow-2xl rounded-3xl w-[100%] max-w-xl overflow-hidden border border-gray-200">
        {/* Image Section */}
        <div className="relative w-full flex justify-center items-center">
          <Image
            src={imageSrc}
            alt={item.name}
            width={0} // Dynamic width
            height={0} // Dynamic height
            sizes="(max-width: 768px) 100vw, 50vw" // Makes image responsive
            className="object-contain w-[60%] h-auto transform scale-75" // Shrinks image by 40% (scale-75)
            priority
          />
        </div>

        {/* Content Section */}
        <div className="p-6 flex flex-col justify-center items-center text-center">
          <h1 className="text-4xl font-extrabold text-gray-800 mb-6">{item.name}</h1>
          <p className="text-xl text-gray-600 mb-4">{item.description}</p>
          <p className="text-2xl font-semibold text-blue-700">{item.price}</p>

          <div className="text-center">
            <a
              href="/menu"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-full transition duration-300"
            >
              ← Back to Menu
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
