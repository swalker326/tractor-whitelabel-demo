import { useBranding, useConfig } from "../config/ConfigContext";

export default function IndexRoute() {
  const branding = useBranding();
  const { isLoading } = useConfig();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full gap-6">
      {branding?.logo && (
        <img 
          src={branding.logo} 
          alt={`${branding.appName} Logo`}
          className="h-24 w-auto"
        />
      )}
      <h1 className="text-4xl font-bold">
        Welcome to {branding?.appName || 'the Application'}
      </h1>
      <p className="text-lg text-center max-w-2xl">
        This is your centralized portal for accessing all {branding?.appName || 'application'} services and tools.
      </p>
      <p className="text-lg text-center max-w-2xl">
        Navigate to different modules using the links in the header above.
      </p>
    </div>
  );
}
