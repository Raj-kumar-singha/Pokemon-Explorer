import { Pokemon, PokemonDetail, PokemonListResponse } from '../types/pokemon';

const BASE_URL = 'https://pokeapi.co/api/v2';

export const fetchPokemonList = async (limit: number = 151): Promise<Pokemon[]> => {
  try {
    const response = await fetch(`${BASE_URL}/pokemon?limit=${limit}`);
    const data: PokemonListResponse = await response.json();
    
    return data.results.map((pokemon, index) => ({
      id: index + 1,
      name: pokemon.name,
      url: pokemon.url,
      image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${index + 1}.png`
    }));
  } catch (error) {
    console.error('Error fetching Pokemon list:', error);
    return [];
  }
};

export const fetchPokemonDetail = async (id: string): Promise<PokemonDetail | null> => {
  try {
    const response = await fetch(`${BASE_URL}/pokemon/${id}`);
    if (!response.ok) {
      throw new Error('Pokemon not found');
    }
    const data: PokemonDetail = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching Pokemon detail:', error);
    return null;
  }
}; 