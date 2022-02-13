import { useState, useEffect } from "react";
import { AppState } from "react-native";

// settings validation
function isValidFunction(func) {
  return func && typeof func === "function";
}

export default function useAppState(settings) {
  const { onChange, onForeground, onBackground } = settings || {};
  const [appState, setAppState] = useState();

  useEffect(() => {
    function handleAppStateChange(nextAppState) {
      if (nextAppState === "active" && appState !== "active") {
        isValidFunction(onForeground) && onForeground();
      } else if (
        appState === "active" &&
        nextAppState.match(/inactive|background/)
      ) {
        isValidFunction(onBackground) && onBackground();
      }
      setAppState(nextAppState);
      isValidFunction(onChange) && onChange(nextAppState);
    }

    handleAppStateChange(AppState.currentState);

    const appStateListener = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    return () => appStateListener.remove();
  }, []);

  return { appState };
}
