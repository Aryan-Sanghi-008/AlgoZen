export const Navbar = () => {
  return (
    <nav className="h-[3.8rem] border-b border-zinc-800 bg-[#111113]/80 backdrop-blur-md flex items-center relative">
      <div className="absolute inset-x-0 bottom-0 h-0.5 bg-linear-to-r from-violet-500/60 via-cyan-400/60 to-purple-500/60 animate-gradient" />

      <span className="text-xl font-semibold tracking-tight bg-linear-to-r from-violet-300 to-cyan-300 bg-clip-text text-transparent ml-3">
        AlgoZen
      </span>
    </nav>
  );
};
