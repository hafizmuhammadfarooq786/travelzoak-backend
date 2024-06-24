const Constants = {
  ACCESS_TOKEN_EXPIRY: '1d', // 1 day
  REFRESH_TOKEN_EXPIRY: '7d', // 7 days
  REFRESH_TOKEN_EXPIRY_MINUTES: 10080, // 7 days * 24 hours * 60 minutes
  FRONTEND_LOCALHOST_URL: 'http://localhost:3000',
  API_METHODS: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  PARTNER_FOLDER_NAME: 'partners',
  TRIPS_FOLDER_NAME: 'trips',
  TRIPS_PHOTOS_FOLDER_NAME: 'tripsPhotos',
  ENV_VARS: {
    NODE_ENV: 'NODE_ENV',
    JWT_ACCESS_SECRET: 'JWT_ACCESS_SECRET',
    JWT_REFRESH_SECRET: 'JWT_REFRESH_SECRET',
  },
};

export default Constants;
