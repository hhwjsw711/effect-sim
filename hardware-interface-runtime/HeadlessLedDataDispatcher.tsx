import { useLedData } from "../src/data/LedDataStoreContext";
import { onFrameDataSignal } from "./ClientDataSocket";
import { useFrame } from "../src/common/utils/frames";

export const HeadlessLedDataDispatcher = () => {
  const ledDataStore = useLedData();

  useFrame(() => {
      for (const [targetId, stringData] of ledDataStore.stringsMap) {
         onFrameDataSignal.dispatch({
            forStringId: targetId,
            rgb: stringData.data
         });
      }
  });

  return null;
};

