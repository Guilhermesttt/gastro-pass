
import { MapPin, Star } from "lucide-react";

interface RestaurantCardProps {
  id: string;
  name: string;
  image: string;
  category: string;
  location: string;
  rating: number;
  discount: string;
  address?: string;
  onClick: () => void;
}

const RestaurantCard = ({
  id,
  name,
  image,
  category,
  location,
  address,
  rating,
  discount,
  onClick,
}: RestaurantCardProps) => {
  return (
    <div 
      className="group cursor-pointer overflow-hidden bg-card rounded-xl shadow-custom border border-border/10 hover:shadow-lg transition-all duration-300"
      onClick={onClick}
    >
      <div className="relative overflow-hidden">
        <div className="absolute top-3 right-3 bg-secondary text-foreground font-medium px-3 py-1 z-10 rounded-md text-sm">
          {discount}
        </div>
        <img
          src={image}
          alt={name}
          className="w-full h-52 object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg text-foreground">{name}</h3>
          <div className="flex items-center gap-1 bg-background px-2 py-1 rounded text-sm">
            <Star size={14} className="fill-primary text-primary" />
            <span className="font-medium">{rating.toFixed(1)}</span>
          </div>
        </div>
        
        <div className="text-sm text-muted-foreground">
          <p className="mb-1">{category}</p>
          <div className="flex items-center gap-1">
            <MapPin size={14} className="text-primary/70" />
            <p>{address || location}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;
