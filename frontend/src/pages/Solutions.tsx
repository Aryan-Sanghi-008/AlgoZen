import { useEffect, useState } from "react";
import { CodeIcon, Loader2 } from "lucide-react";
import type { SolutionType } from "@/types";
import { getSolutionsByContest } from "@/api";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui";

const CURRENT_CONTEST = "Weekly Contest 300";

const PlatformIcon = () => (
  <CodeIcon className="h-4 w-4 mr-2 shrink-0 text-violet-500" />
);

const Solutions = () => {
  const [solutions, setSolutions] = useState<SolutionType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSolutions = async () => {
      setLoading(true);
      const data = await getSolutionsByContest(CURRENT_CONTEST);
      setSolutions(data ?? []);
      setLoading(false);
    };

    fetchSolutions();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0c] text-neutral-50">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-[#0a0a0c] text-zinc-100 animate-gradient">
      <main className="max-w-4xl mx-auto py-10 px-4 sm:px-6">
        <h2 className="text-4xl font-extrabold mb-10 bg-linear-to-r from-violet-400 via-indigo-300 to-cyan-300 bg-clip-text text-transparent tracking-tight">
          {CURRENT_CONTEST} — Solutions
        </h2>

        {solutions.length === 0 ? (
          <p className="text-zinc-500">No solutions posted yet.</p>
        ) : (
          <Accordion type="single" collapsible className="space-y-4">
            {solutions.map((item) => (
              <AccordionItem
                key={item.id}
                value={item.id!}
                className="bg-[#111113]/70 border border-zinc-800 rounded-xl shadow-xl shadow-black/40 hover:border-violet-600/40 hover:shadow-violet-900/20 transition backdrop-blur-xl"
              >
                <AccordionTrigger className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <PlatformIcon />
                    <span className="text-lg font-semibold text-zinc-200">
                      {item.question_no}: {item.title}
                    </span>
                  </div>
                </AccordionTrigger>

                <AccordionContent className="px-5 pb-5 mt-2 text-zinc-300">
                  <div className="prose prose-invert max-w-none leading-relaxed">
                    {item.description}
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-4">
                    {(item.photo_urls ?? []).map((url, idx) => (
                      <img
                        key={idx}
                        src={url}
                        className="rounded-lg border border-zinc-700 shadow-md hover:shadow-violet-700/30 transition"
                      />
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </main>
    </div>
  );
};

export default Solutions;
