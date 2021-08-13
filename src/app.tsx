import React, { FunctionComponent, useState } from "react";
import { ipcRenderer } from "electron";
import { ThemeProvider } from "@fluentui/react";
import { initializeIcons } from "@fluentui/font-icons-mdl2";
import { initializeFileTypeIcons } from "@fluentui/react-file-type-icons";

import { darkTheme, lightTheme } from "./themes";
import MainInterface from "./components/MainInterface";

initializeIcons();
initializeFileTypeIcons();

const App: FunctionComponent = () => {
  const [currentTheme, setCurrentTheme] = useState(lightTheme);

  // Check current theme
  ipcRenderer.invoke("is-dark-mode").then((isDarkMode) => {
    setCurrentTheme(isDarkMode ? darkTheme : lightTheme);
  });

  // Handle theme updates
  ipcRenderer.on("colour-scheme-changed", (_, isDarkMode) => {
    setCurrentTheme(isDarkMode ? darkTheme : lightTheme);
  });

  return (
    <ThemeProvider applyTo="body" theme={currentTheme}>
      <MainInterface />
    </ThemeProvider>
  );
};

export default App;
