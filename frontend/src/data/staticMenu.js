// Menu categories supplied directly by the client (name + price only, no
// product images) - kept as static data rather than going through the
// Category/Product admin flow, which requires an uploaded image per
// product. Shared by MenuBook (rendered as flipbook pages, merged with the
// DB-backed categories) and StaticMealsSection (a plain always-visible
// fallback list, grouped from these same arrays) so the two never drift.
//
// `priceLabel` overrides the normal "Rs. {price}" formatting used for
// DB-backed products, since these are priced in GBP.

const MEAL_NOTE = 'Meal includes: Choice of fries and a drink or coleslaw.';

// Sauces are free flavour add-ons with no listed price of their own, so
// they're folded into the milkshake note rather than modelled as products.
const MILKSHAKE_NOTE =
  'Large 475ml. Extra chocolate topping: £1.00. Sauces (no extra charge): ' +
  'No Sauce, Chocolate, Caramel, Kinder Bueno, Raspberry, Strawberry, Ferrero Rocher, Creme Egg, Bubblegum, Toffee.';

const PIZZA_NOTE = 'Sizes: 9" / 12" / 14". Pizza base: £1.00 extra. Stuffed crust: £1.95 extra.';

// Reproduced exactly as printed in the source menu, including the
// £13.00/£3.00 jump on the first item - not a transcription error here.
const GARLIC_BREAD_NOTE = 'Sizes: 9" / 12" / 14", priced as listed on the source menu.';

export const STATIC_CATEGORIES = [
  { _id: 'static-burger-meals', name: 'Burger Meals', emoji: '🍔', position: 9001 },
  { _id: 'static-wrap-meals', name: 'Wrap Meals', emoji: '🌯', position: 9002 },
  { _id: 'static-kids-meals', name: 'Kids Meals', emoji: '👶', position: 9003 },
  { _id: 'static-nachos', name: 'Nachos', emoji: '🧀', position: 9004 },
  { _id: 'static-milkshakes', name: 'Milkshakes', emoji: '🥤', position: 9005 },
  { _id: 'static-smoothies', name: 'Smoothies', emoji: '🍓', position: 9006 },
  { _id: 'static-drinks', name: 'Drinks', emoji: '🥤', position: 9007 },
  { _id: 'static-waffle-pizzas', name: 'Waffle Pizzas', emoji: '🍕', position: 9008 },
  { _id: 'static-waffles', name: 'Waffles', emoji: '🧇', position: 9009 },
  { _id: 'static-donuts', name: 'Donuts', emoji: '🍩', position: 9010 },
  { _id: 'static-pancakes', name: 'Pancakes', emoji: '🥞', position: 9011 },
  { _id: 'static-brownies', name: 'Brownies', emoji: '🍫', position: 9012 },
  { _id: 'static-pizzas', name: 'Pizzas', emoji: '🍕', position: 9013 },
  { _id: 'static-garlic-breads', name: 'Garlic Breads', emoji: '🧄', position: 9014 },
  { _id: 'static-calzones', name: 'Calzones', emoji: '🥙', position: 9015 },
  { _id: 'static-pizza-meals', name: 'Pizza Meals', emoji: '🍕', position: 9016 },
  { _id: 'static-calzone-meals', name: 'Calzone Meals', emoji: '🥙', position: 9017 },
  { _id: 'static-meal-deals', name: 'Meal Deals', emoji: '🍔', position: 9018 },
  { _id: 'static-kebabs', name: 'Kebabs', emoji: '🌯', position: 9019 },
  { _id: 'static-fries', name: 'Fries', emoji: '🍟', position: 9020 },
  { _id: 'static-side-dishes', name: 'Side Dishes', emoji: '🍗', position: 9021 },
];

export const STATIC_PRODUCTS = [
  // Burger Meals
  { _id: 'static-bm-1', title: 'Chicken Fillet Burger Meal', priceLabel: '£7.95', category: 'static-burger-meals', description: MEAL_NOTE, discountPercent: 0 },
  { _id: 'static-bm-2', title: 'Signature Burger Meal', priceLabel: '£8.95', category: 'static-burger-meals', description: MEAL_NOTE, discountPercent: 0 },
  { _id: 'static-bm-3', title: 'Quarter Pounder Cheeseburger Meal', priceLabel: '£6.95', category: 'static-burger-meals', description: MEAL_NOTE, discountPercent: 0 },
  { _id: 'static-bm-4', title: 'Half Pounder Cheeseburger Meal', priceLabel: '£7.95', category: 'static-burger-meals', description: MEAL_NOTE, discountPercent: 0 },
  { _id: 'static-bm-5', title: 'Double Delux Burger Meal', priceLabel: '£8.95', category: 'static-burger-meals', description: MEAL_NOTE, discountPercent: 0 },
  { _id: 'static-bm-6', title: 'Dady Burger Meal', priceLabel: '£8.95', category: 'static-burger-meals', description: MEAL_NOTE, discountPercent: 0 },
  { _id: 'static-bm-7', title: 'Tex-Mex Burger Meal', priceLabel: '£8.95', category: 'static-burger-meals', description: MEAL_NOTE, discountPercent: 0 },
  { _id: 'static-bm-8', title: 'Supreme Burger Meal', priceLabel: '£8.95', category: 'static-burger-meals', description: MEAL_NOTE, discountPercent: 0 },
  { _id: 'static-bm-9', title: "Smokin' Clucker Burger Meal", priceLabel: '£8.95', category: 'static-burger-meals', description: MEAL_NOTE, discountPercent: 0 },
  { _id: 'static-bm-10', title: 'Bac~N~Cheese Burger Meal', priceLabel: '£8.95', category: 'static-burger-meals', description: MEAL_NOTE, discountPercent: 0 },
  { _id: 'static-bm-11', title: 'Bac~N~Chic Burger Meal', priceLabel: '£8.95', category: 'static-burger-meals', description: MEAL_NOTE, discountPercent: 0 },
  { _id: 'static-bm-12', title: 'Donner Burger Meal', priceLabel: '£8.95', category: 'static-burger-meals', description: MEAL_NOTE, discountPercent: 0 },

  // Wrap Meals
  { _id: 'static-wm-1', title: 'Chicken Strip Wrap Meal', priceLabel: '£7.95', category: 'static-wrap-meals', description: MEAL_NOTE, discountPercent: 0 },
  { _id: 'static-wm-2', title: 'Donner Wrap Meal', priceLabel: '£7.95', category: 'static-wrap-meals', description: MEAL_NOTE, discountPercent: 0 },
  { _id: 'static-wm-3', title: 'Cheeseburger Wrap Meal', priceLabel: '£8.95', category: 'static-wrap-meals', description: MEAL_NOTE, discountPercent: 0 },
  { _id: 'static-wm-4', title: 'Bac~N~Chic Wrap Meal', priceLabel: '£8.95', category: 'static-wrap-meals', description: MEAL_NOTE, discountPercent: 0 },
  { _id: 'static-wm-5', title: 'Donner Dogger Wrap Meal', priceLabel: '£8.95', category: 'static-wrap-meals', description: MEAL_NOTE, discountPercent: 0 },
  { _id: 'static-wm-6', title: 'Popcorn Chicken Wrap Meal', priceLabel: '£8.95', category: 'static-wrap-meals', description: MEAL_NOTE, discountPercent: 0 },
  { _id: 'static-wm-7', title: 'Fully Loaded Wrap Meal', priceLabel: '£8.95', category: 'static-wrap-meals', description: MEAL_NOTE, discountPercent: 0 },
  { _id: 'static-wm-8', title: "Smokin' Clucker Wrap Meal", priceLabel: '£8.95', category: 'static-wrap-meals', description: MEAL_NOTE, discountPercent: 0 },
  { _id: 'static-wm-9', title: 'Supreme Wrap Meal', priceLabel: '£8.95', category: 'static-wrap-meals', description: MEAL_NOTE, discountPercent: 0 },
  { _id: 'static-wm-10', title: 'Chicken Dogger Wrap Meal', priceLabel: '£8.95', category: 'static-wrap-meals', description: MEAL_NOTE, discountPercent: 0 },
  { _id: 'static-wm-11', title: 'King Wrap Meal', priceLabel: '£7.95', category: 'static-wrap-meals', description: MEAL_NOTE, discountPercent: 0 },

  // Kids Meals
  { _id: 'static-km-1', title: 'Kids Popcorn Meal', priceLabel: '£11.00', category: 'static-kids-meals', discountPercent: 0 },
  { _id: 'static-km-2', title: 'Kids Chicken Meal', priceLabel: '£11.00', category: 'static-kids-meals', discountPercent: 0 },
  { _id: 'static-km-3', title: 'Kids Mini Variety Meal', priceLabel: '£11.00', category: 'static-kids-meals', discountPercent: 0 },
  { _id: 'static-km-4', title: 'Kids Nuggets Meal', priceLabel: '£11.00', category: 'static-kids-meals', discountPercent: 0 },
  { _id: 'static-km-5', title: 'Kids Mini Mix Meal', priceLabel: '£11.00', category: 'static-kids-meals', discountPercent: 0 },
  { _id: 'static-km-6', title: 'Kids Mozzarella Sticks Meal', priceLabel: '£11.00', category: 'static-kids-meals', discountPercent: 0 },

  // Nachos
  { _id: 'static-na-1', title: 'Cheesy Nachos', priceLabel: '£11.00', category: 'static-nachos', discountPercent: 0 },
  { _id: 'static-na-2', title: 'Deluxe Nachos', priceLabel: '£11.00', category: 'static-nachos', discountPercent: 0 },
  { _id: 'static-na-3', title: 'Chilli Deluxe Nachos', priceLabel: '£11.00', category: 'static-nachos', discountPercent: 0 },
  { _id: 'static-na-4', title: 'Loaded Nachos', priceLabel: '£11.00', category: 'static-nachos', discountPercent: 0 },
  { _id: 'static-na-5', title: 'Chilli Loaded Nachos', priceLabel: '£11.00', category: 'static-nachos', discountPercent: 0 },
  { _id: 'static-na-6', title: 'Chilli Cheesy Nachos', priceLabel: '£11.00', category: 'static-nachos', discountPercent: 0 },

  // Milkshakes (Large 475ml) - all flavours £11.00
  { _id: 'static-mk-1', title: 'After Eighties Milkshake', priceLabel: '£11.00', category: 'static-milkshakes', description: MILKSHAKE_NOTE, discountPercent: 0 },
  { _id: 'static-mk-2', title: 'Aero Mint Milkshake', priceLabel: '£11.00', category: 'static-milkshakes', description: MILKSHAKE_NOTE, discountPercent: 0 },
  { _id: 'static-mk-3', title: "Cadbury's Caramel Milkshake", priceLabel: '£11.00', category: 'static-milkshakes', description: MILKSHAKE_NOTE, discountPercent: 0 },
  { _id: 'static-mk-4', title: "Cadbury's Flake Milkshake", priceLabel: '£11.00', category: 'static-milkshakes', description: MILKSHAKE_NOTE, discountPercent: 0 },
  { _id: 'static-mk-5', title: 'Crunchie Milkshake', priceLabel: '£11.00', category: 'static-milkshakes', description: MILKSHAKE_NOTE, discountPercent: 0 },
  { _id: 'static-mk-6', title: 'Chocolate Chip Cookie Milkshake', priceLabel: '£11.00', category: 'static-milkshakes', description: MILKSHAKE_NOTE, discountPercent: 0 },
  { _id: 'static-mk-7', title: 'Chocolate Brownie Milkshake', priceLabel: '£11.00', category: 'static-milkshakes', description: MILKSHAKE_NOTE, discountPercent: 0 },
  { _id: 'static-mk-8', title: 'Daim Bar Milkshake', priceLabel: '£11.00', category: 'static-milkshakes', description: MILKSHAKE_NOTE, discountPercent: 0 },
  { _id: 'static-mk-9', title: 'Dairy Milk Milkshake', priceLabel: '£11.00', category: 'static-milkshakes', description: MILKSHAKE_NOTE, discountPercent: 0 },
  { _id: 'static-mk-10', title: 'Ferro Racher Milkshake', priceLabel: '£11.00', category: 'static-milkshakes', description: MILKSHAKE_NOTE, discountPercent: 0 },
  { _id: 'static-mk-11', title: 'Kit Kat Milkshake', priceLabel: '£11.00', category: 'static-milkshakes', description: MILKSHAKE_NOTE, discountPercent: 0 },
  { _id: 'static-mk-12', title: 'Munchies Milkshake', priceLabel: '£11.00', category: 'static-milkshakes', description: MILKSHAKE_NOTE, discountPercent: 0 },
  { _id: 'static-mk-13', title: 'Millions Bubblegum Milkshake', priceLabel: '£11.00', category: 'static-milkshakes', description: MILKSHAKE_NOTE, discountPercent: 0 },
  { _id: 'static-mk-14', title: 'M&M Chocolate Milkshake', priceLabel: '£11.00', category: 'static-milkshakes', description: MILKSHAKE_NOTE, discountPercent: 0 },
  { _id: 'static-mk-15', title: 'M&M Peanuts Milkshake', priceLabel: '£11.00', category: 'static-milkshakes', description: MILKSHAKE_NOTE, discountPercent: 0 },
  { _id: 'static-mk-16', title: 'Milky Bar Milkshake', priceLabel: '£11.00', category: 'static-milkshakes', description: MILKSHAKE_NOTE, discountPercent: 0 },
  { _id: 'static-mk-17', title: 'Milky Way Milkshake', priceLabel: '£11.00', category: 'static-milkshakes', description: MILKSHAKE_NOTE, discountPercent: 0 },
  { _id: 'static-mk-18', title: 'Maltees Milkshake', priceLabel: '£11.00', category: 'static-milkshakes', description: MILKSHAKE_NOTE, discountPercent: 0 },
  { _id: 'static-mk-19', title: 'Mars Bar Milkshake', priceLabel: '£11.00', category: 'static-milkshakes', description: MILKSHAKE_NOTE, discountPercent: 0 },
  { _id: 'static-mk-20', title: "Hershey's Cookies 'n' Cream Milkshake", priceLabel: '£11.00', category: 'static-milkshakes', description: MILKSHAKE_NOTE, discountPercent: 0 },
  { _id: 'static-mk-21', title: 'Nutella Milkshake', priceLabel: '£11.00', category: 'static-milkshakes', description: MILKSHAKE_NOTE, discountPercent: 0 },
  { _id: 'static-mk-22', title: 'Oreo Milkshake', priceLabel: '£11.00', category: 'static-milkshakes', description: MILKSHAKE_NOTE, discountPercent: 0 },
  { _id: 'static-mk-23', title: "Reese's Peanut Butter Cups Milkshake", priceLabel: '£11.00', category: 'static-milkshakes', description: MILKSHAKE_NOTE, discountPercent: 0 },
  { _id: 'static-mk-24', title: 'Rollos Milkshake', priceLabel: '£11.00', category: 'static-milkshakes', description: MILKSHAKE_NOTE, discountPercent: 0 },
  { _id: 'static-mk-25', title: 'Skittles Milkshake', priceLabel: '£11.00', category: 'static-milkshakes', description: MILKSHAKE_NOTE, discountPercent: 0 },
  { _id: 'static-mk-26', title: 'Snickers Milkshake', priceLabel: '£11.00', category: 'static-milkshakes', description: MILKSHAKE_NOTE, discountPercent: 0 },
  { _id: 'static-mk-27', title: 'Smarties Milkshake', priceLabel: '£11.00', category: 'static-milkshakes', description: MILKSHAKE_NOTE, discountPercent: 0 },
  { _id: 'static-mk-28', title: 'Twix Milkshake', priceLabel: '£11.00', category: 'static-milkshakes', description: MILKSHAKE_NOTE, discountPercent: 0 },
  { _id: 'static-mk-29', title: "Terry's Chocolate Orange Milkshake", priceLabel: '£11.00', category: 'static-milkshakes', description: MILKSHAKE_NOTE, discountPercent: 0 },
  { _id: 'static-mk-30', title: 'Wispa Gold Milkshake', priceLabel: '£11.00', category: 'static-milkshakes', description: MILKSHAKE_NOTE, discountPercent: 0 },

  // Smoothies
  { _id: 'static-sm-1', title: "Pash 'n' Shoot", priceLabel: '£11.00', category: 'static-smoothies', discountPercent: 0 },
  { _id: 'static-sm-2', title: 'Melon Refresher', priceLabel: '£11.00', category: 'static-smoothies', discountPercent: 0 },
  { _id: 'static-sm-3', title: 'Big 5', priceLabel: '£11.00', category: 'static-smoothies', discountPercent: 0 },
  { _id: 'static-sm-4', title: 'Berry Go Round', priceLabel: '£11.00', category: 'static-smoothies', discountPercent: 0 },
  { _id: 'static-sm-5', title: 'Grape Escape', priceLabel: '£11.00', category: 'static-smoothies', discountPercent: 0 },
  { _id: 'static-sm-6', title: 'Blueberry Bliss', priceLabel: '£11.00', category: 'static-smoothies', discountPercent: 0 },

  // Drinks - Cans (330ml)
  { _id: 'static-dr-1', title: 'Pepsi (Can 330ml)', priceLabel: '£11.00', category: 'static-drinks', discountPercent: 0 },
  { _id: 'static-dr-2', title: 'Pepsi Max (Can 330ml)', priceLabel: '£11.00', category: 'static-drinks', discountPercent: 0 },
  { _id: 'static-dr-3', title: 'Diet Pepsi (Can 330ml)', priceLabel: '£11.00', category: 'static-drinks', discountPercent: 0 },
  { _id: 'static-dr-4', title: 'Dr Pepper (Can 330ml)', priceLabel: '£11.00', category: 'static-drinks', discountPercent: 0 },
  { _id: 'static-dr-5', title: '7up (Can 330ml)', priceLabel: '£11.00', category: 'static-drinks', discountPercent: 0 },
  { _id: 'static-dr-6', title: 'Tango Orange (Can 330ml)', priceLabel: '£11.00', category: 'static-drinks', discountPercent: 0 },
  { _id: 'static-dr-7', title: 'Tango Apple (Can 330ml)', priceLabel: '£11.00', category: 'static-drinks', discountPercent: 0 },
  { _id: 'static-dr-8', title: 'Mirinda (Can 330ml)', priceLabel: '£11.00', category: 'static-drinks', discountPercent: 0 },
  { _id: 'static-dr-9', title: 'Vimto (Can 330ml)', priceLabel: '£11.00', category: 'static-drinks', discountPercent: 0 },
  { _id: 'static-dr-10', title: 'Coleslaw (120ml)', priceLabel: '£11.00', category: 'static-drinks', discountPercent: 0 },
  // Drinks - 1.5L Bottle
  { _id: 'static-dr-11', title: 'Pepsi (1.5L Bottle)', priceLabel: '£11.00', category: 'static-drinks', discountPercent: 0 },
  { _id: 'static-dr-12', title: 'Pepsi Max (1.5L Bottle)', priceLabel: '£11.00', category: 'static-drinks', discountPercent: 0 },
  { _id: 'static-dr-13', title: '7up (1.5L Bottle)', priceLabel: '£11.00', category: 'static-drinks', discountPercent: 0 },
  { _id: 'static-dr-14', title: 'Tango Orange (1.5L Bottle)', priceLabel: '£11.00', category: 'static-drinks', discountPercent: 0 },

  // Waffle Pizzas
  { _id: 'static-wp-1', title: 'Ma Ma Margarita Waffle Pizza', priceLabel: '£11.00', category: 'static-waffle-pizzas', discountPercent: 0 },
  { _id: 'static-wp-2', title: 'Pepperoni Supreme Waffle Pizza', priceLabel: '£11.00', category: 'static-waffle-pizzas', discountPercent: 0 },
  { _id: 'static-wp-3', title: 'The Mega Meat Waffle Pizza', priceLabel: '£11.00', category: 'static-waffle-pizzas', discountPercent: 0 },
  { _id: 'static-wp-4', title: 'BBQ Blitz Waffle Pizza', priceLabel: '£11.00', category: 'static-waffle-pizzas', discountPercent: 0 },

  // Waffles
  { _id: 'static-wf-1', title: 'Cookie Crush Waffle', priceLabel: '£11.00', category: 'static-waffles', discountPercent: 0 },
  { _id: 'static-wf-2', title: 'Cadbury Caramel Classic Waffle', priceLabel: '£11.00', category: 'static-waffles', discountPercent: 0 },
  { _id: 'static-wf-3', title: 'The Milky Bar Kid Waffle', priceLabel: '£11.00', category: 'static-waffles', discountPercent: 0 },
  { _id: 'static-wf-4', title: 'The American All Star Waffle', priceLabel: '£11.00', category: 'static-waffles', discountPercent: 0 },
  { _id: 'static-wf-5', title: 'The Guilty Pleasure Waffle', priceLabel: '£11.00', category: 'static-waffles', discountPercent: 0 },

  // Donuts
  { _id: 'static-do-1', title: 'The Milky Bar Kid Donuts', priceLabel: '£11.00', category: 'static-donuts', discountPercent: 0 },
  { _id: 'static-do-2', title: 'Cadbury Caramel Donuts', priceLabel: '£11.00', category: 'static-donuts', discountPercent: 0 },
  { _id: 'static-do-3', title: 'Donuts About You', priceLabel: '£11.00', category: 'static-donuts', discountPercent: 0 },
  { _id: 'static-do-4', title: "It's Bueno Donuts", priceLabel: '£11.00', category: 'static-donuts', discountPercent: 0 },
  { _id: 'static-do-5', title: 'Signature Donuts', priceLabel: '£11.00', category: 'static-donuts', discountPercent: 0 },
  { _id: 'static-do-6', title: 'Nutzilla Donuts', priceLabel: '£11.00', category: 'static-donuts', discountPercent: 0 },

  // Pancakes
  { _id: 'static-pc-1', title: 'The Milky Bar Kid Pancakes', priceLabel: '£11.00', category: 'static-pancakes', discountPercent: 0 },
  { _id: 'static-pc-2', title: "It's Bueno Pancakes", priceLabel: '£11.00', category: 'static-pancakes', discountPercent: 0 },
  { _id: 'static-pc-3', title: 'Lotus 1932 Pancakes', priceLabel: '£11.00', category: 'static-pancakes', discountPercent: 0 },
  { _id: 'static-pc-4', title: 'A Taste of Banofi Pancakes', priceLabel: '£11.00', category: 'static-pancakes', discountPercent: 0 },
  { _id: 'static-pc-5', title: 'Dairy Milk Tower Pancakes', priceLabel: '£11.00', category: 'static-pancakes', discountPercent: 0 },
  { _id: 'static-pc-6', title: 'Straw Ela Ela Ela Pancakes', priceLabel: '£11.00', category: 'static-pancakes', discountPercent: 0 },
  { _id: 'static-pc-7', title: 'Berrylicious Pancakes', priceLabel: '£11.00', category: 'static-pancakes', discountPercent: 0 },
  { _id: 'static-pc-8', title: 'The Guilty Pleasure Pancakes', priceLabel: '£11.00', category: 'static-pancakes', discountPercent: 0 },

  // Brownies
  { _id: 'static-br-1', title: 'Original Brownie', priceLabel: '£11.00', category: 'static-brownies', discountPercent: 0 },
  { _id: 'static-br-2', title: "It's Bueno Brownie", priceLabel: '£11.00', category: 'static-brownies', discountPercent: 0 },
  { _id: 'static-br-3', title: 'Ferrero Rocher Brownie', priceLabel: '£11.00', category: 'static-brownies', discountPercent: 0 },
  { _id: 'static-br-4', title: 'Lotus 1932 Brownie', priceLabel: '£11.00', category: 'static-brownies', discountPercent: 0 },
  { _id: 'static-br-5', title: 'Aero Mint Brownie', priceLabel: '£11.00', category: 'static-brownies', discountPercent: 0 },
  { _id: 'static-br-6', title: 'Caramel Overload Brownie', priceLabel: '£11.00', category: 'static-brownies', discountPercent: 0 },
  { _id: 'static-br-7', title: 'Milky Bar Kid Brownie', priceLabel: '£11.00', category: 'static-brownies', discountPercent: 0 },
  { _id: 'static-br-8', title: 'Cookie Crush Brownie', priceLabel: '£11.00', category: 'static-brownies', discountPercent: 0 },

  // Pizzas (9" / 12" / 14")
  { _id: 'static-pz-1', title: 'Cheese & Tomato', priceLabel: '9" £5.95 · 12" £7.95 · 14" £9.95', category: 'static-pizzas', description: PIZZA_NOTE, discountPercent: 0 },
  { _id: 'static-pz-2', title: 'So~So Cheesy Margherita', priceLabel: '9" £6.95 · 12" £8.95 · 14" £10.95', category: 'static-pizzas', description: PIZZA_NOTE, discountPercent: 0 },
  { _id: 'static-pz-3', title: 'Double Pepperoni', priceLabel: '9" £7.95 · 12" £9.95 · 14" £11.95', category: 'static-pizzas', description: PIZZA_NOTE, discountPercent: 0 },
  { _id: 'static-pz-4', title: 'Nugget Pop Pizza', priceLabel: '9" £7.95 · 12" £9.95 · 14" £11.95', category: 'static-pizzas', description: PIZZA_NOTE, discountPercent: 0 },
  { _id: 'static-pz-5', title: "Meat Lover's Delight", priceLabel: '9" £7.95 · 12" £9.95 · 14" £11.95', category: 'static-pizzas', description: PIZZA_NOTE, discountPercent: 0 },
  { _id: 'static-pz-6', title: 'Spicy Beef Special', priceLabel: '9" £7.95 · 12" £9.95 · 14" £11.95', category: 'static-pizzas', description: PIZZA_NOTE, discountPercent: 0 },
  { _id: 'static-pz-7', title: 'Peri Spicy Chicken Special', priceLabel: '9" £7.95 · 12" £9.95 · 14" £11.95', category: 'static-pizzas', description: PIZZA_NOTE, discountPercent: 0 },
  { _id: 'static-pz-8', title: 'Create Your Own', priceLabel: '9" £7.95 · 12" £9.95 · 14" £11.95', category: 'static-pizzas', description: PIZZA_NOTE, discountPercent: 0 },
  { _id: 'static-pz-9', title: 'Hawaiian', priceLabel: '9" £7.95 · 12" £9.95 · 14" £11.95', category: 'static-pizzas', description: PIZZA_NOTE, discountPercent: 0 },
  { _id: 'static-pz-10', title: 'Vegetarian Delight', priceLabel: '9" £7.95 · 12" £9.95 · 14" £11.95', category: 'static-pizzas', description: PIZZA_NOTE, discountPercent: 0 },
  { _id: 'static-pz-11', title: 'Tex Mex', priceLabel: '9" £7.95 · 12" £9.95 · 14" £11.95', category: 'static-pizzas', description: PIZZA_NOTE, discountPercent: 0 },
  { _id: 'static-pz-12', title: "Nice 'n' Spicy", priceLabel: '9" £7.95 · 12" £9.95 · 14" £11.95', category: 'static-pizzas', description: PIZZA_NOTE, discountPercent: 0 },
  { _id: 'static-pz-13', title: 'Donner Pizza', priceLabel: '9" £7.95 · 12" £9.95 · 14" £11.95', category: 'static-pizzas', description: PIZZA_NOTE, discountPercent: 0 },
  { _id: 'static-pz-14', title: 'Bacon Pizza', priceLabel: '9" £7.95 · 12" £9.95 · 14" £11.95', category: 'static-pizzas', description: PIZZA_NOTE, discountPercent: 0 },

  // Garlic Breads (9" / 12" / 14") - prices reproduced as printed, see GARLIC_BREAD_NOTE
  { _id: 'static-gb-1', title: 'Cheesy Garlic Bread', priceLabel: '9" £13.00 · 12" £3.00 · 14" £11.00', category: 'static-garlic-breads', description: GARLIC_BREAD_NOTE, discountPercent: 0 },
  { _id: 'static-gb-2', title: 'Fungus Delight', priceLabel: '9" £3.00 · 12" £3.00 · 14" £11.00', category: 'static-garlic-breads', description: GARLIC_BREAD_NOTE, discountPercent: 0 },
  { _id: 'static-gb-3', title: 'Mushroom Magic', priceLabel: '9" £3.00 · 12" £3.00 · 14" £11.00', category: 'static-garlic-breads', description: GARLIC_BREAD_NOTE, discountPercent: 0 },
  { _id: 'static-gb-4', title: 'Donner Delight', priceLabel: '9" £3.00 · 12" £3.00 · 14" £11.00', category: 'static-garlic-breads', description: GARLIC_BREAD_NOTE, discountPercent: 0 },
  { _id: 'static-gb-5', title: 'Chilli Beef Garlic Bread', priceLabel: '9" £3.00 · 12" £3.00 · 14" £11.00', category: 'static-garlic-breads', description: GARLIC_BREAD_NOTE, discountPercent: 0 },

  // Calzones (9" / 12" / 14")
  { _id: 'static-cz-1', title: 'Just Donner Calzone', priceLabel: '9" £3.00 · 12" £3.00 · 14" £11.00', category: 'static-calzones', discountPercent: 0 },
  { _id: 'static-cz-2', title: "Meat Lover's Calzone", priceLabel: '9" £3.00 · 12" £3.00 · 14" £11.00', category: 'static-calzones', discountPercent: 0 },
  { _id: 'static-cz-3', title: 'Create Your Own Calzone', priceLabel: '9" £3.00 · 12" £3.00 · 14" £11.00', category: 'static-calzones', discountPercent: 0 },

  // Pizza Meals
  { _id: 'static-pm-1', title: '9" Pizza Meal', priceLabel: '£11.00', category: 'static-pizza-meals', discountPercent: 0 },
  { _id: 'static-pm-2', title: '12" Pizza Meal', priceLabel: '£11.00', category: 'static-pizza-meals', discountPercent: 0 },
  { _id: 'static-pm-3', title: '14" Pizza Meal', priceLabel: '£11.00', category: 'static-pizza-meals', discountPercent: 0 },

  // Calzone Meals
  { _id: 'static-cm-1', title: '9" Calzone Meal', priceLabel: '£11.00', category: 'static-calzone-meals', discountPercent: 0 },
  { _id: 'static-cm-2', title: '12" Calzone Meal', priceLabel: '£11.00', category: 'static-calzone-meals', discountPercent: 0 },
  { _id: 'static-cm-3', title: '14" Calzone Meal', priceLabel: '£11.00', category: 'static-calzone-meals', discountPercent: 0 },

  // Meal Deals (chicken)
  { _id: 'static-md-1', title: 'Boneless Strips Meal (4)', priceLabel: '£7.95', category: 'static-meal-deals', discountPercent: 0 },
  { _id: 'static-md-2', title: 'Spicy Wings Meal (6)', priceLabel: '£6.95', category: 'static-meal-deals', discountPercent: 0 },
  { _id: 'static-md-3', title: 'Classic Chicken Meal (3)', priceLabel: '£6.95', category: 'static-meal-deals', discountPercent: 0 },
  { _id: 'static-md-4', title: 'Chicken Nuggets Meal (10)', priceLabel: '£7.95', category: 'static-meal-deals', discountPercent: 0 },
  { _id: 'static-md-5', title: 'Popcorn Chicken Meal (12)', priceLabel: '£7.95', category: 'static-meal-deals', discountPercent: 0 },
  { _id: 'static-md-6', title: 'Boneless Chicken Meal', priceLabel: '£9.95', category: 'static-meal-deals', discountPercent: 0 },
  { _id: 'static-md-7', title: 'Mini Variety Meal', priceLabel: '£7.95', category: 'static-meal-deals', discountPercent: 0 },
  { _id: 'static-md-8', title: 'Mini Feast Meal', priceLabel: '£11.95', category: 'static-meal-deals', discountPercent: 0 },

  // Kebabs
  { _id: 'static-kb-1', title: 'Donner Kebab', priceLabel: '£7.95', category: 'static-kebabs', discountPercent: 0 },
  { _id: 'static-kb-2', title: 'Cheesy Donner Kebab', priceLabel: '£8.95', category: 'static-kebabs', discountPercent: 0 },

  // Fries
  { _id: 'static-fr-1', title: 'Regular Fries', priceLabel: '£1.95', category: 'static-fries', discountPercent: 0 },
  { _id: 'static-fr-2', title: 'Large Fries', priceLabel: '£2.55', category: 'static-fries', discountPercent: 0 },
  { _id: 'static-fr-3', title: 'Mozzarella Cheesy Fries', priceLabel: '£3.00', category: 'static-fries', discountPercent: 0 },
  { _id: 'static-fr-4', title: 'Nacho Cheesy Fries', priceLabel: '£3.95', category: 'static-fries', discountPercent: 0 },
  { _id: 'static-fr-5', title: 'So~So Cheesy Fries', priceLabel: '£3.95', category: 'static-fries', discountPercent: 0 },
  { _id: 'static-fr-6', title: 'Mexicana Cheesy Fries', priceLabel: '£4.95', category: 'static-fries', discountPercent: 0 },
  { _id: 'static-fr-7', title: 'Fully Loaded Fries', priceLabel: '£5.95', category: 'static-fries', discountPercent: 0 },
  { _id: 'static-fr-8', title: 'CheeseBurger Loaded Fries', priceLabel: '£6.95', category: 'static-fries', discountPercent: 0 },
  { _id: 'static-fr-9', title: 'Boneless Chicken Loaded Fries', priceLabel: '£6.95', category: 'static-fries', discountPercent: 0 },
  { _id: 'static-fr-10', title: 'Pepperoni Loaded Fries', priceLabel: '£6.95', category: 'static-fries', discountPercent: 0 },
  { _id: 'static-fr-11', title: 'Piggy in the Middle Fries', priceLabel: '£6.95', category: 'static-fries', discountPercent: 0 },
  { _id: 'static-fr-12', title: 'Popcorn Loaded Fries', priceLabel: '£6.95', category: 'static-fries', discountPercent: 0 },
  { _id: 'static-fr-13', title: 'Nuggets Loaded Fries', priceLabel: '£6.95', category: 'static-fries', discountPercent: 0 },

  // Side Dishes - "Spicy Chicken Bites (6)" is listed twice in the source
  // menu at two different prices (£3.95 and £1.95); reproduced as printed.
  { _id: 'static-sd-1', title: 'Popcorn Chicken (10)', priceLabel: '£3.95', category: 'static-side-dishes', discountPercent: 0 },
  { _id: 'static-sd-2', title: 'Chicken Nuggets (10)', priceLabel: '£3.95', category: 'static-side-dishes', discountPercent: 0 },
  { _id: 'static-sd-3', title: 'Jalapeno Bites (6)', priceLabel: '£3.95', category: 'static-side-dishes', discountPercent: 0 },
  { _id: 'static-sd-4', title: 'Mozzarella Sticks (6)', priceLabel: '£3.95', category: 'static-side-dishes', discountPercent: 0 },
  { _id: 'static-sd-5', title: 'Spicy Chicken Bites (6)', priceLabel: '£3.95', category: 'static-side-dishes', discountPercent: 0 },
  { _id: 'static-sd-6', title: 'Onion Rings (10)', priceLabel: '£3.95', category: 'static-side-dishes', discountPercent: 0 },
  { _id: 'static-sd-7', title: 'Cheesy Onion Rings (10)', priceLabel: '£4.95', category: 'static-side-dishes', discountPercent: 0 },
  { _id: 'static-sd-8', title: 'Potato Wedges', priceLabel: '£3.95', category: 'static-side-dishes', discountPercent: 0 },
  { _id: 'static-sd-9', title: 'Cheesy Potato Wedges', priceLabel: '£4.95', category: 'static-side-dishes', discountPercent: 0 },
  { _id: 'static-sd-10', title: 'Hashbrown (3)', priceLabel: '£1.95', category: 'static-side-dishes', discountPercent: 0 },
  { _id: 'static-sd-11', title: 'Curly Fries', priceLabel: '£3.95', category: 'static-side-dishes', discountPercent: 0 },
  { _id: 'static-sd-12', title: 'Cheesy Curly Fries', priceLabel: '£4.95', category: 'static-side-dishes', discountPercent: 0 },
  { _id: 'static-sd-13', title: 'Heinz Beans (120ml)', priceLabel: '£1.00', category: 'static-side-dishes', discountPercent: 0 },
  { _id: 'static-sd-14', title: 'Chicken Gravy (150ml)', priceLabel: '£1.00', category: 'static-side-dishes', discountPercent: 0 },
  { _id: 'static-sd-15', title: 'Spicy Chicken Bites (6)', priceLabel: '£1.95', category: 'static-side-dishes', discountPercent: 0 },
];
