function HomeCard({title, children}) {
  return (
    <div className="flex min-w-72 flex-1 flex-col gap-2 rounded-lg border border-[#dae7e3] p-6">
        <p className="text-[#101816] text-base leading-normal font-medium">{title}</p>
        {children}
    </div>
  )
}

export default HomeCard