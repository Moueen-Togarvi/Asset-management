import { pgTable, uuid, text, integer, timestamp, pgEnum, index } from "drizzle-orm/pg-core";

export const assetStatusEnum = pgEnum("asset_status", [
    "Available",
    "Allocated",
    "Picked",
    "On_Hold",
    "Dispatched",
]);

export const orderStatusEnum = pgEnum("order_status", [
    "Received",
    "Processing",
    "Completed",
    "Cancelled",
]);

export const allocationStepEnum = pgEnum("allocation_step", [
    "Allocated",
    "Picked",
    "On_Hold",
    "Dispatched",
]);

export const lots = pgTable("lots", {
    id: uuid("id").primaryKey().defaultRandom(),
    lotNumber: text("lot_number").notNull().unique(),
    description: text("description").notNull(),
    quantity: integer("quantity").notNull(),
    location: text("location").notNull(),
    imageUrl: text("image_url"),
    status: assetStatusEnum("status").notNull().default("Available"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => {
    return {
        lotStatusIdx: index("lot_status_idx").on(table.status),
        lotCreatedIdx: index("lot_created_idx").on(table.createdAt),
    };
});

export const salesOrders = pgTable("sales_orders", {
    id: uuid("id").primaryKey().defaultRandom(),
    orderNumber: text("order_number").notNull().unique(),
    hospitalName: text("hospital_name").notNull(),
    status: orderStatusEnum("status").notNull().default("Received"),
    receivedAt: timestamp("received_at").notNull().defaultNow(),
});

export const allocations = pgTable("allocations", {
    id: uuid("id").primaryKey().defaultRandom(),
    orderId: uuid("order_id").notNull().references(() => salesOrders.id),
    lotId: uuid("lot_id").notNull().references(() => lots.id),
    quantity: integer("quantity").notNull(),
    allocationNumber: text("allocation_number").notNull().unique(),
    step: allocationStepEnum("step").notNull().default("Allocated"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => {
    return {
        allocStepIdx: index("alloc_step_idx").on(table.step),
        allocCreatedIdx: index("alloc_created_idx").on(table.createdAt),
    };
});
