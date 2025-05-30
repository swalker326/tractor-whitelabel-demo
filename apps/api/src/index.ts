import { Hono } from "hono";
import { cors } from "hono/cors";

const app = new Hono<{ Bindings: { CUSTOMER_CONFIGS: KVNamespace } }>();
app.use("*", cors());

app.get("/", (c) => {
  return c.text("Hello, World!");
});
app.get("/api", (c) => {
  return c.json({ message: "Hello from API!" });
});
app.post("/api/add-config", async (c) => {
  const customerId = c.req.query("customerId");
  
  if (!customerId) {
    return c.json({ error: "customerId is required" }, 400);
  }
  
  try {
    const config = await c.req.json();
    await c.env.CUSTOMER_CONFIGS.put(customerId, JSON.stringify(config));
    
    return c.json({ 
      message: "Config saved successfully",
      customerId,
      config 
    }, 201);
  } catch (error) {
    return c.json({ error: "Invalid JSON body" }, 400);
  }
});

app.get("/api/customer-config", async (c) => {
  const customerId = c.req.query("customerId");
  
  if (!customerId) {
    return c.json({ error: "customerId is required" }, 400);
  }
  
  try {
    const config = await c.env.CUSTOMER_CONFIGS.get(customerId);
    
    if (!config) {
      return c.json({ error: "Config not found" }, 404);
    }
    console.log("Retrieved config for customerId:", customerId);
    console.log("Config content:", JSON.parse(config));
    return c.json(JSON.parse(config));
  } catch (error) {
    return c.json({ error: "Failed to retrieve config" }, 500);
  }
});

app.post("/api/upload-local-configs", async (c) => {
  try {
    // Import the local JSON config files
    const johnDeereConfig = await import('../config-john-deere.json');
    const newHollandConfig = await import('../config-new-holland.json');
    const kubotaConfig = await import('../config-kubota.json');
    
    const configs = [
      johnDeereConfig.default || johnDeereConfig,
      newHollandConfig.default || newHollandConfig,
      kubotaConfig.default || kubotaConfig
    ];
    
    const results = await Promise.all(
      configs.map(async (config) => {
        try {
          await c.env.CUSTOMER_CONFIGS.put(config.orgId, JSON.stringify(config));
          return { success: true, orgId: config.orgId };
        } catch (error) {
          return { error: `Failed to save config for ${config.orgId}`, orgId: config.orgId };
        }
      })
    );
    
    return c.json({
      message: "Upload complete",
      results
    }, 200);
  } catch (error) {
    return c.json({ error: "Failed to load config files" }, 500);
  }
});

export default app;
