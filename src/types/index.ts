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

// Tipos de API Response
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errorCode?: string;
  errors?: Record<string, string>;
}

// Tipos de Autenticação
export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  username: string;
}

export interface RegisterResponse {
  message: string;
  email: string;
  emailVerificationRequired: boolean;
}

export interface VerifyEmailRequest {
  email: string;
  code: string;
}

export interface VerifyEmailResponse {
  success: boolean;
  message: string;
  email: string;
}

export interface CompleteProfileRequest {
  email: string;
  phone: string;
  birthDate: string;
  gender: string;
  cpf: string;
  state: string;
  city: string;
  photo?: File | Blob;
}

export interface CompleteProfileResponse {
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface ResendCodeRequest {
  email: string;
}

// Tipos de Navegação
export type RootStackParamList = {
  index: undefined;
  '(auth)/login': undefined;
  '(auth)/register': undefined;
  'main/home': undefined;
  'main/profile': undefined;
};
