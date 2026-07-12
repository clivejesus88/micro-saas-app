import { createContext, useCallback, useContext, useState } from "react";

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  avatarUri: string | null;
}

interface UserContextValue extends UserProfile {
  updateProfile: (data: Partial<UserProfile>) => void;
}

const UserContext = createContext<UserContextValue | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>({
    name: "Alex Rivera",
    email: "alex@email.com",
    phone: "+1 (555) 123-4567",
    avatarUri: null,
  });

  const updateProfile = useCallback((data: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...data }));
  }, []);

  return (
    <UserContext.Provider value={{ ...profile, updateProfile }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUserProfile() {
  const ctx = useContext(UserContext);
  if (!ctx) {
    return {
      name: "Alex Rivera",
      email: "alex@email.com",
      phone: "+1 (555) 123-4567",
      avatarUri: null,
      updateProfile: () => {},
    };
  }
  return ctx;
}
