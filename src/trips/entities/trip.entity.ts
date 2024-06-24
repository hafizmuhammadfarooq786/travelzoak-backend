export class TravelzoakTrip {
  id: string;
  title: string;
  slug: string;
  description: string;
  startDate: string;
  endDate: string;
  startDesitination: string;
  endDestination: string;
  totalDays: number;
  totalSeats: number;
  bookedSeats: number;
  perPersonCharges: number;
  coupleCharges: number;
  familyCharges: number;
  advancePayment: number;
  roomSharing: number;
  coverPhotoUrl: string;
  thumbnailUrl: string;
  placesIncluded: string[];
  servicesIncluded: string[];
  servicesExcluded: string[];
  isArchived: boolean;
  partnerId: string;
  createdAtMillis: number;
  updatedAtMillis: number;
}
