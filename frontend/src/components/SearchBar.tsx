import { Search } from "lucide-react";

interface SearchBarProps {
  searchKey: string;
  setSearchKey: (value: string) => void;
}

export default function SearchBar({
  searchKey,
  setSearchKey,
}: SearchBarProps) {
  return (
    <div className="w-full max-w-md mx-auto px-4 mt-4">
      {/* accessibility-only label */}
      <label htmlFor="search-input" className="sr-only">
        Search
      </label>

      <div className="relative">
        {/* magnifier icon */}
        <Search
          size={18}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 transition-colors duration-200"
        />

        <input
          id="search-input"
          type="text"
          value={searchKey}
          onChange={(e) => setSearchKey(e.target.value)}
          placeholder="Search"
          className="
            block w-full pl-10 pr-4 py-2
            rounded-xl bg-gray-800 text-gray-100 placeholder-gray-500
            focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-gray-700
            hover:bg-gray-700 transition
          "
        />
      </div>
    </div>
  );
}
