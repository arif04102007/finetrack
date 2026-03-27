import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  RiDashboardLine, RiExchangeLine, RiAddCircleLine,
  RiPieChartLine, RiBarChartLine, RiWalletLine
} from "react-icons/ri";

const links = [
  { to: "/", label: "Dashboard", icon: RiDashboardLine, exact: true },
  { to: "/transactions", label: "Transactions", icon: RiExchangeLine },
  { to: "/transactions/new", label: "Add New", icon: RiAddCircleLine },
  { to: "/budget", label: "Budget", icon: RiWalletLine },
  { to: "/analytics", label: "Analytics", icon: RiBarChartLine },
];

export default function Navbar() {
  return (
    <>
      {/* Desktop sidebar */}
      <nav style={{
        position: "fixed",
        left: 0,
        top: 0,
        bottom: 0,
        width: 240,
        background: "var(--surface)",
        borderRight: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        padding: "24px 0",
        zIndex: 100,
      }}
      className="sidebar-desktop"
      >
        {/* Logo */}
        <div style={{ padding: "0 20px 28px", borderBottom: "1px solid var(--border)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 34, height: 34, background: "var(--accent)",
              borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 18, color: "#fff", fontWeight: 700, flexShrink: 0,
            }}>₹</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15, color: "var(--text)", letterSpacing: "-0.3px" }}>Fintrack</div>
              <div style={{ fontSize: 11, color: "var(--text3)" }}>Personal Finance</div>
            </div>
          </div>
        </div>

        {/* Nav links */}
        <div style={{ padding: "16px 12px", display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
          <div style={{ fontSize: 11, color: "var(--text3)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.8px", padding: "0 8px", marginBottom: 8 }}>Menu</div>
          {links.map(({ to, label, icon: Icon, exact }) => (
            <NavLink
              key={to}
              to={to}
              end={exact}
              style={({ isActive }) => ({
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "10px 12px",
                borderRadius: 10,
                fontSize: 14,
                fontWeight: 500,
                color: isActive ? "var(--text)" : "var(--text2)",
                background: isActive ? "var(--surface2)" : "transparent",
                transition: "all 0.15s",
                position: "relative",
              })}
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.div
                      layoutId="nav-active"
                      style={{
                        position: "absolute", inset: 0,
                        background: "var(--surface3)",
                        borderRadius: 10,
                        border: "1px solid var(--border2)",
                      }}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <Icon size={18} style={{ flexShrink: 0, position: "relative", zIndex: 1, color: isActive ? "var(--accent)" : "var(--text3)" }} />
                  <span style={{ position: "relative", zIndex: 1 }}>{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>

        <div style={{ padding: "16px 20px", borderTop: "1px solid var(--border)" }}>
          <div style={{ fontSize: 11, color: "var(--text3)" }}>FY 2024–25 · All data local</div>
        </div>
      </nav>

      {/* Mobile bottom bar */}
      <nav style={{
        display: "none",
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        background: "var(--surface)",
        borderTop: "1px solid var(--border)",
        zIndex: 100,
        padding: "8px 0 10px",
      }}
      className="mobile-nav"
      >
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          {links.map(({ to, label, icon: Icon, exact }) => (
            <NavLink key={to} to={to} end={exact} style={({ isActive }) => ({
              display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
              color: isActive ? "var(--accent)" : "var(--text3)",
              fontSize: 10, fontWeight: 500,
            })}>
              <Icon size={20} />
              <span>{label}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      <style>{`
        @media (max-width: 768px) {
          .sidebar-desktop { display: none !important; }
          .mobile-nav { display: block !important; }
        }
      `}</style>
    </>
  );
}
