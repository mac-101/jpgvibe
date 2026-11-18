import { FaChevronDown } from "react-icons/fa6";

export const optionStyle = { backgroundColor: "#000000", color: "#F6E8B1" };

export const inputClass =
  "relative z-10 block w-full rounded-[11px] bg-[#000000] px-4 py-3.5 font-body text-lg text-[var(--jpg-cream)] placeholder:text-[var(--jpg-cream)]/40 focus:outline-none";

/* 1px cream border that fades into a glowing gradient on focus */
export function Field({ id, label, hideLabel = false, error, children }) {
  return (
    <div>
      <label
        htmlFor={id}
        className={hideLabel ? "sr-only" : "mb-2.5 block font-label"}
        style={hideLabel ? undefined : { color: "var(--jpg-cream)", opacity: 0.8 }}
      >
        {label}
      </label>

      <div className="group relative rounded-xl p-px">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -inset-0.5 rounded-2xl opacity-0 blur-md transition-opacity duration-500 group-focus-within:opacity-60 motion-reduce:transition-none"
          style={{ background: "var(--jpg-gradient)" }}
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-xl"
          style={{ background: error ? "var(--jpg-red)" : "var(--jpg-cream)" }}
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-500 group-focus-within:opacity-100 motion-reduce:transition-none"
          style={{ background: "var(--jpg-gradient)" }}
        />
        {children}
      </div>

      {error && (
        <p id={`${id}-error`} className="mt-2 text-sm" style={{ color: "var(--jpg-red)" }}>
          {error}
        </p>
      )}
    </div>
  );
}

export function TextInput({ id, error, className = "", ...props }) {
  return (
    <input
      id={id}
      aria-invalid={Boolean(error)}
      aria-describedby={error ? `${id}-error` : undefined}
      className={`${inputClass} ${className}`}
      {...props}
    />
  );
}

export function SelectBox({ id, value, onChange, error, children }) {
  return (
    <>
      <select
        id={id}
        value={value}
        onChange={onChange}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`${inputClass} cursor-pointer appearance-none pr-12 [color-scheme:dark] ${
          value ? "" : "text-[var(--jpg-cream)]/40"
        }`}
      >
        {children}
      </select>
      <FaChevronDown
        aria-hidden="true"
        className="pointer-events-none absolute right-4 top-1/2 z-20 -translate-y-1/2 text-sm"
        style={{ color: "var(--jpg-cream)" }}
      />
    </>
  );
}
