import { FaBell } from "react-icons/fa";

export default function NotificationBell() {

  return (
    <div className="relative">

      <FaBell
        size={28}
        className="text-[#7C2D12]"
      />

      <span
        className="
          absolute
          -top-2
          -right-2
          bg-red-500
          text-white
          rounded-full
          px-2
          text-xs
        "
      >
        3
      </span>

    </div>
  );
}