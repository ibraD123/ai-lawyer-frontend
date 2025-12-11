import { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, LogOut, Search, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DashboardProps {
  onLogout: () => void;
}

interface Tool {
  id: string;
  name: string;
  description: string;
  placeholder?: string;
}

interface ToolGroup {
  id: string;
  name: string;
  tools: Tool[];
}

interface HistoryItem {
  id: string;
  toolId: string;
  toolName: string;
  promptPreview: string;
  createdAt: string;
}

type MessageRole = 'user' | 'assistant';

interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
}

const toolGroups: ToolGroup[] = [
  {
    id: 'consultant',
    name: 'AI Бот Юрист-Консультант',
    tools: [
      {
        id: 'consultant-main',
        name: 'Юридическая консультация',
        description:
          'DEXLEY-бот отвечает на юридические вопросы, анализирует ситуацию и предлагает варианты действий в рамках российского права.',
        placeholder:
          'Например: «Контрагент отказывается подписать универсальный передаточный документ, какие мои действия?»',
      },
    ],
  },
  {
    id: 'generation',
    name: 'Генерация документов',
    tools: [
      {
        id: 'template-extension',
        name: 'Доп. соглашение о продлении',
        description:
          'Генерирует дополнительное соглашение о продлении срока действия договора с ключевыми условиями.',
        placeholder:
          'Например: «Продлить договор поставки между ООО А и ООО Б до 31.12.2025, оплата по факту, ответственность ограничить.»',
      },
      {
        id: 'template-penalty',
        name: 'Претензия о неустойке',
        description:
          'Создаёт претензию о взыскании неустойки с базовыми расчётами и ссылками на нормы закона.',
        placeholder:
          'Например: «Поставщик просрочил поставку на 15 дней, хотим взыскать неустойку 0.1% в день от стоимости договора.»',
      },
      {
        id: 'template-guarantee',
        name: 'Запрос гарантийного письма',
        description:
          'Формирует запрос гарантийного письма с корректными формулировками и реквизитами.',
        placeholder:
          'Например: «Попросить партнёра подтвердить обязательство оплатить 200 000 ₽ до 10.02.2026.»',
      },
      {
        id: 'template-supply-contract',
        name: 'Договор поставки',
        description:
          'Генерирует договор поставки с условиями оплаты, поставки и ответственности сторон.',
        placeholder:
          'Например: «Поставщик ООО Ромашка, покупатель ООО Василёк, оборудование на 500 000 ₽, срок поставки до 30.03.2026, оплата 50/50.»',
      },
      {
        id: 'template-service-contract',
        name: 'Договор оказания услуг',
        description:
          'Создаёт договор оказания услуг с описанием услуг, сроков, оплаты и штрафов.',
        placeholder:
          'Например: «Маркетинговые услуги, срок до 15.05.2026, стоимость 100 000 ₽, штраф за просрочку, конфиденциальность.»',
      },
      {
        id: 'template-power-of-attorney',
        name: 'Доверенность',
        description:
          'Формирует доверенность на представление интересов компании или физлица.',
        placeholder:
          'Например: «Выдать доверенность Иванову И.И. на подписание актов и представление в налоговой до 31.12.2026.»',
      },
    ],
  },
  {
    id: 'documents',
    name: 'Анализ документов',
    tools: [
      {
        id: 'doc-analysis',
        name: 'Анализ и резюме документа',
        description:
          'Загрузите документ — DEXLEY подготовит краткую выжимку, риски, ключевые условия и рекомендации.',
      },
    ],
  },
];

export function Dashboard({ onLogout }: DashboardProps) {
  const [expandedGroup, setExpandedGroup] = useState<string | null>('generation');
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);

  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);

  // генератор документов
  const [generatedText, setGeneratedText] = useState<string | null>(null);

  // чат консультанта
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatSending, setChatSending] = useState(false);

  // анализ документов (двухпанельный режим)
  const [documentPreview, setDocumentPreview] = useState<string>('Документ ещё не загружен.');
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [analysisPromptPreset, setAnalysisPromptPreset] = useState<string | null>(
    'Краткая выжимка и структура',
  );
  const [analysisCustomPrompt, setAnalysisCustomPrompt] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);

  // история
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('dexley-history');
      if (raw) setHistory(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('dexley-history', JSON.stringify(history));
    } catch {}
  }, [history]);

  // при выборе консультанта — стартовое сообщение
  useEffect(() => {
    if (selectedTool?.id === 'consultant-main' && chatMessages.length === 0) {
      setChatMessages([
        {
          id: 'welcome',
          role: 'assistant',
          content:
            'Здравствуйте, я DEXLEY — ваш ИИ-юрист. Опишите ситуацию или отправьте вопрос, и я объясню, какие у вас права и какие шаги можно предпринять.',
        },
      ]);
    }
    if (selectedTool?.id !== 'consultant-main') {
      // при переключении на другой инструмент чисто визуально не трогаем историю чата,
      // чтобы при возврате пользователь видел диалог. Если хочешь сбрасывать — можно очистить тут.
    }
  }, [selectedTool]);

  const toggleGroup = (groupId: string) => {
    setExpandedGroup(expandedGroup === groupId ? null : groupId);
  };

  const handleSelectTool = (tool: Tool) => {
    setSelectedTool(tool);

    // сброс состояний генерации / анализа
    setInputValue('');
    setGeneratedText(null);
    setAnalysisResult(null);
    setUploadedFileName(null);
    setDocumentPreview('Документ ещё не загружен.');
    setAnalysisCustomPrompt('');
    setAnalysisPromptPreset('Краткая выжимка и структура');
    setLoading(false);

    // чат отдельно не очищаем (см. useEffect выше),
    // чтобы при возвращении в консультанта диалог сохранялся
  };

  const pushHistory = (tool: Tool, preview: string) => {
    const item: HistoryItem = {
      id: Date.now().toString(),
      toolId: tool.id,
      toolName: tool.name,
      promptPreview: preview,
      createdAt: new Date().toISOString(),
    };
    setHistory((prev) => [item, ...prev].slice(0, 10));
  };

  // генерация документов
  const handleRunTextTool = () => {
    if (!selectedTool || selectedTool.id === 'consultant-main') return;
    const trimmed = inputValue.trim();
    const preview = trimmed || '(пустой запрос — пользователь ничего не ввёл)';

    pushHistory(selectedTool, preview);
    setLoading(true);
    setGeneratedText(null);

    setTimeout(() => {
      const baseTitle = `Черновик документа «${selectedTool.name}»`;

      const body =
        trimmed ||
        'Пользователь не указал деталей, текст будет дополнен после интеграции с моделью.';

      setGeneratedText(
        `${baseTitle}\n\n(Здесь будет реальный текст от модели на основе API DEXLEY.)\n\nЗапрос пользователя:\n${body}`,
      );
      setLoading(false);
    }, 900);
  };

  // чат консультанта
  const handleSendChat = () => {
    if (!selectedTool || selectedTool.id !== 'consultant-main') return;
    const trimmed = chatInput.trim();
    if (!trimmed || chatSending) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: trimmed,
    };

    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput('');
    setChatSending(true);

    pushHistory(selectedTool, trimmed);

    setTimeout(() => {
      const assistantMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        role: 'assistant',
        content:
          'Здесь появится детальный ответ ИИ-юриста на основе подключенной модели и ваших документов. ' +
          'На MVP это демо-ответ. В production DEXLEY будет ссылаться на нормы закона и судебную практику.',
      };
      setChatMessages((prev) => [...prev, assistantMsg]);
      setChatSending(false);
    }, 1000);
  };

  // анализ документа
  const handleRunAnalysis = () => {
    if (!selectedTool) return;

    const basePreview =
      uploadedFileName ||
      documentPreview.slice(0, 120) ||
      'Документ без названия';

    const presetText = analysisPromptPreset
      ? `Режим: ${analysisPromptPreset}`
      : 'Свободный режим анализа';

    const combinedPrompt =
      presetText +
      (analysisCustomPrompt.trim()
        ? ` + доп. запрос: ${analysisCustomPrompt.trim()}`
        : '');

    pushHistory(selectedTool, `Анализ документа: ${basePreview}`);

    setLoading(true);
    setAnalysisResult(null);

    setTimeout(() => {
      setAnalysisResult(
        `Встроенный baseline-промпт:\n${presetText}\n\n` +
          '(Здесь будет реальный результат анализа от модели: краткая выжимка, ' +
          'риски, ключевые условия, реквизиты и рекомендации, адаптированные под ваш запрос.)\n\n' +
          (analysisCustomPrompt.trim()
            ? `Дополнительные указания пользователя:\n${analysisCustomPrompt.trim()}`
            : ''),
      );
      setLoading(false);
    }, 1100);
  };

  // скачивание генерации
  const handleDownloadGenerated = () => {
    if (!generatedText || !selectedTool) return;

    const blob = new Blob([generatedText], {
      type: 'text/plain;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${selectedTool.name}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // drag&drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    setUploadedFileName(file.name);

    if (file.type.startsWith('text/')) {
      const reader = new FileReader();
      reader.onload = () => {
        const text = String(reader.result || '');
        setDocumentPreview(text.slice(0, 4000) || 'Файл пустой.');
      };
      reader.readAsText(file);
    } else {
      setDocumentPreview('Предпросмотр недоступен для этого формата, но файл загружен.');
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const isAnalysisTool = selectedTool?.id === 'doc-analysis';
  const isConsultant = selectedTool?.id === 'consultant-main';

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* SIDEBAR */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="text-4xl font-semibold tracking-tight text-gray-900">
            DEXLEY
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <div className="space-y-1">
            <div className="px-3 py-2 text-xs text-gray-500 uppercase tracking-wider">
              Инструменты
            </div>

            {toolGroups.map((group) => (
              <div key={group.id}>
                <button
                  onClick={() => toggleGroup(group.id)}
                  className="w-full flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition text-left"
                >
                  {expandedGroup === group.id ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                  <span className="text-sm">{group.name}</span>
                </button>

                <AnimatePresence>
                  {expandedGroup === group.id && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="ml-6 mt-1 space-y-1"
                    >
                      {group.tools.map((tool) => (
                        <button
                          key={tool.id}
                          onClick={() => handleSelectTool(tool)}
                          className={`
                            w-full px-3 py-2 text-sm rounded-lg transition
                            ${
                              selectedTool?.id === tool.id
                                ? 'bg-[#4F46E5] text-white'
                                : 'text-gray-600 hover:bg-gray-100'
                            }
                          `}
                        >
                          {tool.name}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm">Выйти</span>
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="flex-1 flex flex-col">
        {/* TOP BAR */}
        <header className="bg-white border-b border-gray-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 max-w-xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Поиск документов и запросов…"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4F46E5]"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 ml-6">
              <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
                <User className="w-5 h-5 text-gray-600" />
                <span className="text-sm text-gray-700">Профиль</span>
              </div>
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <div className="flex-1 p-8">
          {!selectedTool ? (
            <div className="max-w-4xl">
              <h1 className="text-3xl mb-4 text-gray-900">Библиотека инструментов</h1>
              <p className="text-lg text-gray-600">
                Выберите инструмент слева, чтобы начать работу.
              </p>
            </div>
          ) : (
            <motion.div
              key={selectedTool.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-6xl"
            >
              <h1 className="text-3xl mb-4 text-gray-900">
                {selectedTool.name}
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                {selectedTool.description}
              </p>

              {/* ----------------- АНАЛИЗ ДОКУМЕНТОВ ----------------- */}
              {isAnalysisTool ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* ЛЕВАЯ ПАНЕЛЬ */}
                  <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-indigo-50/40 via-white to-white p-6 shadow-sm">
                    <h2 className="text-lg font-semibold mb-3 text-gray-900">
                      Документ
                    </h2>
                    <p className="text-sm text-gray-500 mb-4">
                      Перетащите файл или вставьте текст. На MVP это демо-интерфейс. В боевой версии DEXLEY
                      будет анализировать PDF/DOCX через сервер и RAG.
                    </p>

                    <div
                      onDrop={handleDrop}
                      onDragOver={handleDragOver}
                      className="border-2 border-dashed border-gray-300 rounded-xl py-10 px-4 text-center text-gray-500 hover:border-[#4F46E5] hover:bg-indigo-50/60 transition"
                    >
                      <p className="mb-1 font-medium text-gray-700">
                        Перетащите документ сюда
                      </p>
                      <p className="text-xs text-gray-500">
                        Поддержка PDF/DOCX появится после подключения сервера. Сейчас — демо-режим.
                      </p>
                      {uploadedFileName && (
                        <p className="text-sm text-gray-700 mt-3">
                          Файл: {uploadedFileName}
                        </p>
                      )}
                    </div>

                    <div className="mt-6">
                      <label className="block text-sm mb-2 text-gray-700">
                        Предпросмотр текста
                      </label>
                      <div className="h-48 border border-gray-200 rounded-lg bg-gray-50 p-3 text-sm text-gray-700 overflow-auto whitespace-pre-wrap">
                        {documentPreview}
                      </div>
                    </div>
                  </div>

                  {/* ПРАВАЯ ПАНЕЛЬ */}
                  <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm flex flex-col">
                    <h2 className="text-lg font-semibold mb-3 text-gray-900">
                      Результат анализа
                    </h2>

                    <p className="text-sm text-gray-500 mb-3">
                      Режимы ниже — это встроенные baseline-промпты DEXLEY. Они задают стиль анализа.
                      Вы можете включить один из них и дополнительно уточнить задачу своими словами.
                    </p>

                    {/* пресеты режимов */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {[
                        'Краткая выжимка и структура',
                        'Поиск рисков и односторонних условий',
                        'Извлечение ключевых реквизитов',
                      ].map((mode) => {
                        const active = analysisPromptPreset === mode;
                        return (
                          <button
                            key={mode}
                            onClick={() =>
                              setAnalysisPromptPreset(active ? null : mode)
                            }
                            className={`px-3 py-1.5 rounded-full text-xs border transition ${
                              active
                                ? 'bg-[#4F46E5] text-white border-[#4F46E5]'
                                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {mode}
                          </button>
                        );
                      })}
                    </div>

                    {/* подсказка по активному режиму */}
                    {analysisPromptPreset && (
                      <div className="mb-4 text-xs text-gray-500 bg-gray-50 border border-dashed border-gray-300 rounded-lg px-3 py-2">
                        <span className="font-medium text-gray-700">
                          Встроенный промпт:
                        </span>{' '}
                        {analysisPromptPreset === 'Краткая выжимка и структура' &&
                          'DEXLEY делает структурированное резюме документа: цель, стороны, предмет, сроки, ключевые условия, суммы и вывод.'}
                        {analysisPromptPreset === 'Поиск рисков и односторонних условий' &&
                          'DEXLEY фокусируется на небалансе в пользу контрагента, жёстких санкциях, односторонних правах и скрытых рисках.'}
                        {analysisPromptPreset === 'Извлечение ключевых реквизитов' &&
                          'DEXLEY вынимает из текста реквизиты сторон, даты, суммы, сроки, штрафы и другие формальные параметры.'}
                      </div>
                    )}

                    {/* свободный промпт */}
                    <div className="mb-4">
                      <label className="block text-sm mb-2 text-gray-700">
                        Ваши дополнительные указания (опционально)
                      </label>
                      <textarea
                        className="w-full h-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F46E5] text-sm resize-none"
                        placeholder={
                          analysisPromptPreset
                            ? 'Например: «Сделай итоговое резюме для директора на 5–7 пунктов и отдельно выпиши самые жёсткие для нас условия».'
                            : 'Например: «Сделай общий обзор, укажи слабые места и предложи формулировки для их ослабления».'
                        }
                        value={analysisCustomPrompt}
                        onChange={(e) => setAnalysisCustomPrompt(e.target.value)}
                      />
                    </div>

                    <button
                      onClick={handleRunAnalysis}
                      className="self-start mb-4 px-6 py-3 bg-[#4F46E5] text-white rounded-lg hover:bg-[#4338CA] transition"
                    >
                      Проанализировать документ
                    </button>

                    <div className="flex-1 border border-gray-200 rounded-lg bg-gray-50 p-4 text-sm text-gray-800 overflow-auto">
                      {loading ? (
                        <div className="space-y-3 animate-pulse">
                          <div className="h-3 bg-gray-300 rounded w-3/4" />
                          <div className="h-3 bg-gray-300 rounded w-5/6" />
                          <div className="h-3 bg-gray-300 rounded w-2/3" />
                          <div className="h-3 bg-gray-300 rounded w-4/5" />
                        </div>
                      ) : analysisResult ? (
                        <pre className="whitespace-pre-wrap">
                          {analysisResult}
                        </pre>
                      ) : (
                        <span className="text-gray-400">
                          Результат появится здесь после анализа документа.
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ) : isConsultant ? (
                /* ----------------- ЧАТ КОНСУЛЬТАНТА ----------------- */
                <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 shadow-sm flex flex-col h-[600px] max-h-[75vh]">
                  <div className="mb-3 text-xs text-gray-500">
                    DEXLEY сфокусирован только на юридических вопросах. Если запрос не относится
                    к праву, бот вежливо попросит уточнить контекст.
                  </div>

                  {/* быстрые подсказки */}
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 mb-2">
                      Популярные запросы — нажмите, чтобы подставить:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {[
                        'Проверь договор аренды на риски для арендатора.',
                        'Объясни последствия просрочки оплаты по договору поставки.',
                        'Составь список документов для приёма сотрудника на работу.',
                      ].map((prompt) => (
                        <button
                          key={prompt}
                          onClick={() => setChatInput(prompt)}
                          className="px-3 py-1.5 rounded-full text-xs bg-gray-100 text-gray-800 hover:bg-gray-200 transition"
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* окно чата */}
                  <div className="flex-1 border border-gray-200 rounded-xl bg-gray-50 p-4 overflow-auto space-y-3">
                    {chatMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${
                          msg.role === 'user' ? 'justify-end' : 'justify-start'
                        }`}
                      >
                        <div
                          className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                            msg.role === 'user'
                              ? 'bg-[#4F46E5] text-white rounded-br-sm'
                              : 'bg-white text-gray-900 border border-gray-200 rounded-bl-sm'
                          }`}
                        >
                          {msg.content}
                        </div>
                      </div>
                    ))}

                    {chatSending && (
                      <div className="flex justify-start">
                        <div className="inline-flex items-center gap-2 px-3 py-2 rounded-2xl bg-white border border-gray-200 text-xs text-gray-500">
                          <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" />
                          <span className="w-2 h-2 rounded-full bg-gray-300 animate-bounce [animation-delay:0.12s]" />
                          <span className="w-2 h-2 rounded-full bg-gray-200 animate-bounce [animation-delay:0.24s]" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* поле ввода */}
                  <div className="mt-4">
                    <div className="mb-1 text-xs text-gray-400">
                      DEXLEY не заменяет адвоката, но помогает с навигацией по правовым вопросам и
                      формулировкой позиций.
                    </div>
                    <div className="flex gap-3 items-end">
                      <textarea
                        className="flex-1 min-h-[60px] max-h-[120px] px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F46E5] text-sm resize-none"
                        placeholder={
                          selectedTool.placeholder ||
                          'Опишите ситуацию: стороны, договор, суммы, сроки, что произошло и чего вы хотите добиться.'
                        }
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendChat();
                          }
                        }}
                      />
                      <button
                        onClick={handleSendChat}
                        className="px-5 py-2.5 bg-[#4F46E5] text-white rounded-lg hover:bg-[#4338CA] text-sm transition whitespace-nowrap disabled:opacity-60"
                        disabled={chatSending || !chatInput.trim()}
                      >
                        Отправить
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* ----------------- ГЕНЕРАЦИЯ ДОКУМЕНТОВ ----------------- */
                <div className="bg-white rounded-2xl border-2 border-gray-200 p-8 shadow-sm">
                  <div className="space-y-6">
                    <p className="text-sm text-gray-500">
                      Опишите условия, которые нужно включить в документ. DEXLEY соберёт аккуратный
                      юридический текст, который вы сможете доработать.
                    </p>

                    <div>
                      <label className="block text-sm mb-2 text-gray-700">
                        Детали документа
                      </label>
                      <textarea
                        className="w-full h-40 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent resize-none"
                        placeholder={selectedTool.placeholder}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                      />
                    </div>

                    <button
                      onClick={handleRunTextTool}
                      className="px-6 py-3 bg-[#4F46E5] text-white rounded-lg hover:bg-[#4338CA] transition"
                    >
                      Сгенерировать документ
                    </button>
                  </div>

                  {/* результат генерации */}
                  {generatedText && (
                    <div className="mt-8 border-t border-gray-200 pt-6">
                      <div className="flex items-center justify-between mb-3">
                        <h2 className="text-lg font-semibold text-gray-900">
                          Сгенерированный черновик
                        </h2>
                        <button
                          onClick={handleDownloadGenerated}
                          className="text-sm px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                        >
                          Скачать .txt
                        </button>
                      </div>

                      {loading ? (
                        <div className="space-y-3 animate-pulse">
                          <div className="h-3 bg-gray-300 rounded w-3/4" />
                          <div className="h-3 bg-gray-300 rounded w-5/6" />
                          <div className="h-3 bg-gray-300 rounded w-2/3" />
                        </div>
                      ) : (
                        <pre className="bg-gray-50 rounded-xl p-4 text-sm text-gray-800 whitespace-pre-wrap">
                          {generatedText}
                        </pre>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* ИСТОРИЯ */}
              {history.length > 0 && (
                <div className="mt-10">
                  <h2 className="text-sm font-medium text-gray-500 mb-3">
                    Недавние запросы
                  </h2>
                  <div className="space-y-2">
                    {history.slice(0, 5).map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-between bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm"
                      >
                        <div className="flex flex-col">
                          <span className="text-gray-900">
                            {item.toolName}
                          </span>
                          <span className="text-gray-500 truncate max-w-xl">
                            {item.promptPreview}
                          </span>
                        </div>
                        <span className="text-xs text-gray-400 ml-4 whitespace-nowrap">
                          {new Date(item.createdAt).toLocaleString('ru-RU', {
                            day: '2-digit',
                            month: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}
