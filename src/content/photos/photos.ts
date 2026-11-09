import photoData from './manifest.json';

export type CarPhotoRecord = {
  id: string;
  make: string;
  label: string;
  file: string;
  width: number;
  height: number;
  source: string;
  license: string;
  licenseUrl: string;
  artist: string;
  description: string;
  reference: string;
};
export const carPhotos = photoData as Record<string, CarPhotoRecord>;
const aliases: Record<string, string> = {
  corolla: 'toyota-corolla',
  civic: 'honda-civic',
  model3: 'tesla-3',
  cx5: 'mazda-cx5',
  '911': 'porsche-911',
  mazda3: 'mazda-3-sedan',
  cx30: 'mazda-cx30',
  bmw3: 'bmw-3',
  rav4: 'toyota-rav4',
  crv: 'honda-crv',
  outlander: 'mitsubishi-outlander',
  modely: 'tesla-y',
  forester: 'subaru-forester',
  f150: 'ford-f150',
};
export function photoFor(key: string) {
  return carPhotos[key] || carPhotos[aliases[key]];
}
