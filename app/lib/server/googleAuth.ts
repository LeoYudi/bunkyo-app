import { google } from 'googleapis';

export const auth = new google.auth.OAuth2({
  clientId: process.env.googleClientId || '',
  clientSecret: process.env.googleClientSecret || '',
  redirectUri: process.env.googleRedirectUri || '',
});

auth.setCredentials({
  refresh_token: process.env.googleRefreshToken || '',
});