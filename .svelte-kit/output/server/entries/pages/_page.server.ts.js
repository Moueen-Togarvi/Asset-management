import { d as deleteAsset, a as addAsset, g as getRecentInventory, b as getDashboardStats } from "../../chunks/inventory.js";
import { fail } from "@sveltejs/kit";
const load = async () => {
  const [assets, stats] = await Promise.all([
    getRecentInventory(10),
    getDashboardStats()
  ]);
  return {
    assets,
    stats
  };
};
const actions = {
  addAsset: async ({ request }) => {
    try {
      const data = await request.formData();
      const lotNumber = data.get("lotNumber");
      const description = data.get("description");
      const location = data.get("location");
      const quantity = parseInt(data.get("quantity") || "1");
      if (!lotNumber || !description) {
        return fail(400, { message: "Missing required fields" });
      }
      await addAsset({ lotNumber, description, quantity, location });
      return { success: true };
    } catch (error) {
      console.error("Error adding asset:", error);
      return fail(500, { message: error.message || "Failed to add asset" });
    }
  },
  deleteAsset: async ({ request }) => {
    try {
      const formData = await request.formData();
      const id = formData.get("id");
      if (!id) return fail(400, { message: "ID is required" });
      await deleteAsset(id);
      return { success: true };
    } catch (error) {
      console.error("Error deleting asset:", error);
      return fail(500, { message: "Failed to delete asset" });
    }
  }
};
export {
  actions,
  load
};
