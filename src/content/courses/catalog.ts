import tesla from './manufacturers/tesla.json' with { type: 'json' };
import toyota from './manufacturers/toyota.json' with { type: 'json' };
import honda from './manufacturers/honda.json' with { type: 'json' };
import hyundai from './manufacturers/hyundai.json' with { type: 'json' };
import subaru from './manufacturers/subaru.json' with { type: 'json' };
import ford from './manufacturers/ford.json' with { type: 'json' };
import chevrolet from './manufacturers/chevrolet.json' with { type: 'json' };
import kia from './manufacturers/kia.json' with { type: 'json' };
import nissan from './manufacturers/nissan.json' with { type: 'json' };
import volkswagen from './manufacturers/volkswagen.json' with { type: 'json' };
import gmc from './manufacturers/gmc.json' with { type: 'json' };
import ram from './manufacturers/ram.json' with { type: 'json' };
import mitsubishi from './manufacturers/mitsubishi.json' with { type: 'json' };
import jeep from './manufacturers/jeep.json' with { type: 'json' };
import mazda from './manufacturers/mazda.json' with { type: 'json' };
import bmw from './manufacturers/bmw.json' with { type: 'json' };
import mercedesBenz from './manufacturers/mercedes-benz.json' with { type: 'json' };
import lexus from './manufacturers/lexus.json' with { type: 'json' };
import audi from './manufacturers/audi.json' with { type: 'json' };
import fiat from './manufacturers/fiat.json' with { type: 'json' };
import genesis from './manufacturers/genesis.json' with { type: 'json' };
import mini from './manufacturers/mini.json' with { type: 'json' };
import peugeot from './manufacturers/peugeot.json' with { type: 'json' };
import porsche from './manufacturers/porsche.json' with { type: 'json' };
import volvo from './manufacturers/volvo.json' with { type: 'json' };

import type { BrandCourse } from './types.ts';

/** Preserve the editorial order used by saved lessons and review history. */
const courses = [
  tesla,
  toyota,
  honda,
  hyundai,
  subaru,
  ford,
  chevrolet,
  kia,
  nissan,
  volkswagen,
  gmc,
  ram,
  mitsubishi,
  jeep,
  mazda,
  bmw,
  mercedesBenz,
  lexus,
  audi,
  fiat,
  genesis,
  mini,
  peugeot,
  porsche,
  volvo,
] as BrandCourse[];
export default courses;
