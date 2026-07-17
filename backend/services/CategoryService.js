const slugify = require('slugify');
const { categoryRepository } = require('../repositories');
const { uploadImageOnCloudinary, deleteImageOnCloudinary } = require('../utils/cloudinary');
const { BadRequestError, NotFoundError } = require('../errors');
const logger = require('../utils/logger');

class CategoryService {
  async normalizePositions() {
    try {
      const categories = await categoryRepository.find({}, { sort: { position: 1, createdAt: 1 } });
      for (let i = 0; i < categories.length; i++) {
        const expectedPosition = i + 1;
        if (categories[i].position !== expectedPosition) {
          await categoryRepository.updateOne(
            { _id: categories[i]._id },
            { position: expectedPosition }
          );
        }
      }
    } catch (error) {
      logger.error('Error normalizing positions:', { error: error.message, stack: error.stack });
    }
  }

  async createCategory(name, file, emoji) {
    if (!name) {
      throw new BadRequestError('Category name is required');
    }

    const existingCategory = await categoryRepository.findOne({
      name: { $regex: `^${name}$`, $options: 'i' }
    });

    if (existingCategory) {
      throw new BadRequestError('Category already exists');
    }

    let pictureData = undefined;

    // Only upload to Cloudinary if an image file is actually provided
    if (file) {
      const { secure_url, public_id } = await uploadImageOnCloudinary(file.buffer, 'products');
      if (!secure_url || !public_id) {
        throw new BadRequestError('Cloudinary upload failed');
      }
      pictureData = { secure_url, public_id };
    }

    const lastCategory = await categoryRepository.find({}, { sort: { position: -1 }, limit: 1 });
    const newPosition = lastCategory.length > 0 ? lastCategory[0].position + 1 : 1;

    const category = await categoryRepository.create({
      name,
      slug: slugify(name, { lower: true, strict: true }),
      emoji: emoji || "🍔", // Falls back to default emoji if none passed
      picture: pictureData,
      position: newPosition,
      active: true
    });

    await this.normalizePositions();

    return category;
  }

  async updateCategory(slug, updateData, file) {
    const { name, position, active, emoji } = updateData;

    if (!name) {
      throw new BadRequestError('Category name is required');
    }

    if (position !== undefined) {
      const newPosition = parseInt(position);
      const existingCategoryWithPosition = await categoryRepository.findOne({
        position: newPosition,
        slug: { $ne: slug }
      });

      const currentCategory = await categoryRepository.findOne({ slug });
      const currentPosition = currentCategory?.position;

      if (existingCategoryWithPosition) {
        await categoryRepository.updateOne(
          { _id: existingCategoryWithPosition._id },
          { position: currentPosition || newPosition + 1000 }
        );
      }
    }

    const updateFields = {
      name,
      slug: slugify(name, { lower: true, strict: true })
    };

    if (emoji !== undefined) {
      updateFields.emoji = emoji;
    }

    if (position !== undefined) {
      updateFields.position = parseInt(position);
    }

    if (active !== undefined) {
      // Handle both string and boolean values from FormData
      if (typeof active === 'string') {
        updateFields.active = active === 'true' || active === '1';
      } else {
        updateFields.active = Boolean(active);
      }
    }

    const currentCategory = await categoryRepository.findOne({ slug });
    if (!currentCategory) {
      throw new NotFoundError('Category not found');
    }

    if (file) {
      const { secure_url, public_id } = await uploadImageOnCloudinary(file.buffer, 'products');

      // Safely delete old Cloudinary image if it exists
      if (currentCategory.picture && currentCategory.picture.public_id) {
        await deleteImageOnCloudinary(currentCategory.picture.public_id);
      }

      updateFields.picture = { secure_url, public_id };
    }

    const updatedCategory = await categoryRepository.updateOne({ slug }, updateFields);

    await this.normalizePositions();

    // Ensure image property maps dynamically for backward compatibility on frontend
    if (updatedCategory) {
      updatedCategory.image = updatedCategory.picture?.secure_url || null;
    }

    return updatedCategory;
  }

  async deleteCategory(slug) {
    const category = await categoryRepository.findOne({ slug });

    if (!category) {
      throw new NotFoundError('Category not found');
    }

    if (category.picture && category.picture.public_id) {
      await deleteImageOnCloudinary(category.picture.public_id);
    }

    await categoryRepository.deleteOne({ slug });

    await this.normalizePositions();

    return category;
  }

  async getAllCategories(search) {
    const query = {};

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { name: searchRegex },
        { slug: searchRegex }
      ];
    }

    const categories = await categoryRepository.find(query, {
      sort: { position: 1, createdAt: -1 }
    });

    // We keep the dynamic mapping, but preserve both raw picture and emoji fields
    return categories.map(category => {
      const categoryObj = { ...category };
      categoryObj.image = categoryObj.picture?.secure_url || null;
      return categoryObj;
    });
  }

  async getSingleCategory(slug) {
    const category = await categoryRepository.findOne({ slug });

    if (!category) {
      throw new NotFoundError('Category not found');
    }

    return category;
  }

  async toggleCategoryActive(slug) {
    const category = await categoryRepository.findOne({ slug });

    if (!category) {
      throw new NotFoundError('Category not found');
    }

    const updatedCategory = await categoryRepository.updateOne(
      { slug },
      { active: !category.active }
    );

    return updatedCategory;
  }
}

module.exports = new CategoryService();