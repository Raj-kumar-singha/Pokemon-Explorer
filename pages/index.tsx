import React, { useState, useEffect, useMemo } from 'react';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import { Pokemon } from '../types/pokemon';
import { fetchPokemonList } from '../lib/api';
import PokemonCard from '../components/PokemonCard';
import SearchBar from '../components/SearchBar';
import LoadingSpinner from '../components/LoadingSpinner';

interface HomeProps {
  pokemonList: Pokemon[];
}

const Home: React.FC<HomeProps> = ({ pokemonList }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const filteredPokemon = useMemo(() => {
    if (!searchTerm) return pokemonList;
    return pokemonList.filter(pokemon =>
      pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [pokemonList, searchTerm]);

  const handleSearchChange = (term: string) => {
    setIsLoading(true);
    setSearchTerm(term);
    // Simulate search delay
    setTimeout(() => setIsLoading(false), 300);
  };

  return (
    <>
      <Head>
        <title>Pokemon Explorer</title>
        <meta name="description" content="Explore and discover Pokemon with detailed information" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <header className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Pokemon Explorer
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover and explore the world of Pokemon with detailed information about each creature
            </p>
          </header>

          {/* Search Bar */}
          <SearchBar searchTerm={searchTerm} onSearchChange={handleSearchChange} />

          {/* Results Counter */}
          <div className="text-center mb-8">
            <p className="text-gray-600">
              {isLoading ? 'Searching...' : `Found ${filteredPokemon.length} Pokemon`}
            </p>
          </div>

          {/* Pokemon Grid */}
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {filteredPokemon.map((pokemon) => (
                <PokemonCard key={pokemon.id} pokemon={pokemon} />
              ))}
            </div>
          )}

          {/* No Results */}
          {!isLoading && filteredPokemon.length === 0 && searchTerm && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No Pokemon found matching "{searchTerm}"</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const pokemonList = await fetchPokemonList(151); // First generation Pokemon

  return {
    props: {
      pokemonList,
    },
    revalidate: 86400, // Revalidate every 24 hours
  };
};

export default Home;
