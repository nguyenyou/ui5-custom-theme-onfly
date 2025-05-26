import "./App.css";
import { Button, TextArea } from "@ui5/webcomponents-react";
import { setTheme } from "@ui5/webcomponents-base/dist/config/Theme.js";
import { getFinalLessContent } from "./getlesssources";
import { useState } from "react";

const less = getFinalLessContent();

function App() {
  const [custom, setCustom] = useState(`@sapPrimary1: violet;
@sapPrimary2: violet;
    `);

  const [customSecondary, setCustomSecondary] = useState(`@sapPrimary1: yellow;
@sapPrimary2: yellow;
    `);

  async function compileTheme() {
    const themeName = "pinky";
    const baseThemeName = "sap_horizon";
    const CUSTOM_THEME_METADATA = `
.sapThemeMetaData-Base-baseLib {
	background-image: url('data:text/plain;utf-8, { "Path": "Base.baseLib.${themeName}.css_variables", "Extends": ["${baseThemeName}","baseTheme"]}');
}`;

    try {
      const customLess = `
      ${less}
      ${custom}
      `;

      const result = await window.less.render(customLess);
      const customTheme = `
      ${CUSTOM_THEME_METADATA}
      ${result.css}
      `;
      // query the style element with id custom-theme
      const style = document.getElementById("custom-theme");
      if (style) {
        style.textContent = customTheme;
      } else {
        const style = document.createElement("style");
        style.id = "custom-theme";
        style.textContent = customTheme;
        document.head.appendChild(style);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function compileSecondaryTheme() {
    const themeName = "custom";
    const baseThemeName = "sap_horizon";
    const CUSTOM_THEME_METADATA = `
.sapThemeMetaData-Base-baseLib {
	background-image: url('data:text/plain;utf-8, { "Path": "Base.baseLib.${themeName}.css_variables", "Extends": ["${baseThemeName}","baseTheme"]}');
}`;

    try {
      const customLess = `
      ${less}
      ${customSecondary}
      `;

      const result = await window.less.render(customLess);
      const customTheme = `
      ${CUSTOM_THEME_METADATA}
      ${result.css}
      `;
      const style = document.getElementById("custom-theme");
      if (style) {
        style.textContent = customTheme;
      } else {
        const style = document.createElement("style");
        style.id = "custom-theme";
        style.textContent = customTheme;
        document.head.appendChild(style);
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div>
      <Button design="Emphasized" onClick={() => setTheme("sap_horizon")}>
        SAP Horizon
      </Button>
      <Button
        onClick={async () => {
          await compileTheme();
          setTheme("pinky");
        }}
      >
        Pinky
      </Button>
      <Button
        onClick={async () => {
          await compileSecondaryTheme();
          setTheme("custom");
        }}
      >
        Custom</Button>
      <TextArea
        rows={10}
        value={custom}
        onChange={(e) => setCustom(e.target.value)}
      ></TextArea>
      <TextArea
        rows={10}
        value={customSecondary}
        onChange={(e) => setCustomSecondary(e.target.value)}
      ></TextArea>
    </div>
  );
}

export default App;
