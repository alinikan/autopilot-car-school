export type Vehicle = {
  id: string;
  year: number;
  make: string;
  model: string;
  body: string;
  engine: string | null;
  cylinders: string | null;
  transmission: string;
  fuel: string;
  city: string | null;
  highway: string | null;
  combined: string | null;
  kwh: string | null;
  range: string | null;
  motor: string | null;
  gasCombined: string | null;
};

export type Catalogue = {
  source: string;
  checked: string;
  coverage: string;
  vehicles: Vehicle[];
  resources: { name: string; url: string; updated: string }[];
};
