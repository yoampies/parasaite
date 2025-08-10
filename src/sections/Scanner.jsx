import Navbar from "../components/Navbar"
import Card from "../components/Card"
import ScannerResults from "./ScannerResults"
import ImageUploader from "../components/ImageUploader"
import { recentImages } from "../assets/constants"
import { useState } from "react"

function Scanner() {
  const [showResults, setShowResults] = useState(false);
  const handleAnalyze = () => {
    setShowResults(true);
    console.log("changed")
  };

  if (showResults) {
    return <ScannerResults />;
  }

  return (
    <div className="relative flex size-full min-h-screen flex-col bg-white group/design-root overflow-x-hidden font-inter">
      <div className="layout-container flex h-full grow flex-col">
        <Navbar/>
        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <p className="text-[#101816] tracking-light text-[32px] font-bold leading-tight min-w-72">Escáner</p>
            </div>
            <ImageUploader instruction="Arrastra y suelta imágenes aquí o haz clic para subir" message="Formatos de archivo admitidos:" typesOfFiles="JPG, PNG, TIFF" />
            <h2 className="text-[#101816] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Imágenes recientes</h2>
              <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3 p-4">  
                {
                  recentImages.map((image) => (
                    <Card key={image.id} 
                          imgURL={image.imgURL} />
                  ))
                }
              </div>
            <div className="flex px-4 py-3 justify-end">
              <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#00c795] text-[#101816] text-sm font-bold leading-normal tracking-[0.015em]" onClick={handleAnalyze}>
                <span className="truncate">Analizar</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Scanner