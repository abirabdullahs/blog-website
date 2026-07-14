export default function AdminDashboard() {
  return (
    <div className="space-y-10">
      <header className="border-b-2 border-black pb-8">
        <span className="text-[0.65rem] uppercase tracking-[0.4em] font-bold text-gray-400 mb-2 block">System Overview</span>
        <h1 className="text-5xl font-bold tracking-tighter italic font-serif">Dashboard</h1>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="border-2 border-black p-8 flex flex-col gap-4">
          <span className="text-[0.65rem] uppercase font-black tracking-widest opacity-40">Total Circulation</span>
          <span className="text-4xl font-bold font-serif italic">1,284</span>
          <span className="text-[0.6rem] uppercase font-bold text-green-600">+12% vs last month</span>
        </div>
        <div className="border-2 border-black p-8 flex flex-col gap-4">
          <span className="text-[0.65rem] uppercase font-black tracking-widest opacity-40">Published Issues</span>
          <span className="text-4xl font-bold font-serif italic">42</span>
          <span className="text-[0.6rem] uppercase font-bold">2 drafts pending</span>
        </div>
        <div className="border-2 border-black p-8 flex flex-col gap-4 bg-black text-white">
          <span className="text-[0.65rem] uppercase font-black tracking-widest opacity-20">System Health</span>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
            <span className="text-xl font-bold uppercase tracking-widest">Optimal</span>
          </div>
          <span className="text-[0.6rem] uppercase font-bold opacity-50">Firewall Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <section className="space-y-6">
          <h2 className="text-[0.7rem] uppercase font-black tracking-[0.3em] border-b border-black pb-2">Recent Dispatches</h2>
          <ul className="divide-y divide-black/5">
            {[
              "The Future of Next.js & Generative Architecture",
              "Mastering NoSQL Schema Design",
              "Editorial Design: A Digital Manifesto"
            ].map((title, i) => (
              <li key={i} className="py-4 flex justify-between items-center group">
                <span className="text-xs font-bold font-serif group-hover:italic transition-all">{title}</span>
                <span className="text-[0.6rem] uppercase opacity-40">Jan {24 - i}, 2024</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="space-y-6">
          <h2 className="text-[0.7rem] uppercase font-black tracking-[0.3em] border-b border-black pb-2">Engagement Analytics</h2>
          <div className="aspect-[16/9] bg-[#E5E5E5] flex items-center justify-center">
            <span className="text-[0.6rem] uppercase font-black opacity-30 tracking-widest">Chart_Placeholder.svg</span>
          </div>
        </section>
      </div>
    </div>
  );
}
