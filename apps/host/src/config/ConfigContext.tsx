import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { loadOrgConfig, type OrgConfig } from './configLoader';

interface ConfigContextType {
  config: OrgConfig | null;
  isLoading: boolean;
  error: Error | null;
  reloadConfig: () => Promise<void>;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

interface ConfigProviderProps {
  children: ReactNode;
  orgId?: string;
  initialConfig?: OrgConfig;
}

export function ConfigProvider({ children, orgId, initialConfig }: ConfigProviderProps) {
  const [config, setConfig] = useState<OrgConfig | null>(initialConfig || null);
  const [isLoading, setIsLoading] = useState(!initialConfig);
  const [error, setError] = useState<Error | null>(null);

  const loadConfig = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const loadedConfig = await loadOrgConfig(orgId);
      setConfig(loadedConfig);
      
      // Update document metadata
      if (loadedConfig.branding.favicon) {
        const link = document.querySelector("link[rel='icon']") as HTMLLinkElement;
        if (link) {
          link.href = loadedConfig.branding.favicon;
        }
      }
      
      if (loadedConfig.branding.appName) {
        document.title = loadedConfig.branding.appName;
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load configuration'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Skip loading if we already have initial config
    if (!initialConfig) {
      loadConfig();
    }
  }, [orgId]);

  const contextValue: ConfigContextType = {
    config,
    isLoading,
    error,
    reloadConfig: loadConfig
  };

  return (
    <ConfigContext.Provider value={contextValue}>
      {children}
    </ConfigContext.Provider>
  );
}

export function useConfig() {
  const context = useContext(ConfigContext);
  
  if (context === undefined) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  
  return context;
}

// Hook for accessing specific config sections
export function useTheme() {
  const { config } = useConfig();
  return config?.theme || null;
}

export function useFeatures() {
  const { config } = useConfig();
  return config?.features || null;
}

export function useBranding() {
  const { config } = useConfig();
  console.log(config)
  return config?.branding || null;
}

export function useRemoteModules() {
  const { config } = useConfig();
  return config?.remoteModules || null;
}