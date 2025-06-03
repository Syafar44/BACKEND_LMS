export enum ROLES {
    SUPER_ADMIN = "superadmin",
    ADMIN = "admin",
    USER = "user",
}

export default function config() {
    return {
      apiToken: process.env.API_TOKEN,
      signatureSecret: process.env.SIGNATURE_SECRET,
      apiHost: process.env.API_HOST,
      appName: 'roti gembung panglima',
    };
  }