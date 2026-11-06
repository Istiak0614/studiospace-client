export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const PASSWORD_RULES = [
  { id: "length", label: "At least 6 characters", test: (p: string) => p.length >= 6 },
  { id: "upper", label: "One uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
  { id: "lower", label: "One lowercase letter", test: (p: string) => /[a-z]/.test(p) },
];

export const validatePassword = (password: string): string | null => {
  const failed = PASSWORD_RULES.find((rule) => !rule.test(password));
  return failed ? `Password needs ${failed.label.toLowerCase()}` : null;
};

export const isValidEmail = (email: string) => EMAIL_PATTERN.test(email.trim());

export const isValidUrl = (value: string) => {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

export const safeRedirect = (path?: string) =>
  path && path.startsWith("/") && !path.startsWith("//") ? path : "/";