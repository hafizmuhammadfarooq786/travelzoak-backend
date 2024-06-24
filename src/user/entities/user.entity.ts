export interface User {
  id: string;
  fullName: string;
  email: string;
  countryCode: string;
  phoneCountryCode: string;
  phoneNumber: string;
  cnicNumber: string;
  cnicExpiry: string;
  cnicFrontPhotoUrl: string;
  cnicBackCopyUrl: string;
  userRole: {
    id: string;
    name: string;
  };
}

export interface UserAuthVerifiedResponse extends User {
  accessToken: string;
  refreshToken: string;
}
