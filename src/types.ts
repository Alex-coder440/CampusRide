export type RideType = 'all' | 'within_campus' | 'out_of_campus' | 'welfare';

export interface User {
  id: string;
  name: string;
  role: 'student' | 'driver' | 'admin';
  driverType?: 'within' | 'out' | 'welfare';
  email: string;
  avatar?: string;
  status?: 'pending' | 'verified' | 'rejected';
  matricNo?: string;
  shuttleNo?: string;
}

export interface WelfareApplication {
  id: string; // userId
  firstName: string;
  lastName: string;
  matricNo: string;
  fileName: string;
  fileDataURL?: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface ExeatApplication {
  id: string; // userId
  firstName: string;
  lastName: string;
  matricNo: string;
  fileName: string;
  fileDataURL?: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface Ride {
  id: string;
  driverId: string;
  driver: string;
  type: RideType;
  from: string;
  to: string;
  depart: string;
  seats: number;
  price: number;
  rating: string;
  passengers: { id: string; name: string, destination?: string, time?: string, pickup?: string }[];
  status: 'scheduled' | 'active' | 'completed';
}
