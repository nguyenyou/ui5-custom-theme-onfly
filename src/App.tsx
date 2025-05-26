import "./App.css";
import { Button } from "@ui5/webcomponents-react";
import { setTheme } from "@ui5/webcomponents-base/dist/config/Theme.js";
import { getFinalLessContent } from "./getlesssources";

const themeName = "pinky";
const baseThemeName = "sap_horizon";

const CUSTOM_THEME_METADATA = `
.sapThemeMetaData-Base-baseLib {
	background-image: url('data:text/plain;utf-8, { "Path": "Base.baseLib.${themeName}.css_variables", "Extends": ["${baseThemeName}","baseTheme"]}');
}`;

function App() {
  async function compileTheme() {
    const less = getFinalLessContent();
    try {
      const customLess = `
      ${less}

      @sapPrimary1: violet;
      @sapPrimary2: violet;
      `;

      const result = await window.less.render(customLess);
      const customTheme = `
      ${CUSTOM_THEME_METADATA}
      ${result.css}
      `;
      // append to head style
      const style = document.createElement("style");
      style.textContent = customTheme;
      document.head.appendChild(style);
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <div>
      <Button design="Emphasized" onClick={() => setTheme("sap_horizon")}>
        SAP Horizon
      </Button>
      <Button onClick={() => setTheme("pinky")}>Pinky</Button>
      <Button onClick={compileTheme}>Compile Theme</Button>
    </div>
  );
}

export default App;
