export interface Restaurant {
  id: string;
  name: string;
  image: string;
  category: string;
  location: string;
  rating: number;
  discount: string;
  description?: string;
  address?: string;
  phone?: string;
  hours?: string;
  estado?: string; // Estado brasileiro (UF)
}

export const getMockRestaurants = (): Restaurant[] => {
  return []; // Retorna uma lista vazia para que o admin seja responsável por cadastrar os restaurantes
};
