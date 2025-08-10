import { Link } from 'react-router-dom';

function RegularCard({title, content, imgURL}) {
  const parasitePath = `/library/${title.toLowerCase().replace(/\s/g, '-')}`;

  return (
    <Link to={parasitePath} className="p-4 block">
      <div className="flex items-stretch justify-between gap-4 rounded-lg bg-white p-4 shadow-[0_0_4px_rgba(0,0,0,0.1)] transition-transform duration-200 hover:scale-[1.02]">
        <div className="flex flex-col gap-1 flex-[2_2_0px]">
            <p className="text-[#101816] text-base leading-tight font-bold">{title}</p>
            <p className="text-[#5e8d81] text-sm font-normal leading-normal">{content}</p>
        </div>
        <div className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-lg flex-1" style={{ backgroundImage: `url("${imgURL}")` }}></div>
      </div>
    </Link>
  )
}

export default RegularCard;