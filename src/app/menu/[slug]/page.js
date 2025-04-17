import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import MenuItemDetails from './MenuItemDetails'; // Import the Client Component

const menuItems = {
  'spaghetti-bolognese': {
    name: 'Spaghetti Bolognese',
    description: 'Classic Italian pasta with rich meat sauce, slow-cooked with ground beef, tomatoes, herbs, and a touch of red wine. Served with freshly grated Parmesan cheese.',
    price: '$15.99',
    details: [
      'Handmade spaghetti pasta',
      'Rich and savory meat ragu',
      'Imported Italian tomatoes',
      'Fresh herbs and spices',
      'Grated Parmesan cheese',
      'Allergens: Gluten, Dairy',
    ],
    recommendations: ['Pair with a glass of Chianti.', 'Add a side of garlic bread.'],
  },
  'grilled-salmon': {
    name: 'Grilled Salmon',
    description: 'Fresh Atlantic salmon fillet, expertly grilled to a flaky perfection. Served with a side of seasonal roasted vegetables and a lemon-dill sauce.',
    price: '$19.99',
    details: [
      'Fresh Atlantic salmon fillet',
      'Seasonal vegetables (asparagus, bell peppers, zucchini)',
      'Light and zesty lemon-dill sauce',
      'Grilled to order',
      'Healthy and flavorful',
      'Allergens: Fish',
    ],
    recommendations: ['Enjoy with a crisp Sauvignon Blanc.', 'Try our mashed potatoes as a side.'],
  },
  'margherita-pizza': {
    name: 'Margherita Pizza',
    description: 'Authentic wood-fired pizza with a thin and crispy crust, topped with San Marzano tomato sauce, fresh mozzarella, fragrant basil leaves, and a drizzle of extra virgin olive oil.',
    price: '$12.99',
    details: [
      'Hand-stretched thin crust',
      'San Marzano tomato sauce',
      'Fresh Italian mozzarella',
      'Fresh basil leaves',
      'Extra virgin olive oil',
      'Classic and simple',
      'Allergens: Gluten, Dairy',
    ],
    recommendations: ['Perfect with a cold beer.', 'Add a sprinkle of chili flakes for a kick.'],
  },
  'caesar-salad': {
    name: 'Caesar Salad',
    description: 'Crisp romaine lettuce tossed in our homemade creamy Caesar dressing, topped with crunchy garlic croutons, shaved Parmesan cheese, and a sprinkle of black pepper.',
    price: '$9.99',
    details: [
      'Fresh romaine lettuce',
      'Homemade Caesar dressing (contains anchovies)',
      'Garlic croutons',
      'Shaved Parmesan cheese',
      'Freshly ground black pepper',
      'Classic and refreshing',
      'Allergens: Gluten, Dairy, Fish',
    ],
    recommendations: ['Add grilled chicken or shrimp for a complete meal.', 'Extra dressing on the side is available.'],
  },
  'tiramisu': {
    name: 'Tiramisu',
    description: 'Traditional Italian dessert featuring delicate ladyfingers dipped in rich coffee, layered with creamy mascarpone cheese, and dusted with fine cocoa powder.',
    price: '$7.99',
    details: [
      'Coffee-soaked ladyfingers',
      'Sweetened mascarpone cream',
      'Espresso coffee',
      'Cocoa powder dusting',
      'Classic Italian sweet treat',
      'Allergens: Gluten, Dairy, Eggs',
    ],
    recommendations: ['Enjoy with a shot of espresso.', 'A perfect ending to any meal.'],
  },
};

export async function generateStaticParams() {
  return Object.keys(menuItems).map((slug) => ({ slug }));
}

export default async function MenuItemPage({ params }) {
  const { slug } = await params
  const item = menuItems[slug];

  if (!item) {
    notFound();
  }

  const imageSlug = item.name.toLowerCase().replace(/\s+/g, '-');
  const imageSrc = `/${imageSlug}_menu_page.jpg`;

  return (
    <div className="min-h-screen bg-gray-100 py-16 px-4 flex items-center justify-center">
      <MenuItemDetails item={item} imageSrc={imageSrc} />
    </div>
  );
}