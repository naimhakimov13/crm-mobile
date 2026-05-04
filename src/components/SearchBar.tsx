import { SearchIcon } from "./Icon";

type Props = {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
};

export function SearchBar({ value, onChange, placeholder }: Props) {
  return (
    <div className="relative">
      <SearchIcon
        size={18}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400"
      />
      <input
        className="input pl-10"
        placeholder={placeholder ?? "Поиск..."}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
