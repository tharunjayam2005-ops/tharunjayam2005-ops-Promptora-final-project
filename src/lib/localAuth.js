const USERS_KEY = "promptora_users";
const SESSION_KEY = "promptora_session";

function readUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
  } catch {
    return [];
  }
}

function writeUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function toPublicUser(user) {
  return {
    id: user.id,
    email: user.email,
    name: user.name || "",
    avatar_url: user.avatar_url || "",
    bio: user.bio || "",
    createdAt: user.createdAt || Date.now(),
  };
}

export function getLocalSession() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
  } catch {
    return null;
  }
}

export function setLocalSession(user) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

export function clearLocalSession() {
  localStorage.removeItem(SESSION_KEY);
}

export function localSignUp({ name, email, password }) {
  const normalized = email.trim().toLowerCase();
  const fullName = name.trim();

  if (!fullName) {
    throw new Error("Please enter your name.");
  }
  if (!normalized || password.length < 6) {
    throw new Error("Enter a valid email and a password with at least 6 characters.");
  }

  const users = readUsers();
  if (users.some((u) => u.email === normalized)) {
    throw new Error("An account with this email already exists. Please sign in.");
  }

  const user = {
    id: crypto.randomUUID(),
    email: normalized,
    password,
    name: fullName,
    avatar_url: "",
    bio: "",
    createdAt: Date.now(),
  };

  writeUsers([...users, user]);
  const sessionUser = toPublicUser(user);
  setLocalSession(sessionUser);
  return sessionUser;
}

export function localSignIn(email, password) {
  const normalized = email.trim().toLowerCase();
  const users = readUsers();
  const found = users.find((u) => u.email === normalized);

  if (!found || found.password !== password) {
    throw new Error("Invalid email or password.");
  }

  const sessionUser = toPublicUser(found);
  setLocalSession(sessionUser);
  return sessionUser;
}

export function localUpdateProfile(userId, updates) {
  const users = readUsers();
  const index = users.findIndex((u) => u.id === userId);
  if (index === -1) {
    throw new Error("User not found.");
  }

  const next = {
    ...users[index],
    name: updates.name?.trim() || users[index].name || "",
    bio: updates.bio ?? users[index].bio ?? "",
    avatar_url:
      updates.avatar_url !== undefined
        ? updates.avatar_url
        : users[index].avatar_url || "",
  };

  users[index] = next;
  writeUsers(users);

  const sessionUser = toPublicUser(next);
  setLocalSession(sessionUser);
  return sessionUser;
}

export function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error("No image selected."));
      return;
    }
    if (!file.type.startsWith("image/")) {
      reject(new Error("Please upload an image file (JPG, PNG, or WebP)."));
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      reject(new Error("Image must be under 2MB."));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Could not read image file."));
    reader.readAsDataURL(file);
  });
}

export function localSignOut() {
  clearLocalSession();
}
