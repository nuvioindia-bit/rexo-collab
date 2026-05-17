import React, { createContext, useContext, useReducer, useCallback } from 'react';
import type { Campaign, Application, Transaction } from '@/types';

interface AppState {
  campaigns: Campaign[];
  applications: Application[];
  transactions: Transaction[];
  drawerOpen: boolean;
  activeTab: string;
  isLoading: boolean;
}

type AppAction =
  | { type: 'SET_CAMPAIGNS'; payload: Campaign[] }
  | { type: 'SET_APPLICATIONS'; payload: Application[] }
  | { type: 'ADD_APPLICATION'; payload: Application }
  | { type: 'SET_TRANSACTIONS'; payload: Transaction[] }
  | { type: 'TOGGLE_DRAWER' }
  | { type: 'SET_DRAWER'; payload: boolean }
  | { type: 'SET_ACTIVE_TAB'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'ADD_CAMPAIGN'; payload: Campaign };

const initialState: AppState = {
  campaigns: [],
  applications: [],
  transactions: [],
  drawerOpen: false,
  activeTab: 'home',
  isLoading: false,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_CAMPAIGNS':
      return { ...state, campaigns: action.payload };
    case 'ADD_CAMPAIGN':
      return { ...state, campaigns: [action.payload, ...state.campaigns] };
    case 'SET_APPLICATIONS':
      return { ...state, applications: action.payload };
    case 'ADD_APPLICATION':
      return { ...state, applications: [...state.applications, action.payload] };
    case 'SET_TRANSACTIONS':
      return { ...state, transactions: action.payload };
    case 'TOGGLE_DRAWER':
      return { ...state, drawerOpen: !state.drawerOpen };
    case 'SET_DRAWER':
      return { ...state, drawerOpen: action.payload };
    case 'SET_ACTIVE_TAB':
      return { ...state, activeTab: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
}

interface AppContextType {
  state: AppState;
  toggleDrawer: () => void;
  setDrawer: (open: boolean) => void;
  setActiveTab: (tab: string) => void;
  setCampaigns: (campaigns: Campaign[]) => void;
  addCampaign: (campaign: Campaign) => void;
  setApplications: (apps: Application[]) => void;
  addApplication: (app: Application) => void;
  setTransactions: (txns: Transaction[]) => void;
  setLoading: (loading: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const toggleDrawer = useCallback(() => dispatch({ type: 'TOGGLE_DRAWER' }), []);
  const setDrawer = useCallback((open: boolean) => dispatch({ type: 'SET_DRAWER', payload: open }), []);
  const setActiveTab = useCallback((tab: string) => dispatch({ type: 'SET_ACTIVE_TAB', payload: tab }), []);
  const setCampaigns = useCallback((campaigns: Campaign[]) => dispatch({ type: 'SET_CAMPAIGNS', payload: campaigns }), []);
  const addCampaign = useCallback((campaign: Campaign) => dispatch({ type: 'ADD_CAMPAIGN', payload: campaign }), []);
  const setApplications = useCallback((apps: Application[]) => dispatch({ type: 'SET_APPLICATIONS', payload: apps }), []);
  const addApplication = useCallback((app: Application) => dispatch({ type: 'ADD_APPLICATION', payload: app }), []);
  const setTransactions = useCallback((txns: Transaction[]) => dispatch({ type: 'SET_TRANSACTIONS', payload: txns }), []);
  const setLoading = useCallback((loading: boolean) => dispatch({ type: 'SET_LOADING', payload: loading }), []);

  return (
    <AppContext.Provider value={{
      state,
      toggleDrawer,
      setDrawer,
      setActiveTab,
      setCampaigns,
      addCampaign,
      setApplications,
      addApplication,
      setTransactions,
      setLoading,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
