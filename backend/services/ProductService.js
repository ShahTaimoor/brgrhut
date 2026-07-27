const XLSX = require('xlsx');
const mongoose = require('mongoose');
const { productRepository, categoryRepository } = require('../repositories');
const { uploadImageOnCloudinary, deleteImageOnCloudinary } = require('../utils/cloudinary');
const { BadRequestError, NotFoundError } = require('../errors');

class ProductService {
  async createProduct(productData, userId, file) {
    const { title, description, price, category, isAvailable, prepTime, isSpicy, isVegetarian, isFeatured, discountPercent } = productData;

    if (!title || !price || !category || !file) {
      throw new BadRequestError('All fields are required including image');
    }

    const existingProduct = await productRepository.findOne({
      title: { $regex: new RegExp(`^${title.trim()}$`, 'i') }
    });

    if (existingProduct) {
      throw new BadRequestError('Product with this name already exists');
    }

    const { secure_url, public_id } = await uploadImageOnCloudinary(file.buffer, 'products');

    if (!secure_url || !public_id) {
      throw new BadRequestError('Cloudinary upload failed');
    }

    return await productRepository.create({
      title,
      description,
      price: parseFloat(price),
      discountPercent: discountPercent !== undefined ? Math.min(100, Math.max(0, parseFloat(discountPercent) || 0)) : 0,
      category,
      isAvailable: isAvailable === undefined ? true : (isAvailable === 'true' || isAvailable === true),
      prepTime: parseInt(prepTime) || 15,
      isSpicy: isSpicy === 'true' || isSpicy === true,
      isVegetarian: isVegetarian === 'true' || isVegetarian === true,
      isFeatured: isFeatured === 'true' || isFeatured === true,
      user: userId,
      picture: { secure_url, public_id }
    });
  }

  async importExcel(fileBuffer, userId) {
    if (!fileBuffer) {
      throw new BadRequestError('Excel file is required');
    }

    const workbook = XLSX.read(fileBuffer, {
      type: 'buffer',
      cellDates: true,
      cellNF: false,
      cellText: false
    });

    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    let jsonData = XLSX.utils.sheet_to_json(worksheet, {
      header: 1,
      defval: ''
    });

    if (jsonData.length > 0 && Array.isArray(jsonData[0])) {
      const headers = jsonData[0];
      const headerMap = {};

      headers.forEach((header, index) => {
        if (header) {
          const cleanHeader = header.toString().toLowerCase().trim();
          if (cleanHeader.includes('name') || cleanHeader === 'title') {
            headerMap[index] = 'title';
          } else if (cleanHeader.includes('price')) {
            headerMap[index] = 'price';
          } else if (cleanHeader.includes('preptime') || cleanHeader.includes('prep')) {
            headerMap[index] = 'prepTime';
          } else if (cleanHeader.includes('spicy')) {
            headerMap[index] = 'isSpicy';
          }
        }
      });

      jsonData = jsonData.slice(1).map(row => {
        const obj = {};
        Object.keys(headerMap).forEach(index => {
          obj[headerMap[index]] = row[index];
        });
        return obj;
      });
    } else {
      jsonData = XLSX.utils.sheet_to_json(worksheet);
    }

    if (jsonData.length === 0) {
      throw new BadRequestError('Excel file is empty or invalid format');
    }

    const results = { success: 0, failed: 0, errors: [] };
    let defaultCategoryId = null;

    for (let i = 0; i < jsonData.length; i++) {
      const row = jsonData[i];
      const rowNumber = i + 2;

      try {
        const title = row.title || row.name;
        const price = row.price;

        if (!title && !price) continue;

        const productName = title ? title.trim() : `Dish ${rowNumber}`;
        const productPrice = parseFloat(price.toString().replace(/,/g, '')) || 0;
        const productPrepTime = parseInt(row.prepTime) || 15;
        const productIsSpicy = row.isSpicy === 'true' || row.isSpicy === true || row.isSpicy === 'yes';

        if (!defaultCategoryId) {
          const existingCategory = await categoryRepository.findOne({ name: 'General' });
          if (existingCategory) {
            defaultCategoryId = existingCategory._id;
          } else {
            const newCategory = await categoryRepository.create({
              name: 'General',
              slug: 'general',
              emoji: '🍔',
              picture: {
                secure_url: '/logos.png',
                public_id: 'default-category-image'
              }
            });
            defaultCategoryId = newCategory._id;
          }
        }

        await productRepository.create({
          title: productName,
          description: `Imported from Excel - Row ${rowNumber}`,
          price: productPrice,
          category: defaultCategoryId,
          isAvailable: true,
          prepTime: productPrepTime,
          isSpicy: productIsSpicy,
          user: userId,
          picture: {
            secure_url: '/logos.png',
            public_id: 'default-product-image'
          }
        });

        results.success++;
      } catch (error) {
        results.failed++;
        results.errors.push(`Row ${rowNumber}: ${error.message}`);
      }
    }

    return results;
  }

  async updateProduct(productId, updateData, file) {
    const product = await productRepository.findById(productId);
    if (!product) {
      throw new NotFoundError('Product not found');
    }

    const { title } = updateData;

    if (title && title.trim() !== product.title) {
      const existingProduct = await productRepository.findOne({
        title: { $regex: new RegExp(`^${title.trim()}$`, 'i') },
        _id: { $ne: productId }
      });

      if (existingProduct) {
        throw new BadRequestError('Product with this name already exists');
      }
    }

    const updateFields = {};
    if (title) updateFields.title = title;
    if (updateData.description !== undefined) updateFields.description = updateData.description;
    if (updateData.price !== undefined) updateFields.price = parseFloat(updateData.price);
    if (updateData.discountPercent !== undefined) {
      updateFields.discountPercent = Math.min(100, Math.max(0, parseFloat(updateData.discountPercent) || 0));
    }
    if (updateData.category !== undefined) updateFields.category = updateData.category;
    
    // Fast Food toggles
    if (updateData.isAvailable !== undefined) {
      updateFields.isAvailable = updateData.isAvailable === 'true' || updateData.isAvailable === true;
    }
    if (updateData.prepTime !== undefined) {
      updateFields.prepTime = parseInt(updateData.prepTime) || 15;
    }
    if (updateData.isSpicy !== undefined) {
      updateFields.isSpicy = updateData.isSpicy === 'true' || updateData.isSpicy === true;
    }
    if (updateData.isVegetarian !== undefined) {
      updateFields.isVegetarian = updateData.isVegetarian === 'true' || updateData.isVegetarian === true;
    }
    if (updateData.isFeatured !== undefined) {
      updateFields.isFeatured = updateData.isFeatured === 'true' || updateData.isFeatured === true;
    }

    if (file) {
      const { secure_url, public_id } = await uploadImageOnCloudinary(file.buffer, 'products');

      if (product.picture && product.picture.public_id) {
        await deleteImageOnCloudinary(product.picture.public_id);
      }

      updateFields.picture = { secure_url, public_id };
    }

    return await productRepository.updateById(productId, updateFields);
  }

  async updateProductAvailability(productId, isAvailable) {
    if (isAvailable === undefined || isAvailable === null) {
      throw new BadRequestError('Availability state is required');
    }

    const product = await productRepository.findById(productId);
    if (!product) {
      throw new NotFoundError('Product not found');
    }

    const availabilityState = isAvailable === 'true' || isAvailable === true;
    return await productRepository.updateById(productId, { isAvailable: availabilityState });
  }

  async bulkUpdateFeatured(productIds, isFeatured) {
    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      throw new BadRequestError('Product IDs array is required');
    }

    if (isFeatured === undefined || isFeatured === null) {
      throw new BadRequestError('isFeatured value is required');
    }

    const featuredValue = isFeatured === 'true' || isFeatured === true;
    const result = await productRepository.updateMany(
      { _id: { $in: productIds } },
      { $set: { isFeatured: featuredValue } }
    );

    return {
      modifiedCount: result.modifiedCount,
      featuredValue
    };
  }

  async deleteProduct(productId) {
    const product = await productRepository.findById(productId);
    if (!product) {
      throw new NotFoundError('Product not found');
    }

    if (product.picture && product.picture.public_id) {
      await deleteImageOnCloudinary(product.picture.public_id);
    }

    await productRepository.deleteById(productId);
    return product;
  }

  async getProducts(filters) {
    let { category, page = 1, limit = 24, availabilityFilter = 'all', sortBy = 'az' } = filters;

    if (limit === 'all') {
      limit = 0;
    } else {
      limit = parseInt(limit);
    }
    page = parseInt(page);

    if (page < 1) page = 1;
    if (limit < 0) limit = 24;

    const query = { isDeleted: false };
    
    // Filter by availability state
    if (availabilityFilter === 'available' || availabilityFilter === 'active') {
      query.isAvailable = true;
    } else if (availabilityFilter === 'sold-out') {
      query.isAvailable = false;
    } else if (availabilityFilter === 'low-stock') {
      // For a food menu, 'low-stock' means unavailable items (sold out)
      query.isAvailable = false;
    }
    // 'all' means no filter - return everything

    if (category && category.trim().toLowerCase() !== 'all') {
      const trimmedCategory = category.trim().toLowerCase();
      const isValidObjectId = mongoose.Types.ObjectId.isValid(trimmedCategory);

      if (isValidObjectId) {
        query.category = trimmedCategory;
      } else {
        let matchedCategory = await categoryRepository.findOne({
          slug: trimmedCategory
        });

        if (!matchedCategory) {
          matchedCategory = await categoryRepository.findOne({
            name: new RegExp(`^${trimmedCategory}$`, 'i')
          });
        }

        if (matchedCategory) {
          query.category = matchedCategory._id;
        } else {
          return {
            data: [],
            pagination: {
              total: 0,
              page,
              limit,
              totalPages: 0
            }
          };
        }
      }
    }

    const totalProducts = await productRepository.countDocuments(query);
    const sortObject = this._getSortObject(sortBy);

    const products = await productRepository.find(query, {
      select: 'title picture price discountPercent description isAvailable prepTime isSpicy isVegetarian isFeatured createdAt',
      populate: [
        { path: 'user', select: 'name' },
        { path: 'category', select: 'name' }
      ],
      sort: sortObject,
      skip: limit === 0 ? 0 : (page - 1) * limit,
      limit: limit || undefined
    });

    const formattedProducts = products.map(product => {
      const productObj = { ...product };
      productObj.image = productObj.picture?.secure_url || null;
      return productObj;
    });

    return {
      data: formattedProducts,
      pagination: {
        total: totalProducts,
        page,
        limit,
        totalPages: limit > 0 ? Math.ceil(totalProducts / limit) : 1
      }
    };
  }

  async getSingleProduct(productId) {
    const product = await productRepository.findByIdWithPopulate(productId, [
      { path: 'user', select: 'name' },
      { path: 'category', select: 'name' }
    ]);

    if (!product) {
      throw new NotFoundError('Product not found');
    }

    return product;
  }

  // Quick count of temporarily disabled menu items
  async getSoldOutCount() {
    return await productRepository.countDocuments({
      isAvailable: false,
      isDeleted: false
    });
  }

  _getSortObject(sortBy) {
    const sortMap = {
      'az': { isFeatured: -1, title: 1 },
      'za': { isFeatured: -1, title: -1 },
      'price-low': { isFeatured: -1, price: 1 },
      'price-high': { isFeatured: -1, price: -1 },
      'newest': { isFeatured: -1, createdAt: -1 },
      'oldest': { isFeatured: -1, createdAt: 1 },
      'relevance': { isFeatured: -1, createdAt: -1 },
      'stock-low': { isFeatured: -1, isAvailable: 1, title: 1 },
      'stock-high': { isFeatured: -1, isAvailable: -1, title: 1 }
    };

    return sortMap[sortBy] || { isFeatured: -1, title: 1 };
  }
}

module.exports = new ProductService();