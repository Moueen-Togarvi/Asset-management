<script lang="ts">
    import { enhance } from "$app/forms";
    import { toastStore } from "$lib/toasts.svelte";
    let { data } = $props();
    let orderQty = $state(1);
    let boardContainer: HTMLElement;

    // Scroll Logic
    function scrollBoard(direction: "left" | "right") {
        if (!boardContainer) return;
        const scrollAmount = 300; // Approx card width + gap
        boardContainer.scrollBy({
            left: direction === "right" ? scrollAmount : -scrollAmount,
            behavior: "smooth",
        });
    }

    let optimisticUpdates = $state(new Map<string, string>());

    let processedColumns = $derived.by(() => {
        const groups: Record<string, any[]> = {
            Available: [],
            Allocated: [],
            Picked: [],
            On_Hold: [],
            Dispatched: [],
        };

        if (data.assets) {
            for (const a of data.assets) {
                const optStep = optimisticUpdates.get(a.id);
                if (a.status === "Available" && !optStep) {
                    groups.Available.push(a);
                }
            }
        }

        if (data.allocations) {
            for (const a of data.allocations) {
                const step = optimisticUpdates.get(a.id) || (a as any).step;
                if (groups[step]) groups[step].push(a);
            }
        }

        return [
            { id: 1, title: "1. Racks\n(Available)", items: groups.Available },
            { id: 2, title: "2. Allocated", items: groups.Allocated },
            { id: 3, title: "3. Picked", items: groups.Picked },
            { id: 4, title: "4. On Hold", items: groups.On_Hold },
            { id: 5, title: "5. Dispatched", items: groups.Dispatched },
        ];
    });
</script>

<div class="dispatch-board-container animate-fade-in">
    <header class="board-header">
        <div class="header-text">
            <h2>Dispatch Process Flow</h2>
            <p>Manage Allocation, Picking, and Dispatch workflows</p>
        </div>
        <div class="board-controls glass-card">
            <form
                method="POST"
                action="?/autoAllocate"
                use:enhance={() => {
                    return async ({ result, update }) => {
                        if (result.type === "success") {
                            toastStore.add(
                                `Allocated ${orderQty} assets via FIFO`,
                                "success",
                            );
                        } else {
                            toastStore.add(
                                "Allocation failed: Insufficient stock",
                                "error",
                            );
                        }
                        await update();
                    };
                }}
            >
                <div class="control-group">
                    <label for="qty">New Order Qty:</label>
                    <input
                        type="number"
                        name="qty"
                        id="qty"
                        bind:value={orderQty}
                        min="1"
                    />
                    <button type="submit" class="premium-btn auto-alloc-btn">
                        <span>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                class="lucide lucide-zap"
                                ><path
                                    d="M4 14.5 14 3 12 10.5 20 9.5 10 21l2-7.5Z"
                                /></svg
                            >
                        </span>
                        <span class="btn-text">Auto-Allocate (FIFO)</span>
                    </button>
                </div>
            </form>
        </div>
    </header>

    <div class="kanban-board" bind:this={boardContainer}>
        {#each processedColumns as column}
            <div class="column-wrapper">
                <div class="column-header">
                    <span class="column-title">{column.title}</span>
                    <span class="badge">{column.items.length}</span>
                </div>
                <div class="column-body glass-card">
                    {#each column.items as item}
                        <div class="item-card animate-fade-in">
                            {#if column.id === 1}
                                <div class="item-id">
                                    {(item as any).lotNumber}
                                </div>
                                <div class="item-desc">
                                    {(item as any).description}
                                </div>
                            {:else}
                                <div class="item-id">
                                    {(item as any).asset?.lotNumber}
                                </div>
                                <div class="item-desc">
                                    {(item as any).asset?.description}
                                </div>
                                <div class="alloc-badge">
                                    {(item as any).allocationNumber}
                                </div>
                            {/if}

                            <div class="item-actions">
                                {#if column.id === 2}
                                    <form
                                        method="POST"
                                        action="?/pickAndSync"
                                        use:enhance={() => {
                                            optimisticUpdates.set(
                                                item.id,
                                                "Picked",
                                            );
                                            return async ({
                                                result,
                                                update,
                                            }) => {
                                                if (result.type === "success") {
                                                    toastStore.add(
                                                        "Asset picked and synced to NetSuite",
                                                        "success",
                                                    );
                                                } else {
                                                    toastStore.add(
                                                        "NetSuite sync failed",
                                                        "error",
                                                    );
                                                }
                                                optimisticUpdates.delete(
                                                    item.id,
                                                );
                                                await update();
                                            };
                                        }}
                                    >
                                        <input
                                            type="hidden"
                                            name="allocationId"
                                            value={item.id}
                                        />
                                        <button
                                            type="submit"
                                            class="premium-btn action-btn pick"
                                            >Pick & Sync</button
                                        >
                                    </form>
                                {:else if column.id === 3}
                                    <div class="btn-group">
                                        <form
                                            method="POST"
                                            action="?/updateStep"
                                            use:enhance={() => {
                                                optimisticUpdates.set(
                                                    item.id,
                                                    "Dispatched",
                                                );
                                                return async ({
                                                    result,
                                                    update,
                                                }) => {
                                                    if (
                                                        result.type ===
                                                        "success"
                                                    ) {
                                                        toastStore.add(
                                                            "Order dispatched successfully",
                                                            "success",
                                                        );
                                                    }
                                                    optimisticUpdates.delete(
                                                        item.id,
                                                    );
                                                    await update();
                                                };
                                            }}
                                        >
                                            <input
                                                type="hidden"
                                                name="allocationId"
                                                value={item.id}
                                            />
                                            <input
                                                type="hidden"
                                                name="step"
                                                value="Dispatched"
                                            />
                                            <button
                                                type="submit"
                                                class="premium-btn action-btn approve"
                                                >Approve</button
                                            >
                                        </form>
                                        <form
                                            method="POST"
                                            action="?/updateStep"
                                            use:enhance={() => {
                                                optimisticUpdates.set(
                                                    item.id,
                                                    "On_Hold",
                                                );
                                                return async ({
                                                    result,
                                                    update,
                                                }) => {
                                                    if (
                                                        result.type ===
                                                        "success"
                                                    ) {
                                                        toastStore.add(
                                                            "Asset placed on hold",
                                                            "warning",
                                                        );
                                                    }
                                                    optimisticUpdates.delete(
                                                        item.id,
                                                    );
                                                    await update();
                                                };
                                            }}
                                        >
                                            <input
                                                type="hidden"
                                                name="allocationId"
                                                value={item.id}
                                            />
                                            <input
                                                type="hidden"
                                                name="step"
                                                value="On_Hold"
                                            />
                                            <button
                                                type="submit"
                                                class="premium-btn action-btn hold"
                                                >Hold</button
                                            >
                                        </form>
                                    </div>
                                {:else if column.id === 4}
                                    <div class="btn-group">
                                        <form
                                            method="POST"
                                            action="?/updateStep"
                                            use:enhance={() => {
                                                optimisticUpdates.set(
                                                    item.id,
                                                    "Picked",
                                                );
                                                return async ({
                                                    result,
                                                    update,
                                                }) => {
                                                    if (
                                                        result.type ===
                                                        "success"
                                                    ) {
                                                        toastStore.add(
                                                            "Moved back to Picked stage",
                                                            "success",
                                                        );
                                                    }
                                                    optimisticUpdates.delete(
                                                        item.id,
                                                    );
                                                    await update();
                                                };
                                            }}
                                        >
                                            <input
                                                type="hidden"
                                                name="allocationId"
                                                value={item.id}
                                            />
                                            <input
                                                type="hidden"
                                                name="step"
                                                value="Picked"
                                            />
                                            <button
                                                type="submit"
                                                class="premium-btn action-btn retry-btn"
                                                >Retry</button
                                            >
                                        </form>
                                        <form
                                            method="POST"
                                            action="?/returnAsset"
                                            use:enhance={() => {
                                                optimisticUpdates.set(
                                                    item.id,
                                                    "Available",
                                                );
                                                return async ({
                                                    result,
                                                    update,
                                                }) => {
                                                    if (
                                                        result.type ===
                                                        "success"
                                                    ) {
                                                        toastStore.add(
                                                            "Asset returned to inventory",
                                                            "info",
                                                        );
                                                    }
                                                    optimisticUpdates.delete(
                                                        item.id,
                                                    );
                                                    await update();
                                                };
                                            }}
                                        >
                                            <input
                                                type="hidden"
                                                name="allocationId"
                                                value={item.id}
                                            />
                                            <button
                                                type="submit"
                                                class="premium-btn action-btn return-btn"
                                                >Return</button
                                            >
                                        </form>
                                    </div>
                                {:else if column.id === 5}
                                    <form
                                        method="POST"
                                        action="?/returnAsset"
                                        use:enhance={() => {
                                            optimisticUpdates.set(
                                                item.id,
                                                "Available",
                                            );
                                            return async ({
                                                result,
                                                update,
                                            }) => {
                                                if (result.type === "success") {
                                                    toastStore.add(
                                                        "Asset returned to inventory",
                                                        "info",
                                                    );
                                                }
                                                optimisticUpdates.delete(
                                                    item.id,
                                                );
                                                await update();
                                            };
                                        }}
                                    >
                                        <input
                                            type="hidden"
                                            name="allocationId"
                                            value={item.id}
                                        />
                                        <button
                                            type="submit"
                                            class="premium-btn action-btn return-btn"
                                            >Return to Stock</button
                                        >
                                    </form>
                                {/if}
                            </div>
                        </div>
                    {/each}
                </div>
            </div>
        {/each}
    </div>

    <!-- Mobile Navigation Arrows -->
    <div class="mobile-nav-controls">
        <button
            class="nav-arrow left"
            onclick={() => scrollBoard("left")}
            aria-label="Scroll Left"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-chevron-left"
                ><path d="m15 18-6-6 6-6" /></svg
            >
        </button>
        <button
            class="nav-arrow right"
            onclick={() => scrollBoard("right")}
            aria-label="Scroll Right"
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-chevron-right"
                ><path d="m9 18 6-6-6-6" /></svg
            >
        </button>
    </div>
</div>

<style>
    .dispatch-board-container {
        display: flex;
        flex-direction: column;
        gap: 2rem;
    }

    .board-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .header-text h2 {
        font-size: 1.75rem;
        color: var(--text-main);
    }
    .header-text p {
        color: #334155;
        font-size: 0.875rem;
        font-weight: 500;
    }

    .board-controls {
        padding: 0.75rem 1.5rem;
    }

    .control-group {
        display: flex;
        align-items: center;
        gap: 1.5rem;
        font-size: 0.875rem;
        font-weight: 500;
    }

    .control-group input {
        width: 60px;
        padding: 6px 10px;
        border-radius: 8px;
        border: 1px solid #000000;
        background: white;
    }

    .auto-alloc-btn {
        background: #6366f1;
        color: white;
    }
    .auto-alloc-btn:hover {
        background: #4f46e5;
    }

    .kanban-board {
        display: flex;
        gap: 1rem;
        min-height: 70vh;
        width: 100%;
        overflow-x: auto;
        padding-bottom: 1rem; /* Spacing for scrollbar/arrows */
        scroll-behavior: smooth;
        position: relative;
    }

    .column-wrapper {
        flex: 1 1 0px;
        min-width: 180px;
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .column-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.5rem 0.75rem;
        margin-bottom: 0.5rem;
        min-height: 3.5rem; /* Ensure consistent height for alignment */
        align-items: flex-start; /* Align to top to handle wrapping */
    }

    .column-title {
        font-size: 0.85rem;
        font-weight: 800;
        color: #000000;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        line-height: 1.2;
        max-width: 80%; /* Prevent overlapping with badge */
    }

    .badge {
        background: #f1f5f9;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        font-size: 0.75rem;
        font-weight: 800;
        color: #0f172a;
        border: 1px solid #e2e8f0;
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    }

    .column-body {
        flex: 1;
        background: rgba(0, 0, 0, 0.02);
        padding: 0.35rem;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        border-radius: var(--radius-lg);
    }

    .item-card {
        background: white;
        padding: 0.5rem 0.65rem;
        border-radius: 8px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
        border: 1px solid rgba(0, 0, 0, 0.25);
        display: flex;
        flex-direction: column;
        gap: 0.2rem;
        transition: transform 0.2s ease;
    }

    .item-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    }

    .item-id {
        font-weight: 700;
        color: #000000;
        font-size: 0.8rem;
    }
    .item-desc {
        color: #334155;
        font-size: 0.75rem;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .alloc-badge {
        background: #f8fafc;
        color: #0f172a;
        font-family: inherit;
        font-weight: 800;
        font-size: 0.65rem;
        padding: 3px 8px;
        border-radius: 6px;
        width: fit-content;
        border: 1px solid #e2e8f0;
        letter-spacing: 0.02em;
        margin-top: 0.2rem;
    }

    .item-actions {
        margin-top: 0.5rem;
        display: flex;
        width: 100%;
    }

    .item-actions form {
        width: 100%;
    }

    .action-btn {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 0.75rem;
        padding: 8px 12px;
        border-radius: 6px;
        font-weight: 700;
        white-space: nowrap;
    }

    .pick {
        background: #2563eb;
        color: white;
        border: none;
        box-shadow: 0 2px 4px rgba(37, 99, 235, 0.2);
    }
    .pick:hover {
        background: #1d4ed8;
        transform: scale(1.02);
    }

    .approve {
        background: #10b981;
        color: white;
        border: none;
        box-shadow: 0 2px 4px rgba(16, 185, 129, 0.2);
    }
    .approve:hover {
        background: #059669;
        transform: scale(1.02);
    }

    .hold {
        background: #ef4444;
        color: white;
        border: none;
        box-shadow: 0 2px 4px rgba(239, 68, 68, 0.2);
    }
    .hold:hover {
        background: #dc2626;
        transform: scale(1.02);
    }

    .return-btn {
        background: #64748b;
        color: white;
        border: none;
    }
    .return-btn:hover {
        background: #475569;
    }

    .retry-btn {
        background: #f59e0b;
        color: white;
        border: none;
    }
    .retry-btn:hover {
        background: #d97706;
    }

    .return-btn:hover {
        background: #e2e8f0;
    }

    .btn-group {
        margin-top: 0.5rem;
        display: flex;
        justify-content: space-between;
        gap: 0.5rem;
        width: 100%;
    }
    .btn-group form {
        flex: 1;
        display: flex;
    }

    .column-wrapper:nth-child(1) .column-body {
        background: #e1fdf080; /* Light Green */
    }
    .column-wrapper:nth-child(2) .column-body {
        background: #eff6ff80; /* Light Blue */
    }
    .column-wrapper:nth-child(3) .column-body {
        background: #fefce880; /* Light Yellow */
    }
    .column-wrapper:nth-child(4) .column-body {
        background: #fef2f280; /* Light Red */
    }
    @media (max-width: 1200px) {
        .kanban-board {
            overflow-x: auto;
            padding-bottom: 2rem;
            -webkit-overflow-scrolling: touch;
            display: flex;
            gap: 0.5rem; /* Tighter gap */
        }
        .column-wrapper {
            flex: 0 0 calc(50% - 0.5rem); /* Exactly 2 columns */
            min-width: 155px;
        }
    }

    @media (max-width: 768px) {
        .app-container {
            padding: 0.5rem;
        }
        .board-header {
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            gap: 0.5rem;
            padding: 0.5rem;
            margin-bottom: 0.5rem;
            flex-wrap: nowrap; /* Prevent wrapping */
        }
        .board-controls {
            width: auto;
            flex-grow: 0;
            display: flex;
            justify-content: flex-end;
            padding: 0.25rem 0.5rem; /* Compact padding */
            border: 1px solid rgba(0, 0, 0, 0.1); /* Subtle border for definition */
        }
        .control-group {
            gap: 0.5rem;
            align-items: center;
            width: 100%;
        }
        .control-group label {
            display: none; /* Hide label on mobile to save space */
        }
        .control-group input {
            width: 50px;
            padding: 4px 8px;
            font-size: 0.75rem;
            height: 32px;
        }
        .auto-alloc-btn {
            padding: 0 8px;
            font-size: 0.75rem;
            height: 32px;
            white-space: nowrap;
        }
        .auto-alloc-btn .btn-text {
            display: none;
        }
        .auto-alloc-btn::after {
            content: "Allocate";
        }
        .header-text h2 {
            font-size: 1rem;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .header-text p {
            display: none;
        }
    }

    @media (max-width: 480px) {
        .column-wrapper {
            flex: 0 0 calc(50% - 0.25rem);
            min-width: 145px;
        }
        .board-header {
            padding: 0.5rem;
        }
        .header-text h2 {
            font-size: 0.9rem; /* Even smaller on tiny screens */
            max-width: 120px; /* Allow truncation */
        }
    }

    /* Mobile Nav Controls */
    .mobile-nav-controls {
        display: none; /* Hidden on desktop by default */
        position: fixed;
        bottom: 2rem;
        right: 1rem;
        gap: 0.5rem;
        z-index: 50;
    }

    .nav-arrow {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background: #0f172a;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        border: 2px solid rgba(255, 255, 255, 0.1);
        cursor: pointer;
        opacity: 0.9;
        transition:
            transform 0.2s ease,
            opacity 0.2s;
    }

    .nav-arrow:active {
        transform: scale(0.95);
    }
    .nav-arrow:hover {
        opacity: 1;
        background: black;
    }

    @media (max-width: 1024px) {
        .mobile-nav-controls {
            display: flex; /* Show on tablets and mobile */
        }
    }
</style>
