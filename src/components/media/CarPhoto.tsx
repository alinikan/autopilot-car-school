import { ImageOff } from 'lucide-react';
import { photoFor } from '../../content/photos/photos';
import type { CarPhotoRecord } from '../../content/photos/photos';
import { useState } from 'react';
import { RotateCcw } from 'lucide-react';

export function CarPhoto({
  photo,
  blind = false,
  priority = false,
  className = '',
}: {
  photo: string;
  blind?: boolean;
  priority?: boolean;
  className?: string;
}) {
  const record = photoFor(photo);
  return record ? (
    <PhotoFrame
      key={record.id}
      record={record}
      blind={blind}
      priority={priority}
      className={className}
    />
  ) : (
    <div className="photo-error" role="status">
      <ImageOff size={22} />
      <span>No verified photograph for this exact reference.</span>
    </div>
  );
}

function PhotoFrame({
  record,
  blind,
  priority,
  className,
}: {
  record: CarPhotoRecord;
  blind: boolean;
  priority: boolean;
  className: string;
}) {
  const [failed, setFailed] = useState(false);
  const [retry, setRetry] = useState(0);
  return (
    <div className={`car-photo-frame ${className}`} data-photo-id={record.id}>
      {failed ? (
        <div className="photo-error" role="status">
          <ImageOff size={24} />
          <span>The photo could not load.</span>
          <button
            className="text-button"
            onClick={() => {
              setRetry((n) => n + 1);
              setFailed(false);
            }}
          >
            <RotateCcw size={14} />
            Retry photo
          </button>
        </div>
      ) : (
        <img
          src={`/cars/${record.file}${retry ? '?retry=' + retry : ''}`}
          width={record.width}
          height={record.height}
          alt={
            blind
              ? 'Car to identify — use its body shape, badge and details'
              : `${record.label} — reference photograph`
          }
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}
