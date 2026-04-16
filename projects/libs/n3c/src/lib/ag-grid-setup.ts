/**
 * Lazy ag-grid registration.
 *
 * Import this file (side-effect import) in every module or standalone component
 * that uses ag-grid.  ES modules are singletons — the body executes only once
 * regardless of how many files import it, and it is tree-shaken away from
 * routes that never touch ag-grid.
 */
import {ModuleRegistry, AllCommunityModule, provideGlobalGridOptions, themeQuartz} from 'ag-grid-community';

provideGlobalGridOptions({theme: themeQuartz});
ModuleRegistry.registerModules([AllCommunityModule]);
