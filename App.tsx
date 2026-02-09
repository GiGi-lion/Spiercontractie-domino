import React, { useState, useEffect } from 'react';
import { DominoList } from './components/DominoList';
import { History } from './components/History';
import { FeedbackModal } from './components/FeedbackModal';
import { INITIAL_ITEMS, TOTAL_ITEMS } from './constants';
import { DominoItem, Attempt } from './types';
import { Activity, Lightbulb, CheckCircle, RotateCcw, BrainCircuit } from 'lucide-react';
import canvasConfetti from 'canvas-confetti';

// Helper to shuffle array
const shuffleArray = (array: DominoItem[]) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export default function App() {
  const [items, setItems] = useState<DominoItem[]>([]);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [lastScore, setLastScore] = useState(0);

  // Initialize with shuffled items
  useEffect(() => {
    setItems(shuffleArray(INITIAL_ITEMS));
    
    // Load attempts from local storage
    const savedAttempts = localStorage.getItem('han-domino-attempts');
    if (savedAttempts) {
      try {
        const parsed = JSON.parse(savedAttempts);
        // Convert string dates back to Date objects
        const hydrated = parsed.map((a: any) => ({
          ...a,
          timestamp: new Date(a.timestamp)
        }));
        setAttempts(hydrated);
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  // Save attempts when they change
  useEffect(() => {
    localStorage.setItem('han-domino-attempts', JSON.stringify(attempts));
  }, [attempts]);

  const handleReset = () => {
    setItems(shuffleArray(INITIAL_ITEMS.map(i => ({ ...i, isLocked: false }))));
    setHintsUsed(0);
    setShowFeedback(false);
  };

  const handleFullReset = () => {
    setAttempts([]); // This triggers the useEffect to clear localStorage
    handleReset();
  };

  const handleHint = () => {
    const incorrectlyPlacedItems = items.filter((item, index) => 
      index !== item.correctIndex && !item.isLocked
    );

    if (incorrectlyPlacedItems.length === 0) {
      alert("Joh, alles ligt al goed (of vast)! Je hebt geen spiekbriefje meer nodig.");
      return;
    }

    const randomItem = incorrectlyPlacedItems[Math.floor(Math.random() * incorrectlyPlacedItems.length)];
    
    // Swap mechanism to place hint
    const tempItems = [...items];
    const srcIndex = tempItems.findIndex(i => i.id === randomItem.id);
    const destIndex = randomItem.correctIndex;
    
    [tempItems[srcIndex], tempItems[destIndex]] = [tempItems[destIndex], tempItems[srcIndex]];
    
    const finalItems = tempItems.map(item => {
      if (item.id === randomItem.id) {
        return { ...item, isLocked: true };
      }
      return item;
    });

    setItems(finalItems);
    setHintsUsed(h => h + 1);
    setShowFeedback(false);
  };

  const handleCheck = () => {
    let userCorrectCount = 0;
    
    items.forEach((item, index) => {
      const isPositionCorrect = item.correctIndex === index;
      if (isPositionCorrect && !item.isLocked) {
        userCorrectCount++;
      }
    });

    const score = Math.round((userCorrectCount / TOTAL_ITEMS) * 100);

    setLastScore(score);
    
    const newAttempt: Attempt = {
      attemptNumber: attempts.length + 1,
      score: score,
      hintsUsed: hintsUsed,
      timestamp: new Date()
    };
    
    setAttempts([...attempts, newAttempt]);
    setShowFeedback(true);
    setModalOpen(true);

    if (score === 100) {
      const duration = 3000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 60 };
      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval: any = setInterval(function() {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) return clearInterval(interval);
        const particleCount = 50 * (timeLeft / duration);
        canvasConfetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
        canvasConfetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
      }, 250);
    }
  };

  return (
    <div 
        className="min-h-screen pb-20 font-inter relative"
        style={{
            backgroundImage: 'url("https://www.triplepartners.com/uploads/Picture-1.jpg")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed'
        }}
    >
      {/* Overlay to improve readability */}
      <div className="fixed inset-0 bg-rose-900/10 pointer-events-none" />

      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-rose-100 sticky top-0 z-10 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-han-red rounded-lg flex items-center justify-center text-white shadow-md shadow-red-200">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 tracking-tight">De Spier-Domino Challenge 🏋️</h1>
              <p className="text-xs text-gray-500">Sleep die fysiologische chaos weer op orde!</p>
            </div>
          </div>
          <div className="text-sm font-medium text-han-red bg-rose-50 px-3 py-1 rounded-full border border-rose-100">
             Poging #{attempts.length + 1}
          </div>
        </div>
      </header>

      <main className="relative max-w-5xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8 z-0">
        
        {/* Left Column: Domino List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white/95 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-rose-100">
             
             {/* Card Header with Check Button */}
             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-6 border-b border-gray-100">
                <div>
                    <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    De Puzzel
                    <span className="text-xs font-normal text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full border border-gray-200">Sliding Filament Theory</span>
                    </h2>
                    <div className="text-sm text-gray-400 italic mt-1">
                    {hintsUsed > 0 ? `${hintsUsed} hulplijn(en) ingezet 🆘` : 'Nog geen spiekhulp gebruikt 💪'}
                    </div>
                </div>

                <button 
                  onClick={handleCheck}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 text-base font-bold text-white bg-han-red rounded-lg hover:bg-red-700 shadow-md hover:shadow-lg transition-all transform active:scale-95"
                >
                  <CheckCircle className="w-5 h-5" /> Check it! 🚀
                </button>
             </div>
             
             <DominoList 
                items={items} 
                setItems={setItems} 
                showFeedback={showFeedback}
             />

             {/* Footer Actions */}
             <div className="mt-8 pt-6 border-t border-rose-50 flex gap-3">
                <button 
                onClick={handleReset}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
                >
                <RotateCcw className="w-4 h-4" /> Opnieuw husselen
                </button>
                <button 
                onClick={handleHint}
                disabled={hintsUsed >= TOTAL_ITEMS - 1}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-orange-700 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                <Lightbulb className="w-4 h-4" /> Spiekbriefje (+1)
                </button>
             </div>
          </div>
        </div>

        {/* Right Column: History & Stats */}
        <div className="lg:col-span-1 space-y-6">
          <History attempts={attempts} onClearHistory={handleFullReset} />
          
          <div className="bg-white/95 backdrop-blur-sm p-5 rounded-xl border border-rose-100 shadow-sm">
            <h3 className="font-bold mb-3 flex items-center gap-2 text-han-red">
              <BrainCircuit className="w-4 h-4" />
              Game Rules
            </h3>
            <ul className="list-disc list-inside space-y-2 ml-1 text-sm text-gray-600">
              <li>Orden de chaos: sleep de stappen naar de juiste plek.</li>
              <li>Vastloper? Koop een <span className="text-orange-600 font-medium">hint</span> (kost je wel eerpunten, valsspeler).</li>
              <li>Rode blokjes staan vast (gratis punten, soort van).</li>
              <li>Alleen bij <strong>100%</strong> (zonder kramp) krijg je confetti! 🎉</li>
            </ul>
          </div>
        </div>
      </main>

      <FeedbackModal 
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onRetry={() => {
          setModalOpen(false);
          handleReset();
        }}
        score={lastScore}
        hintsUsed={hintsUsed}
      />

      <footer className="absolute bottom-4 left-0 w-full text-center z-0">
         <span className="text-white/80 text-sm font-medium bg-black/20 px-3 py-1 rounded-full backdrop-blur-sm">
           HAN-ALO ©
         </span>
      </footer>
    </div>
  );
}