import React from 'react';
import { Attempt } from '../types';
import { History as HistoryIcon, Lightbulb, Trash2 } from 'lucide-react';

interface HistoryProps {
  attempts: Attempt[];
  onClearHistory: () => void;
}

export const History: React.FC<HistoryProps> = ({ attempts, onClearHistory }) => {
  return (
    <div className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-md border border-gray-100 h-fit sticky top-24 transition-all z-10">
      <div className="flex items-center justify-between mb-4 text-han-dark">
        <div className="flex items-center gap-2">
            <HistoryIcon className="w-5 h-5" />
            <h2 className="text-lg font-bold">Jouw Track Record</h2>
        </div>
        {attempts.length > 0 && (
          <button 
              onClick={(e) => {
                e.stopPropagation();
                onClearHistory();
              }}
              className="group flex items-center gap-1.5 text-xs uppercase tracking-wide font-bold text-gray-400 hover:text-han-red transition-colors px-2 py-1 rounded hover:bg-red-50 cursor-pointer"
              title="Wis al je bloed, zweet en tranen"
          >
              <Trash2 className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
              Wissen
          </button>
        )}
      </div>
      
      {attempts.length === 0 ? (
        <div className="text-sm text-gray-400 italic text-center py-4 border border-dashed border-gray-200 rounded-lg">
          Nog geen zweetdruppels gevallen. 
          <br />
          Sleep die blokken en laat zien wat je kan!
        </div>
      ) : (
        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1 custom-scrollbar">
          {attempts.slice().reverse().map((attempt) => (
            <div 
              key={attempt.attemptNumber} 
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg text-sm border border-gray-100"
            >
              <div>
                <span className="font-semibold text-gray-700">Poging {attempt.attemptNumber}</span>
                <div className="text-xs text-gray-500 mt-0.5">
                  {attempt.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </div>
              </div>
              <div className="text-right">
                <div className={`font-bold text-lg ${attempt.score >= 55 ? 'text-green-600' : 'text-han-red'}`}>
                  {attempt.score}%
                </div>
                {attempt.hintsUsed > 0 && (
                  <div className="flex items-center justify-end gap-1 text-xs text-gray-500">
                    <Lightbulb className="w-3 h-3" />
                    <span>{attempt.hintsUsed} spiekhulp{attempt.hintsUsed !== 1 ? 'jes' : 'je'}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};