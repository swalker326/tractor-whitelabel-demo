interface ThemeConfig {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    neutral: string;
    background: string;
    foreground: string;
    error: string;
    warning: string;
    success: string;
  };
  fonts: {
    sans: string;
    serif: string;
    mono: string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  spacing: {
    base: string;
  };
}

interface RemoteModuleConfig {
  path: string;
  url: string;
  module: string;
}

interface OrgConfig {
  id: string;
  orgId: string;
  theme: ThemeConfig;
  remoteModules: Record<string, RemoteModuleConfig>;
  features: {
    enableAnalytics: boolean;
    enableReporting: boolean;
    enableAdvancedSearch: boolean;
  };
  branding: {
    appName: string;
    logo: string;
    favicon: string;
  };
}

// Default configuration as fallback
const defaultConfig: OrgConfig = {
  id: "default",
  orgId: "default",
  theme: {
    colors: {
      primary: "#3B82F6",
      secondary: "#8B5CF6",
      accent: "#F59E0B",
      neutral: "#6B7280",
      background: "#FFFFFF",
      foreground: "#1F2937",
      error: "#EF4444",
      warning: "#F59E0B",
      success: "#10B981"
    },
    fonts: {
      sans: "Inter, system-ui, sans-serif",
      serif: "Georgia, serif",
      mono: "JetBrains Mono, monospace"
    },
    borderRadius: {
      sm: "0.125rem",
      md: "0.375rem",
      lg: "0.5rem",
      xl: "0.75rem"
    },
    spacing: {
      base: "1rem"
    }
  },
  remoteModules: {
    remote: {
      path: "/remote",
      url: "https://production-remote-addapar-remote-swalker326-ze.firstry.dev/remoteEntry.js",
      module: "remote/App"
    }
  },
  features: {
    enableAnalytics: true,
    enableReporting: true,
    enableAdvancedSearch: true
  },
  branding: {
    appName: "Portal",
    logo: "/logo.svg",
    favicon: "/favicon.ico"
  }
};

// Cache for the loaded configuration
let cachedConfig: OrgConfig | null = null;

// Get organization ID from environment or default
export function getOrgId(): string {
  return process.env.ORG_ID || 'default';
}

// Load organization configuration
export async function loadOrgConfig(orgId?: string): Promise<OrgConfig> {
  const targetOrgId = orgId || getOrgId();
  console.log(`Loading configuration for org: ${targetOrgId}`);
  
  // Return cached config if available and matches the requested org
  if (cachedConfig && cachedConfig.orgId === targetOrgId) {
    return cachedConfig;
  }
  
  try {
    const apiUrl = process.env.API_URL || 'http://localhost:8787';
    const response = await fetch(`${apiUrl}/api/customer-config?customerId=${targetOrgId}`);
    
    if (!response.ok) {
      throw new Error(`Config fetch failed: ${response.status}`);
    }
    
    const config = await response.json();
    cachedConfig = config;
    
    // Apply theme immediately when config is loaded
    applyTheme(config.theme);
    
    return config;
  } catch (error) {
    console.error('Failed to load org config:', error);
    console.warn('Using default configuration');
    cachedConfig = defaultConfig;
    return defaultConfig;
  }
}

// Apply theme to document
export function applyTheme(theme: ThemeConfig): void {
  const root = document.documentElement;
  
  // Apply color scheme
  Object.entries(theme.colors).forEach(([key, value]) => {
    root.style.setProperty(`--color-${key}`, value);
  });
  
  // Apply fonts
  Object.entries(theme.fonts).forEach(([key, value]) => {
    root.style.setProperty(`--font-${key}`, value);
  });
  
  // Apply border radius
  Object.entries(theme.borderRadius).forEach(([key, value]) => {
    root.style.setProperty(`--radius-${key}`, value);
  });
  
  // Apply spacing
  root.style.setProperty('--spacing-base', theme.spacing.base);
}

// Get cached config (useful for synchronous access after initial load)
export function getCachedConfig(): OrgConfig | null {
  return cachedConfig;
}

// Clear cached config (useful for testing or org switching)
export function clearConfigCache(): void {
  cachedConfig = null;
}

export type { OrgConfig, ThemeConfig, RemoteModuleConfig };