const mockKeys = [
  'titles',
  'descriptions',
  'offerPreview',
  'offerImages',
  'users',
  'emails',
  'avatars',
] as const;
export type MockKeys = (typeof mockKeys)[number];

export type MockData = Record<MockKeys, string[]>;
