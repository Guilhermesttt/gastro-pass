
import { MapPin, Star } from "lucide-react";
import { motion } from "framer-motion";

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
    <motion.div 
      whileHover={{ y: -8, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
      transition={{ type: "spring", stiffness: 300 }}
      className="group cursor-pointer overflow-hidden bg-card rounded-xl shadow-custom border border-border/10 hover:border-primary/30 transition-all duration-300"
      onClick={onClick}
    >
      <div className="relative overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="absolute top-3 right-3 bg-primary text-white font-medium px-3 py-1 z-10 rounded-md text-sm"
        >
          {discount}
        </motion.div>
        <motion.img
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.4 }}
          src={image}
          alt={name}
          className="w-full h-52 object-cover"
        />
      </div>
      
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg text-foreground">{name}</h3>
          <motion.div 
            whileHover={{ scale: 1.1 }}
            className="flex items-center gap-1 bg-background px-2 py-1 rounded text-sm"
          >
            <Star size={14} className="fill-primary text-primary" />
            <span className="font-medium">{rating.toFixed(1)}</span>
          </motion.div>
        </div>
        
        <div className="text-sm text-muted-foreground">
          <p className="mb-1">{category}</p>
          <div className="flex items-center gap-1">
            <MapPin size={14} className="text-primary/70" />
            <p>{address || location}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default RestaurantCard;
