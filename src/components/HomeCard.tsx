import { HomeCardProps } from '../types';

/**
 * @description Componente contenedor estilizado para la página de inicio.
 * Muestra un título y renderiza cualquier contenido pasado como 'children'.
 */
function HomeCard({ 
  title = 'Título no proporcionado', 
  children = null 
}: HomeCardProps) {
  return (
    <div className="flex min-w-72 flex-1 flex-col gap-2 rounded-lg border border-[#dae7e3] p-6 shadow-[0_0_4px_rgba(0,0,0,0.1)]">
      <p className="text-[#101816] text-base leading-normal font-medium">{title}</p>
      {children}
    </div>
  );
}

export default HomeCard;