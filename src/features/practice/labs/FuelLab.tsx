import { useState } from 'react';

export function FuelLab() {
  const [rating, setRating] = useState(7);
  const [distance, setDistance] = useState(300);
  const [price, setPrice] = useState(1.8);
  const litres = (rating * distance) / 100;
  return (
    <div className="lab fuel-lab">
      <span className="eyebrow">TRY THE NUMBERS</span>
      <label>
        Fuel consumption <b>{rating.toFixed(1)} L/100 km</b>
        <input
          type="range"
          min="3"
          max="18"
          step=".1"
          value={rating}
          onChange={(e) => setRating(+e.target.value)}
        />
      </label>
      <div className="two-inputs">
        <label>
          Distance (km)
          <input
            type="number"
            min="0"
            max="100000"
            value={distance}
            onChange={(e) => setDistance(Math.max(0, Math.min(100000, +e.target.value)))}
          />
        </label>
        <label>
          Gas price (CAD/L)
          <input
            type="number"
            min="0"
            max="10"
            step=".01"
            value={price}
            onChange={(e) => setPrice(Math.max(0, Math.min(10, +e.target.value)))}
          />
        </label>
      </div>
      <div className="fuel-result">
        <div>
          <b>{litres.toFixed(1)} L</b>
          <span>estimated fuel</span>
        </div>
        <div>
          <b>${(litres * price).toFixed(2)}</b>
          <span>estimated cost · CAD</span>
        </div>
      </div>
      <small>Illustrative estimate, not a current pump price or real-world guarantee.</small>
    </div>
  );
}
