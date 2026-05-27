import React, { useState, useEffect, useContext, useMemo } from "react";
import CartItem from "../Components/CartItem.jsx";
import AddressManager from "../Components/AddressManager";
import Loading from "../Components/Loading";
import { CartContext } from "../ContextAPI/CartContext";
import { getproducts, getChargePlanRates } from "../Service/APIservice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { usePriceContext } from "../ContextAPI/PriceContext.jsx";

const safeNum = (v, fallback = 0) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
};

const Cart = () => {

  const {
    cart,
    clear,
    removeFromCart,
    updateQuantity,
  } = useContext(CartContext);

  const [user, setUser] = useState(null);

  const [products, setProducts] = useState([]);

  const [loadingProducts, setLoadingProducts] = useState(true);

  const [loadingRates, setLoadingRates] = useState(false);

  const [address, setAddress] = useState(null);

  const navigate = useNavigate();

  const { toConvert } = usePriceContext();

  // Charges
  const [pfPerUnit, setPfPerUnit] = useState(0);

  const [printPerUnit, setPrintPerUnit] = useState(0);

  const [gstPercent, setGstPercent] = useState(0);

  // User from localStorage
  useEffect(() => {

    try {

      const stored = localStorage.getItem("user");

      if (stored) {
        setUser(JSON.parse(stored));
      }

    } catch (e) {

      console.error("Invalid user in localStorage", e);
    }

  }, []);

  // Fetch Products
  useEffect(() => {

    const run = async () => {

      try {

        setLoadingProducts(true);

        const fetched = await getproducts();

        // console.log("========== PRODUCTS ==========");
        // console.log(fetched);

        if (Array.isArray(fetched)) {
          setProducts(fetched);
        }

      } catch (e) {

        console.error(e);

        toast.error("Failed to load products");

      } finally {

        setLoadingProducts(false);
      }
    };

    run();

  }, []);

  // Merge Cart + Product Data
  const actualData = useMemo(() => {

    if (!Array.isArray(cart) || !Array.isArray(products)) {
      return [];
    }

    return cart
      .map((ci) => {

        const p = products.find((x) => x._id === ci.id);

        if (!p) return null;

        return {
          ...p,
          ...ci,
        };

      })
      .filter(Boolean);

  }, [cart, products]);

  // Total Quantity
const totalQuantity = useMemo(() => {

  return actualData.reduce((sum, item) => {

    // console.log("ITEM =>", item);

    // console.log("QUANTITY =>", item.quantity);

    let qty = 0;

    // CASE 1 -> quantity is object
    if (
      typeof item.quantity === "object" &&
      item.quantity !== null
    ) {

      qty = Object.values(item.quantity).reduce(
        (acc, q) => acc + safeNum(q, 0),
        0
      );
    }

    // CASE 2 -> quantity is number/string
    else {

      qty = safeNum(item.quantity, 0);
    }

    // console.log("FINAL ITEM QTY =>", qty);

    return sum + qty;

  }, 0);

}, [actualData]);

  // Subtotal
const subtotal = useMemo(() => {

  return actualData.reduce((sum, item) => {

    let qty = 0;

    if (
      typeof item.quantity === "object" &&
      item.quantity !== null
    ) {

      qty = Object.values(item.quantity).reduce(
        (acc, q) => acc + safeNum(q, 0),
        0
      );
    }

    else {

      qty = safeNum(item.quantity, 0);
    }

    // console.log("PRICE =>", item.price);
    // console.log("QTY =>", qty);

    return sum + safeNum(item.price, 0) * qty;

  }, 0);

}, [actualData]);

  // Fetch Charges
  useEffect(() => {

    const fetchRates = async () => {

      try {

        setLoadingRates(true);

        const qty = totalQuantity > 0 ? totalQuantity : 0;

        // console.log("========== TOTAL QUANTITY ==========");
        // console.log(qty);

        const res = await getChargePlanRates(qty);

        // console.log("========== FULL API RESPONSE ==========");
        // console.log(res);

        if (res?.success) {
                          const data = res?.data || {};

              const pf = safeNum(
                data?.perUnit?.pakageingandforwarding,
                0
              );

              const printing = safeNum(
                data?.perUnit?.printingcost,
                0
              );

              const gst = safeNum(
                data?.gstPercent,
                0
              );

              setPfPerUnit(pf);

              setPrintPerUnit(printing);

              setGstPercent(gst);
                      

        } else {

          console.log("❌ API success false");

          setPfPerUnit(0);
          setPrintPerUnit(0);
          setGstPercent(0);
        }

      } catch (e) {

        console.error("❌ CHARGE API ERROR =>", e);

        toast.error("Failed to load charges");

        setPfPerUnit(0);
        setPrintPerUnit(0);
        setGstPercent(0);

      } finally {

        setLoadingRates(false);
      }
    };

    if (totalQuantity > 0) {

      fetchRates();

    } else {

      setPfPerUnit(0);
      setPrintPerUnit(0);
      setGstPercent(0);
    }

  }, [totalQuantity]);

  // P&F Total
  const pfTotal = useMemo(() => {

    const value =
      safeNum(pfPerUnit, 0) *
      safeNum(totalQuantity, 0);

    console.log("pfTotal =>", value);

    return value;

  }, [pfPerUnit, totalQuantity]);

  // Print Total
  const printTotal = useMemo(() => {

    const value =
      safeNum(printPerUnit, 0) *
      safeNum(totalQuantity, 0);

    console.log("printTotal =>", value);

    return value;

  }, [printPerUnit, totalQuantity]);

  // GST Total
  const gstTotal = useMemo(() => {

    const gst =
      (safeNum(subtotal, 0) *
        safeNum(gstPercent, 0)) / 100;

    console.log("gstTotal =>", gst);

    return gst;

  }, [subtotal, gstPercent]);

  // Grand Total
  const grandTotal = useMemo(() => {

    const total =
      safeNum(subtotal, 0) +
      safeNum(pfTotal, 0) +
      safeNum(printTotal, 0) +
      safeNum(gstTotal, 0);

    console.log("========== GRAND TOTAL ==========");
    console.log({
      subtotal,
      pfTotal,
      printTotal,
      gstTotal,
      total,
    });

    return total;

  }, [subtotal, pfTotal, printTotal, gstTotal]);

  // Convert Currency
  const convert = (amount) =>
    (
      safeNum(amount, 0) *
      safeNum(toConvert, 0)
    ).toFixed(2);

  // Order Payload
  const orderPayload = useMemo(() => ({

    items: actualData,

    totalPay:
      safeNum(grandTotal, 0) *
      safeNum(toConvert, 0),

    address,

    user,

    pf: pfTotal,

    gst: gstTotal,

    printing: printTotal,

  }), [
    actualData,
    grandTotal,
    toConvert,
    address,
    user,
    pfTotal,
    gstTotal,
    printTotal,
  ]);

  // console.log("========== ORDER PAYLOAD ==========");
  // console.log(orderPayload);

  // Checkout
  const handleCheckout = () => {

    if (!user) {

      toast.error("Please log in");

      return;
    }

    if (!actualData.length) {

      toast.error("Cart is empty");

      navigate("/home");

      return;
    }

    if (!address) {

      toast.error("Select address");

      return;
    }

    navigate("/payment", {
      state: orderPayload,
    });
  };

  const isLoading =
    loadingProducts || loadingRates;

  if (isLoading) return <Loading />;

  return (

    <div className="min-h-screen text-white p-8">

      <h1 className="text-3xl font-bold mb-8">
        SHOPPING CART
      </h1>

      <div className="flex flex-col lg:flex-row gap-8">

        {/* Cart Items */}
        <div className="flex-1">

          {actualData.length > 0 ? (

            actualData.map((item, i) => (

              <CartItem
                key={`${item._id}-${i}`}
                item={item}
                removeFromCart={() =>
                  removeFromCart(
                    item.id,
                    item.quantity,
                    item.color,
                    item.design
                  )
                }
                updateQuantity={(newQty) =>
                  updateQuantity(
                    item.id,
                    item.quantity,
                    item.color,
                    item.design,
                    newQty
                  )
                }
              />
            ))

          ) : (

            <div className="text-gray-400 text-center mt-16 text-xl">
              Your cart is empty.
            </div>
          )}

        </div>

        {/* Summary */}
        <div className="lg:w-96 flex flex-col">

          <div
            className="lg:w-96 h-fit rounded-sm p-6"
            style={{
              backgroundColor: "#112430",
            }}
          >

            <h2 className="text-2xl font-bold mb-6 text-white">
              ORDER SUMMARY
            </h2>

            <div className="space-y-4 mb-8">

              <div className="flex justify-between">
                <span className="text-gray-300">
                  Subtotal
                </span>

                <span className="text-white">
                  {convert(subtotal)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-300">
                  P&F Charges
                </span>

                <span className="text-white">
                  {convert(pfTotal)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-300">
                  Printing Charge
                </span>

                <span className="text-white">
                  {convert(printTotal)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-300">
                  GST Charge
                </span>

                <span className="text-white">
                  {convert(gstTotal)}
                </span>
              </div>

            </div>

            <div className="flex justify-between border-t border-gray-600 pt-4 mb-6">

              <span className="text-white font-bold">
                Total
              </span>

              <span className="text-white font-bold">
                {convert(grandTotal)}
              </span>

            </div>

            <button
              className="w-full py-4 font-bold hover:bg-opacity-90 transition-all"
              style={{
                backgroundColor: "#FDC305",
                color: "#112430",
              }}
              onClick={handleCheckout}
            >
              CHECK OUT
            </button>

          </div>

          {/* Address */}
          <AddressManager
            addresss={address}
            setAddresss={setAddress}
            user={user}
            setUser={setUser}
          />

        </div>

      </div>

    </div>
  );
};

export default Cart;