import React from 'react';
import Link from 'next/link';
import CustomImage from './CustomImage';
import { Pokemon } from '../types/pokemon';

interface PokemonCardProps {
  pokemon: Pokemon;
}

const PokemonCard: React.FC<PokemonCardProps> = ({ pokemon }) => {
  const capitalizedName = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);

  return (
    <Link href={`/pokemon/${pokemon.id}`}>
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 cursor-pointer transform hover:scale-105">
        <div className="flex flex-col items-center">
          <div className="relative w-24 h-24 mb-4">
            <CustomImage
              src={pokemon.image || '/placeholder-pokemon.png'}
              alt={pokemon.name}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            {capitalizedName}
          </h3>
          <p className="text-sm text-gray-500">#{pokemon.id.toString().padStart(3, '0')}</p>
        </div>
      </div>
    </Link>
  );
};

export default PokemonCard; 