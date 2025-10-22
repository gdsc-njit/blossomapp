import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { fetchAllTrees, Tree } from '../utils/data';

interface TreeDataContextType {
  trees: Tree[];
  loading: boolean;
  error: string | null;
  refreshTrees: () => Promise<void>;
}

const TreeDataContext = createContext<TreeDataContextType | undefined>(undefined);

export function TreeDataProvider({ children }: { children: ReactNode }) {
  const [trees, setTrees] = useState<Tree[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTrees = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchAllTrees();
      setTrees(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load trees');
      console.error('Error loading trees:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshTrees = async () => {
    await loadTrees();
  };

  useEffect(() => {
    loadTrees();
  }, []);

  const value: TreeDataContextType = {
    trees,
    loading,
    error,
    refreshTrees,
  };

  return (
    <TreeDataContext.Provider value={value}>
      {children}
    </TreeDataContext.Provider>
  );
}

export function useTreeData() {
  const context = useContext(TreeDataContext);
  if (context === undefined) {
    throw new Error('useTreeData must be used within a TreeDataProvider');
  }
  return context;
}