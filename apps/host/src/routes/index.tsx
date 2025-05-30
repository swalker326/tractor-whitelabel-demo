import { useBranding, useConfig, useTheme } from "../config/ConfigContext";

export default function IndexRoute() {
  const branding = useBranding();
  const theme = useTheme();
  const { isLoading } = useConfig();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-full flex flex-col justify-between">
      {/* Hero Section */}
      <section 
        className="relative overflow-hidden flex-1 flex items-center"
        style={{
          background: `linear-gradient(135deg, ${theme?.colors.primary}15 0%, ${theme?.colors.primary}05 50%, ${theme?.colors.secondary}10 100%)`,
        }}
      >
        <div className="container mx-auto px-8 py-24">
          <div className="max-w-4xl mx-auto text-center space-y-12">
            <div className="space-y-6">
              <h1 
                className="text-7xl font-bold leading-tight"
                style={{ color: theme?.colors.primary }}
              >
                Welcome to {branding?.appName || 'the Application'}
              </h1>
              <div className="flex justify-center gap-4">
                <div className="h-2 w-32 rounded-full" style={{ backgroundColor: theme?.colors.secondary }}></div>
                <div className="h-2 w-16 rounded-full" style={{ backgroundColor: theme?.colors.primary }}></div>
                <div className="h-2 w-8 rounded-full" style={{ backgroundColor: theme?.colors.accent }}></div>
              </div>
            </div>
            <p className="text-3xl text-gray-700 leading-relaxed max-w-3xl mx-auto">
              Your centralized portal for accessing all {branding?.appName || 'application'} services and tools.
            </p>
            <div className="flex gap-6 justify-center">
              <button 
                className="px-10 py-5 text-lg text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
                style={{ backgroundColor: theme?.colors.primary }}
              >
                Get Started
              </button>
              <button 
                className="px-10 py-5 text-lg font-semibold rounded-lg shadow-md hover:shadow-lg transition-all border-2"
                style={{ 
                  borderColor: theme?.colors.primary,
                  color: theme?.colors.primary 
                }}
              >
                Learn More
              </button>
            </div>
          </div>
        </div>
        {/* Decorative elements */}
        <div 
          className="absolute -top-24 -right-24 w-96 h-96 rounded-full blur-3xl opacity-10"
          style={{ backgroundColor: theme?.colors.primary }}
        ></div>
        <div 
          className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full blur-3xl opacity-10"
          style={{ backgroundColor: theme?.colors.secondary }}
        ></div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4" style={{ color: theme?.colors.primary }}>
              Explore Our Services
            </h2>
            <p className="text-xl text-gray-600">Everything you need in one place</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div 
              className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 cursor-pointer"
              style={{ borderTop: `4px solid ${theme?.colors.primary}` }}
            >
              <div className="text-5xl mb-4">🚜</div>
              <h3 className="text-2xl font-bold mb-3" style={{ color: theme?.colors.primary }}>Equipment</h3>
              <p className="text-gray-600 mb-4">Browse our extensive catalog of tractors and farming equipment</p>
              <a className="inline-flex items-center gap-2 font-semibold" style={{ color: theme?.colors.primary }}>
                Browse Catalog →
              </a>
            </div>
            <div 
              className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 cursor-pointer"
              style={{ borderTop: `4px solid ${theme?.colors.secondary}` }}
            >
              <div className="text-5xl mb-4">🔧</div>
              <h3 className="text-2xl font-bold mb-3" style={{ color: theme?.colors.primary }}>Service</h3>
              <p className="text-gray-600 mb-4">Schedule maintenance and repairs with certified technicians</p>
              <a className="inline-flex items-center gap-2 font-semibold" style={{ color: theme?.colors.primary }}>
                Schedule Service →
              </a>
            </div>
            <div 
              className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 cursor-pointer"
              style={{ borderTop: `4px solid ${theme?.colors.accent}` }}
            >
              <div className="text-5xl mb-4">📊</div>
              <h3 className="text-2xl font-bold mb-3" style={{ color: theme?.colors.primary }}>Reports</h3>
              <p className="text-gray-600 mb-4">View detailed analytics and performance metrics</p>
              <a className="inline-flex items-center gap-2 font-semibold" style={{ color: theme?.colors.primary }}>
                View Reports →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section 
        className="py-20"
        style={{ backgroundColor: theme?.colors.primary }}
      >
        <div className="container mx-auto px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to get started?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Navigate to different modules using the links in the header above
          </p>
          <button 
            className="px-8 py-4 bg-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
            style={{ color: theme?.colors.primary }}
          >
            Explore Now
          </button>
        </div>
      </section>
    </div>
  );
}
