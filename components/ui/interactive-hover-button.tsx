import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";

export function InteractiveHoverButton({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "group bg-background relative w-auto cursor-pointer overflow-hidden rounded-full border p-2 px-6 text-center font-semibold transition-all duration-300 hover:bg-gradient-to-r hover:from-[hsl(var(--gradient-start))] hover:to-[hsl(var(--gradient-end))] hover:shadow-[0_0_15px_rgba(105,4,206,0.6),0_0_30px_rgba(132,9,255,0.4),0_0_45px_rgba(152,50,255,0.3)]",
        className
      )}
      {...props}>
      <div className="flex items-center gap-2">
        <div className="bg-primary h-2 w-2 rounded-full transition-all duration-300 group-hover:scale-[1.008] group-hover:bg-linear-to-r group-hover:from-[hsl(var(--gradient-start))] group-hover:to-[hsl(var(--gradient-end))] group-hover:shadow-[0_0_15px_rgba(105,4,206,0.6),0_0_30px_rgba(132,9,255,0.4),0_0_45px_rgba(152,50,255,0.3)]"></div>
        <span className="inline-block transition-all duration-300 group-hover:translate-x-12 group-hover:opacity-0 group-hover:text-white">
          {children}
        </span>
      </div>
      <div className="text-white absolute top-0 z-10 flex h-full w-full translate-x-12 items-center justify-center gap-2 opacity-0 transition-all duration-300 group-hover:-translate-x-5 group-hover:opacity-100">
        <span>{children}</span>
        <ArrowRight />
      </div>
    </button>
  );
}
