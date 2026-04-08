import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useActor } from "../hooks/useActor";

export interface AuthUser {
  id: bigint;
  name: string;
  role: string;
  pin: string;
}

interface AuthContextType {
  currentUser: AuthUser | null;
  sessionValidated: boolean;
  login: (user: AuthUser) => void;
  logout: () => void;
  canEdit: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  sessionValidated: true,
  login: () => {},
  logout: () => {},
  canEdit: false,
  isAdmin: false,
});

function serializeUser(user: AuthUser): string {
  return JSON.stringify({ ...user, id: user.id.toString() });
}

function deserializeUser(raw: string): AuthUser | null {
  try {
    const obj = JSON.parse(raw);
    return { ...obj, id: BigInt(obj.id) };
  } catch {
    return null;
  }
}

// Safe heartbeat call - only calls if the method exists on the actor
function safeHeartbeat(actor: unknown, userId: bigint) {
  try {
    const actorRec = actor as unknown as Record<string, unknown>;
    const fn = actorRec.sendHeartbeat;
    if (typeof fn === "function") {
      (fn as (id: bigint) => Promise<void>).call(actor, userId).catch(() => {});
    }
  } catch {
    // ignore
  }
}

// Inner component that handles heartbeat AND session validation
function SessionManager({
  user,
  onInvalidSession,
  onValidated,
}: {
  user: AuthUser;
  onInvalidSession: () => void;
  onValidated: () => void;
}) {
  const { actor, isFetching } = useActor();
  const validatedRef = useRef(false);

  // Send heartbeat every 60 seconds
  useEffect(() => {
    if (!actor) return;
    safeHeartbeat(actor, user.id);
    const interval = setInterval(() => {
      safeHeartbeat(actor, user.id);
    }, 60_000);
    return () => clearInterval(interval);
  }, [actor, user.id]);

  // Validate session against backend once actor is ready
  useEffect(() => {
    if (!actor || isFetching || validatedRef.current) return;
    validatedRef.current = true;

    async function validateSession() {
      try {
        // Call getUsersByPin to check if the stored PIN is still valid
        const actorAny = actor as unknown as Record<string, unknown>;
        const fn = actorAny.getUsersByPin;
        if (typeof fn === "function") {
          const result = await (
            fn as (
              pin: string,
            ) => Promise<
              { id: bigint; name: string; role: string; pin: string }[]
            >
          ).call(actor, user.pin);
          const users = Array.isArray(result) ? result : [];

          if (users.length === 0) {
            // PIN no longer valid → clear session and show login
            onInvalidSession();
            return;
          }

          // Verify our user ID is still valid
          const match = users.find((u) => {
            try {
              return BigInt(u.id.toString()) === BigInt(user.id.toString());
            } catch {
              return false;
            }
          });

          if (!match) {
            onInvalidSession();
            return;
          }
        }
        // Session is valid
        onValidated();
      } catch {
        // Validation failed due to network/canister error
        // Don't invalidate session on network errors - just mark as validated
        onValidated();
      }
    }

    // Small delay to let actor fully initialize
    const t = setTimeout(validateSession, 1500);
    return () => clearTimeout(t);
  }, [actor, isFetching, user, onInvalidSession, onValidated]);

  // If actor never loads (timeout), mark as validated to prevent infinite loading
  useEffect(() => {
    const fallback = setTimeout(() => {
      if (!validatedRef.current) {
        onValidated();
      }
    }, 8000);
    return () => clearTimeout(fallback);
  }, [onValidated]);

  return null;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const storedRaw = localStorage.getItem("gaushala_user");
  const storedUser = storedRaw ? deserializeUser(storedRaw) : null;

  const [currentUser, setCurrentUser] = useState<AuthUser | null>(storedUser);
  // If there's no stored session, validation is immediately complete
  const [sessionValidated, setSessionValidated] = useState(!storedUser);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("gaushala_user", serializeUser(currentUser));
    } else {
      localStorage.removeItem("gaushala_user");
    }
  }, [currentUser]);

  const login = useCallback((user: AuthUser) => {
    setCurrentUser(user);
    setSessionValidated(true);
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
    localStorage.removeItem("gaushala_user");
    setSessionValidated(true);
  }, []);

  const handleInvalidSession = useCallback(() => {
    setCurrentUser(null);
    localStorage.removeItem("gaushala_user");
    setSessionValidated(true);
  }, []);

  const handleValidated = useCallback(() => {
    setSessionValidated(true);
  }, []);

  const roleLower = currentUser?.role?.toLowerCase();
  const canEdit = roleLower === "admin" || roleLower === "editor";
  const isAdmin = roleLower === "admin";

  return (
    <AuthContext.Provider
      value={{ currentUser, sessionValidated, login, logout, canEdit, isAdmin }}
    >
      {currentUser && !sessionValidated && (
        <SessionManager
          user={currentUser}
          onInvalidSession={handleInvalidSession}
          onValidated={handleValidated}
        />
      )}
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
