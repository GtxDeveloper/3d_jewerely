export const renderConfig = {
  gold: {
    color: '#FFD700',
    metalness: 1.0,
    roughness: 0.15,
    envMapIntensity: 2.0,
  },
  diamond: {
    bounces: 3,
    ior: 2.4,
    fresnel: 1.0,
    aberrationStrength: 0.04,
    color: 'white',
    fastChroma: true,
  },
} as const;
