import { Outlet, useLoaderData } from "react-router";
import { ConfigProvider, useConfig } from "./config/ConfigContext";
import type { OrgConfig } from "./config/configLoader";
//@ts-expect-error
import Header from "tractor_header/Module";

interface LoaderData {
  config: OrgConfig;
}

function LayoutContent() {
  const { config, isLoading } = useConfig();
  
  return (
    <div className="flex flex-col h-screen">
      <Header config={config} isLoading={isLoading} />
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
}

export default function RootLayout() {
  const { config } = useLoaderData() as LoaderData;
  
  return (
    <ConfigProvider initialConfig={config}>
      <LayoutContent />
    </ConfigProvider>
  );
}
