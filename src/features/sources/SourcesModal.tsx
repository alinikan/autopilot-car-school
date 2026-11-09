import { carPhotos } from '../../content/photos/photos';
import { Modal } from '../../components/ui/Modal';
import { ExternalLink } from 'lucide-react';
import { brandCourses } from '../../content/courses/lesson-builder';
import { CarPhoto } from '../../components/media/CarPhoto';

export function Sources({ close }: { close: () => void }) {
  const credits = Object.values(carPhotos);
  return (
    <Modal title="Sources & image credits" close={close} wide>
      <p>
        Autopilot is a beginner learning course and a Canadian vehicle-data explorer. It does not
        claim to catalogue every vehicle in the world.
      </p>
      <div className="source-items">
        {[
          [
            'Brand emblems',
            'Cardog Icons / respective trademark owners',
            'https://github.com/cardog-ai/icons',
          ],
          [
            'Canadian vehicle specifications',
            'Natural Resources Canada / Open Government',
            'https://open.canada.ca/data/en/dataset/98f1a129-f628-4ce4-b24d-6f16bf24dd64',
          ],
          [
            'Fuel ratings explained',
            'Natural Resources Canada',
            'https://natural-resources.canada.ca/energy-efficiency/transportation-energy-efficiency/fuel-consumption-guide',
          ],
          [
            'Gasoline octane',
            'U.S. Department of Energy / EPA',
            'https://www.fueleconomy.gov/feg/octane.shtml',
          ],
          [
            'BC winter tire requirements',
            'Government of British Columbia',
            'https://www2.gov.bc.ca/gov/content/transportation/driving-and-cycling/traveller-information/seasonal/winter-driving/about-winter-tires',
          ],
          [
            'Winter tire guidance',
            'ICBC',
            'https://www.icbc.com/road-safety/safety-and-road-conditions/winter-tires-tips',
          ],
          ['BC vehicle insurance', 'ICBC', 'https://www.icbc.com/insurance'],
        ].map(([title, owner, url]) => (
          <a href={url} key={url} target="_blank" rel="noreferrer">
            <div>
              <b>{title}</b>
              <span>{owner}</span>
            </div>
            <ExternalLink size={16} />
          </a>
        ))}
      </div>
      <p className="small muted">
        Government data is used under the Open Government Licence – Canada. The library checks live
        government resources on load and falls back to an included snapshot. Data completeness
        depends on the source. Lessons are curated and are not automatically rewritten. Manufacturer
        courses cover selected families, including explicitly labelled recognition/used-car
        examples. Canadian price snapshots retain their model year, source and exclusions; verify
        current offers directly.
      </p>
      <h3>Manufacturer course sources</h3>
      <div className="source-items">
        {brandCourses.map((c) => (
          <a key={c.id} href={c.source} target="_blank" rel="noreferrer">
            <div>
              <b>{c.name}</b>
              <span>
                Official range · course snapshot 2026-11-08 · model and price references are also
                linked within each lesson
              </span>
            </div>
            <ExternalLink size={16} />
          </a>
        ))}
      </div>
      <h3>Photography & visual references</h3>
      <p className="small muted">
        Photos are recognition references and can show non-Canadian, historical or different-trim
        vehicles. Images are shown in full without layout cropping. Use Enlarge to inspect details.
        Brand emblems are supplied by Cardog Icons. Body silhouettes are simplified teaching
        illustrations. Brand names and emblems belong to their respective owners.
      </p>
      <div className="credit-list">
        {credits.map((c) => (
          <div key={c.id}>
            <CarPhoto photo={c.id} />
            <section>
              <a href={c.source} target="_blank" rel="noreferrer">
                {c.label} reference photo ↗
              </a>
              <p>
                {c.artist} ·{' '}
                <a href={c.licenseUrl} target="_blank" rel="noreferrer">
                  {c.license}
                </a>
              </p>
            </section>
          </div>
        ))}
      </div>
    </Modal>
  );
}
