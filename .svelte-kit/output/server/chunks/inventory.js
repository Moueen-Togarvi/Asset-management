import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { b as private_env } from "./shared-server.js";
import { pgEnum, pgTable, timestamp, text, integer, uuid, index } from "drizzle-orm/pg-core";
import { eq, desc, sql as sql$1, asc, or, ne, and, gt } from "drizzle-orm";
import { subHours } from "date-fns";
const assetStatusEnum = pgEnum("asset_status", [
  "Available",
  "Allocated",
  "Picked",
  "On_Hold",
  "Dispatched"
]);
const orderStatusEnum = pgEnum("order_status", [
  "Received",
  "Processing",
  "Completed",
  "Cancelled"
]);
const allocationStepEnum = pgEnum("allocation_step", [
  "Allocated",
  "Picked",
  "On_Hold",
  "Dispatched"
]);
const lots = pgTable("lots", {
  id: uuid("id").primaryKey().defaultRandom(),
  lotNumber: text("lot_number").notNull().unique(),
  description: text("description").notNull(),
  quantity: integer("quantity").notNull(),
  location: text("location").notNull(),
  imageUrl: text("image_url"),
  status: assetStatusEnum("status").notNull().default("Available"),
  createdAt: timestamp("created_at").notNull().defaultNow()
}, (table) => {
  return {
    lotStatusIdx: index("lot_status_idx").on(table.status),
    lotCreatedIdx: index("lot_created_idx").on(table.createdAt)
  };
});
const salesOrders = pgTable("sales_orders", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderNumber: text("order_number").notNull().unique(),
  hospitalName: text("hospital_name").notNull(),
  status: orderStatusEnum("status").notNull().default("Received"),
  receivedAt: timestamp("received_at").notNull().defaultNow()
});
const allocations = pgTable("allocations", {
  id: uuid("id").primaryKey().defaultRandom(),
  orderId: uuid("order_id").notNull().references(() => salesOrders.id),
  lotId: uuid("lot_id").notNull().references(() => lots.id),
  quantity: integer("quantity").notNull(),
  allocationNumber: text("allocation_number").notNull().unique(),
  step: allocationStepEnum("step").notNull().default("Allocated"),
  createdAt: timestamp("created_at").notNull().defaultNow()
}, (table) => {
  return {
    allocStepIdx: index("alloc_step_idx").on(table.step),
    allocCreatedIdx: index("alloc_created_idx").on(table.createdAt)
  };
});
const schema = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  allocationStepEnum,
  allocations,
  assetStatusEnum,
  lots,
  orderStatusEnum,
  salesOrders
}, Symbol.toStringTag, { value: "Module" }));
const sql = neon(private_env.DATABASE_URL);
const db = drizzle(sql, { schema });
async function addAsset(data) {
  return await db.insert(lots).values(data).returning();
}
async function getRecentInventory(limit = 10) {
  return await db.select().from(lots).orderBy(desc(lots.createdAt)).limit(limit);
}
async function getDashboardStats() {
  const [res] = await db.select({
    total: sql$1`count(*)`,
    available: sql$1`count(*) filter (where ${lots.status} = 'Available')`,
    allocated: sql$1`count(*) filter (where ${lots.status} != 'Available' and ${lots.status} != 'Dispatched')`,
    Available: sql$1`count(*) filter (where ${lots.status} = 'Available')`,
    Allocated: sql$1`count(*) filter (where ${lots.status} = 'Allocated')`,
    Picked: sql$1`count(*) filter (where ${lots.status} = 'Picked')`,
    On_Hold: sql$1`count(*) filter (where ${lots.status} = 'On_Hold')`,
    Dispatched: sql$1`count(*) filter (where ${lots.status} = 'Dispatched')`
  }).from(lots);
  return {
    totalAssets: Number(res.total),
    availableAssets: Number(res.available),
    allocatedAssets: Number(res.allocated),
    Available: Number(res.Available),
    Allocated: Number(res.Allocated),
    Picked: Number(res.Picked),
    On_Hold: Number(res.On_Hold),
    Dispatched: Number(res.Dispatched)
  };
}
async function getFIFOAvailable() {
  return await db.select().from(lots).where(eq(lots.status, "Available")).orderBy(asc(lots.createdAt));
}
async function getAvailableLots(limit = 50) {
  return await db.select({
    id: lots.id,
    lotNumber: lots.lotNumber,
    description: lots.description,
    status: lots.status
  }).from(lots).where(eq(lots.status, "Available")).orderBy(desc(lots.createdAt)).limit(limit);
}
async function getActiveAllocations(limit = 100) {
  const fourHoursAgo = subHours(/* @__PURE__ */ new Date(), 4);
  return await db.select({
    id: allocations.id,
    allocationNumber: allocations.allocationNumber,
    step: allocations.step,
    lotId: allocations.lotId,
    createdAt: allocations.createdAt,
    asset: {
      id: lots.id,
      lotNumber: lots.lotNumber,
      description: lots.description
    }
  }).from(allocations).innerJoin(lots, eq(allocations.lotId, lots.id)).where(
    or(
      ne(allocations.step, "Dispatched"),
      and(
        eq(allocations.step, "Dispatched"),
        gt(allocations.createdAt, fourHoursAgo)
      )
    )
  ).orderBy(desc(allocations.createdAt)).limit(limit);
}
async function createAllocation(orderId, lotId, quantity) {
  const [allocation] = await db.insert(allocations).values({
    orderId,
    lotId,
    quantity,
    allocationNumber: `ALLOC-${Date.now()}`,
    step: "Allocated"
  }).returning();
  await db.update(lots).set({ status: "Allocated" }).where(eq(lots.id, lotId));
  return allocation;
}
async function updateAllocationStep(allocationId, step) {
  const [allocation] = await db.update(allocations).set({ step }).where(eq(allocations.id, allocationId)).returning();
  await db.update(lots).set({ status: step }).where(eq(lots.id, allocation.lotId));
  return allocation;
}
async function deleteAsset(id) {
  return await db.delete(lots).where(eq(lots.id, id));
}
async function returnAsset(allocationId) {
  const [allocation] = await db.select().from(allocations).where(eq(allocations.id, allocationId));
  if (!allocation) return null;
  await db.update(lots).set({ status: "Available" }).where(eq(lots.id, allocation.lotId));
  await db.delete(allocations).where(eq(allocations.id, allocationId));
  return { success: true };
}
export {
  addAsset as a,
  getDashboardStats as b,
  getFIFOAvailable as c,
  deleteAsset as d,
  db as e,
  createAllocation as f,
  getRecentInventory as g,
  getAvailableLots as h,
  getActiveAllocations as i,
  returnAsset as r,
  salesOrders as s,
  updateAllocationStep as u
};
