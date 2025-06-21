export interface AddressFormData {
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  phoneNumber: string;
  isDefault: boolean;
  latitude: number | null;
  longitude: number | null;
}
export interface Address {
  id: number;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  phoneNumber: string;
  isDefault: boolean;
  latitude?: number;
  longitude?: number;
}
