#!/usr/bin/env node
/*
 * Internal library generator
 *
 * Usage examples:
 *   node tools/create-internal-lib.cjs --name=core
 *   node tools/create-internal-lib.cjs --name=core --alias=@libs/core
 *   node tools/create-internal-lib.cjs --name=buttons --alias=@ui/buttons --dir=ui/buttons
 *
 * Required:
 *   --name   : project name (used in angular.json and folder name if --dir is not provided)
 *
 * Optional:
 *   --alias  : TS path alias (default: @libs/<name>)
 *   --dir    : path under projects/libs (default: <name>)
 *   --help   : print usage and exit (also -h)
 */

const fs = require('fs');
const path = require('path');

function parseArgs(argv) {
  const args = {};
  argv.slice(2).forEach((arg) => {
    if (!arg.startsWith('--') && arg !== '-h') return;
    if (arg === '-h') {
      args.h = true;
      return;
    }
    const [key, value] = arg.replace(/^--/, '').split('=');
    args[key] = value === undefined ? true : value;
  });
  return args;
}

function printHelp() {
  console.log(`
Internal Library Generator

Usage:
  node tools/create-internal-lib.cjs --name=<projectName> [options]

Required:
  --name       Name of the library project.
               - Used as the Angular project name in angular.json
               - Used as the folder name under projects/libs if --dir is not provided

Optional:
  --alias      TypeScript path alias to register.
               - Default: @libs/<name>
               - Example: --alias=@critical/core

  --dir        Path under projects/libs where the library will be created.
               - Default: <name>
               - Example: --dir=ui/buttons  -> projects/libs/ui/buttons

  --help, -h   Show this help message.

  --prefix    Selector prefix for Angular schematics in this project.
              - Used when running: ng g c <name> --project <name>
              - Example: --prefix=cp  -> selector "cp-my-component"

Behavior:
  - Creates folder: projects/libs/<dir> with:
      - src/index.ts (barrel)
      - src/lib/public-api.ts (public API surface)
  - Adds a minimal "library" project entry to angular.json so you can use:
      ng g component MyComp --project <name>
      ng g service MyService --project <name>
  - Adds TS path aliases for:
      <alias> and <alias>/* 
    into tsconfig.base.json (if present) or tsconfig.json.
  - Creates tsconfig.lib.json in the library root, extending the workspace tsconfig.
`);
}

function loadJsonStrict(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }
  const raw = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(raw);
}

function loadJsonJsonc(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  let text = fs.readFileSync(filePath, 'utf8');

  // Strip BOM
  text = text.replace(/^\uFEFF/, '');

  // Remove /* block comments */
  text = text.replace(/\/\*[\s\S]*?\*\//g, '');

  // Remove // line comments
  text = text.replace(/^\s*\/\/.*$/gm, '');

  // Remove trailing commas before } or ]
  text = text.replace(/,\s*(\}|\])/g, '$1');

  return JSON.parse(text);
}

function saveJson(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
}

function main() {
  const args = parseArgs(process.argv);

  if (args.help || args.h) {
    printHelp();
    return;
  }

  const name = args.name;
  if (!name) {
    console.error('Error: --name is required. Use --help for usage.');
    process.exit(1);
  }

  const alias = args.alias || `@libs/${name}`;
  const dir = args.dir || name;

  // New: optional prefix for generated selectors (ng g c)
  const prefix = args.prefix || 'app'; // default stays 'app' like before

  const workspaceRoot = process.cwd();
  const libsRoot = path.join(workspaceRoot, 'projects', 'libs');
  const projectRoot = path.join(libsRoot, dir);
  const srcRoot = path.join(projectRoot, 'src');
  const libRoot = path.join(srcRoot, 'lib');

  const projectName = name;

  if (fs.existsSync(projectRoot)) {
    console.error(`Error: project folder already exists: ${projectRoot}`);
    process.exit(1);
  }

  // 1) Create folder structure
  fs.mkdirSync(libRoot, { recursive: true });

  // 2) Basic source files
  const indexTsPath = path.join(srcRoot, 'index.ts');
  const publicApiPath = path.join(libRoot, 'public-api.ts');

  const indexTsContent = `// Barrel file for ${projectName} internal library
export * from './lib/public-api';
`;

  const publicApiContent = `// Public API surface for ${projectName} internal library
// Export your components/services/helpers from here.
`;

  fs.writeFileSync(indexTsPath, indexTsContent, 'utf8');
  fs.writeFileSync(publicApiPath, publicApiContent, 'utf8');

  // 3) Update angular.json with a minimal library project
    const angularJsonPath = path.join(workspaceRoot, 'angular.json');
    // angular.json must be strict JSON:
    const angularJson = loadJsonStrict(angularJsonPath);

  if (!angularJson.projects) {
    angularJson.projects = {};
  }

  if (angularJson.projects[projectName]) {
    console.error(`Error: project "${projectName}" already exists in angular.json`);
    process.exit(1);
  }

  const projectRootRel = path
    .relative(workspaceRoot, projectRoot)
    .split(path.sep)
    .join('/');

  const srcRootRel = path
    .relative(workspaceRoot, srcRoot)
    .split(path.sep)
    .join('/');

  angularJson.projects[projectName] = {
    projectType: 'library',
    root: projectRootRel,
    sourceRoot: srcRootRel,
    prefix, // uses the value from --prefix (or 'app' by default)
    architect: {}
    };

  saveJson(angularJsonPath, angularJson);

  // 4) Update workspace tsconfig paths with alias
const tsconfigBasePath = path.join(workspaceRoot, 'tsconfig.base.json');
const tsconfigPath = fs.existsSync(tsconfigBasePath)
  ? tsconfigBasePath
  : path.join(workspaceRoot, 'tsconfig.json');

// tsconfig files can have comments / trailing commas:
const tsconfig = loadJsonJsonc(tsconfigPath);

  tsconfig.compilerOptions = tsconfig.compilerOptions || {};
  tsconfig.compilerOptions.paths = tsconfig.compilerOptions.paths || {};

  const indexRel = './' + path
    .relative(workspaceRoot, indexTsPath)
    .split(path.sep)
    .join('/');

  // Point to src folder (not index.ts) for cleaner resolution
  const srcRel = indexRel.replace(/\/index\.ts$/, '');

  tsconfig.compilerOptions.paths[alias] = [srcRel];
  tsconfig.compilerOptions.paths[`${alias}/*`] = [
    srcRel + '/*'
  ];

  // Add to references array if it exists
  if (Array.isArray(tsconfig.references)) {
    const tsconfigLibRel = './' + path
      .relative(workspaceRoot, path.join(projectRoot, 'tsconfig.lib.json'))
      .split(path.sep)
      .join('/');
    
    tsconfig.references.push({ path: tsconfigLibRel });
  }

  saveJson(tsconfigPath, tsconfig);

  // 5) Create tsconfig.lib.json for the library
  const tsconfigExtendsRel = path
    .relative(projectRoot, tsconfigPath)
    .split(path.sep)
    .join('/');

  const outDirRel = path
    .relative(projectRoot, path.join(workspaceRoot, 'dist', 'out-tsc'))
    .split(path.sep)
    .join('/');

  const tsconfigLib = {
    extends: tsconfigExtendsRel,
    compilerOptions: {
      outDir: outDirRel,
      declaration: true,
      types: []
    },
    include: ['src/**/*.ts'],
    exclude: ['src/**/*.spec.ts']
  };

  const tsconfigLibPath = path.join(projectRoot, 'tsconfig.lib.json');
  saveJson(tsconfigLibPath, tsconfigLib);


  console.log(`✅ Created internal lib:
  Name:       ${projectName}
  Root:       ${projectRootRel}
  Alias:      ${alias}
  Dir:        projects/libs/${dir}
  References: ${Array.isArray(tsconfig.references) ? 'Added to tsconfig.json' : 'Not using project references'}`);

  console.log(`
Next steps:
- Generate components/services with:
    ng generate component my-comp --project ${projectName}
    ng generate service my-service --project ${projectName}

- Specs in this library will be picked up by your test setup if tsconfig.spec.json
  (or equivalent) includes "projects/**/*.spec.ts".
`);
}

main();