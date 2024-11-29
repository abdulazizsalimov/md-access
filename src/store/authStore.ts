import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  username: string;
  isAdmin: boolean;
}

interface UserData {
  password: string;
  isAdmin: boolean;
  lastLogin?: string;
}

interface AuthState {
  user: User | null;
  users: { [key: string]: UserData };
  login: (username: string, password: string, remember: boolean) => boolean;
  logout: () => void;
  createUser: (username: string, password: string, isAdmin: boolean) => boolean;
  updatePassword: (username: string, newPassword: string) => boolean;
  deleteUser: (username: string) => boolean;
  getAllUsers: () => Array<{ username: string } & UserData>;
}

const adminUser = {
  username: 'admin',
  password: 'admin',
  isAdmin: true,
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      users: {
        [adminUser.username]: {
          password: adminUser.password,
          isAdmin: adminUser.isAdmin,
          lastLogin: new Date().toISOString(),
        },
      },
      login: (username, password, remember) => {
        const users = get().users;
        const userCredentials = users[username];
        
        if (userCredentials && userCredentials.password === password) {
          set(state => ({ 
            user: { 
              username, 
              isAdmin: userCredentials.isAdmin 
            },
            users: {
              ...state.users,
              [username]: {
                ...userCredentials,
                lastLogin: new Date().toISOString()
              }
            }
          }));
          return true;
        }
        return false;
      },
      logout: () => set({ user: null }),
      createUser: (username, password, isAdmin) => {
        const currentUser = get().user;
        const users = get().users;

        if (!currentUser?.isAdmin) return false;
        if (users[username]) return false;

        set({
          users: {
            ...users,
            [username]: {
              password,
              isAdmin,
              lastLogin: undefined
            }
          }
        });
        return true;
      },
      updatePassword: (username, newPassword) => {
        const currentUser = get().user;
        if (!currentUser?.isAdmin) return false;

        set(state => ({
          users: {
            ...state.users,
            [username]: {
              ...state.users[username],
              password: newPassword
            }
          }
        }));
        return true;
      },
      deleteUser: (username) => {
        const currentUser = get().user;
        if (!currentUser?.isAdmin || username === 'admin') return false;

        set(state => {
          const { [username]: _, ...remainingUsers } = state.users;
          return { users: remainingUsers };
        });
        return true;
      },
      getAllUsers: () => {
        const users = get().users;
        return Object.entries(users).map(([username, data]) => ({
          username,
          ...data
        }));
      }
    }),
    {
      name: 'auth-storage',
      skipHydration: true,
    }
  )
);