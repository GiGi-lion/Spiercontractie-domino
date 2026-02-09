import React from 'react';
import { X, Trophy, AlertCircle, ThumbsUp } from 'lucide-react';

interface FeedbackModalProps {
  score: number;
  hintsUsed: number;
  isOpen: boolean;
  onClose: () => void;
  onRetry: () => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ score, hintsUsed, isOpen, onClose, onRetry }) => {
  if (!isOpen) return null;

  const isPerfect = score === 100;
  const isPass = score >= 55;
  const maxPossible = Math.round(((10 - hintsUsed) / 10) * 100);

  let title = "Spierscheuring... 🤕";
  let message = "Ai, deze contractie loopt nog niet soepel. De volgorde rammelt aan alle kanten.";
  let HeaderIcon = AlertCircle;
  let bgClass = "bg-han-red"; // Default fail color

  if (isPerfect) {
    title = "BAM! GOUD! 🥇";
    message = "Olympisch niveau! Je snapt de 'Sliding Filament Theory' beter dan Huxley zelf. Lekker bezig!";
    HeaderIcon = Trophy;
    bgClass = "bg-green-600";
  } else if (isPass) {
    title = "Lekkere warming-up 👍";
    message = "Je zit in de goede flow, maar we gaan voor goud. Nog even finetunen die handel!";
    HeaderIcon = ThumbsUp;
    bgClass = "bg-orange-500";
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden transform transition-all scale-100 border border-gray-100">
        <div className={`p-6 text-white ${bgClass}`}>
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
                <HeaderIcon className="w-7 h-7" />
                <h2 className="text-2xl font-bold">{title}</h2>
            </div>
            <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>
          <p className="mt-2 text-white/95 font-medium">
            {message}
          </p>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex justify-between items-center py-3 border-b border-gray-100">
            <span className="text-gray-600">Jouw prestatie</span>
            <span className={`text-4xl font-bold ${isPass ? 'text-green-600' : 'text-han-red'}`}>
              {score}%
            </span>
          </div>

          <div className="space-y-2 text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between">
              <span>Hulplijnen ingezet:</span>
              <span className="font-medium text-gray-900">{hintsUsed}</span>
            </div>
            <div className="flex justify-between">
              <span>Eerlijke max. score (zonder hints):</span>
              <span className="font-medium text-gray-900">{maxPossible}%</span>
            </div>
            <p className="text-xs text-gray-400 mt-2 italic border-t border-gray-200 pt-2">
              *Pro-tip: Echte kampioenen doen het zonder spiekbriefjes voor die 100%!
            </p>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={onRetry}
              className="flex-1 px-4 py-3 bg-han-dark text-white font-medium rounded-lg hover:bg-black transition-colors shadow-lg shadow-black/10"
            >
              Nog een rondje knallen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};