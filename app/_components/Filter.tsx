"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ReactNode } from "react";

const Filter = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const activeFilter = searchParams.get("capacity") ?? "all";
  const handleFilter = (filterTerm: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("capacity", filterTerm);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };
  return (
    <div className="border border-primary-800 flex">
      <Button
        handleFilter={handleFilter}
        filterTerm="all"
        activeFilter={activeFilter}
      >
        All cabins
      </Button>
      <Button
        handleFilter={handleFilter}
        filterTerm="small"
        activeFilter={activeFilter}
      >
        1-3 guests
      </Button>
      <Button
        handleFilter={handleFilter}
        filterTerm="medium"
        activeFilter={activeFilter}
      >
        4-7 guests
      </Button>
      <Button
        handleFilter={handleFilter}
        filterTerm="large"
        activeFilter={activeFilter}
      >
        8-12 guests
      </Button>
    </div>
  );
};

type ButtonType = {
  filterTerm: string;
  handleFilter: (filterTerm: string) => void;
  activeFilter: string;
  children: ReactNode;
};

const Button = ({
  filterTerm,
  handleFilter,
  activeFilter,
  children,
}: ButtonType) => {
  return (
    <button
      onClick={() => handleFilter(filterTerm)}
      className={`${
        filterTerm === activeFilter ? "bg-primary-700 text-primary-50" : ""
      } px-5 py-2 hover:bg-primary-700`}
    >
      {children}
    </button>
  );
};
export default Filter;
