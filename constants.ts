import { DominoItem } from './types';

// The correct sequence of steps for Muscle Contraction.
const RAW_STEPS = [
  "Motorische impuls vanuit hersenen of ruggenmerg",
  "Zenuwuiteinde scheidt acetylcholine uit",
  "Calcium (Ca2+) komt vrij in spiervezel",
  "Bindingsplaats op actine komt vrij",
  "Myosinekopje bindt aan bindingsplaats op actine",
  "Myosinekopje klapt om (‘power stroke’)",
  "ATP bindt aan Myosine",
  "Myosine ontkoppelt van de actine",
  "ATP splitst in ADP + P",
  "Myosine gaat terug naar de beginpositie"
];

export const INITIAL_ITEMS: DominoItem[] = RAW_STEPS.map((step, index) => ({
  id: `item-${index}`,
  content: step,
  correctIndex: index,
  isLocked: false,
}));

export const MAX_SCORE = 100;
export const TOTAL_ITEMS = 10;