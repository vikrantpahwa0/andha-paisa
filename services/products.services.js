import db from "../database/index.js";
import {
  successMessages,
  failureMessages,
  validationMessages,
} from "../constants/messages.js";
import { saveBase64Image } from "../utils/saveBase64Image.js"; // Adjust the import path as needed

const { PRODUCTS, IMAGES, PRODUCT_IMAGE, PRODUCT_CATEGORY } = db;

const handleImages = async (images, productId) => {
  if (!images || !Array.isArray(images) || images.length === 0) {
    // If no images provided, remove all existing product images
    await PRODUCT_IMAGE.destroy({
      where: { product_id: productId },
    });
    return [];
  }

  // Separate images into those with id (existing) and those without (new)
  const existingImages = images.filter((img) => img.id);
  const newImages = images.filter((img) => !img.id && img.base64String);

  // Get all current images for this product
  const currentProductImages = await PRODUCT_IMAGE.findAll({
    where: { product_id: productId },
    attributes: ["image_id"],
  });

  const currentImageIds = currentProductImages.map((pi) => pi.image_id);

  // Find images that need to be removed (in current but not in the request)
  const requestedImageIds = existingImages.map((img) => img.id);
  const imagesToRemove = currentImageIds.filter(
    (id) => !requestedImageIds.includes(id),
  );

  // Remove images that are no longer associated with the product
  if (imagesToRemove.length > 0) {
    // First, remove from junction table
    await PRODUCT_IMAGE.destroy({
      where: {
        product_id: productId,
        image_id: imagesToRemove,
      },
    });
  }

  // Create new images
  const createdImages = [];
  for (let i = 0; i < newImages.length; i++) {
    const { base64String } = newImages[i];

    // Upload to ImgBB
    const imageUrl = await saveBase64Image(base64String);

    // Create image record in database
    const imageRecord = await IMAGES.create({
      code: "PROD", // Product image
      path: imageUrl,
      filename: `product_${productId}_${Date.now()}_${i}.jpg`, // You might want to extract original filename
      is_active: true,
    });

    createdImages.push({
      id: imageRecord.id,
      url: imageUrl,
    });

    // Create junction record
    await PRODUCT_IMAGE.create({
      product_id: productId,
      image_id: imageRecord.id,
      display_order: i, // Order based on array position
    });
  }

  // Update display order for existing images
  for (let i = 0; i < existingImages.length; i++) {
    const { id: imageId } = existingImages[i];
    await PRODUCT_IMAGE.update(
      { display_order: i },
      {
        where: {
          product_id: productId,
          image_id: imageId,
        },
      },
    );
  }

  // Return all image URLs (existing + new)
  const allImageIds = [
    ...requestedImageIds,
    ...createdImages.map((img) => img.id),
  ];
  const finalImages = await IMAGES.findAll({
    where: { id: allImageIds },
    attributes: ["id", "path"],
  });

  return finalImages.map((img) => img.path);
};

/**
 * Creates or updates a product with images
 */
export const createUpdateProducts = async (body) => {
  const { id, images, ...directProductData } = body;

  let product;

  if (id) {
    // Update existing product
    product = await PRODUCTS.findByPk(id);
    if (!product) {
      throw new Error(failureMessages.PRODUCT_NOT_FOUND);
    }
    await product.update(directProductData);
  } else {
    // Create new product
    product = await PRODUCTS.create(directProductData);
  }

  // Handle images - pass product.id
  if (images) {
    await handleImages(images, product.id);
  }

  // Fetch the complete product with images
  const completeProduct = await PRODUCTS.findByPk(product.id, {
    include: [
      {
        model: PRODUCT_IMAGE,
        as: "productImages",
        include: [
          {
            model: IMAGES,
            as: "image",
            attributes: ["id", "path", "filename"],
          },
        ],
        order: [["display_order", "ASC"]],
      },
    ],
  });

  return completeProduct;
};

export const listProducts = async (data) => {
  // Implementation for listing products with their images
  const products = await PRODUCTS.findAll({
    include: [
      {
        model: PRODUCT_IMAGE,
        as: "productImages",
        include: [
          {
            model: IMAGES,
            as: "image",
            attributes: ["id", "path", "filename"],
          },
        ],
        order: [["display_order", "ASC"]],
      },
    ],
  });

  return products;
};

export const listCategories = async (data) => {
  return await PRODUCT_CATEGORY.findAll();
};

export const myLeadPostback = async (data) => {
  return true;
};
