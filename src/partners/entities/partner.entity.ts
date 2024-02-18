export class Partner {
  id?: string;
  name: string;
  slug?: string;
  description: string;
  logoUrl: string;
  city: string;
  state: string;
  isLicensed: boolean;
  licenseNo: string;
  licenseCopyURL: string;
  isArchived: boolean;
  cloudinaryLogoPublicId: string;
  cloudinaryLicenseCopyURLPublicId: string;
  createdAtMillis?: number | bigint;
  updatedAtMillis?: number | bigint;
}


export class CreatePartner {
  name: string;
  description: string;
  logoImage: string;
  city: string;
  state: string;
  isLicensed: boolean;
  licenseNo: string;
  licenseCopyURL: string;
  isArchived: boolean;
}
