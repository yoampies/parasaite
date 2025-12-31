import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import { ErrorProps } from "../types/index"

function Error({ 
  title = "Error", 
  message = "Ha ocurrido un error inesperado.", 
  linkText = "Volver al inicio", 
  linkTo = "/" 
}: ErrorProps) {
  return (
    <div className="relative flex size-full min-h-screen flex-col bg-white overflow-x-hidden font-inter">
      <Navbar />
      <div className="flex flex-1 justify-center py-5 px-40">
        <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
          <h2 className="text-red-500 text-[22px] font-bold leading-tight tracking-[-0.015em] p-4">
            {title}
          </h2>
          <p className="text-[#5e8d81] text-base font-normal leading-normal px-4">
            {message}
          </p>
          <p className="text-[#5e8d81] text-base font-normal leading-normal px-4 py-2">
            <Link to={linkTo} className="text-[#101816] font-bold underline">
              {linkText}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Error;