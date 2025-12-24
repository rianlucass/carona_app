export interface GoogleAuthConfig {
    expoClientId: string;
    androidClientId: string;
    webClientId: string;
}   

export const GOOGLE_AUTH_CONFIG: GoogleAuthConfig = {
  // Para Expo Go (desenvolvimento) - WEB CLIENT ID
  expoClientId: '1094885903724-5qnpjj2a4pl8tnsn7oucagffntt13l2p.apps.googleusercontent.com',
  
  // Para Android nativo (produção) - ANDROID CLIENT ID
  androidClientId: '1094885903724-0vbu71fjfpp1q7fntap16uct68e6f96l.apps.googleusercontent.com',
  
  // Para backend (Spring Boot) - MESMO WEB CLIENT ID
  webClientId: '1094885903724-5qnpjj2a4pl8tnsn7oucagffntt13l2p.apps.googleusercontent.com',
};