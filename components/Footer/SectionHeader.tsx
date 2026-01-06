import { Highlighter } from "../ui/highlighter";

export const SectionHeader = ({
    title,
    description
}: {
    title: string;
    description: string;
}) => {
    return (
        <div className="flex flex-col gap-5 px-6 md:px-0"> 
            <h1 className='md:text-6xl text-3xl font-heading tracking-wide'>
                <Highlighter action="underline">{title}</Highlighter>
            </h1>
            <p className="text-sm font-display text-white/60">{description}</p>
            <hr className="border-t-2 border-gray-500 w-[calc(100%-5rem)] my-3 sm:w-auto" />
        </div>
    );
}
    