// src/pages/admin/AdminProducts.jsx
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import AdminLayout from "../../../components/common/admin-app-layout";
import { Plus, X, Image as ImageIcon, Tag, Edit } from "lucide-react";
import {
  createUpdateProduct,
  getProductsList,
  getCategoriesList,
  clearError,
  clearSuccessMessage,
} from "../../../store/slices/admin/products";

export default function AdminProducts() {
  const dispatch = useDispatch();
  const { products, categories, isLoading, error, successMessage } =
    useSelector(
      (state) =>
        state.adminProducts || {
          products: [],
          categories: [],
          isLoading: false,
          error: null,
          successMessage: null,
        },
    );

  const [form, setForm] = useState({
    name: "",
    category_id: "", // Changed from category to category_id
    description: "",
    points_required: "",
    stock: "",
    expiry_date: "",
  });
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [tags, setTags] = useState([]);
  const [currentTag, setCurrentTag] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [openProductId, setOpenProductId] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    dispatch(getProductsList());
    dispatch(getCategoriesList()); // Fetch categories on mount
  }, [dispatch]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        dispatch(clearSuccessMessage());
      }, 3000);
      return () => clearTimeout(timer);
    }
    if (error) {
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, error, dispatch]);

  const toggleProduct = (productId) => {
    setOpenProductId(openProductId === productId ? null : productId);
  };

  // Helper function to format date for input
  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "";
      return date.toISOString().split("T")[0];
    } catch (error) {
      return "";
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setForm({
      name: product.name || "",
      category_id: product.category_id || "", // Changed from category to category_id
      description: product.description || "",
      points_required: product.points_required || "",
      stock: product.stock || "",
      expiry_date: formatDateForInput(product.expiry_date),
    });

    // Handle images from productImages array - create a copy before sorting
    if (product.productImages && Array.isArray(product.productImages)) {
      const images = product.productImages.map((pi) => ({
        id: pi.image.id,
        path: pi.image.path,
        display_order: pi.display_order,
      }));
      const sortedImages = [...images].sort(
        (a, b) => a.display_order - b.display_order,
      );
      setExistingImages(sortedImages);
    } else {
      setExistingImages([]);
    }

    setImageFiles([]);
    setImagePreviews([]);

    // Handle tags - split comma-separated string into array for UI
    if (product.tags) {
      if (typeof product.tags === "string") {
        setTags(
          product.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter((tag) => tag),
        );
      } else if (Array.isArray(product.tags)) {
        setTags(product.tags);
      } else {
        setTags([]);
      }
    } else {
      setTags([]);
    }
    setIsEditMode(true);
    document
      .getElementById("product-form")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingProduct(null);
    setForm({
      name: "",
      category_id: "",
      description: "",
      points_required: "",
      stock: "",
      expiry_date: "",
    });
    setImageFiles([]);
    setImagePreviews([]);
    setExistingImages([]);
    setTags([]);
    setCurrentTag("");
    setIsEditMode(false);
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const validFiles = files.filter((file) => file.type.startsWith("image/"));
    if (validFiles.length !== files.length) {
      alert("Please upload only image files");
      return;
    }

    const newPreviews = validFiles.map((file) => URL.createObjectURL(file));
    setImagePreviews([...imagePreviews, ...newPreviews]);
    setImageFiles([...imageFiles, ...validFiles]);
    e.target.value = "";
  };

  const removeNewImage = (index) => {
    URL.revokeObjectURL(imagePreviews[index]);
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
    setImageFiles(imageFiles.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index) => {
    setExistingImages(existingImages.filter((_, i) => i !== index));
  };

  const addTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag("");
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      alert("Please enter product name");
      return;
    }
    if (!form.category_id) {
      alert("Please select a category");
      return;
    }
    if (!form.points_required || parseFloat(form.points_required) <= 0) {
      alert("Please enter valid points required");
      return;
    }
    if (!form.stock || parseInt(form.stock) < 0) {
      alert("Please enter valid stock quantity");
      return;
    }

    const totalImages = existingImages.length + imageFiles.length;
    if (totalImages === 0 && !isEditMode) {
      alert("Please upload at least one image");
      return;
    }

    const imagesData = [];

    existingImages.forEach((img) => {
      if (img.id) {
        imagesData.push({ id: img.id });
      }
    });

    for (const file of imageFiles) {
      const base64 = await convertFileToBase64(file);
      imagesData.push({ base64String: base64 });
    }

    // Convert tags array to comma-separated string
    const tagsString = tags.length > 0 ? tags.join(",") : "";

    const productData = {
      name: form.name.trim(),
      category_id: parseInt(form.category_id), // Send category_id as integer
      description: form.description.trim(),
      points_required: parseFloat(form.points_required),
      stock: parseInt(form.stock),
      expiry_date: form.expiry_date || null,
      tags: tagsString,
      images: imagesData,
      is_active: true,
    };

    if (isEditMode && editingProduct) {
      productData.id = editingProduct.id;
    }

    try {
      const result = await dispatch(createUpdateProduct(productData)).unwrap();
      if (result?.success) {
        await dispatch(getProductsList());
        alert(
          result.message ||
            (isEditMode
              ? "Product updated successfully!"
              : "Product created successfully!"),
        );
        cancelEdit();
      }
    } catch (error) {
      console.error("Error saving product:", error);
      alert(error || "Failed to save product");
    }
  };

  useEffect(() => {
    return () => {
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imagePreviews]);

  // Helper function to get all image URLs for display
  const getAllImageUrls = () => {
    const urls = [];
    existingImages.forEach((img) => {
      if (img.path) urls.push(img.path);
    });
    imagePreviews.forEach((url) => urls.push(url));
    return urls;
  };

  // Helper function to get category name by id
  const getCategoryName = (categoryId) => {
    const category = categories.find((c) => c.id === categoryId);
    return category ? category.name : categoryId;
  };

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-800">
          Manage Products
        </h1>
        <p className="text-sm text-gray-500">
          Create and manage products for users to redeem with points
        </p>
      </div>

      {successMessage && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">
          {successMessage}
        </div>
      )}
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5">
          <div className="bg-white rounded-xl shadow p-5 sticky top-4">
            <h3 className="text-lg font-semibold mb-4 text-slate-700">
              {isEditMode ? "Edit Product" : "Create New Product"}
            </h3>

            <form
              id="product-form"
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  placeholder="Enter product name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Category *
                </label>
                <select
                  value={form.category_id}
                  onChange={(e) =>
                    setForm({ ...form, category_id: e.target.value })
                  }
                  className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Description *
                </label>
                <textarea
                  placeholder="Enter product description"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  rows="3"
                  className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Points Required *
                  </label>
                  <input
                    type="number"
                    placeholder="e.g., 500"
                    value={form.points_required}
                    onChange={(e) =>
                      setForm({ ...form, points_required: e.target.value })
                    }
                    className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    required
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Stock *
                  </label>
                  <input
                    type="number"
                    placeholder="e.g., 10"
                    value={form.stock}
                    onChange={(e) =>
                      setForm({ ...form, stock: e.target.value })
                    }
                    className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    required
                    min="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Expiry Date (Optional)
                </label>
                <input
                  type="date"
                  value={form.expiry_date}
                  onChange={(e) =>
                    setForm({ ...form, expiry_date: e.target.value })
                  }
                  className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Images *
                </label>

                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="flex-1 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-center cursor-pointer hover:border-emerald-500 transition-colors"
                  >
                    <ImageIcon className="w-5 h-5 mx-auto text-gray-400" />
                    <span className="text-sm text-gray-500">
                      Click to upload images
                    </span>
                  </label>
                </div>

                {existingImages.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs text-gray-500 mb-2">
                      Existing Images:
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      {existingImages.map((img, index) => (
                        <div
                          key={`existing-${index}`}
                          className="relative group"
                        >
                          <img
                            src={img.path}
                            alt={`Existing ${index + 1}`}
                            className="w-full h-20 object-cover rounded-lg border border-gray-200"
                          />
                          <button
                            type="button"
                            onClick={() => removeExistingImage(index)}
                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600 transition"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {imagePreviews.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs text-gray-500 mb-2">New Images:</p>
                    <div className="grid grid-cols-3 gap-2">
                      {imagePreviews.map((url, index) => (
                        <div key={`new-${index}`} className="relative group">
                          <img
                            src={url}
                            alt={`New ${index + 1}`}
                            className="w-full h-20 object-cover rounded-lg border border-gray-200"
                          />
                          <button
                            type="button"
                            onClick={() => removeNewImage(index)}
                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600 transition"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <p className="text-xs text-gray-400 mt-1">
                  {getAllImageUrls().length} image
                  {getAllImageUrls().length !== 1 ? "s" : ""}
                  {isEditMode &&
                    ` (${existingImages.length} existing, ${imageFiles.length} new)`}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Tags (Optional)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add a tag (e.g., Premium)"
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1 border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>

                {tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm"
                      >
                        <Tag className="w-3 h-3" />
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="hover:text-red-600 transition"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-emerald-500 text-white py-2 rounded-lg hover:bg-emerald-600 transition mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading
                    ? "Saving..."
                    : isEditMode
                      ? "Update Product"
                      : "Create Product"}
                </button>

                {isEditMode && (
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition mt-4"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className="bg-white rounded-xl shadow p-5">
            <h3 className="text-lg font-semibold mb-4 text-slate-700">
              Existing Products
            </h3>

            <div className="space-y-3 max-h-[600px] overflow-y-auto">
              {isLoading && products.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-8">
                  Loading products...
                </p>
              )}

              {!isLoading && products.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-8">
                  No products created yet. Create your first product!
                </p>
              )}

              {products.map((product) => {
                // Get sorted images for this product
                const sortedImages =
                  product.productImages && Array.isArray(product.productImages)
                    ? [...product.productImages].sort(
                        (a, b) => a.display_order - b.display_order,
                      )
                    : [];

                return (
                  <div
                    key={product.id}
                    className="border rounded-lg overflow-hidden bg-white hover:shadow-md transition-shadow duration-200"
                  >
                    <div className="p-4 bg-gradient-to-r from-gray-50 to-white">
                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => toggleProduct(product.id)}
                          className="flex-1 text-left group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                              <img
                                src={
                                  sortedImages.length > 0
                                    ? sortedImages[0].image.path
                                    : "https://via.placeholder.com/100/4ade80/1a1a1a?text=P"
                                }
                                alt={product.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.src =
                                    "https://via.placeholder.com/100/4ade80/1a1a1a?text=P";
                                }}
                              />
                            </div>
                            <div>
                              <h4 className="font-semibold text-slate-800 text-lg">
                                {product.name}
                              </h4>
                              <div className="flex items-center gap-3 mt-1 flex-wrap">
                                <span className="text-xs px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full">
                                  {getCategoryName(product.category_id)}
                                </span>
                                <span className="text-sm text-emerald-600 font-medium">
                                  ₹{product.points_required}
                                </span>
                                <span className="text-xs text-gray-400">
                                  Stock: {product.stock}
                                </span>
                                {product.tags && (
                                  <span className="text-xs text-gray-400">
                                    {typeof product.tags === "string"
                                      ? product.tags.split(",").length
                                      : product.tags.length}{" "}
                                    tags
                                  </span>
                                )}
                                {product.productImages &&
                                  product.productImages.length > 0 && (
                                    <span className="text-xs text-gray-400">
                                      {product.productImages.length} images
                                    </span>
                                  )}
                              </div>
                            </div>
                          </div>
                        </button>

                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() => handleEditProduct(product)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                            title="Edit Product"
                          >
                            <Edit className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div
                      className={`transition-all duration-300 ease-in-out overflow-hidden ${
                        openProductId === product.id
                          ? "max-h-[500px]"
                          : "max-h-0"
                      }`}
                    >
                      <div className="p-4 border-t bg-gray-50">
                        <div className="space-y-3">
                          <div>
                            <h5 className="text-sm font-medium text-slate-600">
                              Description:
                            </h5>
                            <p className="text-sm text-slate-700 mt-1">
                              {product.description}
                            </p>
                          </div>

                          {sortedImages.length > 0 && (
                            <div>
                              <h5 className="text-sm font-medium text-slate-600 mb-2">
                                Images:
                              </h5>
                              <div className="grid grid-cols-4 gap-2">
                                {sortedImages.map((pi, idx) => (
                                  <div key={idx} className="relative group">
                                    <img
                                      src={pi.image.path}
                                      alt={`${product.name} ${idx + 1}`}
                                      className="w-full h-20 object-cover rounded-lg border border-gray-200 cursor-pointer hover:opacity-80 transition"
                                      onClick={() =>
                                        setPreviewImage(pi.image.path)
                                      }
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {product.tags && (
                            <div>
                              <h5 className="text-sm font-medium text-slate-600 mb-1">
                                Tags:
                              </h5>
                              <div className="flex flex-wrap gap-2">
                                {typeof product.tags === "string"
                                  ? product.tags.split(",").map((tag, idx) => (
                                      <span
                                        key={idx}
                                        className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs"
                                      >
                                        {tag.trim()}
                                      </span>
                                    ))
                                  : Array.isArray(product.tags) &&
                                    product.tags.map((tag, idx) => (
                                      <span
                                        key={idx}
                                        className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs"
                                      >
                                        {tag}
                                      </span>
                                    ))}
                              </div>
                            </div>
                          )}

                          {product.expiry_date && (
                            <div>
                              <h5 className="text-sm font-medium text-slate-600">
                                Expiry Date:
                              </h5>
                              <p className="text-sm text-slate-700 mt-1">
                                {new Date(
                                  product.expiry_date,
                                ).toLocaleDateString()}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {previewImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] p-4">
            <img
              src={previewImage}
              alt="Preview"
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
            />
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white rounded-full p-2 transition"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
