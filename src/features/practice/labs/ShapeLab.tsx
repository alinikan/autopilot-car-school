import { useState } from 'react';
import { CarShape } from '../../../components/illustrations/CarShape';

export function ShapeLab() {
  const [shape, setShape] = useState('sedan');
  const notes: Record<string, string> = {
    sedan: 'A separate trunk lid sits below the rear window. Three sections: hood, cabin, trunk.',
    hatchback: 'The rear door includes the rear window. The cargo area connects to the cabin.',
    suv: 'A taller cabin and higher seating position. Many SUVs also have a hatch-style rear door.',
    pickup: 'An open cargo bed behind the passenger cabin. Cabs and bed lengths vary.',
  };
  return (
    <div className="lab">
      <span className="eyebrow">LOOK AT THE OUTLINE</span>
      <CarShape type={shape} />
      <div className="segmented">
        {Object.keys(notes).map((s) => (
          <button className={shape === s ? 'selected' : ''} onClick={() => setShape(s)} key={s}>
            {s === 'suv' ? 'SUV' : s}
          </button>
        ))}
      </div>
      <p>{notes[shape]}</p>
      <small>Teaching silhouettes • proportions simplified</small>
    </div>
  );
}
