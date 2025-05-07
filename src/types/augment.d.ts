
import { User } from './index';

// Extend the User interface to include the 'status' property
declare module './index' {
  interface User {
    status?: string;
  }
}
