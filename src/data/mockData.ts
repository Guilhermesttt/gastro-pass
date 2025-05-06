
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
}

export const getMockRestaurants = (): Restaurant[] => {
  return [
    {
      id: '1',
      name: 'La Tratoria',
      image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80',
      category: 'Italiana • $$',
      location: 'Centro',
      rating: 4.8,
      discount: '15% OFF',
      description: 'Restaurante italiano autêntico com ambiente aconchegante. Massas artesanais e ingredientes importados da Itália.',
      address: 'Rua Augusta, 1200 - Centro',
      phone: '(11) 3456-7890',
      hours: 'Ter-Dom: 12h às 23h'
    },
    {
      id: '2',
      name: 'Sushi Kenzo',
      image: 'https://images.unsplash.com/photo-1553621042-f6e147245754?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80',
      category: 'Japonesa • $$$',
      location: 'Jardins',
      rating: 4.9,
      discount: '10% OFF',
      description: 'Culinária japonesa de alto padrão com ingredientes frescos importados diretamente do Japão. Chef premiado.',
      address: 'Al. Santos, 1500 - Jardins',
      phone: '(11) 3333-4444',
      hours: 'Seg-Sáb: 11h30 às 15h, 19h às 23h'
    },
    {
      id: '3',
      name: 'Burger House',
      image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1071&q=80',
      category: 'Hamburgeria • $$',
      location: 'Pinheiros',
      rating: 4.6,
      discount: '20% OFF',
      description: 'Hambúrgueres artesanais com ingredientes premium. Carnes maturadas e pães feitos diariamente.',
      address: 'Rua dos Pinheiros, 320',
      phone: '(11) 3030-2020',
      hours: 'Todos os dias: 12h às 23h'
    },
    {
      id: '4',
      name: 'Sabor Brasileiro',
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1469&q=80',
      category: 'Brasileira • $$',
      location: 'Vila Mariana',
      rating: 4.7,
      discount: 'Sobremesa Grátis',
      description: 'Comida brasileira tradicional com receitas de família. Feijoada aos sábados e música ao vivo.',
      address: 'Rua Vergueiro, 1500 - Vila Mariana',
      phone: '(11) 2525-3636',
      hours: 'Ter-Dom: 11h30 às 15h30, 18h30 às 22h30'
    },
    {
      id: '5',
      name: 'Taco Libre',
      image: 'https://images.unsplash.com/photo-1613514785940-daed07799d9b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80',
      category: 'Mexicana • $$',
      location: 'Itaim',
      rating: 4.5,
      discount: '15% OFF',
      description: 'Autêntica comida mexicana com receitas tradicionais. Ambiente descontraído e margaritas artesanais.',
      address: 'Rua João Cachoeira, 300 - Itaim Bibi',
      phone: '(11) 4848-5959',
      hours: 'Seg-Sáb: 12h às 15h, 19h às 23h'
    },
    {
      id: '6',
      name: 'Le Bistro',
      image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
      category: 'Francesa • $$$',
      location: 'Higienópolis',
      rating: 4.8,
      discount: 'Taça de Vinho Grátis',
      description: 'Bistrô francês elegante com menu sazonal e carta de vinhos premiada. Pratos clássicos da culinária francesa.',
      address: 'Av. Higienópolis, 618',
      phone: '(11) 3030-4040',
      hours: 'Ter-Dom: 19h às 23h30'
    },
    {
      id: '7',
      name: 'Green Life',
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
      category: 'Vegetariana • $$',
      location: 'Moema',
      rating: 4.6,
      discount: '10% OFF',
      description: 'Restaurante vegetariano com opções veganas e sem glúten. Ingredientes orgânicos e de produtores locais.',
      address: 'Av. Lavandisca, 717 - Moema',
      phone: '(11) 5151-6262',
      hours: 'Todos os dias: 11h às 22h'
    },
    {
      id: '8',
      name: 'Pizza Nova',
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
      category: 'Pizzaria • $$',
      location: 'Perdizes',
      rating: 4.5,
      discount: '30% na Segunda Pizza',
      description: 'Pizzaria artesanal com forno a lenha. Mais de 40 sabores de pizzas, incluindo opções vegetarianas e veganas.',
      address: 'Rua Apinajés, 1200 - Perdizes',
      phone: '(11) 3636-7777',
      hours: 'Ter-Dom: 18h às 23h30'
    },
    {
      id: '9',
      name: 'Aroma do Mar',
      image: 'https://images.unsplash.com/photo-1579631542720-3a87824fff86?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80',
      category: 'Frutos do Mar • $$$',
      location: 'Santana',
      rating: 4.7,
      discount: '15% OFF',
      description: 'Especializado em frutos do mar frescos. Ambiente sofisticado e carta de vinhos exclusiva.',
      address: 'Av. Braz Leme, 2020 - Santana',
      phone: '(11) 2121-3434',
      hours: 'Ter-Dom: 12h às 16h, 19h às 23h'
    },
    {
      id: '10',
      name: 'Café Culture',
      image: 'https://images.unsplash.com/photo-1445116572660-236099ec97a0?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80',
      category: 'Café • $',
      location: 'Vila Madalena',
      rating: 4.4,
      discount: 'Café do dia Grátis',
      description: 'Café descolado com grãos selecionados e torrados artesanalmente. Opções de brunch e sobremesas caseiras.',
      address: 'Rua Aspicuelta, 300 - Vila Madalena',
      phone: '(11) 4040-5050',
      hours: 'Seg-Sáb: 8h às 20h, Dom: 9h às 19h'
    },
    {
      id: '11',
      name: 'Thai Palace',
      image: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
      category: 'Tailandesa • $$',
      location: 'Consolação',
      rating: 4.5,
      discount: '20% OFF',
      description: 'Autêntica culinária tailandesa com ingredientes importados. Ambiente decorado no estilo oriental.',
      address: 'Rua da Consolação, 3456',
      phone: '(11) 2222-3333',
      hours: 'Seg-Sáb: 11h30 às 14h30, 19h às 22h30'
    },
    {
      id: '12',
      name: 'Alma Portenha',
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1081&q=80',
      category: 'Argentina • $$$',
      location: 'Brooklin',
      rating: 4.8,
      discount: '10% OFF',
      description: 'Típico restaurante argentino especializado em carnes grelhadas. Ambiente rústico e aconchegante.',
      address: 'Rua Joaquim Floriano, 400 - Brooklin',
      phone: '(11) 5050-6060',
      hours: 'Ter-Dom: 12h às 15h, 19h às 23h'
    }
  ];
};
