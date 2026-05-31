import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { pl } from "date-fns/locale";
import { calculateNumerology } from "@/lib/numerology";

const Numerology = () => {
  const [selected, setSelected] = useState<Date | undefined>();
  const [open, setOpen] = useState(false);
  const [results, setResults] = useState<string[] | null>(null);

  const handleSelect = (date: Date | undefined) => {
    setSelected(date);
    setOpen(false);
    if (date) setResults(calculateNumerology(date));
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 py-24">
      <div className="max-w-xl w-full mx-auto">
        <h1 className="text-5xl md:text-6xl font-heading font-light text-foreground mb-10 text-center">
          Numerologia
        </h1>

        <div className="flex flex-col sm:flex-row gap-4 mb-10">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <button className="flex-1 flex items-center gap-3 h-12 px-4 bg-white/[0.05] border border-white/20 hover:border-accent/60 rounded-xl text-base text-left transition-colors duration-200">
                <CalendarIcon className="w-5 h-5 text-muted-foreground shrink-0" />
                <span className={selected ? "text-foreground" : "text-muted-foreground"}>
                  {selected ? selected.toLocaleDateString("pl-PL") : "Wybierz datę urodzenia..."}
                </span>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-card border-white/10 min-w-[320px]" align="start">
              <Calendar
                mode="single"
                selected={selected}
                onSelect={handleSelect}
                captionLayout="dropdown-buttons"
                fromYear={1900}
                toYear={new Date().getFullYear()}
                defaultMonth={selected ?? new Date(1990, 0, 1)}
                locale={pl}
                classNames={{
                  caption: "flex justify-center pt-2 pb-1 relative items-center px-10",
                  caption_dropdowns: "flex items-center gap-2",
                  caption_label: "hidden",
                  vhidden: "sr-only",
                  dropdown_month: "relative",
                  dropdown_year: "relative",
                  dropdown: "bg-card text-foreground border border-white/10 rounded-md text-sm px-2 py-1 cursor-pointer focus:outline-none",
                }}
              />
            </PopoverContent>
          </Popover>
        </div>

        {results && (
          <div className="p-6 rounded-2xl bg-white/[0.05] border border-white/10 backdrop-blur-xl">
            <ul className="space-y-2 font-mono text-sm text-foreground/90">
              {results.map((result, index) => (
                <li key={index}>
                  <span className="text-accent/70">{index + 1})</span> {result}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Numerology;
