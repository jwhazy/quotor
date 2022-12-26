import { createContext } from "react";

type DefaultContext = {
  refreshFeed: boolean;
  setRefreshFeed?: (refresh: boolean) => void;
};

const defaultState = {
  refreshFeed: false,
};

export default createContext<DefaultContext>(defaultState);
