import React from 'react';
import { Reorder, useDragControls, motion } from 'framer-motion';
import { DominoItem } from '../types';
import { Lock, GripVertical, CheckCircle2, XCircle } from 'lucide-react';

interface DominoListProps {
  items: DominoItem[];
  setItems: (items: DominoItem[]) => void;
  showFeedback: boolean;
}

const Item = ({ item, showFeedback }: { item: DominoItem, showFeedback: boolean }) => {
  const controls = useDragControls();

  // Determine border/bg color based on state
  // Using 'muscle' themed colors (rose/red based)
  let borderColor = "border-muscle-200";
  let bgColor = "bg-white";
  let icon = <GripVertical className="w-5 h-5 text-muscle-300" />;
  
  if (item.isLocked) {
    borderColor = "border-han-red";
    bgColor = "bg-rose-50";
    icon = <Lock className="w-5 h-5 text-han-red" />;
  } else if (showFeedback) {
     // Feedback handled via overlay, base style remains clean
  }

  return (
    <Reorder.Item
      value={item}
      id={item.id}
      dragListener={!item.isLocked}
      dragControls={controls}
      layout
      className={`relative flex items-center p-4 mb-3 rounded-lg border-2 shadow-sm transition-all ${borderColor} ${bgColor} ${item.isLocked ? 'cursor-not-allowed opacity-90' : 'cursor-grab active:cursor-grabbing hover:border-han-red/50'}`}
    >
      <div className="mr-4 flex-shrink-0">
        {icon}
      </div>
      <div className="flex-grow font-medium text-gray-800 select-none">
        {item.content}
      </div>
      
      {/* Visual Feedback Overlay (only when Checked) */}
      {showFeedback && !item.isLocked && (
        <div className="absolute right-4">
           {/* Placeholder for alignment */}
        </div>
      )}
    </Reorder.Item>
  );
};

export const DominoList: React.FC<DominoListProps> = ({ items, setItems, showFeedback }) => {
  return (
    <Reorder.Group axis="y" values={items} onReorder={setItems} className="w-full max-w-2xl mx-auto space-y-0">
      {items.map((item, index) => {
        const isCorrectPosition = item.correctIndex === index;
        
        return (
          <div key={item.id} className="relative group">
            <Item item={item} showFeedback={showFeedback} />
            
            {showFeedback && !item.isLocked && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none z-10">
                {isCorrectPosition ? (
                   <CheckCircle2 className="w-6 h-6 text-green-500 fill-white" />
                ) : (
                   <XCircle className="w-6 h-6 text-orange-400 fill-white" />
                )}
              </div>
            )}
          </div>
        );
      })}
    </Reorder.Group>
  );
};