import { ScannerCardProps } from "../types";

/**
 * @description Componente de tarjeta para la sección del escáner. 
 * Muestra una imagen y gestiona visualmente su estado de selección mediante un anillo (ring).
 */
const ScannerCard = ({ 
  imgURL = "https://via.placeholder.com/200", 
  onClick = () => {}, 
  isSelected = false 
}: ScannerCardProps) => {
  
  // Construcción dinámica de clases con Tailwind
  const cardClasses = `flex flex-col gap-3 cursor-pointer rounded-lg transition-all duration-200 ${
    isSelected ? 'ring-2 ring-offset-2 ring-[#00c795]' : 'hover:opacity-90'
  }`;

  return (
    <div 
      className={cardClasses} 
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      aria-pressed={isSelected}
    >
      <div
        className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-lg"
        style={{ backgroundImage: `url("${imgURL}")` }}
        aria-label="Imagen seleccionada para escaneo"
      />
    </div>
  );
};

export default ScannerCard;