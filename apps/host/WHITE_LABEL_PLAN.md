# White Label Configuration Plan

## Overview

This document outlines the approach for implementing white-label functionality in the application. The system will support organization-specific configurations including theming, module federation, and feature customization.

## Configuration Structure

### app.{orgId}.config.json

The configuration file will be fetched from an API endpoint and will contain organization-specific settings:

```json
{
  "orgId": "acme-corp",
  "theme": {
    "colors": {
      "primary": "#1e40af",
      "secondary": "#7c3aed",
      "accent": "#f59e0b",
      "neutral": "#374151",
      "background": "#ffffff",
      "foreground": "#1f2937",
      "error": "#dc2626",
      "warning": "#f59e0b",
      "success": "#10b981"
    },
    "fonts": {
      "sans": "Inter, system-ui, sans-serif",
      "serif": "Georgia, serif",
      "mono": "JetBrains Mono, monospace"
    },
    "borderRadius": {
      "sm": "0.125rem",
      "md": "0.375rem",
      "lg": "0.5rem",
      "xl": "0.75rem"
    },
    "spacing": {
      "base": "1rem"
    }
  },
  "remoteModules": {
    "remote": {
      "path": "/remote",
      "url": "https://production-remote-addapar-remote-swalker326-ze.firstry.dev/remoteEntry.js",
      "module": "remote/App"
    },
    "dashboard": {
      "path": "/dashboard",
      "url": "https://dashboard.example.com/remoteEntry.js",
      "module": "dashboard/Main"
    },
    "analytics": {
      "path": "/analytics",
      "url": "https://analytics.example.com/remoteEntry.js",
      "module": "analytics/App"
    }
  },
  "features": {
    "enableAnalytics": true,
    "enableReporting": false,
    "enableAdvancedSearch": true
  },
  "branding": {
    "appName": "ACME Portal",
    "logo": "https://cdn.example.com/acme-logo.svg",
    "favicon": "https://cdn.example.com/acme-favicon.ico"
  }
}
```

## Implementation Plan

### 1. Configuration Loading

- **API Endpoint**: `/api/config/{orgId}`
- **Caching Strategy**: Cache configuration in memory with TTL
- **Fallback**: Default configuration if API fails

```typescript
// Example implementation
async function loadOrgConfig(orgId: string): Promise<OrgConfig> {
  try {
    const response = await fetch(`/api/config/${orgId}`);
    if (!response.ok) throw new Error('Config fetch failed');
    return await response.json();
  } catch (error) {
    console.error('Failed to load org config:', error);
    return defaultConfig;
  }
}
```

### 2. Dynamic Module Loading Integration

Update the router to use configuration for module federation:

```typescript
// In router.tsx patchRoutesOnNavigation
const config = await getOrgConfig();
const moduleConfig = config.remoteModules[pathClean];

if (moduleConfig) {
  registerRemotes([{
    name: pathClean,
    entry: moduleConfig.url
  }]);
  
  const module = await loadRemote<{ default: () => React.ReactNode }>(
    moduleConfig.module
  );
  // ... rest of implementation
}
```

### 3. Tailwind v4 Theme Integration

Use CSS custom properties to apply theme dynamically:

```css
/* Base theme variables */
:root {
  --color-primary: theme('colors.primary');
  --color-secondary: theme('colors.secondary');
  /* ... other theme variables */
}
```

Apply theme on configuration load:

```typescript
function applyTheme(theme: ThemeConfig) {
  const root = document.documentElement;
  
  // Apply color scheme
  Object.entries(theme.colors).forEach(([key, value]) => {
    root.style.setProperty(`--color-${key}`, value);
  });
  
  // Apply fonts
  Object.entries(theme.fonts).forEach(([key, value]) => {
    root.style.setProperty(`--font-${key}`, value);
  });
  
  // Apply other theme properties...
}
```

### 4. Configuration Context

Create a React context for global configuration access:

```typescript
interface ConfigContextType {
  config: OrgConfig;
  isLoading: boolean;
  error: Error | null;
}

const ConfigContext = createContext<ConfigContextType>();

export function ConfigProvider({ children, orgId }: Props) {
  const [config, setConfig] = useState<OrgConfig>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    loadOrgConfig(orgId)
      .then(setConfig)
      .catch(setError)
      .finally(() => setIsLoading(false));
  }, [orgId]);
  
  // Apply theme when config loads
  useEffect(() => {
    if (config?.theme) {
      applyTheme(config.theme);
    }
  }, [config]);
  
  return (
    <ConfigContext.Provider value={{ config, isLoading, error }}>
      {children}
    </ConfigContext.Provider>
  );
}
```

## Implementation Steps

1. **Phase 1: Configuration Schema**
   - Define TypeScript interfaces for configuration
   - Create validation schemas
   - Set up default configuration

2. **Phase 2: API Integration**
   - Implement configuration API endpoint
   - Add configuration loading logic
   - Implement caching mechanism

3. **Phase 3: Theme System**
   - Set up Tailwind v4 with CSS custom properties
   - Create theme application logic
   - Build theme switching mechanism

4. **Phase 4: Module Federation**
   - Update router to use configuration
   - Implement dynamic remote registration
   - Add error handling for module loading

5. **Phase 5: Testing & Documentation**
   - Create example configurations
   - Write integration tests
   - Document configuration options

## Security Considerations

- Validate all configuration values
- Sanitize URLs for remote modules
- Implement CSP headers for dynamic scripts
- Use HTTPS for all remote module URLs

## Performance Optimizations

- Cache configurations client-side
- Preload critical remote modules
- Implement lazy loading strategies
- Use service workers for offline support

## Future Enhancements

- A/B testing support through configuration
- Feature flag management
- Dynamic permission systems
- Multi-tenant support