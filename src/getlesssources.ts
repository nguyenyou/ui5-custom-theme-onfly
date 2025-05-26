// Import your raw LESS files
import baseVariables from "@sap-theming/theming-base-content/content/Base/baseLib/baseTheme/base.less?raw";
import baseCssVariables from "@sap-theming/theming-base-content/content/Base/baseLib/baseTheme/css_variables.less?raw";
import baseSkeleton from "@sap-theming/theming-base-content/content/Base/baseLib/baseTheme/skeleton.less?raw";
import baseHorizonVariables from "@sap-theming/theming-base-content/content/Base/baseLib/sap_horizon/base.less?raw";
import horizonVariables from "@sap-theming/theming-base-content/content/Base/baseLib/sap_horizon/css_variables.less?raw";

/**
 * Remove @import statements from LESS content to avoid duplication
 */
function removeImports(content: string): string {
  return content.replace(/@import\s+(['"])[^'"]*\1\s*;?\s*/g, '');
}

/**
 * Add a comment header to identify the file content
 */
function addFileHeader(content: string, filename: string): string {
  return `\n/* ===============================================\n * ${filename}\n * =============================================== */\n${content}\n`;
}

/**
 * Concatenate all LESS files in the correct dependency order
 * 
 * Dependency order:
 * 1. baseTheme/base.less (4) - Base foundation, no dependencies
 * 2. baseTheme/skeleton.less (5) - Depends on base.less
 * 3. baseTheme/css_variables.less (3) - Depends on base.less and skeleton.less
 * 4. sap_horizon/base.less (2) - Depends on baseTheme files
 * 5. sap_horizon/css_variables.less (1) - Depends on all above files
 */
export function concatenateAllLessFiles(): string {
  const files = [
    {
      name: 'baseTheme/base.less',
      content: baseVariables
    },
    {
      name: 'baseTheme/skeleton.less', 
      content: baseSkeleton
    },
    {
      name: 'baseTheme/css_variables.less',
      content: baseCssVariables
    },
    {
      name: 'sap_horizon/base.less',
      content: baseHorizonVariables
    },
    {
      name: 'sap_horizon/css_variables.less',
      content: horizonVariables
    }
  ];

  console.log('Concatenating LESS files in dependency order...');
  
  let concatenatedContent = '';
  
  for (const file of files) {
    console.log(`Processing: ${file.name}`);
    
    // Remove import statements to avoid circular references
    const cleanContent = removeImports(file.content);
    
    // Add file header and append to result
    concatenatedContent += addFileHeader(cleanContent, file.name);
  }
  
  console.log('LESS file concatenation completed');
  return concatenatedContent;
}

/**
 * Get the final concatenated LESS content ready for compilation
 */
export function getFinalLessContent(): string {
  return concatenateAllLessFiles();
}

// Usage example:
/*
// Get the concatenated content
const finalContent = getFinalLessContent();

// You can now compile this with less.js
// const compiledCSS = await less.render(finalContent);

// Or save it to a file for debugging
// console.log(finalContent);
*/
