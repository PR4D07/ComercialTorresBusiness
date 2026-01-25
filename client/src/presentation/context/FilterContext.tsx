import { createContext, useContext, useState, type ReactNode } from 'react';

interface FilterContextType {
  search: string;
  category: string;
  setSearch: (term: string) => void;
  setCategory: (cat: string) => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export function FilterProvider({ children }: { children: ReactNode }) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');

  return (
    <FilterContext.Provider value={{ search, category, setSearch, setCategory }}>
      {children}
    </FilterContext.Provider>
  );
}

export function useFilter() {
  const context = useContext(FilterContext);
  if (!context) throw new Error('useFilter must be used within a FilterProvider');
  return context;
}
