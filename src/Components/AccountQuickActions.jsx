// AccountQuickActions.jsx
import { Link } from "react-router-dom";
import { FiUser, FiTruck, FiHeart } from "react-icons/fi";
import { IoWalletOutline } from "react-icons/io5";

const GOLD = "#E5C870";

const items = [
  { label: "My Account", to: "/account", Icon: FiUser },
  { label: "My Orders",  to: "/orders",  Icon: FiTruck },
  { label: "My Wallet",  to: "/wallet",  Icon: IoWalletOutline  },
  { label: "My Wishlist",to: "/wishlist",Icon: FiHeart },
];

export default function AccountQuickActions() {
  return (
    <div className="grid grid-cols-2 gap-4 max-w-md">
      {items.map(({ label, to, Icon }) => (
        <Link
          key={label}
          to={to}
          className="group rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition
                     hover:shadow-md active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-offset-2"
          style={{ borderColor: "rgba(0,0,0,0.08)" }}
        >
          <div className="flex flex-col items-center justify-center gap-3">
            <div
              className="rounded-xl p-3 ring-1"
              style={{
                color: GOLD,
                background: "rgba(229, 200, 112, 0.12)",
                ringColor: "rgba(0,0,0,0.06)",
              }}
            >
              <Icon size={28} />
            </div>
            <span
              className="text-sm font-semibold text-gray-800 group-hover:opacity-90"
              style={{ letterSpacing: "0.1px" }}
            >
              {label}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
