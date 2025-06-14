import { createContext, useContext } from "react"

interface AppContextType {
  auth: {
    auth: any,
    setAuth: any
  }
}

const initialValues = {
  auth: {
    auth: {},
    setAuth: () => { }
  }
}

const AppContext = createContext<AppContextType>(initialValues);

export const useAppContext = (): AppContextType => useContext(AppContext);

export default AppContext;