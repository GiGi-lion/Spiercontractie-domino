import React from 'react';
import { Reorder, useDragControls } from 'framer-motion';
import { DominoItem } from '../types';
import { Lock, GripVertical, XCircle } from 'lucide-react';

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
      // VERANDERD: transition-all weggehaald en vervangen door transition-colors.
      // transition-all zorgt voor vertraging (lag) tijdens het slepen omdat het de transform probeert te animeren.
      className={`relative flex items-center p-4 mb-3 rounded-lg border-2 shadow-sm transition-colors duration-200 ${borderColor} ${bgColor} ${item.isLocked ? 'cursor-not-allowed opacity-90' : 'cursor-grab active:cursor-grabbing hover:border-han-red/50'}`}
      style={{ touchAction: 'none' }}
    >
      <div 
        className="mr-4 flex-shrink-0 cursor-grab active:cursor-grabbing"
        onPointerDown={(e) => {
           if(!item.isLocked) controls.start(e);
        }}
      >
        {icon}
      </div>
      <div className="flex-grow font-medium text-gray-800 select-none">
        {item.content}
      </div>
      
      {/* Visual Feedback Overlay (only when Checked) */}
      {showFeedback && !item.isLocked && (
        <div className="absolute right-4 pointer-events-none">
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
            
            {showFeedback && !item.isLocked && !isCorrectPosition && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none z-10">
                   <XCircle className="w-6 h-6 text-orange-400 fill-white" />
              </div>
            )}
          </div>
        );
      })}
    </Reorder.Group>
  );
};