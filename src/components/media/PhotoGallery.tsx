import { Expand } from 'lucide-react';
import { useState } from 'react';
import { photoFor } from '../../content/photos/photos';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CarPhoto } from './CarPhoto';
import { Modal } from '../ui/Modal';

export function PhotoGallery({
  photos,
  note,
  blind = false,
}: {
  photos: string[];
  note?: string;
  blind?: boolean;
}) {
  return <Gallery key={photos.join('|')} photos={photos} note={note} blind={blind} />;
}

function Gallery({ photos, note, blind }: { photos: string[]; note?: string; blind: boolean }) {
  const [index, setIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const current = photos[index];
  const record = photoFor(current);
  if (!record) return null;
  const step = (n: number) => setIndex((i) => (i + n + photos.length) % photos.length);
  const controls = photos.length > 1 && (
    <div className="photo-navigation">
      <button className="icon-button" aria-label="Previous car photo" onClick={() => step(-1)}>
        <ChevronLeft size={20} />
      </button>
      <span aria-live="polite">
        Photo {index + 1} of {photos.length}
      </span>
      <button className="icon-button" aria-label="Next car photo" onClick={() => step(1)}>
        <ChevronRight size={20} />
      </button>
    </div>
  );
  return (
    <figure className="car-gallery">
      <div className="gallery-image">
        <CarPhoto photo={current} blind={blind} />
        <button
          className="photo-expand"
          onClick={() => setExpanded(true)}
          aria-label="Enlarge car photo"
        >
          <Expand size={16} />
          <span>Enlarge</span>
        </button>
      </div>
      {controls}
      <figcaption>
        {!blind && (
          <>
            <strong>Pictured: {record.label}</strong>
            <p>{record.reference}</p>
          </>
        )}
        {note && <p>{note}</p>}
        {!blind && (
          <a href={record.source} target="_blank" rel="noreferrer">
            Photo & credit ↗
          </a>
        )}
      </figcaption>
      {!blind && photos.length > 1 && (
        <div className="photo-choices" aria-label="Cars in this lesson">
          {photos.map((p, i) => (
            <button
              key={p}
              className={i === index ? 'active' : ''}
              aria-pressed={i === index}
              onClick={() => setIndex(i)}
            >
              {photoFor(p)?.label}
            </button>
          ))}
        </div>
      )}
      {expanded && (
        <Modal
          title={blind ? 'Car reference photograph' : record.label}
          close={() => setExpanded(false)}
          wide
          photo
        >
          <div className="photo-lightbox">
            <CarPhoto photo={current} blind={blind} priority />
            {controls}
            {!blind && (
              <>
                <p>
                  <b>{record.label}</b> · {record.reference}
                </p>
                <p className="small muted">
                  {record.artist} ·{' '}
                  <a href={record.licenseUrl} target="_blank" rel="noreferrer">
                    {record.license}
                  </a>{' '}
                  ·{' '}
                  <a href={record.source} target="_blank" rel="noreferrer">
                    Original photograph ↗
                  </a>
                </p>
              </>
            )}
          </div>
        </Modal>
      )}
    </figure>
  );
}
