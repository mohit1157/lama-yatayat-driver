/**
 * LaMa Yatayat Driver - TypeScript Types
 */

/* ------------------------------------------------------------------ */
/*  Auth                                                               */
/* ------------------------------------------------------------------ */

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "rider" | "driver" | "admin";
  avatar_url?: string;
  rating?: number;
  created_at: string;
  updated_at: string;
}

export interface DriverProfile {
  id: string;
  user_id: string;
  license_number: string;
  vehicle_make: string;
  vehicle_model: string;
  vehicle_year: number;
  vehicle_plate: string;
  vehicle_color: string;
  capacity: number;
  bg_check_status: "pending" | "approved" | "rejected" | "suspended";
  rating_avg: number;
  rating_count: number;
  verified_at: string | null;
  created_at: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: "driver";
}

export interface OnboardInput {
  license_number: string;
  vehicle_make: string;
  vehicle_model: string;
  vehicle_year: number;
  vehicle_plate: string;
  vehicle_color: string;
  capacity: number;
}

/* ------------------------------------------------------------------ */
/*  Location                                                           */
/* ------------------------------------------------------------------ */

export interface LatLng {
  latitude: number;
  longitude: number;
}

export interface DriverLocationUpdate {
  lat: number;
  lng: number;
  heading: number;
  speed: number;
}

/* ------------------------------------------------------------------ */
/*  Rides & Batches                                                    */
/* ------------------------------------------------------------------ */

export type RideStatus =
  | "requested"
  | "matched"
  | "driver_en_route"
  | "driver_arrived"
  | "in_progress"
  | "completed"
  | "cancelled";

export interface Rider {
  id: string;
  name: string;
  phone: string;
  avatar_url?: string;
  rating?: number;
}

export interface RideInBatch {
  id: string;
  rider: Rider;
  status: RideStatus;
  pickup_location: {
    lat: number;
    lng: number;
    address: string;
  };
  dropoff_location: {
    lat: number;
    lng: number;
    address: string;
  };
  fare: number;
  ride_type: "one_way" | "round_trip";
}

export interface Batch {
  id: string;
  driver_id: string;
  status: "pending" | "accepted" | "in_progress" | "completed" | "cancelled";
  rides: RideInBatch[];
  total_fare: number;
  driver_earnings: number;
  waypoints: Waypoint[];
  created_at: string;
}

export interface Waypoint {
  ride_id: string;
  rider_name: string;
  type: "pickup" | "dropoff";
  lat: number;
  lng: number;
  address: string;
  completed: boolean;
  order: number;
}

/* ------------------------------------------------------------------ */
/*  Earnings                                                           */
/* ------------------------------------------------------------------ */

export interface EarningsSummary {
  today: number;
  this_week: number;
  this_month: number;
  total_rides_today: number;
  total_rides_week: number;
  avg_per_ride: number;
}

export interface EarningsEntry {
  id: string;
  ride_id: string;
  amount: number;
  status: string;
  created_at: string;
}

/* ------------------------------------------------------------------ */
/*  Notifications                                                      */
/* ------------------------------------------------------------------ */

export interface PushTokenPayload {
  token: string;
  platform: "ios" | "android";
}

/* ------------------------------------------------------------------ */
/*  WebSocket                                                          */
/* ------------------------------------------------------------------ */

export type WSMessageType =
  | "batch_request"
  | "ride_cancelled"
  | "rider_location"
  | "ride_status_update"
  | "location_update"
  | "error";

export interface WSMessage {
  type: WSMessageType;
  data: unknown;
}
