import Card from "@/components/Card";
export default function MainContent() {
  return (
    <main className="flex justify-center mx-10">
      <div className="max-w-lg xl:max-w-xl flex flex-col justify-center">
        <span
          id="element"
          className="text-site dark:text-white text-2xl lg:text-3xl mt-5 text-center tracking-wider h-8"
        ></span>
        <h3
          id="dev-title"
          className="text-site-500 dark:text-neutral-500 text-sm lg:text-lg text-center mt-1"
        >
          Desenvolvedor Full-stack
        </h3>
        <ul className="flex gap-4 justify-center mt-2 xl:gap-6">
          <li className="hover-underline after:-bottom-1 dark:after:bg-neutral-300">
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://github.com/NivDantas"
              aria-label="Github"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-5 lg:size-6 xl:size-7 stroke-site-500 dark:stroke-neutral-500"
              >
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
              </svg>
            </a>
          </li>
          <li className="hover-underline after:-bottom-1 dark:after:bg-neutral-300">
            <a href="mailto:nivdantas@icloud.com" aria-label="Mail">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-5 lg:size-6 xl:size-7 stroke-site-500 dark:stroke-neutral-500"
              >
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
            </a>
          </li>
          <li className="hover-underline after:-bottom-1 dark:after:bg-neutral-300">
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.linkedin.com/in/nivaldo-dantas/"
              aria-label="Linkedin"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-5 lg:size-6 xl:size-7 stroke-site-500 dark:stroke-neutral-500"
              >
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                <rect x="2" y="9" width="4" height="12"></rect>
                <circle cx="4" cy="4" r="2"></circle>
              </svg>
            </a>
          </li>
        </ul>
        <p
          id="paragraph"
          className="text-site-700 dark:text-neutral-300 text-xs lg:text-sm xl:text-[16px] mt-5 text-pretty"
        >
          Olá, me chamo Nivaldo Dantas — desenvolvedor full-stack atualmente
          formado em engenhenharia de software — com sólida base acadêmica e
          experiência prática no desenvolvimento de aplicações mobile e web.
        </p>
        <section className="mt-5">
          <h2
            id="title-one"
            className="text-site dark:text-white text-xl xl:text-2xl"
          >
            Educação
          </h2>
          <Card
            title="Bacharelado em Engenharia de Software"
            subtitle="Instituto Federal do Amazonas - IFAM"
            year="2020-2025"
          ></Card>
          <Card
            title="Formação Continuada"
            subtitle="Projeto Aranouá - Instituto Federal do Amazonas"
            year="2021-2024"
          >
            <p
              id="ex-paragraph-one"
              className="text-site-800 dark:text-neutral-300 text-sm xl:text-[16px] text-pretty"
            >
              Atividade extracurricular em parceria do IFAM com a Samsung com
              finalidade de capacitar, aperfeiçoar e atualizar o estudante,
              garantindo a constante modernização das competências e atualizar
              saberes com foco no desempenho, aprimoramento focado em cursos de
              React, React Native, Programação para Dispositivos Móveis, Banco
              de Dados, entre outros, com projetos reais.
            </p>
          </Card>

          <h2
            id="title-two"
            className="text-site dark:text-white text-xl xl:text-2xl mt-6"
          >
            Experiência
          </h2>
          <Card
            title="Estagiário"
            subtitle="Tribunal de Contas do Amazonas - TCE/AM"
            year="2024-2025"
          >
            <ul
              id="ex-paragraph-two"
              className="text-site-800 dark:text-neutral-300 text-sm xl:text-[16px] text-pretty ml-2 list-disc grid gap-4"
            >
              <li>
                Desenvolvimento e manutenção de aplicações web para setores
                internos.
              </li>
              <li>
                Participação na concepção de novos projetos colaborando com
                equipes multidisciplinares para levantamento de requisitos e
                definição de funcionalidades.
              </li>
              <li>
                Implementação de automações para otimizar fluxos de trabalho e
                reduzir tarefas manuais, utilizando scripts e integrações entre
                sistemas internos.
              </li>
              <li>
                Utilização de ferramentas de kanban para organização,
                acompanhamento e priorização das tarefas, promovendo eficiência
                nos fluxos de trabalho.
              </li>
              <li>
                Participação em reuniões de planejamento e retrospectiva,
                contribuindo para o alinhamento das demandas e melhoria contínua
                dos processos.
              </li>
            </ul>
          </Card>
          <h2
            id="title-three"
            className="text-site dark:text-white text-xl xl:text-2xl mt-6"
          >
            Idiomas
          </h2>
          <Card title="Português" subtitle="Nativo"></Card>
          <Card title="Inglês" subtitle="Avançado"></Card>
        </section>
      </div>
    </main>
  );
}
