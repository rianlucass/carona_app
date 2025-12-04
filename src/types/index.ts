// Tipos de Usuário
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  photo?: string;
  rating?: number;
  createdAt: Date;
}

// Tipos de Carona
export interface Ride {
  id: string;
  driverId: string;
  driver: User;
  origin: Location;
  destination: Location;
  departureTime: Date;
  availableSeats: number;
  price: number;
  status: RideStatus;
  passengers: User[];
  createdAt: Date;
}

export interface Location {
  address: string;
  latitude: number;
  longitude: number;
}

export type RideStatus = 'pending' | 'active' | 'completed' | 'cancelled';

// Tipos de Reserva
export interface Booking {
  id: string;
  rideId: string;
  passengerId: string;
  passenger: User;
  status: BookingStatus;
  seatsBooked: number;
  createdAt: Date;
}

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled';

// Tipos de Navegação
export type RootStackParamList = {
  index: undefined;
  '(auth)/login': undefined;
  '(auth)/register': undefined;
  'main/home': undefined;
  'main/profile': undefined;
};
