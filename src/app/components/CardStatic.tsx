interface Card {
  title: string;
  subtitle: string | string[];
  year?: string;
  project?: string;
}

const CardStatic = ({ title, subtitle, year, project }: Card) => {
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
  if (Array.isArray(subtitle) && project) {
    return (
      <div className="flex justify-center self-center w-3xl">
        <div className="border-1 border-neutral-300 dark:border-detalhe rounded-lg py-3 px-4 grid grid-cols-1 relative mt-1.5 w-full mb-2 hover:shadow-xl transition-all duration-700">
          <h3
            id="lan-subtitle-one"
            className="text-site dark:text-white text-lg lg:text-lg break-normal font-medium"
          >
            {title}
          </h3>
          <div className="mt-2 mb-1">
            {subtitle.map((s) => {
              return (
                <h4
                  key={s}
                  className="text-site-600 dark:text-neutral-200 text-[10px] lg:text-sm mt-1 mr-2 inline bg-neutral-100 dark:bg-site-800 px-2 py-1 rounded-full border-1 border-neutral-300 dark:border-neutral-900"
                >
                  {s}
                </h4>
              );
            })}
          </div>
          <span className="w-full h-0.25 bg-neutral-200 dark:bg-neutral-500 mt-2"></span>
          <p className="text-neutral-500 dark:text-neutral-200 text-[12px] mt-2 font-regular">
            <a
              href={project}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Project: ${title}`}
            >
              GitHub
            </a>
          </p>
        </div>
      </div>
    );
  }
  if (project) {
    return (
      <div className="flex justify-center self-center w-3xl">
        <div className="border-1 border-neutral-300 dark:border-detalhe rounded-lg py-3 px-4 grid grid-cols-1 relative mt-1.5 w-full mb-2 hover:shadow-xl transition-all duration-700">
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
          <span className="w-full h-0.25 bg-neutral-200 dark:bg-neutral-500 mt-2"></span>
          <p className="text-neutral-500 dark:text-neutral-200 text-[12px] mt-2 font-regular">
            <a
              href={project}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Project: ${title}`}
            >
              GitHub
            </a>
          </p>
        </div>
      </div>
    );
  }
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
};
export default CardStatic;
