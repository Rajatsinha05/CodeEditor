import React from 'react';
import { Layout, LayoutDashboard, Minimize2, Maximize2 } from 'lucide-react';

const TemplateSelector = ({ activeTemplate, setActiveTemplate, scale, setScale }) => {
  const templates = [
    { id: 'modern', name: 'Modern', icon: LayoutDashboard },
    { id: 'minimal', name: 'Minimal', icon: Layout },
    { id: 'creative', name: 'Creative', icon: Layout },
    { id: 'professional', name: 'Professional', icon: Layout },
    { id: 'elegant', name: 'Elegant', icon: Layout }
  ];

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4">
      <div className="flex flex-wrap justify-center gap-2">
        {templates.map(template => {
          const Icon = template.icon;
          return (
            <button
              key={template.id}
              onClick={() => setActiveTemplate(template.id)}
              className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 ${
                activeTemplate === template.id
                  ? 'bg-blue-600 text-white shadow-lg scale-105'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Icon size={18} />
              {template.name}
            </button>
          );
        })}
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => setScale(prev => Math.max(0.5, prev - 0.1))}
          className="p-2 rounded-lg bg-white text-gray-600 hover:bg-gray-50"
          title="Zoom Out"
        >
          <Minimize2 size={18} />
        </button>
        <span className="min-w-[60px] text-center">
          {Math.round(scale * 100)}%
        </span>
        <button
          onClick={() => setScale(prev => Math.min(1.5, prev + 0.1))}
          className="p-2 rounded-lg bg-white text-gray-600 hover:bg-gray-50"
          title="Zoom In"
        >
          <Maximize2 size={18} />
        </button>
      </div>
    </div>
  );
};

export default TemplateSelector;