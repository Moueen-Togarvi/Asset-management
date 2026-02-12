import { pgTable, uuid, text, integer, timestamp, pgEnum, index, primaryKey } from "drizzle-orm/pg-core";

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

export const userRoleEnum = pgEnum("user_role", [
    "admin",
    "manager",
    "user",
]);

// Auth.js required tables
export const users = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name"),
    email: text("email").notNull().unique(),
    emailVerified: timestamp("email_verified", { mode: "date" }),
    image: text("image"),
    passwordHash: text("password_hash"),
    role: userRoleEnum("role").notNull().default("user"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const accounts = pgTable("accounts", {
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("provider_account_id").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
}, (table) => ({
    pk: primaryKey({ columns: [table.provider, table.providerAccountId] }),
}));

export const sessions = pgTable("sessions", {
    sessionToken: text("session_token").notNull().primaryKey(),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable("verification_tokens", {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
}, (table) => ({
    pk: primaryKey({ columns: [table.identifier, table.token] }),
}));

export const lots = pgTable("lots", {
    id: uuid("id").primaryKey().defaultRandom(),
    lotNumber: text("lot_number").notNull().unique(),
    description: text("description").notNull(),
    quantity: integer("quantity").notNull(),
    location: text("location").notNull(),
    imageUrl: text("image_url"),
    status: assetStatusEnum("status").notNull().default("Available"),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
}, (table) => {
    return {
        lotStatusIdx: index("lot_status_idx").on(table.status),
        lotCreatedIdx: index("lot_created_idx").on(table.createdAt),
        lotUserIdx: index("lot_user_idx").on(table.userId),
    };
});

export const salesOrders = pgTable("sales_orders", {
    id: uuid("id").primaryKey().defaultRandom(),
    orderNumber: text("order_number").notNull().unique(),
    hospitalName: text("hospital_name").notNull(),
    status: orderStatusEnum("status").notNull().default("Received"),
    userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
    receivedAt: timestamp("received_at").notNull().defaultNow(),
}, (table) => {
    return {
        orderUserIdx: index("order_user_idx").on(table.userId),
    };
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
