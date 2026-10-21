import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { isSupabaseConfigured, supabase } from "../lib/supabase";
import {
  fileToDataUrl,
  getLocalSession,
  localSignIn,
  localSignOut,
  localSignUp,
  localUpdateProfile,
} from "../lib/localAuth";
import { ensureProfile, fetchProfile, uploadAvatar } from "../services/profileStore";

const AuthContext = createContext(null);

function mapAuthUser(authUser, profile) {
  if (!authUser) return null;
  return {
    id: authUser.id,
    email: authUser.email,
    name:
      profile?.name ||
      authUser.user_metadata?.name ||
      authUser.user_metadata?.full_name ||
      "",
    bio: profile?.bio || "",
    avatar_url: profile?.avatar_url || authUser.user_metadata?.avatar_url || "",
  };
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  async function hydrateSupabaseUser(authUser, hasSession = true) {
    if (!authUser || !hasSession) {
      setUser(null);
      setProfile(null);
      return;
    }

    try {
      let nextProfile = await fetchProfile(authUser.id);

      if (!nextProfile) {
        nextProfile = await ensureProfile({
          name:
            authUser.user_metadata?.name ||
            authUser.user_metadata?.full_name ||
            authUser.email?.split("@")[0] ||
            "Creator",
          bio: "",
          avatar_url: "",
        });
      }

      setProfile(nextProfile);
      setUser(mapAuthUser(authUser, nextProfile));
    } catch {
      // Trigger may still be creating the profile; fall back to auth metadata
      setProfile(null);
      setUser(mapAuthUser(authUser, null));
    }
  }

  useEffect(() => {
    let mounted = true;

    if (isSupabaseConfigured && supabase) {
      supabase.auth.getSession().then(async ({ data }) => {
        if (!mounted) return;
        setSession(data.session ?? null);
        await hydrateSupabaseUser(data.session?.user ?? null, Boolean(data.session));
        setLoading(false);
      });

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, nextSession) => {
        setSession(nextSession ?? null);
        hydrateSupabaseUser(nextSession?.user ?? null, Boolean(nextSession)).finally(() => {
          if (mounted) setLoading(false);
        });
      });

      return () => {
        mounted = false;
        subscription.unsubscribe();
      };
    }

    const localUser = getLocalSession();
    setUser(localUser);
    setProfile(localUser);
    setSession(localUser ? { user: localUser } : null);
    setLoading(false);

    return () => {
      mounted = false;
    };
  }, []);

  async function signInWithPassword(email, password) {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      setSession(data.session ?? null);
      await hydrateSupabaseUser(data.session?.user ?? null, Boolean(data.session));
      return;
    }

    const localUser = localSignIn(email, password);
    setUser(localUser);
    setProfile(localUser);
    setSession({ user: localUser });
  }

  async function signUpWithPassword({ name, email, password }) {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name: name.trim(), full_name: name.trim() },
        },
      });
      if (error) throw error;

      // Only write profile when a real session exists (RLS needs auth.uid())
      if (data.session?.user) {
        setSession(data.session);
        try {
          const nextProfile = await ensureProfile({
            name: name.trim(),
            bio: "",
            avatar_url: "",
          });
          setProfile(nextProfile);
          setUser(mapAuthUser(data.session.user, nextProfile));
        } catch {
          setUser(mapAuthUser(data.session.user, { name: name.trim() }));
        }
        return { ...data, needsEmailConfirmation: false };
      }

      // Email confirmation required — account created, but not signed in yet
      if (data.user && !data.session) {
        return {
          ...data,
          needsEmailConfirmation: true,
          email: email.trim().toLowerCase(),
          name: name.trim(),
        };
      }

      return { ...data, needsEmailConfirmation: false };
    }

    const localUser = localSignUp({ name, email, password });
    setUser(localUser);
    setProfile(localUser);
    setSession({ user: localUser });
    return { user: localUser, needsEmailConfirmation: false };
  }

  async function updateProfile({ name, bio, avatarFile }) {
    if (!user) throw new Error("Please sign in first.");

    let avatarUrl = user.avatar_url || "";

    if (avatarFile) {
      if (isSupabaseConfigured && supabase) {
        avatarUrl = await uploadAvatar(user.id, avatarFile);
      } else {
        avatarUrl = await fileToDataUrl(avatarFile);
      }
    }

    if (isSupabaseConfigured && supabase) {
      const nextProfile = await ensureProfile({
        name: name.trim(),
        bio: bio?.trim() || "",
        avatar_url: avatarUrl,
      });
      setProfile(nextProfile);
      setUser(mapAuthUser({ id: user.id, email: user.email }, nextProfile));
      return nextProfile;
    }

    const nextUser = localUpdateProfile(user.id, {
      name,
      bio,
      avatar_url: avatarUrl,
    });
    setUser(nextUser);
    setProfile(nextUser);
    setSession({ user: nextUser });
    return nextUser;
  }

  async function signOut() {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } else {
      localSignOut();
    }
    setSession(null);
    setUser(null);
    setProfile(null);
  }

  const value = useMemo(
    () => ({
      session,
      user,
      profile,
      loading,
      isConfigured: isSupabaseConfigured,
      authMode: isSupabaseConfigured ? "supabase" : "local",
      isAuthenticated: Boolean(user),
      displayName: user?.name || user?.email?.split("@")[0] || "Creator",
      signInWithPassword,
      signUpWithPassword,
      updateProfile,
      signOut,
    }),
    [session, user, profile, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
