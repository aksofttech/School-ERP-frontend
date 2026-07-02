const fs = require('fs');
const path = require('path');

const layoutsToExtract = [
  'AdminLayout',
  'SuperAdminLayout',
  'DashboardLayout',
  'TeacherLayout',
  'StudentLayout',
  'ParentLayout'
];

function getFiles(dir, files = []) {
  const fileList = fs.readdirSync(dir);
  for (const file of fileList) {
    const name = path.join(dir, file);
    if (fs.statSync(name).isDirectory()) {
      getFiles(name, files);
    } else if (name.endsWith('.tsx')) {
      files.push(name);
    }
  }
  return files;
}

const modulesDir = path.join(__dirname, '../modules');
const pagesDir = path.join(__dirname, '../pages');

const allModuleFiles = getFiles(modulesDir);
let changedFiles = 0;

allModuleFiles.forEach((file) => {
  let content = fs.readFileSync(file, 'utf8');

  // Match: export default function Something() { ... return <Layout>...</Layout> }
  // OR     const Something = () => { ... return <Layout>...</Layout> }
  // We need to support various formatting, which is hard with plain regex.
  // Instead of complex AST, let's look for known layouts wrapping the main return.

  let modified = false;

  for (const layout of layoutsToExtract) {
    const layoutRegex = new RegExp(`(<${layout}[^>]*>)([\\s\\S]*?)(</${layout}>)`);
    const match = content.match(layoutRegex);
    
    if (match) {
      // Find the name of the component function to attach `.getLayout`
      let componentNameMatch = content.match(/export\s+default\s+function\s+([A-Za-z0-9_]+)/);
      if (!componentNameMatch) {
         componentNameMatch = content.match(/const\s+([A-Za-z0-9_]+)\s*=\s*(?:function|\([^)]*\)\s*=>)/);
      }

      if (componentNameMatch) {
        const componentName = componentNameMatch[1];
        
        // Remove the layout wrapper from the return statement
        const newReturnContent = match[2]; // the children JSX
        
        // Safety check: is it the *only* thing returned? Usually it is "return (\n <Layout>...</Layout> \n)"
        const originalReturnRegex = new RegExp(`return\\s*\\(?\\s*${match[0].replace(/[.*+?^$\{()|[\]\\]/g, '\\$&')}\\s*\\)?`);
        
        if (content.match(originalReturnRegex)) {
            content = content.replace(originalReturnRegex, `return (\n      <>\n        ${newReturnContent}\n      </>\n    )`);
            
            // Append getLayout if not already present
            if (!content.includes(`${componentName}.getLayout`)) {
              content += `\n\n${componentName}.getLayout = function getLayout(page: React.ReactElement) {\n  return <${layout}>{page}</${layout}>;\n};\n`;
            }

            modified = true;
        } else {
            // Might not be easily regexable wrapped in a return, replace just the layout tag with Fragment
            content = content.replace(layoutRegex, `<>\n$2\n</>`);
            if (!content.includes(`${componentName}.getLayout`)) {
               content += `\n\n${componentName}.getLayout = function getLayout(page: React.ReactElement) {\n  return <${layout}>{page}</${layout}>;\n};\n`;
            }
            modified = true;
        }
      }
    }
  }

  if (modified) {
    // Add import React if ReactElement is used but not imported
    if (!content.includes("import React") && content.includes("React.ReactElement")) {
        content = "import React from 'react';\n" + content;
    }
    fs.writeFileSync(file, content, 'utf8');
    changedFiles++;
    console.log(`Refactored ${file}`);
  }
});

console.log(`\nSuccessfully refactored layouts in ${changedFiles} files.`);
