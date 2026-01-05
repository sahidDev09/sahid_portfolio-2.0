"use client";

import React, { useId } from "react";
import Image from "next/image";
import { Button } from "../ui/button";
import { useSend } from "@/hooks/use-send";

const Label = ({ children, className, htmlFor }: { children: React.ReactNode; className?: string; htmlFor?: string }) => (
  <label htmlFor={htmlFor} className={className}>
    {children}
  </label>
);

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(({ className, ...props }, ref) => (
  <input ref={ref} className={className} {...props} />
));
Input.displayName = "Input";

const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(({ className, ...props }, ref) => (
  <textarea ref={ref} className={className} {...props} />
));
Textarea.displayName = "Textarea";

const WaitlistForm = () => {
  const nameId = useId();
  const emailId = useId();
  const projectTypeId = useId();
  const timelineId = useId();
  const messageId = useId();

  const { send, isSending, isSuccess, error } = useSend();
  const formRef = React.useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      projectType: formData.get("project-type") as string,
      timeline: formData.get("timeline") as string,
      message: formData.get("message") as string,
    };
    
    await send(data);
  };

  React.useEffect(() => {
    if (isSuccess && formRef.current) {
      formRef.current.reset();
    }
  }, [isSuccess]);

  return (
    <div className="relative z-10 flex flex-col lg:flex-row h-full w-full max-w-[1100px] mx-auto items-center p-6 sm:p-10 lg:p-16 gap-8 lg:gap-16">
      <div className="flex-1 flex flex-col justify-center space-y-6 w-full text-white">
        <div className="space-y-3">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-medium leading-none tracking-[-0.03em]">
            Let&apos;s Build Something Great
          </h2>
          <p className="text-white/70 text-lg">
            I&apos;m currently available for freelance work and open to new opportunities.
          </p>
        </div>
        
        <div className="space-y-4 sm:space-y-6 pt-4">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center border border-white/10">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <title>Success Icon</title>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm sm:text-base text-white/90 leading-relaxed">
                Custom Web Development focused on clean code, scalability, and exceptional user experience.
              </p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center border border-white/10">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <title>Speed Icon</title>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm sm:text-base text-white/90 leading-relaxed">
                Collaborative approach from discovery to deployment, ensuring your vision comes to life.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-8 mt-8 border-t border-white/10">
          <p className="text-xl sm:text-2xl text-white italic leading-relaxed mb-6 opacity-90">
            &quot;Bringing technical expertise and a keen eye for design to every project I undertake.&quot;
          </p>
          <div className="flex items-center gap-4">
            <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white/20">
              <Image
                src="/sahid_bento.jpg"
                alt="Alex Rivera"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <p className="text-lg font-medium text-white">
                MD ABU SAHID
              </p>
              <p className="text-sm text-white/60">
                MERN-Stack Developer
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 w-full lg:max-w-[480px]">
        <div className="bg-white/5 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl">
          {isSuccess ? (
             <div className="flex flex-col items-center justify-center py-12 space-y-4 text-center animate-in fade-in zoom-in duration-500">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-2">
                   <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                   </svg>
                </div>
                <h3 className="text-2xl font-bold text-white">Message Sent!</h3>
                <p className="text-white/70">Thanks for reaching out. I&apos;ll get back to you shortly.</p>
                <Button 
                   onClick={() => window.location.reload()} 
                   className="mt-6 bg-white/10 hover:bg-white/20 text-white"
                >
                   Send Another
                </Button>
             </div>
          ) : (
          <form className="space-y-5" onSubmit={handleSubmit} ref={formRef}>
            <div>
              <Label
                htmlFor={nameId}
                className="block text-[10px] font-mono font-bold text-white/50 mb-2 tracking-[1px] uppercase"
              >
                Full Name *
              </Label>
              <Input
                type="text"
                id={nameId}
                name="name"
                required
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all text-sm h-12"
              />
            </div>
            
            <div>
              <Label
                htmlFor={emailId}
                className="block text-[10px] font-mono font-bold text-white/50 mb-2 tracking-[1px] uppercase"
              >
                Email Address *
              </Label>
              <Input
                type="email"
                id={emailId}
                name="email"
                required
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all text-sm h-12"
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Label
                  htmlFor={projectTypeId}
                  className="block text-[10px] font-mono font-bold text-white/50 mb-2 tracking-[1px] uppercase"
                >
                  Project Type
                </Label>
                <Input
                  type="text"
                  id={projectTypeId}
                    name="project-type"
                    placeholder="e.g. Web Development"
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all text-sm h-12"
                  />
              </div>
              <div className="sm:w-36 w-full">
                <Label
                  htmlFor={timelineId}
                  className="block text-[10px] font-mono font-bold text-white/50 mb-2 tracking-[1px] uppercase"
                >
                  Timeline
                </Label>
                <div className="relative">
                  <select 
                    id={timelineId} 
                    name="timeline"
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-white/20 transition-all text-sm h-12 appearance-none cursor-pointer"
                  >
                    <option value="" className="bg-zinc-900">Select</option>
                    <option value="1-2-weeks" className="bg-zinc-900">1-2 Weeks</option>
                    <option value="2-4-weeks" className="bg-zinc-900">2-4 Weeks</option>
                    <option value="1-2-months" className="bg-zinc-900">1-2 Months</option>
                    <option value="2-months+" className="bg-zinc-900">2 Months+</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <Label
                htmlFor={messageId}
                className="block text-[10px] font-mono font-bold text-white/50 mb-2 tracking-[1px] uppercase"
              >
                How can I help you?
              </Label>
              <Textarea
                id={messageId}
                name="message"
                rows={3}
                placeholder="Tell me about your project, goals, and any specific requirements..."
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all resize-none text-sm"
              />
            </div>
            
            {error && (
              <div className="text-red-400 text-sm bg-red-400/10 p-3 rounded-lg border border-red-400/20">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={isSending}
              className="w-full h-12 rounded-xl bg-white text-black font-bold hover:scale-[1.02] active:scale-[0.98] transition-all tracking-tight shadow-xl shadow-white/10 disabled:opacity-70 disabled:hover:scale-100"
            >
              {isSending ? "Sending..." : "Send Message"}
            </Button>
          </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default WaitlistForm;
