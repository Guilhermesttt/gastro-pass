
import { Star } from "lucide-react";

interface RestaurantCardProps {
  id: string;
  name: string;
  image: string;
  category: string;
  location: string;
  rating: number;
  discount: string;
  onClick: () => void;
}

const RestaurantCard = ({
  id,
  name,
  image,
  category,
  location,
  rating,
  discount,
  onClick,
}: RestaurantCardProps) => {
  return (
    <div 
      className="card group cursor-pointer overflow-hidden"
      onClick={onClick}
    >
      <div className="relative mb-4 overflow-hidden rounded-lg">
        <div className="absolute top-0 right-0 bg-secondary text-black font-medium px-3 py-1 z-10 rounded-bl-lg">
          {discount}
        </div>
        <img
          src={image}
          alt={name}
          className="w-full h-48 object-cover rounded-lg transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      
      <div>
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg">{name}</h3>
          <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded text-sm">
            <Star size={14} className="fill-yellow-500 text-yellow-500" />
            <span className="font-medium">{rating.toFixed(1)}</span>
          </div>
        </div>
        
        <div className="text-sm text-text">
          <p className="mb-1">{category}</p>
          <p>{location}</p>
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;
