import { r as returnAsset, u as updateAllocationStep, c as getFIFOAvailable, e as db, s as salesOrders, f as createAllocation, h as getAvailableLots, i as getActiveAllocations } from "../../../chunks/inventory.js";
async function syncToNetSuite(data) {
  console.log("🔄 Syncing to NetSuite:", data);
  await new Promise((resolve) => setTimeout(resolve, 1500));
  return {
    success: true,
    netsuiteId: `NS-${Math.floor(Math.random() * 1e6)}`,
    syncedAt: (/* @__PURE__ */ new Date()).toISOString()
  };
}
const load = async () => {
  const [availableAssets, activeAllocations] = await Promise.all([
    getAvailableLots(),
    getActiveAllocations()
  ]);
  return {
    assets: availableAssets,
    allocations: activeAllocations
  };
};
const actions = {
  autoAllocate: async ({ request }) => {
    const data = await request.formData();
    const qty = parseInt(data.get("qty") || "1");
    const availableLots = await getFIFOAvailable();
    if (availableLots.length < qty) {
      return { error: "Insufficient stock" };
    }
    const [order] = await db.insert(salesOrders).values({
      orderNumber: `SO-${Date.now()}`,
      hospitalName: "General Hospital"
    }).returning();
    for (let i = 0; i < qty; i++) {
      await createAllocation(order.id, availableLots[i].id, 1);
    }
    return { success: true };
  },
  pickAndSync: async ({ request }) => {
    const data = await request.formData();
    const allocationId = data.get("allocationId");
    const allocation = await updateAllocationStep(allocationId, "Picked");
    await syncToNetSuite(allocation);
    return { success: true };
  },
  updateStep: async ({ request }) => {
    const data = await request.formData();
    const allocationId = data.get("allocationId");
    const step = data.get("step");
    await updateAllocationStep(allocationId, step);
    return { success: true };
  },
  returnAsset: async ({ request }) => {
    const data = await request.formData();
    const allocationId = data.get("allocationId");
    await returnAsset(allocationId);
    return { success: true };
  }
};
export {
  actions,
  load
};
