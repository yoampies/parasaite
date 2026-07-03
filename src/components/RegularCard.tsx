import { memo } from 'react';
import { Link } from 'react-router-dom';
import { RegularCardProps } from '../types';

const RegularCard = memo(function RegularCard({
  title,
  content = 'No hay contenido disponible para este parásito.',
  imgURL = 'https://via.placeholder.com/300',
}: RegularCardProps) {
  const parasitePath = `/library/${title.toLowerCase().trim().replace(/\s+/g, '-')}`;

  return (
    <Link to={parasitePath} className="block">
      <div className="flex flex-col gap-3 rounded-lg bg-white p-3 shadow-[0_0_4px_rgba(0,0,0,0.1)] transition-transform duration-200 hover:scale-[1.02]">
        {/* 1. Imagen Arriba */}
        <div
          className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-lg"
          style={{ backgroundImage: `url("${imgURL}")` }}
          role="img"
          aria-label={`Imagen de ${title}`}
        ></div>

        {/* 2. Textos Debajo (Sin recortar) */}
        <div className="flex flex-col gap-1">
          <p className="text-[#101816] text-sm font-bold leading-tight">{title}</p>
          <p className="text-[#5e8d81] text-xs font-normal leading-normal">{content}</p>
        </div>
      </div>
    </Link>
  );
});

export default RegularCard;
