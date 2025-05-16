
import { MapPin, Star, QrCode } from "lucide-react";
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
  qrCode?: string;
  onClick: () => void;
  onQrCodeClick?: (event: React.MouseEvent) => void;
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
  qrCode,
  onClick,
  onQrCodeClick,
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
        {qrCode && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ 
              scale: 1.15, 
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)" 
            }}
            whileTap={{ scale: 0.95 }}
            className="absolute top-3 left-3 bg-white text-black p-1.5 z-10 rounded-md shadow-lg cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              onQrCodeClick && onQrCodeClick(e);
            }}
          >
            <QrCode size={18} />
          </motion.div>
        )}
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
