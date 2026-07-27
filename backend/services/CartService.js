const mongoose = require('mongoose');
const { cartRepository, productRepository } = require('../repositories');
const { BadRequestError, NotFoundError } = require('../errors');

// Fast food is made-to-order (no stock count), so cap quantity per item to a sane order size
const MAX_ORDER_QUANTITY = 99;

class CartService {
  async getCart(userId) {
    // Validate userId
    if (!userId) {
      throw new BadRequestError('User ID is required');
    }
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new BadRequestError('Invalid user ID format');
    }

    // Convert userId to ObjectId for consistency
    const userObjectId = mongoose.Types.ObjectId.isValid(userId) 
      ? new mongoose.Types.ObjectId(userId) 
      : userId;

    const cart = await cartRepository.findOneWithPopulate(
      { user: userObjectId },
      [{ path: 'items.product' }]
    );

    if (!cart) {
      return { items: [] };
    }

    let validItems = cart.items.filter(item => item.product !== null);

    const itemsToUpdate = [];
    validItems = validItems.map(item => {
      const product = item.product;
      const isAvailable = product.isAvailable === true;
      const requestedQty = item.quantity;

      if (!isAvailable) {
        return {
          ...item.toObject(),
          product: {
            ...product.toObject(),
            isOutOfStock: true,
            availableStock: 0
          }
        };
      }

      if (requestedQty > MAX_ORDER_QUANTITY) {
        itemsToUpdate.push({
          productId: product._id.toString(),
          quantity: MAX_ORDER_QUANTITY
        });
        return {
          ...item.toObject(),
          quantity: MAX_ORDER_QUANTITY,
          product: {
            ...product.toObject(),
            isOutOfStock: false,
            availableStock: MAX_ORDER_QUANTITY,
            quantityAdjusted: true,
            originalQuantity: requestedQty
          }
        };
      }

      return {
        ...item.toObject(),
        product: {
          ...product.toObject(),
          isOutOfStock: false,
          availableStock: MAX_ORDER_QUANTITY
        }
      };
    });

    if (itemsToUpdate.length > 0) {
      itemsToUpdate.forEach(({ productId, quantity }) => {
        const itemIndex = cart.items.findIndex(i => i.product.toString() === productId);
        if (itemIndex > -1) {
          cart.items[itemIndex].quantity = quantity;
        }
      });
      cart.updatedAt = new Date();
      await cartRepository.save(cart);
    }

    if (validItems.length !== cart.items.length) {
      cart.items = validItems.map(item => ({
        product: item.product._id,
        quantity: item.quantity
      }));
      cart.updatedAt = new Date();
      await cartRepository.save(cart);
    }

    return { items: validItems };
  }

  async addItem(userId, productId, quantity) {
    // Validate userId
    if (!userId) {
      throw new BadRequestError('User ID is required');
    }
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new BadRequestError('Invalid user ID format');
    }

    const product = await productRepository.findById(productId);

    if (!product) {
      throw new NotFoundError('Product not found');
    }

    if (!product.isAvailable) {
      throw new BadRequestError(`Product "${product.title}" is currently unavailable`);
    }

    // Convert userId to ObjectId for consistency
    const userObjectId = mongoose.Types.ObjectId.isValid(userId)
      ? new mongoose.Types.ObjectId(userId)
      : userId;

    let cart = await cartRepository.findOne({ user: userObjectId });
    if (!cart) {
      cart = await cartRepository.create({ user: userObjectId, items: [] });
    }

    const itemIndex = cart.items.findIndex(i => i.product.toString() === productId);
    const requestedQuantity = itemIndex > -1
      ? cart.items[itemIndex].quantity + quantity
      : quantity;

    if (requestedQuantity > MAX_ORDER_QUANTITY) {
      throw new BadRequestError(
        `Maximum order quantity for "${product.title}" is ${MAX_ORDER_QUANTITY}. You requested ${requestedQuantity}.`
      );
    }

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cartRepository.save(cart);

    const updatedCart = await cartRepository.findOneWithPopulate(
      { user: userObjectId },
      [{ path: 'items.product' }]
    );

    let validItems = updatedCart.items.filter(item => item.product !== null);

    if (validItems.length !== updatedCart.items.length) {
      updatedCart.items = validItems;
      updatedCart.updatedAt = new Date();
      await cartRepository.save(updatedCart);
    }

    return { items: validItems };
  }

  async removeItem(userId, productId) {
    // Validate userId
    if (!userId) {
      throw new BadRequestError('User ID is required');
    }
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new BadRequestError('Invalid user ID format');
    }

    // Convert userId to ObjectId for consistency
    const userObjectId = mongoose.Types.ObjectId.isValid(userId) 
      ? new mongoose.Types.ObjectId(userId) 
      : userId;

    let cart = await cartRepository.findOne({ user: userObjectId });
    if (!cart) {
      return { items: [] };
    }

    cart.items = cart.items.filter(i => i.product.toString() !== productId);
    cart.updatedAt = new Date();
    await cartRepository.save(cart);

    const updatedCart = await cartRepository.findOneWithPopulate(
      { user: userObjectId },
      [{ path: 'items.product' }]
    );

    let validItems = updatedCart.items.filter(item => item.product !== null);

    if (validItems.length !== updatedCart.items.length) {
      updatedCart.items = validItems;
      updatedCart.updatedAt = new Date();
      await cartRepository.save(updatedCart);
    }

    return { items: validItems };
  }

  async emptyCart(userId) {
    // Validate userId
    if (!userId) {
      throw new BadRequestError('User ID is required');
    }
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new BadRequestError('Invalid user ID format');
    }

    // Convert userId to ObjectId for consistency
    const userObjectId = mongoose.Types.ObjectId.isValid(userId) 
      ? new mongoose.Types.ObjectId(userId) 
      : userId;

    let cart = await cartRepository.findOne({ user: userObjectId });
    if (cart) {
      cart.items = [];
      cart.updatedAt = new Date();
      await cartRepository.save(cart);
    }
    return { items: [] };
  }

  async updateItemQuantity(userId, productId, quantity) {
    // Validate userId
    if (!userId) {
      throw new BadRequestError('User ID is required');
    }
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new BadRequestError('Invalid user ID format');
    }

    // Convert userId to ObjectId for consistency
    const userObjectId = mongoose.Types.ObjectId.isValid(userId) 
      ? new mongoose.Types.ObjectId(userId) 
      : userId;

    let cart = await cartRepository.findOne({ user: userObjectId });
    if (!cart) {
      throw new NotFoundError('Cart not found');
    }

    const itemIndex = cart.items.findIndex(i => i.product.toString() === productId);
    if (itemIndex === -1) {
      throw new NotFoundError('Item not found in cart');
    }

    const product = await productRepository.findById(productId);

    if (!product) {
      throw new NotFoundError('Product not found');
    }

    if (!product.isAvailable) {
      throw new BadRequestError(`Product "${product.title}" is currently unavailable`);
    }

    if (quantity > MAX_ORDER_QUANTITY) {
      throw new BadRequestError(
        `Maximum order quantity for "${product.title}" is ${MAX_ORDER_QUANTITY}. You requested ${quantity}.`
      );
    }

    cart.items[itemIndex].quantity = quantity;
    cart.updatedAt = new Date();
    await cartRepository.save(cart);

    const updatedCart = await cartRepository.findOneWithPopulate(
      { user: userObjectId },
      [{ path: 'items.product' }]
    );

    let validItems = updatedCart.items.filter(item => item.product !== null);

    if (validItems.length !== updatedCart.items.length) {
      updatedCart.items = validItems;
      updatedCart.updatedAt = new Date();
      await cartRepository.save(updatedCart);
    }

    return { items: validItems };
  }

  async checkStock(products) {
    if (!products || !Array.isArray(products)) {
      throw new BadRequestError('Products array is required');
    }

    const stockStatus = [];
    const outOfStockItems = [];
    const insufficientStockItems = [];

    for (const item of products) {
      const product = await productRepository.findById(item.id || item.productId);
      const requestedQuantity = item.quantity || 0;

      if (!product) {
        outOfStockItems.push({
          productId: item.id || item.productId,
          productTitle: 'Product',
          message: 'Product not found'
        });
        continue;
      }

      if (!product.isAvailable) {
        outOfStockItems.push({
          productId: product._id.toString(),
          productTitle: product.title,
          message: `"${product.title}" is currently unavailable`
        });
        continue;
      }

      if (requestedQuantity > MAX_ORDER_QUANTITY) {
        insufficientStockItems.push({
          productId: product._id.toString(),
          productTitle: product.title,
          availableStock: MAX_ORDER_QUANTITY,
          requestedQuantity
        });
        continue;
      }

      stockStatus.push({
        productId: product._id.toString(),
        available: true,
        availableStock: MAX_ORDER_QUANTITY,
        requestedQuantity
      });
    }

    const isValid = outOfStockItems.length === 0 && insufficientStockItems.length === 0;

    return {
      isValid,
      stockStatus,
      outOfStockItems,
      insufficientStockItems,
      message: isValid
        ? 'All products are available in requested quantities'
        : `${outOfStockItems.length} out of stock, ${insufficientStockItems.length} insufficient stock`
    };
  }
}

module.exports = new CartService();

