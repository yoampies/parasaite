import Navbar from "../components/Navbar"
import Card from "../components/Card"
import {recentAnalyses, parasiteTypes, weekDays, feedbackStatus} from "../assets/constants";
import { useState } from "react";

function History() {
  const daysInMonth = 30;
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);/*Check*/
  const selectedDays = [5, 30];
  const isSelected = (day) => selectedDays.includes(day);
  const getColStartClass = (day) => day === 1 ? "col-start-4" : "";
  const getRoundedClass = (day) => {
    if (day === 5) return "rounded-l-full";
    if (day === 30) return "rounded-r-full";
    return "";
  }

  const [searchValue, setSearchValue] = useState('');

  return (
    <div
      className="relative flex size-full min-h-screen flex-col bg-white group/design-root overflow-x-hidden"
      style={{
        '--checkbox-tick-svg': `url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='rgb(16,24,22)' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e")`,
        fontFamily: 'Inter, "Noto Sans", sans-serif',
      }}
    >
      <div className="layout-container flex h-full grow flex-col">
        <Navbar />
        <div className="gap-1 px-6 flex flex-1 justify-center py-5">
          <div className="layout-content-container flex flex-col w-80">
            <div className="px-4 py-3">
              <label className="flex flex-col min-w-40 h-12 w-full">
                <div className="flex w-full flex-1 items-stretch rounded-lg h-full">
                  <div className="text-[#5e8d81] flex border-none bg-[#f0f5f4] items-center justify-center pl-4 rounded-l-lg border-r-0" data-icon="MagnifyingGlass" data-size="24px" data-weight="regular">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                      <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path>
                    </svg>
                  </div>
                  <input
                    placeholder="Search by date, time, or parasite type"
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#101816] focus:outline-0 focus:ring-0 border-none bg-[#f0f5f4] focus:border-none h-full placeholder:text-[#5e8d81] px-4 rounded-l-none border-l-0 pl-2 text-base font-normal leading-normal"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)} 
                  />
                </div>
              </label>
            </div>
            <div className="flex flex-wrap gap-4 px-4 py-6">
              <div className="flex min-w-72 flex-1 flex-col gap-2">
                <p className="text-[#101816] text-base font-medium leading-normal">Analysis Distribution</p>
                <p className="text-[#101816] tracking-light text-[32px] font-bold leading-tight truncate">120</p>
                <div className="flex gap-1">
                  <p className="text-[#5e8d81] text-base font-normal leading-normal">Last 30 Days</p>
                  <p className="text-[#07882e] text-base font-medium leading-normal">+15%</p>
                </div>
                <div className="grid min-h-[180px] grid-flow-col gap-6 grid-rows-[1fr_auto] items-end justify-items-center px-3">
                  <div className="border-[#5e8d81] bg-[#f0f5f4] border-t-2 w-full" style={{ height: '60%' }}></div>
                  <p className="text-[#5e8d81] text-[13px] font-bold leading-normal tracking-[0.015em]">Jan 1</p>
                  <div className="border-[#5e8d81] bg-[#f0f5f4] border-t-2 w-full" style={{ height: '100%' }}></div>
                  <p className="text-[#5e8d81] text-[13px] font-bold leading-normal tracking-[0.015em]">Jan 8</p>
                  <div className="border-[#5e8d81] bg-[#f0f5f4] border-t-2 w-full" style={{ height: '50%' }}></div>
                  <p className="text-[#5e8d81] text-[13px] font-bold leading-normal tracking-[0.015em]">Jan 15</p>
                  <div className="border-[#5e8d81] bg-[#f0f5f4] border-t-2 w-full" style={{ height: '40%' }}></div>
                  <p className="text-[#5e8d81] text-[13px] font-bold leading-normal tracking-[0.015em]">Jan 22</p>
                  <div className="border-[#5e8d81] bg-[#f0f5f4] border-t-2 w-full" style={{ height: '70%' }}></div>
                  <p className="text-[#5e8d81] text-[13px] font-bold leading-normal tracking-[0.015em]">Jan 29</p>
                </div>
              </div>
            </div>
            <h3 className="text-[#101816] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">Filter by Parasite Type</h3>
            <div className="px-4">
              {
                parasiteTypes.map((parasite) => (
                  <label key={parasite} className="flex gap-x-3 py-3 flex-row">
                    <input
                      type="checkbox"
                      className="h-5 w-5 rounded border-[#dae7e3] border-2 bg-transparent text-[#00c795] checked:bg-[#00c795] checked:border-[#00c795] checked:bg-[image:--checkbox-tick-svg] focus:ring-0 focus:ring-offset-0 focus:border-[#dae7e3] focus:outline-none"
                    />
                    <p className="text-[#101816] text-base font-normal leading-normal">{parasite}</p>
                  </label>
                ))
              }
            </div>
            <h3 className="text-[#101816] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">Filter by Confidence Level</h3>
            <div className="@container">
              <div className="relative flex w-full flex-col items-start justify-between gap-3 p-4 @[480px]:flex-row">
                <p className="text-[#101816] text-base font-medium leading-normal w-full shrink-[3]">Confidence Level</p>
                <div className="flex h-[38px] w-full pt-1.5">
                  <div className="flex h-1 w-full rounded-sm bg-[#dae7e3] pl-[60%] pr-[15%]">
                    <div className="relative">
                      <div className="absolute -left-3 -top-1.5 flex flex-col items-center gap-1">
                        <div className="size-4 rounded-full bg-[#101816]"></div>
                        <p className="text-[#101816] text-sm font-normal leading-normal">0</p>
                      </div>
                    </div>
                    <div className="h-1 flex-1 rounded-sm bg-[#101816]"></div>
                    <div className="relative">
                      <div className="absolute -left-3 -top-1.5 flex flex-col items-center gap-1">
                        <div className="size-4 rounded-full bg-[#101816]"></div>
                        <p className="text-[#101816] text-sm font-normal leading-normal">100</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <h3 className="text-[#101816] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">Filter by Date</h3>
            <div className="flex flex-wrap items-center justify-center gap-6 p-4">
              <div className="flex min-w-72 max-w-[336px] flex-1 flex-col gap-0.5">
                <div className="flex items-center p-1 justify-between">
                  <button>
                    <div className="text-[#101816] flex size-10 items-center justify-center" data-icon="CaretLeft" data-size="18px" data-weight="regular">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M165.66,202.34a8,8,0,0,1-11.32,11.32l-80-80a8,8,0,0,1,0-11.32l80-80a8,8,0,0,1,11.32,11.32L91.31,128Z"></path>
                      </svg>
                    </div>
                  </button>
                  <p className="text-[#101816] text-base font-bold leading-tight flex-1 text-center">January 2024</p>
                  <button>
                    <div className="text-[#101816] flex size-10 items-center justify-center" data-icon="CaretRight" data-size="18px" data-weight="regular">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18px" height="18px" fill="currentColor" viewBox="0 0 256 256">
                        <path d="M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"></path>
                      </svg>
                    </div>
                  </button>
                </div>
                <div className="grid grid-cols-7">
                  {
                    weekDays.map((weekDay) => (
                      <p key={weekDay.id} className="text-[#101816] text-[13px] font-bold leading-normal tracking-[0.015em] flex h-12 w-full items-center justify-center pb-0.5">{weekDay.name}</p>
                    ))
                  }
                  {  
                    days.map((day) => (
                      <button key={day}
                              className={`h-12 w-full text-[#101816] text-sm font-medium leading-normal 
                                ${getColStartClass(day)} ${getRoundedClass(day)} ${isSelected(day) ? 'bg-[#f0f5f4]' : ''}`}
                      >
                        <div className={`flex size-full items-center justify-center rounded-full ${isSelected(day) ? 'bg-[#00c795]' : ''}`}>
                          {day}
                        </div>
                      </button>
                    ))
                  }
                </div>
              </div>
            </div>
            <h3 className="text-[#101816] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">Filter by Feedback Status</h3>
            <div className="flex flex-wrap gap-3 p-4">
              {
                feedbackStatus.map((state) => (
                  <label key={state} className="text-sm font-medium leading-normal flex items-center justify-center rounded-lg border border-[#dae7e3] px-4 h-11 text-[#101816] has-[:checked]:border-[3px] has-[:checked]:px-3.5 has-[:checked]:border-[#00c795] relative cursor-pointer">
                    <p>{state}</p>
                    <input type="radio" className="invisible absolute" name="64f56a85-5189-44b3-a156-d9555b8d83f5" />
                  </label>
                ))
              }
            </div>
          </div>
          <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <div className="flex min-w-72 flex-col gap-3">
                <p className="text-[#101816] tracking-light text-[32px] font-bold leading-tight">Review Previous Analyses</p>
                <p className="text-[#5e8d81] text-sm font-normal leading-normal">
                  Access and manage your past analyses. Click on any entry to view detailed results, including annotated images and parasite information.
                </p>
              </div>
            </div>
            <h2 className="text-[#101816] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">Recent Analyses</h2>
            {
              recentAnalyses.map((analysis) => (
                <Card key={analysis.id} 
                      title={`Analysis ${analysis.date}`}
                      content={analysis.content} 
                      imgURL={analysis.imgURL}/>
              ))
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default History