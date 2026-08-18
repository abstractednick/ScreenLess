const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function inviteCode(length = 6): string {
  let out = "";
  for (let i = 0; i < length; i += 1) {
    out += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }
  return out;
}

export function publicUser(user: {
  id: string;
  displayName: string;
  avatarHue: number;
  email?: string;
  timezone?: string;
  preferredLanguage?: string;
  bio?: string | null;
}) {
  return {
    id: user.id,
    displayName: user.displayName,
    avatarHue: user.avatarHue,
    email: user.email,
    timezone: user.timezone,
    preferredLanguage: user.preferredLanguage,
    bio: user.bio,
  };
}

export function dateKey(date = new Date(), timeZone = "Asia/Kolkata"): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}
