const Constants = {
  ACCESS_TOKEN_EXPIRY: '1d', // 1 day
  REFRESH_TOKEN_EXPIRY: '7d', // 7 days
  REFRESH_TOKEN_EXPIRY_MINUTES: 10080, // 7 days * 24 hours * 60 minutes
  FRONTEND_LOCALHOST_URL: 'http://localhost:3000',
  API_METHODS: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  SELECT_KEYS_FOR_CATEGORIES: {
    id: true,
    name: true,
    slug: true,
  },
  SELECT_KEYS_FOR_DESTINATIONS: {
    id: true,
    name: true,
    slug: true,
    coverPhotoUrl: true,
    backgroundUrl: true,
    thumbnailUrl: true,
    latitude: true,
    longitude: true,
    description: true,
    isArchived: true,
  },
  SELECT_KEYS_FOR_USERS: {
    id: true,
    fullName: true,
    email: true,
    countryCode: true,
    phoneCountryCode: true,
    phoneNumber: true,
    cnicNumber: true,
    cnicExpiry: true,
    cnicFrontPhotoUrl: true,
    CnicBackCopyUrl: true,
    roleId: true,
  },
  SELECT_KEYS_FOR_CONTACT_INFO: {
    id: true,
    userId: true,
    address: true,
    city: true,
    country: true,
    postalCode: true,
    state: true,
  },
  SELECT_KEYS_FOR_SOCIAL_LINKS: {
    id: true,
    userId: true,
    website: true,
    facebook: true,
    instagram: true,
    linkedin: true,
    youtube: true,
    tiktok: true,
  },
  PARTNER_FOLDER_NAME: 'partners',
  SELECT_KEYS_FOR_PARTNERS: {
    id: true,
    name: true,
    slug: true,
    description: true,
    logoUrl: true,
    city: true,
    state: true,
    isLicensed: true,
    licenseNo: true,
    licenseCopyURL: true,


  },
};

export default Constants;
