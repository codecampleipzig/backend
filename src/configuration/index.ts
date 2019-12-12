export const PORT: string = process.env.PORT || "3001";
export const environment: string = process.env.NODE_ENV || "development";

// Generate private key with jwt using the following command in node:
// require('crypto').randomBytes(64).toString('hex')
export const secret =
  "fbf50189319aa851c000ded939929376c7fdfc040993c6ebf71477baf6c008ea09dcb041616358c001b7230f6f06b6d46b006c26f154e50a6f160caaf30f7a42";
