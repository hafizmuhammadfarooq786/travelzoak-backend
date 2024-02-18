export class Photos {
  imageUrl: string;
  publicId: string;
}

export class TripPhoto {
  id?: string;
  tripId: string;
  photos: Photos[];
  createdAtMillis?: number | bigint;
  updatedAtMillis?: number | bigint;
}
