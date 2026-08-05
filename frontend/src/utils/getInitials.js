// Used by the review avatar (admin list and storefront testimonials) whenever
// no customer photo is on file. "John Doe" -> "JD", a single-word name just
// uses its first two letters so the avatar never renders empty.
export const getInitials = (name) => {
  const words = (name || '').trim().split(/\s+/).filter(Boolean);

  if (words.length === 0) return '?';
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();

  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
};
