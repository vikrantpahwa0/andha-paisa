// src/pages/admin/AdminProducts.jsx
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import AdminLayout from "../../../components/common/admin-app-layout"; // Fixed import path
import {
  Plus,
  X,
  Image as ImageIcon,
  Tag,
  Edit,
  Trash2,
} from "lucide-react";
import {
  createUpdateProduct,
  getProductsList,
  clearError,
  clearSuccessMessage,
} from "../../../store/slices/admin/products";

const CATEGORIES = ["Gift Cards", "Cash", "Electronics", "Merchandise", "Food", "Fashion", "Other"];

export default function AdminProducts() {
  const dispatch = useDispatch();
  const { products, isLoading, error, successMessage } = useSelector(
    (state) => state.adminProducts || { products: [], isLoading: false, error: null, successMessage: null }
  );

  const [form, setForm] = useState({
    name: "",
    category: "",
    description: "",
    pointsRequired: "",
    stock: "",
    expiryDate: "",
  });
  const [images, setImages] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [tags, setTags] = useState([]);
  const [currentTag, setCurrentTag] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [openProductId, setOpenProductId] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  // Fetch products on component mount
  useEffect(() => {
    dispatch(getProductsList());
  }, [dispatch]);

  // Clear messages after 3 seconds
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

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setForm({
      name: product.name || "",
      category: product.category || "",
      description: product.description || "",
      pointsRequired: product.pointsRequired || "",
      stock: product.stock || "",
      expiryDate: product.expiryDate || "",
    });
    setImageUrls(product.images || []);
    setImages([]);
    setTags(product.tags || []);
    setIsEditMode(true);
    document.getElementById("product-form")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleDeleteProduct = async (productId, productName) => {
    if (window.confirm(`Are you sure you want to delete "${productName}"?`)) {
      try {
        await dispatch(createUpdateProduct({
          id: productId,
          is_active: false,
        })).unwrap();
        await dispatch(getProductsList());
        alert(`Product "${productName}" deleted successfully!`);
      } catch (error) {
        console.error("Error deleting product:", error);
        alert(error || "Failed to delete product");
      }
    }
  };

  const cancelEdit = () => {
    setEditingProduct(null);
    setForm({ name: "", category: "", description: "", pointsRequired: "", stock: "", expiryDate: "" });
    setImages([]);
    setImageUrls([]);
    setTags([]);
    setCurrentTag("");
    setIsEditMode(false);
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const validFiles = files.filter(file => file.type.startsWith('image/'));
    if (validFiles.length !== files.length) {
      alert("Please upload only image files");
      return;
    }

    const newImageUrls = validFiles.map(file => URL.createObjectURL(file));
    setImageUrls([...imageUrls, ...newImageUrls]);
    setImages([...images, ...validFiles]);
    e.target.value = "";
  };

  const removeImage = (index) => {
    setImageUrls(imageUrls.filter((_, i) => i !== index));
    setImages(images.filter((_, i) => i !== index));
  };

  const addTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag("");
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      alert("Please enter product name");
      return;
    }
    if (!form.category) {
      alert("Please select a category");
      return;
    }
    if (!form.pointsRequired || parseFloat(form.pointsRequired) <= 0) {
      alert("Please enter valid points required");
      return;
    }
    if (!form.stock || parseInt(form.stock) < 0) {
      alert("Please enter valid stock quantity");
      return;
    }
    if (imageUrls.length === 0 && !isEditMode) {
      alert("Please upload at least one image");
      return;
    }

    const productData = {
      name: form.name.trim(),
      category: form.category,
      description: form.description.trim(),
      pointsRequired: parseFloat(form.pointsRequired),
      stock: parseInt(form.stock),
      expiryDate: form.expiryDate || null,
      tags: tags,
      images: imageUrls,
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
          (isEditMode ? "Product updated successfully!" : "Product created successfully!")
        );
        cancelEdit();
      } else {
        alert("Failed to save product");
      }
    } catch (error) {
      console.error("Error saving product:", error);
      alert(error || "Failed to save product");
    }
  };

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-800">Manage Products</h1>
        <p className="text-sm text-gray-500">Create and manage products for users to redeem with points</p>
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
        {/* CREATE/EDIT FORM */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-xl shadow p-5 sticky top-4">
            <h3 className="text-lg font-semibold mb-4 text-slate-700">
              {isEditMode ? "Edit Product" : "Create New Product"}
            </h3>

            <form id="product-form" onSubmit={handleSubmit} className="space-y-4">
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
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  required
                >
                  <option value="">Select Category</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
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
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
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
                    value={form.pointsRequired}
                    onChange={(e) => setForm({ ...form, pointsRequired: e.target.value })}
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
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
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
                  value={form.expiryDate}
                  onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
                  className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Images * {isEditMode && "(Add more images)"}
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
                    <span className="text-sm text-gray-500">Click to upload images</span>
                  </label>
                </div>

                {imageUrls.length > 0 && (
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {imageUrls.map((url, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={url}
                          alt={`Product ${index + 1}`}
                          className="w-full h-20 object-cover rounded-lg border border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 hover:bg-red-600 transition"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <p className="text-xs text-gray-400 mt-1">
                  {imageUrls.length} image{imageUrls.length !== 1 ? 's' : ''} uploaded
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
                  {isLoading ? "Saving..." : isEditMode ? "Update Product" : "Create Product"}
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

        {/* LIST - Existing Products */}
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

              {products.map((product) => (
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
                              src={product.images && product.images[0] || "https://via.placeholder.com/100/4ade80/1a1a1a?text=P"}
                              alt={product.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.src = "https://via.placeholder.com/100/4ade80/1a1a1a?text=P";
                              }}
                            />
                          </div>
                          <div>
                            <h4 className="font-semibold text-slate-800 text-lg">
                              {product.name}
                            </h4>
                            <div className="flex items-center gap-3 mt-1 flex-wrap">
                              <span className="text-xs px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full">
                                {product.category}
                              </span>
                              <span className="text-sm text-emerald-600 font-medium">
                                ₹{product.pointsRequired}
                              </span>
                              <span className="text-xs text-gray-400">
                                Stock: {product.stock}
                              </span>
                              {product.tags && product.tags.length > 0 && (
                                <span className="text-xs text-gray-400">
                                  {product.tags.length} tags
                                </span>
                              )}
                              {product.images && product.images.length > 0 && (
                                <span className="text-xs text-gray-400">
                                  {product.images.length} images
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
                        <button
                          onClick={() => handleDeleteProduct(product.id, product.name)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                          title="Delete Product"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div
                    className={`transition-all duration-300 ease-in-out overflow-hidden ${
                      openProductId === product.id ? "max-h-[500px]" : "max-h-0"
                    }`}
                  >
                    <div className="p-4 border-t bg-gray-50">
                      <div className="space-y-3">
                        <div>
                          <h5 className="text-sm font-medium text-slate-600">Description:</h5>
                          <p className="text-sm text-slate-700 mt-1">{product.description}</p>
                        </div>

                        {product.images && product.images.length > 0 && (
                          <div>
                            <h5 className="text-sm font-medium text-slate-600 mb-2">Images:</h5>
                            <div className="grid grid-cols-4 gap-2">
                              {product.images.map((img, idx) => (
                                <div key={idx} className="relative group">
                                  <img
                                    src={img}
                                    alt={`${product.name} ${idx + 1}`}
                                    className="w-full h-20 object-cover rounded-lg border border-gray-200 cursor-pointer hover:opacity-80 transition"
                                    onClick={() => setPreviewImage(img)}
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {product.tags && product.tags.length > 0 && (
                          <div>
                            <h5 className="text-sm font-medium text-slate-600 mb-1">Tags:</h5>
                            <div className="flex flex-wrap gap-2">
                              {product.tags.map((tag, idx) => (
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

                        {product.expiryDate && (
                          <div>
                            <h5 className="text-sm font-medium text-slate-600">Expiry Date:</h5>
                            <p className="text-sm text-slate-700 mt-1">
                              {new Date(product.expiryDate).toLocaleDateString()}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Image Preview Modal */}
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