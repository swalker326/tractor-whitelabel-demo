# Tractor White-Label Demo

A white-label application demo showcasing how to build and deploy multiple branded versions of a tractor dealership application using a single codebase.

## Overview

This project demonstrates a white-label architecture that allows building customized versions for different tractor brands:
- **John Deere** 
- **Kubota**
- **New Holland**

Each brand gets its own themed version with custom colors, logos, and branding while sharing the same underlying functionality.

## Project Structure

```
tractor-whitelabel-demo/
├── apps/
│   ├── host/          # Main frontend application
│   │   ├── .env              # Active environment configuration
│   │   ├── .env.john-deere   # John Deere brand config
│   │   ├── .env.kubota       # Kubota brand config
│   │   └── .env.new-holland  # New Holland brand config
│   └── api/           # Backend API service
└── .github/
    └── workflows/     # CI/CD pipelines
```

## Environment Configuration

The white-label functionality is controlled through environment files located in `apps/host/`:

### Environment Variables

- **ORG_ID**: The organization/brand identifier (`john-deere`, `kubota`, `new-holland`)
- **API_URL**: The backend API endpoint (default: `https://api.shane9741.workers.dev`)

### Running Locally

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Run a specific white-label version:**
   ```bash
   cd apps/host
   
   # Run John Deere version
   pnpm dev:john-deere
   
   # Run Kubota version
   pnpm dev:kubota
   
   # Run New Holland version
   pnpm dev:new-holland
   ```

3. **For local API development:**
   
   If you need to use a local API instead of the production endpoint, update the `.env` file to point to your local API:
   ```
   API_URL=http://localhost:8787
   ```

## Building for Production

Build commands are available for each white-label version:

```bash
cd apps/host

# Build John Deere version
pnpm build:john-deere

# Build Kubota version
pnpm build:kubota

# Build New Holland version
pnpm build:new-holland
```

Each build command:
- Automatically sets the appropriate `ORG` environment variable
- Builds the application with brand-specific theming
- No need to manually change .env files - the build commands handle everything

## CI/CD

The project includes a GitHub Actions workflow that:
- Automatically builds all three white-label versions on pull requests
- Extracts deployment URLs from build outputs
- Comments on the PR with a table showing all deployment links

## Development

### Adding a New Brand

1. Create a new environment file: `apps/host/.env.{brand-name}`
2. Set the appropriate `ORG_ID` value
3. Add a new build script to `apps/host/package.json`:
   ```json
   "build:{brand-name}": "ORG={brand-name} rspack build"
   ```
4. Update the GitHub Actions workflow to include the new build

### Customization Points

The application reads the `ORG_ID` to determine:
- Color schemes and theming
- Logo and brand assets
- Brand-specific content
- Custom features or functionality

## Technologies

- **Frontend**: React with Rspack (Module Federation)
- **Backend**: Cloudflare Workers
- **Build Tool**: Rspack
- **Package Manager**: PNPM
- **CI/CD**: GitHub Actions