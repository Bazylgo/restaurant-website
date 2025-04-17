'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function MenuItemDetails({ item, imageSrc }) {
  return (
    <div className="bg-white shadow-xl rounded-2xl w-full max-w-lg overflow-hidden border border-gray-200">
      {/* Top Section */}
      <div className="relative h-64">
        <Image
          src={imageSrc}
          alt={item.name}
          layout="fill"
          objectFit="cover"
          className="rounded-t-2xl"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = "/placeholder-food.jpg";
          }}
        />
      </div>

      {/* Bottom Section */}
      <div className="p-8 flex flex-col space-y-4">
        {/* Title and Price */}
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-3xl font-bold text-gray-800">{item.name}</h1>
          <span className="text-2xl font-semibold text-orange-600">{item.price}</span>
        </div>

        {/* Description */}
        <p className="text-gray-700 leading-relaxed mb-4">{item.description}</p>

        {/* Details */}
        {item.details && item.details.length > 0 && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Details</h3>
            <ul className="list-disc list-inside text-gray-600">
              {item.details.map((detail, index) => (
                <li key={index}>{detail}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Recommendations */}
        {item.recommendations && item.recommendations.length > 0 && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">We Recommend</h3>
            <ul className="list-disc list-inside text-orange-500">
              {item.recommendations.map((recommendation, index) => (
                <li key={index}>{recommendation}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Back to Menu Button */}
        <div className="mt-6">
          <Link
            href="/menu"
            className="inline-block bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-8 rounded-full transition duration-300 shadow-md"
          >
            Back to Menu
          </Link>
        </div>
      </div>
    </div>
  );
}