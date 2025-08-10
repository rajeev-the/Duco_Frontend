import { useState, useEffect } from "react";

const OrderDetailsCard = ({ orderId }) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const statusOptions = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

  const handleStatusChange = async (newStatus) => {
    setOrder((prev) => ({ ...prev, status: newStatus }));
    try {
      await fetch(`https://duco-backend.onrender.com/api/order/update/${orderId}`, {
        method:"PUT",
        headers:{"Content-Type": "application/json"},
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending": return "bg-yellow-100 text-yellow-800";
      case "Processing": return "bg-blue-100 text-blue-800";
      case "Shipped": return "bg-indigo-100 text-indigo-800";
      case "Delivered": return "bg-green-100 text-green-800";
      case "Cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  // pick product variant image where colorcode matches product.color
  const getVariantImage = (product) => {
    if (!product?.image_url || !product?.color) return null;
    const match = product.image_url.find(
      (img) => img.colorcode?.toLowerCase() === product.color.toLowerCase()
    );
    return match?.url?.[0] || product.image_url?.[0]?.url?.[0] || null;
  };

  // Fetch order details
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        // If your route is /api/orders/:id, change this accordingly:
        const res = await fetch(`https://duco-backend.onrender.com/api/order/${orderId}`);
        const data = await res.json();
        setOrder(data);
      } catch (err) {
        console.error("Failed to fetch order", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrderDetails();
  }, [orderId]);

  if (loading) return <div className="p-4 text-center">Loading...</div>;
  if (!order) return <div className="p-4 text-center">Order not found</div>;

  return (
    <div className="bg-white rounded-lg shadow-xl p-6 mb-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Order #{order._id}</h2>
          <p className="text-gray-600">
            Placed on{" "}
            {new Date(order.createdAt).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(order.status)}`}>
            {order.status}
          </span>
          <select
            value={order.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="block w-40 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {statusOptions.map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Customer / Payment */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Customer Information</h3>
          <div className="space-y-1">
            <p>{order.address?.fullName}</p>
            <p className="text-blue-600">{order.address?.mobileNumber}</p>
            <p className="text-gray-600">
              {order.address?.houseNumber}, {order.address?.street}, {order.address?.city},{" "}
              {order.address?.state} - {order.address?.pincode}
            </p>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Payment Information</h3>
          <div className="space-y-1">
            <p>Total Amount: ₹{Number(order.price || 0).toFixed(2)}</p>
            <p className={`font-medium ${order.razorpayPaymentId ? "text-green-600" : "text-yellow-600"}`}>
              Payment Status: {order.razorpayPaymentId ? "Paid" : "Unpaid"}
            </p>
          </div>
        </div>
      </div>

      {/* Order Items with Product Details & Design Previews */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold mb-4">Order Items</h3>

        <div className="space-y-5">
          {order.products?.map((item, index) => {
            const variantImg = getVariantImage(item);
            return (
              <div key={index} className="bg-gray-50 rounded-lg p-4">
                {/* Top row: image + basic info */}
                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 bg-white rounded border border-gray-200 overflow-hidden flex items-center justify-center">
                    {variantImg ? (
                      <img src={variantImg} alt={item.products_name} className="w-full h-full object-contain" />
                    ) : (
                      <div className="text-xs text-gray-400">No image</div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900">{item.products_name}</p>
                    <p className="text-sm text-gray-600">
                      Size: <span className="font-medium">{item.size || "-"}</span> &nbsp;|&nbsp; 
                      Color: <span className="font-medium">{item.colortext || item.color || "-"}</span> &nbsp;|&nbsp;
                      Qty: <span className="font-medium">{item.quantity || 1}</span>
                    </p>
                    <p className="text-gray-800 font-semibold mt-1">
                      ₹{Number(item.price || 0).toFixed(2)}
                    </p>

                    {/* Link to variant image */}
                    {variantImg && (
                      <a
                        href={variantImg}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-blue-600 hover:underline mt-1 inline-block"
                      >
                        Open variant image
                      </a>
                    )}
                  </div>
                </div>

                {/* Design previews */}
                {Array.isArray(item.design) && item.design.length > 0 && (
                  <div className="mt-3">
                    <p className="text-sm font-medium text-gray-800 mb-2">Design Preview</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {item.design.map((d, i) => {
                        const preview = d.uploadedImage || d.url; // prefer composed/overlay image if available
                        return (
                          <div key={i} className="bg-white border border-gray-200 rounded p-2 flex flex-col items-center">
                            <div className="w-full aspect-square overflow-hidden flex items-center justify-center">
                              {preview ? (
                                <img src={preview} alt={`${d.view} preview`} className="w-full h-full object-contain" />
                              ) : (
                                <div className="text-[11px] text-gray-400">No image</div>
                              )}
                            </div>
                            <div className="mt-2 flex items-center gap-2">
                              <span className="text-[11px] text-gray-600 capitalize">{d.view}</span>
                              {preview && (
                                <a
                                  href={preview}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-[11px] text-blue-600 hover:underline"
                                >
                                  Open
                                </a>
                              )}
                              {/* Also expose base template link if different */}
                              {d.url && d.uploadedImage && d.uploadedImage !== d.url && (
                                <a
                                  href={d.url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-[11px] text-gray-700 hover:underline"
                                >
                                  Base
                                </a>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsCard;
