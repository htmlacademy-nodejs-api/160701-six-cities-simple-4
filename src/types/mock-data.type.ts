const mockKeys = [
  'titles',
  'descriptions',
  'offerPreview',
  'offerImages',
  'offerFeatures',
  'cities',
  'users',
  'emails',
  'avatars',
  'passwords',
] as const;
export type MockKeys = (typeof mockKeys)[number];

export type MockData = Record<MockKeys, string[]>;
