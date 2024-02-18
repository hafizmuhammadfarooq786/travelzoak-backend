const StringUtils = {
  STATUS: {
    SUCCESS: 'SUCCESS',
    ERROR: 'FAILURE',
    EXCEPTION: 'EXCEPTION',
    BAD_REQUEST: 'BAD REQUEST',
    UNAUTHORIZED: 'UNAUTHORIZED',
    FORBIDDEN: 'FORBIDDEN',
    EXIST: 'RECORD ALREADY EXISTS',
    NON_AUTHORITIVE_INFORMATION: 'NON AUTHORITIVE INFORMATION',
    PARTIAL_CONTENT: 'PARTIAL CONTENT',
    SERVICE_UNAVAILABLE: 'SERVICE UNAVAILABLE',
    INTERNAL_SERVER_ERROR: 'INTERNAL SERVER ERROR',
    NO_RECORD_FOUND: 'NO RECORD FOUND',
    CONFLICT: 'CONFLICT',
  },
  CODE: {
    OK: 200,
    NON_AUTHORITIVE_INFORMATION: 203,
    PARTIAL_CONTENT: 206,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_SERVER_ERROR: 500,
    SERVICE_UNAVAILABLE: 503,
  },
  MESSAGE: {
    SUCCESS: 'SUCCESS',
    EXCEPTION: 'An exception occured',
    INVALID_EMAIL: 'Invalid email address',
    INVALID_CODE: 'Invalid credentials, email or code is incorrect',
    EMAIL_SEND_FAILED:
      'Unable to send email. Please try again later. If the issue persists, contact support.',
    CODE_SEND:
      'A verification code has been dispatched to your email address for two-factor authentication.',
    CODE_VERIFIED: 'Code has been successfully verified',
    CODE_EXPIRED: 'Your OTP code has expired. Please attempt to resend it.',
    CODE_RESEND: 'Code has been resend successfully',
    USER_ERROR:
      'Encountered an issue with user registration. Kindly reach out to our support team for assistance.',
    CREATE_AUTHCODE_ERROR: 'Unable to create auth code',
    DATA_MISSING:
      'Missing required data. Please provide all necessary information and try again.',
    USER_ALREADY_EXIST_BUT_NOT_VERIFIED:
      'User already exists, but the account has not been verified. Please check your email for the verification code.',
    RECORD_NOT_FOUND: 'NO RECORD FOUND AGAINST PROVIDED INFORMATION',
    INVALID_REFRESH_TOKEN: 'Invalid refresh token',
    FAILED_TO_DELETE_REFRESH_TOKEN: 'Failed to delete refresh token',
    USER_WITH_DEVICE_ID_ALREADY_EXISTS:
      'The user with the specified deviceId already exists.',
    FAILED_TO_CREATE_REFRESH_TOKEN: 'Failed to create refresh token',
    FAILED_TO_SAVE_REFRESH_TOKEN: 'Failed to save refresh token',
    USER_ID_NOT_FOUND: 'User id not found',
    INVALID_USER_ID_OR_DEVICE_ID: 'Invalid userId or deviceId',
    ACCESS_DENIED: 'Access denied',
    INVALID_USER_ID: 'Invalid user id',
    USER_NOT_FOUND: 'User not found',
    FAILED_TO_CREATE_USER_ROLES_FROM_SEED:
      'Failed to create user roles from seed',
    FAILED_TO_GET_USER_ROLES: 'Failed to get user roles',
    FAILED_TO_CREATE_CONTACT_INFO: 'Failed to create contact info',
    FAILED_TO_GET_CONTACT_INFO: 'Failed to get contact info',
    FAILED_TO_UPDATE_CONTACT_INFO: 'Failed to update contact info',
    FAILED_TO_UPDATE_SOCIAL_LINKS: 'Failed to update social links',
    FAILED_TO_CREATE_SOCIAL_LINKS: 'Failed to create social links',
    FAILED_TO_GET_SOCIAL_LINKS: 'Failed to get social links',

    FAILED_TO_CREATE_DESTINATIONS_FROM_SEED:
      'Failed to create destinations from seed',
    FAILED_TO_CREATE_DESTINATION: 'Failed to create destination',
    FAILED_TO_GET_DESTINATIONS: 'Failed to get destinations',
    INAVLID_DESTINATION_ID: 'Invalid destination id',
    FAILED_TO_UPDATE_DESTINATION: 'Failed to update destination',
    FAILED_TO_DELETE_DESTINATION: 'Failed to delete destination',

    FAILED_TO_CREATE_CATEGORIES_FROM_SEED:
      'Failed to create categories from seed',
    FAILED_TO_CREATE_CATEGORY: 'Failed to create category',
    FAILED_TO_GET_CATEGORIES: 'Failed to get categories',
    INAVLID_CATEGORY_ID: 'Invalid category id',
    FAILED_TO_UPDATE_CATEGORY: 'Failed to update category',
    FAILED_TO_DELETE_CATEGORY: 'Failed to delete category',

    FAILED_TO_CREATE_PARTNERS_FROM_SEED: 'Failed to create partners from seed',
    FAILED_TO_CREATE_PARTNER: 'Failed to create partner',
    FAILED_TO_GET_PARTNERS: 'Failed to get partners',
    INAVLID_PARTNER_ID: 'Invalid partner id',
    FAILED_TO_UPDATE_PARTNER: 'Failed to update partner',
    FAILED_TO_ARCHIVE_PARTNER: 'Failed to archive partner',

    FAILED_TO_UPLOAD_IMAGE: 'Failed to upload image',
    FAILED_TO_REPLACE_IMAGE: 'Failed to replace image',

    FAILED_TO_CREATE_TRIPS_FROM_SEED: 'Failed to create trips from seed',
    FAILED_TO_CREATE_TRIP: 'Failed to create trip',
    FAILED_TO_GET_TRIPS: 'Failed to get trips',
    INAVLID_TRIP_ID: 'Invalid trip id',
    FAILED_TO_UPDATE_TRIP: 'Failed to update trip',
    FAILED_TO_ARCHIVE_TRIP: 'Failed to archive trip',
    FAILED_TO_DELETE_IMAGE: 'Failed to delete image',

    FAILED_TO_CREATE_TRIPS_PHOTOS_FROM_SEED:
      'Failed to create trips photos from seed',
    FAILED_TO_CREATE_TRIP_PHOTOS: 'Failed to create trip photos',
    FAILED_TO_GET_TRIP_PHOTOS: 'Failed to get trip photos',
    FAILED_TO_UPLOAD_TRIP_PHOTOS: 'Failed to upload trip photos',
    FAILED_TO_UPDATE_TRIP_PHOTOS: 'Failed to update trip photos',
    FAILED_TO_DELETE_TRIP_PHOTOS: 'Failed to delete trip photos',
  },
};

export default StringUtils;
