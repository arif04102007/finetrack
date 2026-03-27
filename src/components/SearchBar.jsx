import { RiSearchLine, RiCloseLine } from "react-icons/ri";

export default function SearchBar({ value, onChange, placeholder = "Search transactions..." }) {
  return (
    <div style={{ position: "relative", flex: 1 }}>
      <RiSearchLine
        size={16}
        style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text3)" }}
      />
      <input
        className="form-input"
        style={{ paddingLeft: 36, paddingRight: value ? 36 : 14 }}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
      />
      {value && (
        <button
          onClick={() => onChange("")}
          style={{
            position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)",
            background: "none", border: "none", cursor: "pointer", color: "var(--text3)",
            padding: 4, display: "flex", alignItems: "center",
          }}
        >
          <RiCloseLine size={16} />
        </button>
      )}
    </div>
  );
}
