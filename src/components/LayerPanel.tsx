import React, { useState } from 'react';
import { usePaint } from '../context/PaintContext';
import { Eye, EyeOff, Lock, Unlock, Plus, Trash, Edit, GripVertical } from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SortableLayerItemProps {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
  isActive: boolean;
  onVisibilityToggle: () => void;
  onLockToggle: () => void;
  onRename: (name: string) => void;
  onRemove: () => void;
  onClick: () => void;
}

const SortableLayerItem: React.FC<SortableLayerItemProps> = ({
  id,
  name,
  visible,
  locked,
  isActive,
  onVisibilityToggle,
  onLockToggle,
  onRename,
  onRemove,
  onClick,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(name);
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleRename = () => {
    if (newName.trim()) {
      onRename(newName.trim());
    }
    setIsEditing(false);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`flex items-center p-2 rounded cursor-pointer group
        ${isActive ? 'bg-neutral-700' : 'hover:bg-neutral-800'}`}
      onClick={onClick}
    >
      <button
        className="mr-2 text-neutral-400 hover:text-white cursor-grab"
        {...listeners}
      >
        <GripVertical size={16} />
      </button>
      
      <button
        onClick={(e) => {
          e.stopPropagation();
          onVisibilityToggle();
        }}
        className="mr-2 text-neutral-400 hover:text-white"
        title={visible ? 'Hide Layer' : 'Show Layer'}
      >
        {visible ? <Eye size={16} /> : <EyeOff size={16} />}
      </button>
      
      {isEditing ? (
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onBlur={handleRename}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleRename();
            if (e.key === 'Escape') setIsEditing(false);
          }}
          className="flex-1 bg-neutral-800 text-white px-2 py-0.5 rounded text-sm focus:outline-none focus:ring-1 focus:ring-yellow-500"
          autoFocus
          onClick={(e) => e.stopPropagation()}
        />
      ) : (
        <span className="flex-1 truncate text-sm text-neutral-300">{name}</span>
      )}
      
      <div className="flex space-x-1 ml-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsEditing(true);
          }}
          className="p-1 text-neutral-400 hover:text-white rounded hover:bg-neutral-700"
          title="Rename Layer"
        >
          <Edit size={14} />
        </button>
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            onLockToggle();
          }}
          className="p-1 text-neutral-400 hover:text-white rounded hover:bg-neutral-700"
          title={locked ? 'Unlock Layer' : 'Lock Layer'}
        >
          {locked ? <Lock size={14} /> : <Unlock size={14} />}
        </button>
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="p-1 text-neutral-400 hover:text-red-500 rounded hover:bg-neutral-700"
          title="Delete Layer"
        >
          <Trash size={14} />
        </button>
      </div>
    </div>
  );
};

const LayerPanel: React.FC = () => {
  const { 
    state, 
    addLayer, 
    removeLayer, 
    setActiveLayer, 
    toggleLayerVisibility, 
    toggleLayerLock, 
    renameLayer,
    reorderLayers,
  } = usePaint();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      const oldIndex = state.layers.findIndex(layer => layer.id === active.id);
      const newIndex = state.layers.findIndex(layer => layer.id === over.id);
      reorderLayers(oldIndex, newIndex);
    }
  };

  return (
    <div className="bg-neutral-900 border-l border-neutral-800 p-2 w-64 overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-medium text-white">Layers</h2>
        <button
          onClick={addLayer}
          className="p-1.5 bg-yellow-600 rounded hover:bg-yellow-700 transition-colors"
          title="Add Layer"
        >
          <Plus size={16} />
        </button>
      </div>
      
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={state.layers.map(layer => layer.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-1">
            {state.layers.map((layer, index) => (
              <SortableLayerItem
                key={layer.id}
                id={layer.id}
                name={layer.name}
                visible={layer.visible}
                locked={layer.locked}
                isActive={state.activeLayerIndex === index}
                onVisibilityToggle={() => toggleLayerVisibility(layer.id)}
                onLockToggle={() => toggleLayerLock(layer.id)}
                onRename={(name) => renameLayer(layer.id, name)}
                onRemove={() => removeLayer(layer.id)}
                onClick={() => setActiveLayer(index)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default LayerPanel;