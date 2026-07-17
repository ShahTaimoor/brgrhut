const productService = require('../services/ProductService');
const productSearchService = require('../services/ProductSearchService');

class ProductController {
  async createProduct(req, res, next) {
    try {
      const productData = req.body;
      const userId = req.user.id;
      const file = req.file;

      const product = await productService.createProduct(productData, userId, file);

      return res.status(201).json({
        success: true,
        message: 'Menu Item Added Successfully',
        product
      });
    } catch (error) {
      next(error);
    }
  }

  async importExcel(req, res, next) {
    try {
      const file = req.file;
      const userId = req.user.id;

      const results = await productService.importExcel(file.buffer, userId);

      return res.status(200).json({
        success: true,
        message: `Import completed. ${results.success} items created, ${results.failed} failed.`,
        results
      });
    } catch (error) {
      next(error);
    }
  }

  async updateProduct(req, res, next) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const file = req.file;

      const product = await productService.updateProduct(id, updateData, file);

      return res.status(200).json({
        success: true,
        message: 'Menu item updated successfully',
        product
      });
    } catch (error) {
      next(error);
    }
  }

  // Swapped from explicit stock integers to binary menu availability toggles
  async updateProductAvailability(req, res, next) {
    try {
      const { id } = req.params;
      const { isAvailable } = req.body;

      const product = await productService.updateProductAvailability(id, isAvailable);

      return res.status(200).json({
        success: true,
        message: 'Item availability state updated successfully',
        product
      });
    } catch (error) {
      next(error);
    }
  }

  async bulkUpdateFeatured(req, res, next) {
    try {
      const { productIds, isFeatured } = req.body;

      const result = await productService.bulkUpdateFeatured(productIds, isFeatured);

      return res.status(200).json({
        success: true,
        message: `Successfully ${result.featuredValue ? 'marked' : 'unmarked'} ${result.modifiedCount} item(s) as featured`,
        modifiedCount: result.modifiedCount
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteProduct(req, res, next) {
    try {
      const { id } = req.params;

      const product = await productService.deleteProduct(id);

      return res.status(200).json({
        success: true,
        message: 'Item Deleted Successfully',
        data: product
      });
    } catch (error) {
      next(error);
    }
  }

  async getProducts(req, res, next) {
    try {
      const filters = req.query;

      const result = await productService.getProducts(filters);

      const message = result.data.length === 0
        ? 'No active items found in this category.'
        : 'Menu items fetched successfully';

      return res.status(200).json({
        success: true,
        message,
        data: result.data,
        pagination: result.pagination
      });
    } catch (error) {
      next(error);
    }
  }

  async searchProducts(req, res, next) {
    try {
      const { q, limit, page } = req.query;

      const result = await productSearchService.searchProducts(q, limit, page);

      const message = result.pagination.total > 0
        ? `Found ${result.pagination.total} item(s) matching all keywords`
        : 'No menu options found matching all keywords';

      return res.status(200).json({
        success: true,
        message,
        data: result.data,
        query: result.query,
        keywords: result.keywords,
        pagination: result.pagination
      });
    } catch (error) {
      next(error);
    }
  }

  async getSearchSuggestions(req, res, next) {
    try {
      const { q, limit } = req.query;

      const result = await productSearchService.getSearchSuggestions(q, limit);

      return res.status(200).json({
        success: true,
        data: result.data,
        query: result.query,
        keywords: result.keywords
      });
    } catch (error) {
      next(error);
    }
  }

  async getSingleProduct(req, res, next) {
    try {
      const { id } = req.params;

      const product = await productService.getSingleProduct(id);

      return res.status(200).json({
        success: true,
        message: 'Single menu item fetched successfully',
        product
      });
    } catch (error) {
      next(error);
    }
  }

  // Swapped low inventory tracking to kitchen sold-out counts
  async getSoldOutCount(req, res, next) {
    try {
      const count = await productService.getSoldOutCount();

      return res.status(200).json({
        success: true,
        count
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ProductController();