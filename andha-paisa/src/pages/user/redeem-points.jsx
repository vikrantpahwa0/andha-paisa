// src/pages/UsePoints.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  ArrowLeft,
  Gift,
  Star,
  Clock,
  Eye,
  ShoppingBag,
  Award,
  Sparkles,
  ChevronRight,
  Filter,
  X,
  Loader2,
  CheckCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  Pause,
  Play,
} from "lucide-react";
import AppLayout from "../../components/common/app-layout";
import { fetchUserEarnings } from "../../store/slices/user-earnings";
import {
  getProductsList,
  getCategoriesList,
} from "../../store/slices/admin/products";

export default function UsePoints() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { confirmedPoints, isLoading: earningsLoading } = useSelector(
    (state) => state.earnings,
  );
  const {
    products,
    categories,
    isLoading: productsLoading,
  } = useSelector(
    (state) =>
      state.adminProducts || { products: [], categories: [], isLoading: false },
  );

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [redeemSuccess, setRedeemSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFullscreenImage, setIsFullscreenImage] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [cardImageIndexes, setCardImageIndexes] = useState({});

  // Fetch products and categories on mount
  useEffect(() => {
    dispatch(getProductsList());
    dispatch(getCategoriesList());
    dispatch(fetchUserEarnings());
  }, [dispatch]);

  // Auto-slide for each product card
  useEffect(() => {
    const intervals = {};

    products.forEach((product) => {
      const images = getProductImages(product);
      if (images && images.length > 1) {
        intervals[product.id] = setInterval(() => {
          setCardImageIndexes((prev) => ({
            ...prev,
            [product.id]:
              prev[product.id] === undefined
                ? 1
                : (prev[product.id] + 1) % images.length,
          }));
        }, 3000);
      }
    });

    return () => {
      Object.values(intervals).forEach((interval) => clearInterval(interval));
    };
  }, [products]);

  // Auto-slide for modal images
  useEffect(() => {
    if (isModalOpen && selectedProduct && !isPaused) {
      const images = getProductImages(selectedProduct);
      if (images && images.length > 1) {
        const interval = setInterval(() => {
          setCurrentImageIndex((prev) =>
            prev === images.length - 1 ? 0 : prev + 1,
          );
        }, 3000);
        return () => clearInterval(interval);
      }
    }
  }, [isModalOpen, selectedProduct, isPaused]);

  // Helper function to extract images from product
  const getProductImages = (product) => {
    if (!product) return [];
    if (product.productImages && Array.isArray(product.productImages)) {
      // Sort by display_order and extract image paths
      const sortedImages = [...product.productImages]
        .sort((a, b) => a.display_order - b.display_order)
        .map((pi) => pi.image?.path)
        .filter((path) => path);
      return sortedImages.length > 0 ? sortedImages : [];
    }
    // Fallback for backward compatibility
    if (product.images && Array.isArray(product.images)) {
      return product.images;
    }
    return [];
  };

  // Helper function to get category name by id
  const getCategoryName = (categoryId) => {
    const category = categories.find((c) => c.id === categoryId);
    return category ? category.name : categoryId;
  };

  // Filter products based on selected category
  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((p) => {
          const categoryName = getCategoryName(p.category_id);
          return categoryName === selectedCategory;
        });

  // Get unique categories from products
  const getUniqueCategories = () => {
    const categoryNames = products
      .map((p) => getCategoryName(p.category_id))
      .filter((name) => name && name !== "");
    return ["All", ...new Set(categoryNames)];
  };

  const productCategories = getUniqueCategories();

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setCurrentImageIndex(0);
    setIsModalOpen(true);
    setErrorMessage("");
    setRedeemSuccess(false);
    setIsFullscreenImage(false);
    setIsPaused(false);
  };

  const handleImageClick = (e) => {
    e.stopPropagation();
    setIsFullscreenImage(!isFullscreenImage);
  };

  const handleThumbnailClick = (index) => {
    setCurrentImageIndex(index);
  };

  const handlePrevImage = (e) => {
    e.stopPropagation();
    const images = getProductImages(selectedProduct);
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = (e) => {
    e.stopPropagation();
    const images = getProductImages(selectedProduct);
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const togglePause = (e) => {
    e.stopPropagation();
    setIsPaused(!isPaused);
  };

  const handleRedeem = async () => {
    if (!selectedProduct) return;

    if (confirmedPoints < selectedProduct.points_required) {
      setErrorMessage(
        `You need ${selectedProduct.points_required} points to redeem this. You have ${confirmedPoints} points.`,
      );
      return;
    }

    setIsRedeeming(true);
    setErrorMessage("");

    try {
      // Replace with actual API call
      // await api.redeemProduct({ productId: selectedProduct.id });

      await new Promise((resolve) => setTimeout(resolve, 1500));

      setRedeemSuccess(true);
      // Refresh earnings after redemption
      dispatch(fetchUserEarnings());

      // Refresh products to update stock
      dispatch(getProductsList());

      setTimeout(() => {
        setIsModalOpen(false);
        setSelectedProduct(null);
        setRedeemSuccess(false);
        setCurrentImageIndex(0);
        setIsFullscreenImage(false);
        setIsPaused(false);
      }, 2000);
    } catch (error) {
      setErrorMessage("Failed to redeem. Please try again.");
    } finally {
      setIsRedeeming(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "No expiry";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date);
  };

  const getProductImage = (product, index = 0) => {
    const images = getProductImages(product);
    if (images && images.length > 0) {
      const imgIndex =
        cardImageIndexes[product.id] !== undefined
          ? cardImageIndexes[product.id]
          : index;
      return images[imgIndex % images.length];
    }
    return "https://via.placeholder.com/400x300/4ade80/1a1a1a?text=Product";
  };

  // Get thumbnail images (up to 3)
  const getThumbnails = (product) => {
    const images = getProductImages(product);
    if (!images || images.length === 0) return [];
    return images.slice(0, 3);
  };

  // Get total image count
  const getImageCount = (product) => {
    const images = getProductImages(product);
    return images.length;
  };

  // Check if product is out of stock
  const isOutOfStock = (product) => {
    return product.stock === 0;
  };

  // Check if user can afford product
  const canAfford = (product) => {
    return confirmedPoints >= product.points_required;
  };

  // Loading state
  if (productsLoading || earningsLoading) {
    return (
      <AppLayout>
        <div className="max-w-6xl mx-auto flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-green-500 mx-auto mb-4" />
            <p className="text-slate-600">Loading products...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-slate-800">
                Use Points
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Redeem your points for exciting rewards and products
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-200 via-green-300 to-green-400 rounded-2xl px-6 py-3 shadow-md">
              <div className="flex items-center gap-3">
                <Award className="w-5 h-5 text-slate-700" />
                <div>
                  <p className="text-xs text-slate-700 font-medium">
                    Your Points
                  </p>
                  <p className="text-xl font-bold text-slate-900">
                    {confirmedPoints}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Categories Filter */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 mb-6">
          <div className="flex items-center justify-between mb-3 sm:mb-0">
            <button
              onClick={() => setShowFilter(!showFilter)}
              className="flex items-center gap-2 text-slate-600 sm:hidden"
            >
              <Filter className="w-4 h-4" />
              <span className="text-sm font-medium">Filter</span>
            </button>
          </div>

          <div
            className={`${showFilter ? "flex" : "hidden"} sm:flex flex-wrap gap-2`}
          >
            {productCategories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  setSelectedCategory(category);
                  setShowFilter(false);
                }}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 text-sm
                  ${
                    selectedCategory === category
                      ? "bg-gradient-to-r from-green-200 via-green-300 to-green-400 text-slate-900 shadow-sm"
                      : "bg-gray-50 text-slate-600 hover:bg-gray-100"
                  }
                `}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center">
            <ShoppingBag className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-700">
              No products found
            </h3>
            <p className="text-slate-500 text-sm mt-1">
              Try selecting a different category
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProducts.map((product) => {
              const canAffordProduct = canAfford(product);
              const outOfStock = isOutOfStock(product);
              const thumbnails = getThumbnails(product);
              const currentImage = getProductImage(product);
              const imageCount = getImageCount(product);

              return (
                <div
                  key={product.id}
                  onClick={() => !outOfStock && handleProductClick(product)}
                  className={`bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden transition-all duration-200
                    ${
                      outOfStock
                        ? "opacity-60 cursor-not-allowed"
                        : "hover:shadow-lg hover:-translate-y-1 cursor-pointer"
                    }
                  `}
                >
                  {/* Image Gallery on Card */}
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={currentImage}
                      alt={product.name}
                      className="w-full h-full object-cover transition-opacity duration-500"
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/400x300/4ade80/1a1a1a?text=Product";
                      }}
                    />

                    {product.isPopular && (
                      <span className="absolute top-2 left-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        Popular
                      </span>
                    )}

                    {outOfStock && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="bg-red-500 text-white px-4 py-2 rounded-xl font-semibold text-sm">
                          Out of Stock
                        </span>
                      </div>
                    )}

                    {/* Thumbnail strip at bottom of card */}
                    {thumbnails.length > 1 && !outOfStock && (
                      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 bg-black/40 backdrop-blur-sm px-2 py-1.5 rounded-lg">
                        {thumbnails.map((thumb, idx) => {
                          const currentIdx =
                            cardImageIndexes[product.id] !== undefined
                              ? cardImageIndexes[product.id]
                              : 0;
                          const isActive = idx === currentIdx;

                          return (
                            <div
                              key={idx}
                              className={`w-8 h-8 rounded-md overflow-hidden border-2 transition-all duration-200 ${
                                isActive
                                  ? "border-green-400 ring-1 ring-green-300"
                                  : "border-white/40 hover:border-white"
                              }`}
                              onClick={(e) => {
                                e.stopPropagation();
                                setCardImageIndexes((prev) => ({
                                  ...prev,
                                  [product.id]: idx,
                                }));
                              }}
                            >
                              <img
                                src={thumb}
                                alt={`${product.name} ${idx + 1}`}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.src =
                                    "https://via.placeholder.com/32x32/4ade80/1a1a1a?text=P";
                                }}
                              />
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Image count badge */}
                    {imageCount > 1 && !outOfStock && (
                      <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {imageCount}
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold text-slate-800 text-sm line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                      {product.description}
                    </p>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-1">
                        <Gift className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-bold text-slate-800">
                          {product.points_required}
                        </span>
                      </div>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          canAffordProduct && !outOfStock
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {outOfStock
                          ? "Unavailable"
                          : canAffordProduct
                            ? "Available"
                            : "Need more"}
                      </span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!outOfStock) handleProductClick(product);
                      }}
                      disabled={outOfStock}
                      className={`w-full mt-3 py-2 rounded-xl font-medium transition-all duration-200 text-sm
                        ${
                          outOfStock
                            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                            : canAffordProduct
                              ? "bg-gradient-to-r from-green-200 via-green-300 to-green-400 text-slate-900 hover:from-green-300 hover:to-green-500 active:scale-95"
                              : "bg-gray-100 text-slate-500 hover:bg-gray-200"
                        }
                      `}
                    >
                      {outOfStock
                        ? "Out of Stock"
                        : canAffordProduct
                          ? "Redeem Now"
                          : "Insufficient Points"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Product Detail Modal */}
      {isModalOpen && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-slide-up"
            onClick={(e) => {
              if (isFullscreenImage) {
                e.stopPropagation();
                setIsFullscreenImage(false);
              }
            }}
          >
            <div className="sticky top-0 bg-white z-10 p-4 border-b border-slate-100 flex items-center justify-between rounded-t-2xl">
              <h3 className="text-lg font-semibold text-slate-800">
                Redeem Product
              </h3>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedProduct(null);
                  setErrorMessage("");
                  setRedeemSuccess(false);
                  setCurrentImageIndex(0);
                  setIsFullscreenImage(false);
                  setIsPaused(false);
                }}
                className="p-2 rounded-lg hover:bg-gray-100 transition"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="p-4">
              {/* Image Gallery */}
              <div className="relative">
                <div
                  className={`aspect-video rounded-xl overflow-hidden mb-3 bg-gray-100 ${
                    isFullscreenImage ? "cursor-zoom-out" : "cursor-zoom-in"
                  }`}
                  onClick={handleImageClick}
                >
                  {(() => {
                    const images = getProductImages(selectedProduct);
                    const currentImage =
                      images.length > 0 ? images[currentImageIndex] : null;
                    return (
                      <img
                        src={
                          currentImage ||
                          "https://via.placeholder.com/600x400/4ade80/1a1a1a?text=Product"
                        }
                        alt={selectedProduct.name}
                        className={`w-full h-full object-cover transition-transform duration-300 ${
                          isFullscreenImage ? "scale-150" : "scale-100"
                        }`}
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/600x400/4ade80/1a1a1a?text=Product";
                        }}
                      />
                    );
                  })()}

                  {/* Image navigation arrows */}
                  {getProductImages(selectedProduct).length > 1 && (
                    <>
                      <button
                        onClick={handlePrevImage}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={handleNextImage}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition"
                      >
                        <ChevronRightIcon className="w-5 h-5" />
                      </button>
                    </>
                  )}

                  {/* Image counter and pause button */}
                  {getProductImages(selectedProduct).length > 1 && (
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/60 text-white text-xs px-3 py-1.5 rounded-full">
                      <span>
                        {currentImageIndex + 1} /{" "}
                        {getProductImages(selectedProduct).length}
                      </span>
                      <button
                        onClick={togglePause}
                        className="hover:bg-white/20 rounded p-1 transition"
                      >
                        {isPaused ? (
                          <Play className="w-3 h-3" />
                        ) : (
                          <Pause className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                  )}
                </div>

                {/* Thumbnails */}
                {getProductImages(selectedProduct).length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300">
                    {getProductImages(selectedProduct).map((image, index) => (
                      <div
                        key={index}
                        onClick={() => handleThumbnailClick(index)}
                        className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden cursor-pointer transition-all duration-200 border-2 ${
                          currentImageIndex === index
                            ? "border-green-400 ring-2 ring-green-200"
                            : "border-transparent hover:border-gray-300"
                        }`}
                      >
                        <img
                          src={image}
                          alt={`${selectedProduct.name} ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src =
                              "https://via.placeholder.com/64x64/4ade80/1a1a1a?text=P";
                          }}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <h4 className="text-xl font-bold text-slate-800 mt-4">
                {selectedProduct.name}
              </h4>
              <p className="text-sm text-slate-500 mt-1">
                {selectedProduct.description}
              </p>

              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-slate-500">Points Required</p>
                  <p className="text-lg font-bold text-slate-800">
                    {selectedProduct.points_required}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3">
                  <p className="text-xs text-slate-500">Available Stock</p>
                  <p className="text-lg font-bold text-slate-800">
                    {selectedProduct.stock}
                  </p>
                </div>
                <div className="bg-gray-50 rounded-xl p-3 col-span-2">
                  <p className="text-xs text-slate-500">Expiry Date</p>
                  <p className="text-sm font-medium text-slate-800">
                    {formatDate(selectedProduct.expiry_date)}
                  </p>
                </div>
              </div>

              <div className="mt-4 p-3 bg-gradient-to-br from-green-200 via-green-300 to-green-400 rounded-xl">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-700">Your Points</span>
                  <span className="text-lg font-bold text-slate-900">
                    {confirmedPoints}
                  </span>
                </div>
                {confirmedPoints < selectedProduct.points_required && (
                  <p className="text-xs text-red-700 mt-1">
                    Need {selectedProduct.points_required - confirmedPoints}{" "}
                    more points
                  </p>
                )}
              </div>

              {errorMessage && (
                <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {redeemSuccess && (
                <div className="mt-4 p-3 rounded-xl bg-green-50 border border-green-200 flex items-center gap-2 text-green-600 text-sm">
                  <CheckCircle className="w-4 h-4 flex-shrink-0" />
                  <span>Successfully redeemed! 🎉</span>
                </div>
              )}

              <button
                onClick={handleRedeem}
                disabled={
                  isRedeeming ||
                  redeemSuccess ||
                  confirmedPoints < selectedProduct.points_required ||
                  selectedProduct.stock === 0
                }
                className="w-full mt-4 py-3.5 rounded-xl font-semibold text-slate-900 transition-all duration-200
                  bg-gradient-to-r from-green-200 via-green-300 to-green-400
                  hover:from-green-300 hover:to-green-500
                  active:scale-95 shadow-md
                  disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                  flex items-center justify-center gap-2"
              >
                {isRedeeming ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : redeemSuccess ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Redeemed!
                  </>
                ) : selectedProduct.stock === 0 ? (
                  "Out of Stock"
                ) : confirmedPoints < selectedProduct.points_required ? (
                  "Insufficient Points"
                ) : (
                  <>
                    <Gift className="w-5 h-5" />
                    Redeem Now
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
