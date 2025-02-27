import { ArrowRightIcon, SearchIcon } from "lucide-react";

import { Input } from "../ui/input";

const SearchInput = () => {
  return (
    <div className="mt-4">
      <div className="relative">
        <Input id="search" className="peer ps-9 pe-9 py-5 focus-visible:ring-0 bg-gray-400/40" placeholder="Search..." type="search" autoComplete="off" />
        <div className="text-stone-900/50 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
          <SearchIcon size={16} />
        </div>
        <button
          className="text-stone-900/50 hover:text-stone-900 focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-0 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Submit search"
          type="submit"
        >
          <ArrowRightIcon size={16} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

export default SearchInput
