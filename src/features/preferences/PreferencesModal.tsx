import type { Progress } from '../../domain/learning.mjs';
import { useRef, useState } from 'react';
import { today, validateProgress } from '../../domain/learning.mjs';
import { Modal } from '../../components/ui/Modal';
import { Check, Download, MapPin, ShieldCheck, Upload } from 'lucide-react';

export function Preferences({
  progress,
  update,
  close,
}: {
  progress: Progress;
  update: (p: Progress | ((p: Progress) => Progress)) => void;
  close: () => void;
}) {
  const [message, setMessage] = useState('');
  const input = useRef<HTMLInputElement>(null);
  const exportData = () => {
    const blob = new Blob([JSON.stringify(progress, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `autopilot-progress-${today()}.json`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  return (
    <Modal title="Learning preferences" close={close}>
      <span className="eyebrow">DAILY LEARNING GOAL</span>
      <p>Pick a comfortable rhythm. You can change it any time.</p>
      <div className="goal-options">
        {[5, 10, 15].map((n) => (
          <button
            key={n}
            className={progress.dailyGoal === n ? 'selected' : ''}
            onClick={() => update((p) => ({ ...p, dailyGoal: n }))}
          >
            <b>{n} min</b>
            <span>
              {n === 5 ? 'Easy does it' : n === 10 ? 'A little momentum' : 'Feeling curious'}
            </span>
            {progress.dailyGoal === n && <Check size={16} />}
          </button>
        ))}
      </div>
      <div className="preference-region">
        <MapPin size={20} />
        <div>
          <b>British Columbia, Canada</b>
          <p>CAD · kilometres · litres · Pacific time</p>
        </div>
      </div>
      <h3>Your progress, in your hands.</h3>
      <p className="small muted">
        Export a backup or restore one. Importing replaces the progress currently shown and syncs it
        to your account if signed in.
      </p>
      <div className="backup-buttons">
        <button className="btn outline" onClick={exportData}>
          <Download size={16} /> Export backup
        </button>
        <button className="btn outline" onClick={() => input.current?.click()}>
          <Upload size={16} /> Import backup
        </button>
      </div>
      <input
        hidden
        type="file"
        accept="application/json,.json"
        ref={input}
        onChange={async (e) => {
          const f = e.target.files?.[0];
          if (!f) return;
          try {
            if (f.size > 2000000) throw Error('File too large');
            const d = JSON.parse(await f.text());
            if (!validateProgress(d)) throw Error('Not a valid Autopilot backup');
            if (window.confirm('Replace your current progress with this backup?')) {
              update(d);
              setMessage('Your backup has been restored.');
            }
          } catch (err) {
            setMessage(err instanceof Error ? err.message : 'Could not import backup');
          }
          e.target.value = '';
        }}
      />
      {message && (
        <p role="status" className="form-message">
          {message}
        </p>
      )}
      <div className="privacy-note">
        <ShieldCheck size={17} />
        <p>
          Guest progress stays in this browser. Signed-in progress is stored in your private
          database record. You can remove account progress by contacting the project owner; no
          advertising trackers are included.
        </p>
      </div>
    </Modal>
  );
}
