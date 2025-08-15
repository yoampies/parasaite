import Navbar from '../components/Navbar';
import { useParams } from 'react-router-dom';
import { recentAnalyses } from '../assets/constants';

const ScannerFeedback = () => {

  const radioDotSvg = `url('data:image/svg+xml,%3csvg viewBox=%270 0 16 16%27 fill=%27rgb(16,24,22)%27 xmlns=%27http://www.w3.org/2000/svg%27%3e%3ccircle cx=%278%27 cy=%278%27 r=%273%27/%3e%3c/svg%3e')`;
  
  const { analysisId } = useParams();
  let analysis
  const storedAnalysis = localStorage.getItem("currentAnalysis")

  if (storedAnalysis) {
    analysis = JSON.parse(storedAnalysis)

    if (analysis.id.toString() !== analysisId) {
        analysis = recentAnalyses.find(a => a.id.toString() === analysisId);
    }
  } else {
    analysis = recentAnalyses.find(a => a.id.toString() === analysisId);
  }

  return (
    <div
      className="relative flex size-full min-h-screen flex-col bg-white group/design-root overflow-x-hidden font-inter"
      style={{
        '--radio-dot-svg': radioDotSvg,
      }}
    >
      <div className="layout-container flex h-full grow flex-col">
        <Navbar />
        <div className="px-40 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col w-[512px] max-w-[512px] py-5 flex-1">
            <h2 className="text-[#101816] tracking-light text-[28px] font-bold leading-tight px-4 text-left pb-3 pt-5">
              {`Enviar Feedback del Análisis ${analysis.date}`}
            </h2>
            <p className="text-[#101816] text-base font-normal leading-normal pb-3 pt-1 px-4">
              Gracias por ayudarnos a mejorar. Por favor, describe el error que encontraste.
            </p>
            <h3 className="text-[#101816] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">
              Tipo de Error
            </h3>
            <div className="flex flex-col gap-3 p-4">
              <label className="flex items-center gap-4 rounded-lg border border-solid border-[#dae7e3] p-[15px]">
                <input
                  type="radio"
                  className="h-5 w-5 border-2 border-[#dae7e3] bg-transparent text-transparent checked:border-[#101816] checked:bg-[image:var(--radio-dot-svg)] focus:outline-none focus:ring-0 focus:ring-offset-0 checked:focus:border-[#101816]"
                  name="feedback-type"
                  defaultChecked
                />
                <div className="flex grow flex-col">
                  <p className="text-[#101816] text-sm font-medium leading-normal">Identificación Incorrecta</p>
                </div>
              </label>
              <label className="flex items-center gap-4 rounded-lg border border-solid border-[#dae7e3] p-[15px]">
                <input
                  type="radio"
                  className="h-5 w-5 border-2 border-[#dae7e3] bg-transparent text-transparent checked:border-[#101816] checked:bg-[image:var(--radio-dot-svg)] focus:outline-none focus:ring-0 focus:ring-offset-0 checked:focus:border-[#101816]"
                  name="feedback-type"
                />
                <div className="flex grow flex-col">
                  <p className="text-[#101816] text-sm font-medium leading-normal">Falsa Detección</p>
                </div>
              </label>
              <label className="flex items-center gap-4 rounded-lg border border-solid border-[#dae7e3] p-[15px]">
                <input
                  type="radio"
                  className="h-5 w-5 border-2 border-[#dae7e3] bg-transparent text-transparent checked:border-[#101816] checked:bg-[image:var(--radio-dot-svg)] focus:outline-none focus:ring-0 focus:ring-offset-0 checked:focus:border-[#101816]"
                  name="feedback-type"
                />
                <div className="flex grow flex-col">
                  <p className="text-[#101816] text-sm font-medium leading-normal">Detección Incompleta</p>
                </div>
              </label>
              <label className="flex items-center gap-4 rounded-lg border border-solid border-[#dae7e3] p-[15px]">
                <input
                  type="radio"
                  className="h-5 w-5 border-2 border-[#dae7e3] bg-transparent text-transparent checked:border-[#101816] checked:bg-[image:var(--radio-dot-svg)] focus:outline-none focus:ring-0 focus:ring-offset-0 checked:focus:border-[#101816]"
                  name="feedback-type"
                />
                <div className="flex grow flex-col">
                  <p className="text-[#101816] text-sm font-medium leading-normal">Otro</p>
                </div>
              </label>
            </div>
            <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
              <label className="flex flex-col min-w-40 flex-1">
                <textarea
                  placeholder="Describe el error en detalle"
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#101816] focus:outline-0 focus:ring-0 border border-[#dae7e3] bg-white focus:border-[#dae7e3] min-h-36 placeholder:text-[#5e8d81] p-[15px] text-base font-normal leading-normal"
                ></textarea>
              </label>
            </div>
            <div className="flex px-4 py-3 justify-end">
              <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#00c795] text-[#101816] text-sm font-bold leading-normal tracking-[0.015em]">
                <span className="truncate">Enviar Feedback</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScannerFeedback;