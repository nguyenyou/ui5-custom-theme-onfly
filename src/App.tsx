import "./App.css";
import { Button, TextArea } from "@ui5/webcomponents-react";
import { setTheme } from "@ui5/webcomponents-base/dist/config/Theme.js";
import { getFinalLessContent } from "./getlesssources";
import { useState } from "react";

// Constants
const BASE_THEME_NAME = "sap_horizon";
const STYLE_ELEMENT_ID = "custom-theme";

const DEFAULT_THEMES = {
  primary: {
    name: "primary",
    variables: `@sapPrimary1: red;
@sapPrimary2: red;`,
  },
  secondary: {
    name: "secondary", 
    variables: `@sapPrimary1: orange;
@sapPrimary2: orange;`,
  },
} as const;

const less = getFinalLessContent();

// Utility functions
const generateThemeMetadata = (themeName: string, baseThemeName: string): string => `
.sapThemeMetaData-Base-baseLib {
	background-image: url('data:text/plain;utf-8, { "Path": "Base.baseLib.${themeName}.css_variables", "Extends": ["${baseThemeName}","baseTheme"]}');
}`;

const injectStyleToDocument = (customTheme: string): void => {
  let styleElement = document.getElementById(STYLE_ELEMENT_ID) as HTMLStyleElement;
  
  if (styleElement) {
    styleElement.textContent = customTheme;
  } else {
    styleElement = document.createElement("style");
    styleElement.id = STYLE_ELEMENT_ID;
    styleElement.textContent = customTheme;
    document.head.appendChild(styleElement);
  }
};

const compileCustomTheme = async (
  themeName: string,
  customVariables: string,
  baseThemeName: string = BASE_THEME_NAME
): Promise<void> => {
  try {
    const themeMetadata = generateThemeMetadata(themeName, baseThemeName);
    const customLess = `${less}\n${customVariables}`;
    
    const result = await window.less.render(customLess);
    const customTheme = `${themeMetadata}\n${result.css}`;
    
    injectStyleToDocument(customTheme);
  } catch (error) {
    console.error("Error compiling theme:", error);
  }
};

function App() {
  const [primaryThemeVariables, setPrimaryThemeVariables] = useState<string>(
    DEFAULT_THEMES.primary.variables
  );
  
  const [secondaryThemeVariables, setSecondaryThemeVariables] = useState<string>(
    DEFAULT_THEMES.secondary.variables
  );

  // Theme compilation handlers
  const handleCompilePrimaryTheme = async (): Promise<void> => {
    await compileCustomTheme(DEFAULT_THEMES.primary.name, primaryThemeVariables);
  };

  const handleCompileSecondaryTheme = async (): Promise<void> => {
    await compileCustomTheme(DEFAULT_THEMES.secondary.name, secondaryThemeVariables);
  };

  // Button click handlers
  const handleSapHorizonClick = (): void => {
    setTheme(BASE_THEME_NAME);
  };

  const handlePrimaryThemeClick = async (): Promise<void> => {
    await handleCompilePrimaryTheme();
    setTheme(DEFAULT_THEMES.primary.name);
  };

  const handleSecondaryThemeClick = async (): Promise<void> => {
    await handleCompileSecondaryTheme();
    setTheme(DEFAULT_THEMES.secondary.name);
  };

  return (
    <div>
      {/* Theme Selection Buttons */}
      <Button design="Emphasized" onClick={handleSapHorizonClick}>
        SAP Horizon
      </Button>
      
      <Button onClick={handlePrimaryThemeClick}>
        Primary
      </Button>
      
      <Button onClick={handleSecondaryThemeClick}>
        Secondary
      </Button>

      {/* Theme Variable Editors */}
      <TextArea
        rows={10}
        value={primaryThemeVariables}
        onChange={(e) => setPrimaryThemeVariables(e.target.value)}
      />
      
      <TextArea
        rows={10}
        value={secondaryThemeVariables}
        onChange={(e) => setSecondaryThemeVariables(e.target.value)}
      />
    </div>
  );
}

export default App;
