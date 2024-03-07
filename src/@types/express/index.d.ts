export {};

declare global {
  namespace Express {
    interface Request {
      user: {
        ID: number;
        name: string;
        userName: string;
        accessType: string;
      };
    }
  }
}
