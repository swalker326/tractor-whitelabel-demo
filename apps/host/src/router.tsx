import type React from "react";
import { createBrowserRouter, type RouteObject } from "react-router";
import {
  loadRemote,
  registerRemotes
} from "@module-federation/enhanced/runtime";
import RootLayout from "./RootLayout";
import IndexRoute from "./routes";
import { loadOrgConfig, getCachedConfig, applyTheme } from "./config/configLoader";

// Root loader to fetch config before rendering
async function rootLoader() {
  try {
    const config = await loadOrgConfig();
    console.log('Organization config loaded:', config.orgId);
    
    // Apply theme immediately to prevent flash
    applyTheme(config.theme);
    
    return { config };
  } catch (error) {
    console.error('Failed to load initial config:', error);
    throw error;
  }
}

export const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <RootLayout />,
      loader: rootLoader,
      children: [{ index: true, element: <IndexRoute /> }]
    }
  ],
  {
    patchRoutesOnNavigation: async ({ matches, path, patch }) => {
      console.log("Attempting to load route:", path);
      const pathClean = path.slice(1); // Remove leading slash
      
      // Get the cached config or load it if not available
      let config = getCachedConfig();
      if (!config) {
        try {
          config = await loadOrgConfig();
        } catch (error) {
          console.error("Failed to load config for routing:", error);
          return;
        }
      }
      
      // Check if this path has a remote module configured
      const moduleConfig = config.remoteModules[pathClean];
      if (!moduleConfig) {
        console.log(`No remote module configured for path: ${pathClean}`);
        return;
      }
      
      console.log(`Loading remote module for ${pathClean}:`, moduleConfig);
      
      // Register the remote module
      registerRemotes([
        {
          name: pathClean,
          entry: moduleConfig.url
        }
      ]);
      
      try {
        // Load the remote module
        const module = await loadRemote<{ default: () => React.ReactNode }>(
          moduleConfig.module
        );
        
        if (!module) {
          console.error(`Failed to load remote module: ${moduleConfig.module}`);
          return;
        }

        const route: RouteObject = {
          path: path,
          Component: () => module.default()
        };
        
        patch("0", [route]);
        console.log(`Successfully loaded remote module for ${pathClean}`);
      } catch (error) {
        console.error(`Error loading remote module for ${pathClean}:`, error);
      }
    }
  }
);
