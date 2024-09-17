"use client"

const AmbientLight = () => {
  return (
    <div className="pointer-events-none absolute left-0 top-0 -z-10 h-screen w-screen select-none">
      <div className="absolute inset-0 isolate contain-strict">
        <div className="page-light-a absolute left-0 top-10 h-[1480px] w-[680px] translate-y-[-350px] rotate-[-45deg]" />
        <div className="page-light-b pointer-events-none absolute left-0 top-10 h-[1380px] w-[240px] origin-top-left translate-x-[-220%] translate-y-[-42%] rotate-[-45deg] select-none" />
        <div className="page-light-c absolute left-0 top-10 h-[1380px] w-[240px] origin-top-left translate-x-[-200%] translate-y-[-50%] rotate-[-45deg]" />
      </div>
    </div>
  )
}

export { AmbientLight }
