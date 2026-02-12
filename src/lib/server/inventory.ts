import { db } from './db';
import { lots, salesOrders, allocations } from './db/schema';
import { desc, asc, eq, sql, and, ne, or, gt } from 'drizzle-orm';
import { subHours } from 'date-fns';

export async function addAsset(data: { lotNumber: string, description: string, quantity: number, location: string, userId: string }) {
    return await db.insert(lots).values(data).returning();
}

export async function getRecentInventory(userId: string, limit: number = 10) {
    return await db.select().from(lots)
        .where(eq(lots.userId, userId))
        .orderBy(desc(lots.createdAt))
        .limit(limit);
}

export async function getDashboardStats(userId: string) {
    const [res] = await db.select({
        total: sql<number>`count(*)`,
        available: sql<number>`count(*) filter (where ${lots.status} = 'Available')`,
        allocated: sql<number>`count(*) filter (where ${lots.status} != 'Available' and ${lots.status} != 'Dispatched')`,
        Available: sql<number>`count(*) filter (where ${lots.status} = 'Available')`,
        Allocated: sql<number>`count(*) filter (where ${lots.status} = 'Allocated')`,
        Picked: sql<number>`count(*) filter (where ${lots.status} = 'Picked')`,
        On_Hold: sql<number>`count(*) filter (where ${lots.status} = 'On_Hold')`,
        Dispatched: sql<number>`count(*) filter (where ${lots.status} = 'Dispatched')`
    }).from(lots)
        .where(eq(lots.userId, userId));

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

export async function getFIFOAvailable(userId: string) {
    return await db.select().from(lots)
        .where(and(eq(lots.status, 'Available'), eq(lots.userId, userId)))
        .orderBy(asc(lots.createdAt));
}

export async function getAvailableLots(userId: string, limit: number = 50) {
    return await db.select({
        id: lots.id,
        lotNumber: lots.lotNumber,
        description: lots.description,
        status: lots.status
    })
        .from(lots)
        .where(and(eq(lots.status, 'Available'), eq(lots.userId, userId)))
        .orderBy(desc(lots.createdAt))
        .limit(limit);
}

export async function getActiveAllocations(userId: string, limit: number = 100) {
    const fourHoursAgo = subHours(new Date(), 4);

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
    })
        .from(allocations)
        .innerJoin(lots, eq(allocations.lotId, lots.id))
        .where(
            and(
                eq(lots.userId, userId),
                or(
                    ne(allocations.step, 'Dispatched'),
                    and(
                        eq(allocations.step, 'Dispatched'),
                        gt(allocations.createdAt, fourHoursAgo)
                    )
                )
            )
        )
        .orderBy(desc(allocations.createdAt))
        .limit(limit);
}

export async function createAllocation(orderId: string, lotId: string, quantity: number) {
    // 1. Create allocation record
    const [allocation] = await db.insert(allocations).values({
        orderId,
        lotId,
        quantity,
        allocationNumber: `ALLOC-${Date.now()}`,
        step: 'Allocated'
    }).returning();

    // 2. Update lot status
    await db.update(lots)
        .set({ status: 'Allocated' })
        .where(eq(lots.id, lotId));

    return allocation;
}

export async function updateAllocationStep(allocationId: string, step: 'Allocated' | 'Picked' | 'On_Hold' | 'Dispatched', userId: string) {
    // First verify the allocation belongs to the user
    const [existingAllocation] = await db.select()
        .from(allocations)
        .innerJoin(lots, eq(allocations.lotId, lots.id))
        .where(and(eq(allocations.id, allocationId), eq(lots.userId, userId)))
        .limit(1);

    if (!existingAllocation) {
        throw new Error('Allocation not found or unauthorized');
    }

    const [allocation] = await db.update(allocations)
        .set({ step })
        .where(eq(allocations.id, allocationId))
        .returning();

    // Sync asset status with allocation step
    await db.update(lots)
        .set({ status: step as any })
        .where(eq(lots.id, allocation.lotId));

    return allocation;
}

export async function deleteAsset(id: string, userId: string) {
    return await db.delete(lots).where(and(eq(lots.id, id), eq(lots.userId, userId)));
}

export async function returnAsset(allocationId: string, userId: string) {
    // First verify the allocation belongs to the user
    const [result] = await db.select()
        .from(allocations)
        .innerJoin(lots, eq(allocations.lotId, lots.id))
        .where(and(eq(allocations.id, allocationId), eq(lots.userId, userId)))
        .limit(1);

    if (!result) {
        throw new Error('Allocation not found or unauthorized');
    }

    const allocation = result.allocations;

    // 1. Reset lot status
    await db.update(lots)
        .set({ status: 'Available' })
        .where(eq(lots.id, allocation.lotId));

    // 2. Delete allocation
    await db.delete(allocations)
        .where(eq(allocations.id, allocationId));

    return { success: true };
}
