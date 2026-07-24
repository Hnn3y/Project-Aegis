import {
  createContext,
  useContext,
  useRef,
  type ReactNode,
} from "react";

import type { Viewer } from "cesium";

interface CesiumContextType {
  viewerRef: React.MutableRefObject<Viewer | null>;
}

const CesiumContext =
  createContext<CesiumContextType | null>(null);

interface Props {
  children: ReactNode;
}

export default function CesiumProvider({
  children,
}: Props) {
  const viewerRef = useRef<Viewer | null>(null);

  return (
    <CesiumContext.Provider
      value={{
        viewerRef,
      }}
    >
      {children}
    </CesiumContext.Provider>
  );
}

export function useCesium() {
  const context = useContext(CesiumContext);

  if (!context) {
    throw new Error(
      "useCesium must be used inside CesiumProvider."
    );
  }

  return context;
}