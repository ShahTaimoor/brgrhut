// Maps a category name to a fitting emoji by keyword. The Category schema's
// `emoji` field defaults to 🍔 for every new category and is rarely changed
// by admins, so it can't be trusted as-is - this keyword match gives sensible
// results out of the box and only needs the DB field for genuinely custom cases.
const KEYWORD_EMOJI = [
  [['pizza'], '🍕'],
  [['burger', 'sandwich', 'sandwhich'], '🍔'],
  [['fries', 'fry', 'side', 'wing', 'nugget', 'appetizer', 'starter'], '🍟'],
  [['drink', 'beverage', 'juice', 'soda', 'shake', 'smoothie', 'cola'], '🥤'],
  [['coffee', 'tea', 'espresso', 'latte'], '☕'],
  [['dessert', 'sweet', 'cake', 'pastry', 'donut', 'doughnut'], '🍰'],
  [['ice cream', 'icecream', 'gelato', 'sundae'], '🍨'],
  [['italian'], '🍝'],
  [['pasta', 'noodle', 'spaghetti'], '🍝'],
  [['salad', 'healthy', 'veg', 'vegetable'], '🥗'],
  [['taco', 'burrito', 'mexican'], '🌮'],
  [['sushi', 'japanese'], '🍣'],
  [['chicken', 'fried chicken'], '🍗'],
  [['pizza roll', 'roll', 'wrap'], '🌯'],
  [['soup'], '🍲'],
  [['bread', 'bakery'], '🍞'],
  [['breakfast'], '🍳'],
  [['chinese'], '🥡'],
  [['bbq', 'barbecue', 'barbeque', 'grill', 'grilled'], '🍖'],
  [['thai'], '🍜'],
  [['indian', 'curry'], '🍛'],
  [['mediterranean', 'greek', 'kebab', 'gyro'], '🥙'],
  [['seafood', 'fish', 'shrimp'], '🦐'],
  [['steak', 'steakhouse'], '🥩'],
];

export const getCategoryEmoji = (category) => {
  const name = (category?.name || '').toLowerCase();

  for (const [keywords, emoji] of KEYWORD_EMOJI) {
    if (keywords.some((keyword) => name.includes(keyword))) {
      return emoji;
    }
  }

  // The Category schema's `emoji` field defaults to 🍔 for every category and is
  // rarely changed, so it's not a trustworthy fallback (that's the exact bug this
  // was fixed for - an unmatched category would silently show a burger). A neutral
  // "generic food" icon is honest about not having a specific match, instead of
  // implying a burger when there may be none on the menu at all.
  return '🍽️';
};
