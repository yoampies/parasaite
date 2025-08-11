import { feedbackStatus } from "../assets/constants"

function ButtonFilter({title}) {
  return (
    <>
        <h3 className="text-[#101816] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">{title}</h3>
        <div className="flex flex-wrap gap-3 p-4">
            {feedbackStatus.map((state) => (
            <label
                key={state}
                className="text-sm font-medium leading-normal flex items-center justify-center rounded-lg border border-[#dae7e3] px-4 h-11 text-[#101816] has-[:checked]:border-[3px] has-[:checked]:px-3.5 has-[:checked]:border-[#00c795] relative cursor-pointer"
            >
                <p>{state}</p>
                <input type="radio" className="invisible absolute" name="64f56a85-5189-44b3-a156-d9555b8d83f5" />
            </label>
            ))}
        </div>
    </>
  )
}

export default ButtonFilter