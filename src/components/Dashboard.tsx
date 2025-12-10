import { useState } from 'react';
import { ChevronDown, ChevronRight, LogOut, Search, User } from 'lucide-react';

interface DashboardProps {
  onLogout: () => void;
}

interface Tool {
  id: string;
  name: string;
  description: string;
}

interface ToolGroup {
  id: string;
  name: string;
  tools: Tool[];
}

const toolGroups: ToolGroup[] = [
  {
    id: 'consultant',
    name: 'AI Бот Юрист-Консультант',
    tools: [
      {
        id: 'consultant-main',
        name: 'Юридическая консультация',
        description: 'Получите мгновенные ответы на юридические вопросы, рекомендации по действиям и разъяснения законодательства'
      }
    ]
  },
  {
    id: 'generation',
    name: 'Генерация документов',
    tools: [
      {
        id: 'template-extension',
        name: 'Доп. соглашение о продлении',
        description: 'Генерирует готовый шаблон дополнительного соглашения о продлении срока действия договора с автоматическим заполнением данных'
      },
      {
        id: 'template-penalty',
        name: 'Претензия о неустойке',
        description: 'Создаёт претензию о взыскании неустойки с расчётами и ссылками на законодательство на основе ваших данных'
      },
      {
        id: 'template-guarantee',
        name: 'Запрос гарантийного письма',
        description: 'Формирует официальный запрос гарантийного письма с указанием всех необходимых реквизитов и условий'
      }
    ]
  },
  {
    id: 'documents',
    name: 'Анализ документов',
    tools: [
      {
        id: 'doc-summary',
        name: 'Краткая выжимка',
        description: 'TL;DR любого документа — основные положения, ключевые условия и важные даты в сжатом виде'
      },
      {
        id: 'doc-risks',
        name: 'Проверка рисков',
        description: 'Автоматическое выявление слабых пунктов, потенциальных угроз и невыгодных условий в документах'
      },
      {
        id: 'doc-extraction',
        name: 'Извлечение данных',
        description: 'Автоматическое извлечение структурированных данных из документов: реквизиты, суммы, даты, стороны сделки'
      },
      {
        id: 'doc-translation',
        name: 'Перевод + анализ',
        description: 'Перевод юридических документов с сохранением терминологии и одновременным анализом содержания'
      }
    ]
  }
];

export function Dashboard({ onLogout }: DashboardProps) {
  const [expandedGroup, setExpandedGroup] = useState<string | null>('generation');
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);

  const toggleGroup = (groupId: string) => {
    setExpandedGroup(expandedGroup === groupId ? null : groupId);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="text-xl tracking-tight">
            <span className="text-[#4F46E5]">Юрист</span>
            <span className="text-gray-900">ИИ</span>
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
                  className="w-full flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors text-left"
                >
                  {expandedGroup === group.id ? (
                    <ChevronDown className="w-4 h-4 flex-shrink-0" />
                  ) : (
                    <ChevronRight className="w-4 h-4 flex-shrink-0" />
                  )}
                  <span className="text-sm">{group.name}</span>
                </button>
                
                {expandedGroup === group.id && (
                  <div className="ml-6 mt-1 space-y-1">
                    {group.tools.map((tool) => (
                      <button
                        key={tool.id}
                        onClick={() => setSelectedTool(tool)}
                        className={`
                          w-full px-3 py-2 text-sm text-left rounded-lg transition-colors
                          ${selectedTool?.id === tool.id
                            ? 'bg-[#4F46E5] text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                          }
                        `}
                      >
                        {tool.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </nav>
        
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm">Выйти</span>
          </button>
        </div>
      </aside>
      
      {/* Main content */}
      <main className="flex-1 flex flex-col">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 max-w-xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Поиск..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-3 ml-6">
              <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg">
                <User className="w-5 h-5 text-gray-600" />
                <span className="text-sm text-gray-700">Nar Praditya</span>
              </div>
            </div>
          </div>
        </header>
        
        {/* Content area */}
        <div className="flex-1 p-8">
          {selectedTool ? (
            <div className="max-w-4xl">
              <h1 className="text-3xl mb-4 text-gray-900">
                {selectedTool.name}
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                {selectedTool.description}
              </p>
              
              <div className="bg-white rounded-2xl border-2 border-gray-200 p-8">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm mb-2 text-gray-700">
                      Введите данные или загрузите документ
                    </label>
                    <textarea
                      className="w-full h-40 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent resize-none"
                      placeholder="Опишите ситуацию или вставьте текст документа..."
                    />
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <button className="px-6 py-3 bg-[#4F46E5] text-white rounded-lg hover:bg-[#4338CA] transition-colors">
                      Обработать
                    </button>
                    <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                      Загрузить файл
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-4xl">
              <h1 className="text-3xl mb-4 text-gray-900">
                Библиотека инструментов
              </h1>
              <p className="text-lg text-gray-600">
                Выберите инструмент из списка слева для начала работы
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}