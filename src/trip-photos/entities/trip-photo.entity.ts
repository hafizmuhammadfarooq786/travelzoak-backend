export class Photos {
  id?: string;
  imageUrl: string;
  publicId: string;
}

export class TripPhoto {
  tripId: string;
  photos: Photos[];
}
