import { useState } from 'react';

export function CylinderLab() {
  const [count, setCount] = useState(4);
  const [running, setRunning] = useState(true);
  return (
    <div className="lab">
      <span className="eyebrow">INSIDE A COMBUSTION ENGINE</span>
      <div className={`engine ${running ? 'running' : ''}`}>
        {Array.from({ length: count }, (_, i) => (
          <div className="cylinder" key={i}>
            <span className="spark">✦</span>
            <div className="piston" style={{ animationDelay: `-${i * 0.22}s` }} />
            <small>{i + 1}</small>
          </div>
        ))}
      </div>
      <div className="segmented">
        {[3, 4, 6, 8].map((n) => (
          <button className={count === n ? 'selected' : ''} onClick={() => setCount(n)} key={n}>
            {n} cylinders
          </button>
        ))}
      </div>
      <button className="text-button" onClick={() => setRunning(!running)}>
        {running ? 'Pause' : 'Play'} animation
      </button>
      <p>
        {count} chambers, each with a moving piston. This is a simplified teaching animation, not an
        engine’s actual firing order.
      </p>
    </div>
  );
}
