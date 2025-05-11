import React, { useState } from 'react';
import { usePaint } from '../context/PaintContext';
import { Eye, EyeOff, Lock, Unlock, Plus, Trash, Edit } from 'lucide-react';

const LayerPanel: React.FC = () => {
  const { state, addLayer, removeLayer, setActiveLayer, toggleLayerVisibility, toggleLayerLock, renameLayer } = usePaint();
  const [editingLayerId, setEditingLayerId] = useState<string | null>(null);
  const [newLayerName, setNewLayerName] = useState('');
  
  const handleLayerClick = (index: number) => {
    setActiveLayer(index);
  };
  
  const handleAddLayer = () => {
    addLayer();
  };
  
  const handleRemoveLayer = (id: string) => {
    if (state.layers.length > 1) {
      removeLayer(id);
    }
  };
  
  const startRenaming = (layer: { id: string; name: string }) => {
    setEditingLayerId(layer.id);
    setNewLayerName(layer.name);
  };
  
  const handleRename = (id: string) => {
    if (newLayerName.trim()) {
      renameLayer(id, newLayerName.trim());
    }
    setEditingLayerId(null);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent, id: string) => {
    if (e.key === 'Enter') {
      handleRename(id);
    } else if (e.key === 'Escape') {
      setEditingLayerId(null);
    }
  };
  
  return (
    <div className="bg-neutral-900 border-l border-neutral-800 p-2 w-64 overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-medium text-white">Layers</h2>
        <button
          onClick={handleAddLayer}
          className="p-1.5 bg-blue-600 rounded hover:bg-blue-700 transition-colors"
          title="Add Layer"
        >
          <Plus size={16} />
        </button>
      </div>
      
      <div className="space-y-1">
        {state.layers.map((layer, index) => (
          <div
            key={layer.id}
            className={`flex items-center p-2 rounded cursor-pointer group
              ${state.activeLayerIndex === index ? 'bg-neutral-700' : 'hover:bg-neutral-800'}`}
            onClick={() => handleLayerClick(index)}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleLayerVisibility(layer.id);
              }}
              className="mr-2 text-neutral-400 hover:text-white"
              title={layer.visible ? 'Hide Layer' : 'Show Layer'}
            >
              {layer.visible ? <Eye size={16} /> : <EyeOff size={16} />}
            </button>
            
            {editingLayerId === layer.id ? (
              <input
                type="text"
                value={newLayerName}
                onChange={(e) => setNewLayerName(e.target.value)}
                onBlur={() => handleRename(layer.id)}
                onKeyDown={(e) => handleKeyDown(e, layer.id)}
                className="flex-1 bg-neutral-800 text-white px-2 py-0.5 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                autoFocus
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <span className="flex-1 truncate text-sm text-neutral-300">{layer.name}</span>
            )}
            
            <div className="flex space-x-1 ml-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  startRenaming(layer);
                }}
                className="p-1 text-neutral-400 hover:text-white rounded hover:bg-neutral-700"
                title="Rename Layer"
              >
                <Edit size={14} />
              </button>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleLayerLock(layer.id);
                }}
                className="p-1 text-neutral-400 hover:text-white rounded hover:bg-neutral-700"
                title={layer.locked ? 'Unlock Layer' : 'Lock Layer'}
              >
                {layer.locked ? <Lock size={14} /> : <Unlock size={14} />}
              </button>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveLayer(layer.id);
                }}
                className="p-1 text-neutral-400 hover:text-red-500 rounded hover:bg-neutral-700"
                title="Delete Layer"
                disabled={state.layers.length <= 1}
              >
                <Trash size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LayerPanel;