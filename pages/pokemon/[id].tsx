import React from 'react';
import { GetStaticProps, GetStaticPaths } from 'next';
import Head from 'next/head';
import CustomImage from '../../components/CustomImage';
import Link from 'next/link';
import { PokemonDetail } from '../../types/pokemon';
import { fetchPokemonDetail } from '../../lib/api';
import TypeBadge from '../../components/TypeBadge';

interface PokemonDetailProps {
  pokemon: PokemonDetail | null;
}

const PokemonDetailPage: React.FC<PokemonDetailProps> = ({ pokemon }) => {
  if (!pokemon) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Pokemon not found</h1>
          <Link href="/" className="text-primary hover:underline">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const capitalizedName = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);

  return (
    <>
      <Head>
        <title>{capitalizedName} - Pokemon Explorer</title>
        <meta name="description" content={`Detailed information about ${capitalizedName}`} />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          {/* Back Button */}
          <Link href="/" className="inline-flex items-center text-primary hover:text-primary-dark mb-8">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Pokemon List
          </Link>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-primary to-secondary p-8 text-white">
              <div className="flex flex-col md:flex-row items-center">
                <div className="relative w-48 h-48 mb-6 md:mb-0 md:mr-8">
                  <CustomImage
                    src={pokemon.sprites.other['official-artwork'].front_default}
                    alt={pokemon.name}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <div>
                  <h1 className="text-4xl font-bold mb-2">{capitalizedName}</h1>
                  <p className="text-xl mb-4">#{pokemon.id.toString().padStart(3, '0')}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {pokemon.types.map(({ type }) => (
                      <TypeBadge key={type.name} type={type.name} />
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Height:</span> {pokemon.height / 10} m
                    </div>
                    <div>
                      <span className="font-medium">Weight:</span> {pokemon.weight / 10} kg
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Stats */}
                <div>
                  <h2 className="text-2xl font-bold mb-4 text-gray-800">Base Stats</h2>
                  <div className="space-y-4">
                    {pokemon.stats.map(({ stat, base_stat }) => (
                      <div key={stat.name}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium text-gray-700 capitalize">
                            {stat.name.replace('-', ' ')}
                          </span>
                          <span className="text-sm font-bold text-gray-900">{base_stat}</span>
                        </div>
                        <div className="stat-bar">
                          <div
                            className="stat-fill"
                            style={{ width: `${Math.min((base_stat / 255) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Abilities */}
                <div>
                  <h2 className="text-2xl font-bold mb-4 text-gray-800">Abilities</h2>
                  <div className="space-y-3">
                    {pokemon.abilities.map(({ ability, is_hidden }) => (
                      <div
                        key={ability.name}
                        className={`p-3 rounded-lg ${is_hidden ? 'bg-yellow-50 border border-yellow-200' : 'bg-gray-50'}`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-gray-800 capitalize">
                            {ability.name.replace('-', ' ')}
                          </span>
                          {is_hidden && (
                            <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded">
                              Hidden
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Moves */}
              <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Moves</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  {pokemon.moves.slice(0, 20).map(({ move }) => (
                    <div key={move.name} className="bg-gray-100 rounded-lg p-2 text-center">
                      <span className="text-sm text-gray-700 capitalize">
                        {move.name.replace('-', ' ')}
                      </span>
                    </div>
                  ))}
                </div>
                {pokemon.moves.length > 20 && (
                  <p className="text-sm text-gray-500 mt-2">
                    And {pokemon.moves.length - 20} more moves...
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  // Generate paths for first 151 Pokemon
  const paths = Array.from({ length: 151 }, (_, i) => ({
    params: { id: (i + 1).toString() },
  }));

  return {
    paths,
    fallback: 'blocking',
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const id = params?.id as string;
  const pokemon = await fetchPokemonDetail(id);

  if (!pokemon) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      pokemon,
    },
    revalidate: 86400, // Revalidate every 24 hours
  };
};

export default PokemonDetailPage; 