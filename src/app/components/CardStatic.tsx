interface Card {
  title: string;
  subtitle: string;
  year?: string;
}

export default function CardStatic({ title, subtitle, year }: Card) {
  if (year)
    return (
      <div className="border-1 border-site-300 dark:border-detalhe rounded-lg mt-5 group w-full p-4 grid grid-cols-1 relative text-left">
        <h3 className="text-site dark:text-white text-sm lg:text-lg break-normal">
          {title}
        </h3>
        <h4 className="text-site-500 dark:text-neutral-400 text-[10px] lg:text-sm mt-1">
          {subtitle}
        </h4>
        <h4 className="text-site-500 dark:text-neutral-400 text-[10px] lg:text-sm mt-2 justify-self-end">
          {year}
        </h4>
        <span className="w-5 h-1 absolute bg-gradient-to-b from-site-300 to-site-700 dark:from-[#344C50] dark:to-[#356C6C] left-4 top-17 lg:top-21"></span>
      </div>
    );
  return (
    <div className="border-1 border-site-300 dark:border-detalhe rounded-lg py-3 px-4 grid grid-cols-1 relative mt-1.5">
      <h3
        id="lan-subtitle-one"
        className="text-site dark:text-white text-sm lg:text-lg break-normal"
      >
        {title}
      </h3>
      <h4
        id="lan-subparagraph-one"
        className="text-site-500 dark:text-neutral-400 text-[10px] lg:text-sm mt-1"
      >
        {subtitle}
      </h4>
    </div>
  );
}
