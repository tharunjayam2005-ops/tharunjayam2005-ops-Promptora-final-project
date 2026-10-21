import { isSupabaseConfigured, supabase } from "../lib/supabase";

export async function fetchProfile(userId) {
  if (!isSupabaseConfigured || !supabase) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("id, email, name, bio, avatar_url, created_at, updated_at")
    .eq("id", userId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function ensureProfile(payload = {}) {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error("Cloud sync is not available right now.");
  }

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) {
    throw new Error("Please sign in again before updating your profile.");
  }

  // Prefer RPC so profile creation/update is not blocked by RLS timing issues
  const { data: rpcData, error: rpcError } = await supabase.rpc("ensure_profile", {
    p_name: payload.name ?? "",
    p_bio: payload.bio ?? "",
    p_avatar_url: payload.avatar_url ?? "",
  });

  if (!rpcError && rpcData) {
    return Array.isArray(rpcData) ? rpcData[0] : rpcData;
  }

  // Fallback if RPC is not deployed yet
  const { data, error } = await supabase
    .from("profiles")
    .upsert(
      {
        id: session.user.id,
        email: session.user.email,
        name: payload.name || session.user.user_metadata?.name || "Creator",
        bio: payload.bio ?? "",
        avatar_url: payload.avatar_url ?? "",
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" }
    )
    .select("id, email, name, bio, avatar_url, created_at, updated_at")
    .single();

  if (error) throw error;
  return data;
}

export async function uploadAvatar(userId, file) {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error("Cloud sync is not available right now.");
  }

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user) {
    throw new Error("Please sign in again before uploading a profile image.");
  }

  if (!file?.type?.startsWith("image/")) {
    throw new Error("Please upload an image file (JPG, PNG, or WebP).");
  }
  if (file.size > 2 * 1024 * 1024) {
    throw new Error("Image must be under 2MB.");
  }

  const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${session.user.id}/avatar-${Date.now()}.${extension}`;

  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(path, file, {
      cacheControl: "3600",
      upsert: true,
      contentType: file.type,
    });

  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from("avatars").getPublicUrl(path);
  return data.publicUrl;
}
