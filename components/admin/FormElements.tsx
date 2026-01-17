interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ReactNode;
}

export const FormInput = ({ label, icon, ...props }: InputProps) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-zinc-400 ml-1">{label}</label>
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500">
            {icon}
          </div>
        )}
        <input
          {...props}
          value={props.value ?? ""}
          className={`w-full bg-zinc-900/50 border border-white/10 rounded-xl py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#8001ff]/50 focus:border-[#8001ff]/50 transition-all ${
            icon ? "pl-12 pr-4" : "px-4"
          }`}
        />
      </div>
    </div>
  );
};

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

export const FormTextarea = ({ label, ...props }: TextareaProps) => {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-zinc-400 ml-1">{label}</label>
      <textarea
        {...props}
        value={props.value ?? ""}
        className="w-full bg-zinc-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#8001ff]/50 focus:border-[#8001ff]/50 transition-all min-h-[120px]"
      />
    </div>
  );
};
