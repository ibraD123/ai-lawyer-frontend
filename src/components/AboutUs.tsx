interface AboutUsProps {
  isDarkTheme: boolean;
}

export function AboutUs({ isDarkTheme }: AboutUsProps) {
  return (
    <section className={`py-24 px-6 ${isDarkTheme ? 'bg-black' : 'bg-white'}`}>
      <div className="max-w-7xl mx-auto">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className={`text-5xl mb-8 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
            О нас
          </h2>
          <p className={`text-xl leading-relaxed mb-6 ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}>
            Мы создаём инструменты искусственного интеллекта для юридической отрасли. 
            Наша миссия — освободить юристов от рутинных задач и дать им возможность 
            сосредоточиться на стратегически важных решениях.
          </p>
          <p className={`text-xl leading-relaxed ${isDarkTheme ? 'text-gray-400' : 'text-gray-600'}`}>
            Команда ЮристИИ объединяет экспертов в области права, машинного обучения 
            и разработки программного обеспечения. Мы понимаем специфику юридической 
            работы и создаём решения, которые действительно работают в реальных условиях.
          </p>
        </div>
      </div>
    </section>
  );
}