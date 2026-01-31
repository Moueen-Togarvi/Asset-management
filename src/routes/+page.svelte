<script lang="ts">
    import { onMount } from "svelte";
    import { enhance } from "$app/forms";
    import { toastStore } from "$lib/toasts.svelte";

    let { data } = $props();

    let tableWrapper: HTMLElement;

    function scrollTable(direction: "left" | "right") {
        if (!tableWrapper) return;
        const scrollAmount = 300;
        tableWrapper.scrollBy({
            left: direction === "right" ? scrollAmount : -scrollAmount,
            behavior: "smooth",
        });
    }

    const STATUS_DISPLAY: Record<string, string> = {
        On_Hold: "On Hold",
        Dispatched: "Out",
    };

    let stats = $derived([
        {
            label: "Total Assets",
            value: data.stats.totalAssets,
            icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-package"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>`,
            color: "var(--primary)",
        },
        {
            label: "In Stock / Available",
            value: data.stats.availableAssets,
            icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check-circle-2"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>`,
            color: "var(--success)",
        },
        {
            label: "Allocated / Out",
            value: data.stats.allocatedAssets,
            icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-up-right"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>`,
            color: "var(--warning)",
        },
    ]);

    let recentAssets = $derived(data.assets.slice(0, 10));

    let availablePct = $derived(
        (data.stats.availableAssets / (data.stats.totalAssets || 1)) * 100,
    );

    let hoveredStat = $state<{ label: string; value: number } | null>(null);

    let showDeleteModal = $state(false);
    let assetToDelete = $state<{ id: string; lotNumber: string } | null>(null);

    function triggerDelete(id: string, lotNumber: string) {
        assetToDelete = { id, lotNumber };
        showDeleteModal = true;
    }

    function cancelDelete() {
        showDeleteModal = false;
        assetToDelete = null;
    }

    onMount(() => {});
</script>

<div class="dashboard gap-4">
    <div class="stats-grid">
        {#each stats as stat}
            <div
                class="glass-card stat-card animate-fade-in"
                style="--accent-color: {stat.color}"
            >
                <div class="stat-info">
                    <span class="stat-label">{stat.label}</span>
                    <span class="stat-value">{stat.value}</span>
                </div>
                <div class="stat-icon-wrapper" style="color: {stat.color}">
                    {@html stat.icon}
                </div>
                <div class="stat-line"></div>
            </div>
        {/each}
    </div>

    <div class="main-grid">
        <div class="glass-card chart-container animate-fade-in">
            <h3>Inventory Status</h3>
            <div class="donut-chart-wrapper">
                <div class="donut-chart">
                    <svg
                        viewBox="0 0 100 100"
                        role="img"
                        aria-label="Inventory Status Distribution"
                    >
                        <!-- Allocated (Background) -->
                        <circle
                            cx="50"
                            cy="50"
                            r="40"
                            fill="none"
                            stroke="#2563eb"
                            stroke-width="12"
                            class="chart-bg"
                            role="button"
                            tabindex="0"
                            aria-label="In Use Segment"
                            onmouseenter={() =>
                                (hoveredStat = {
                                    label: "In Use",
                                    value: data.stats.allocatedAssets,
                                })}
                            onmouseleave={() => (hoveredStat = null)}
                            onfocus={() =>
                                (hoveredStat = {
                                    label: "In Use",
                                    value: data.stats.allocatedAssets,
                                })}
                            onblur={() => (hoveredStat = null)}
                        />
                        <!-- Available (Overlay) -->
                        <circle
                            cx="50"
                            cy="50"
                            r="40"
                            fill="none"
                            stroke="var(--success)"
                            stroke-width="12"
                            stroke-dasharray="251.32"
                            stroke-dashoffset={251.32 *
                                (1 - availablePct / 100)}
                            transform="rotate(-90 50 50)"
                            class="chart-segment"
                            role="button"
                            tabindex="0"
                            aria-label="Available Segment"
                            onmouseenter={() =>
                                (hoveredStat = {
                                    label: "Available",
                                    value: data.stats.availableAssets,
                                })}
                            onmouseleave={() => (hoveredStat = null)}
                            onfocus={() =>
                                (hoveredStat = {
                                    label: "Available",
                                    value: data.stats.availableAssets,
                                })}
                            onblur={() => (hoveredStat = null)}
                        />
                    </svg>
                    <div class="donut-center">
                        <span class="total"
                            >{hoveredStat
                                ? hoveredStat.value
                                : data.stats.totalAssets}</span
                        >
                        <span class="label"
                            >{hoveredStat ? hoveredStat.label : "Total"}</span
                        >
                    </div>
                </div>
                <div class="chart-legend">
                    <div
                        class="legend-item"
                        role="button"
                        tabindex="0"
                        onmouseenter={() =>
                            (hoveredStat = {
                                label: "Available",
                                value: data.stats.availableAssets,
                            })}
                        onmouseleave={() => (hoveredStat = null)}
                        onfocus={() =>
                            (hoveredStat = {
                                label: "Available",
                                value: data.stats.availableAssets,
                            })}
                        onblur={() => (hoveredStat = null)}
                    >
                        <span class="dot available"></span>
                        <span class="legend-label">Available</span>
                        <span class="legend-count"
                            >{data.stats.availableAssets}</span
                        >
                    </div>
                    <div
                        class="legend-item"
                        role="button"
                        tabindex="0"
                        onmouseenter={() =>
                            (hoveredStat = {
                                label: "In Use",
                                value: data.stats.allocatedAssets,
                            })}
                        onmouseleave={() => (hoveredStat = null)}
                        onfocus={() =>
                            (hoveredStat = {
                                label: "In Use",
                                value: data.stats.allocatedAssets,
                            })}
                        onblur={() => (hoveredStat = null)}
                    >
                        <span class="dot allocated"></span>
                        <span class="legend-label">In Use</span>
                        <span class="legend-count"
                            >{data.stats.allocatedAssets}</span
                        >
                    </div>
                </div>
            </div>
        </div>

        <div class="glass-card quick-add animate-fade-in">
            <h3>Quick Add Asset</h3>
            <form
                class="quick-form"
                method="POST"
                action="?/addAsset"
                use:enhance={() => {
                    return async ({ result, update }) => {
                        if (result.type === "success") {
                            toastStore.add(
                                "Asset added successfully",
                                "success",
                            );
                        } else {
                            const message =
                                (result as any).data?.message ||
                                "Failed to add asset";
                            toastStore.add(message, "error");
                        }
                        await update();
                    };
                }}
            >
                <div class="input-group">
                    <label for="desc">Description</label>
                    <div class="input-wrapper">
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
                            class="input-icon"
                            ><path d="M12 20h9" /><path
                                d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"
                            /></svg
                        >
                        <input
                            type="text"
                            name="description"
                            id="desc"
                            placeholder="e.g. MRI Controller"
                            required
                        />
                    </div>
                </div>

                <div class="form-row">
                    <div class="input-group">
                        <label for="serial">Serial Number</label>
                        <div class="input-wrapper">
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
                                class="input-icon"
                                ><path
                                    d="M3 5v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2z"
                                /><path d="M7 7h10" /><path d="M7 12h10" /><path
                                    d="M7 17h10"
                                /></svg
                            >
                            <input
                                type="text"
                                name="lotNumber"
                                id="serial"
                                placeholder="SN-2024-..."
                                required
                            />
                        </div>
                    </div>
                    <div class="input-group">
                        <label for="location">Location</label>
                        <div class="input-wrapper">
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
                                class="input-icon"
                                ><path
                                    d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"
                                /><circle cx="12" cy="10" r="3" /></svg
                            >
                            <input
                                type="text"
                                name="location"
                                id="location"
                                placeholder="e.g. Warehouse-A"
                                required
                            />
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    class="premium-btn premium-btn-primary full-width"
                >
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
                        class="lucide lucide-plus-circle"
                        ><circle cx="12" cy="12" r="10" /><path
                            d="M8 12h8"
                        /><path d="M12 8v8" /></svg
                    >
                    Add New Asset
                </button>
            </form>
        </div>
    </div>

    <div class="glass-card table-section animate-fade-in">
        <div class="table-header">
            <h3>All Assets</h3>
            <button class="refresh-btn">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="lucide lucide-rotate-ccw"
                    ><path
                        d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"
                    /><path d="M3 3v5h5" /></svg
                >
                Refresh
            </button>
        </div>
        <div class="table-wrapper" bind:this={tableWrapper}>
            <table>
                <thead>
                    <tr>
                        <th style="width: 120px;">SERIAL</th>
                        <th>DESCRIPTION</th>
                        <th style="text-align: center; width: 140px;">STATUS</th
                        >
                        <th style="text-align: center;">LOCATION</th>
                        <th style="text-align: center; width: 80px;">ACTION</th>
                    </tr>
                </thead>
                <tbody>
                    {#each recentAssets as asset}
                        <tr>
                            <td class="serial">{asset.lotNumber}</td>
                            <td>{asset.description}</td>
                            <td>
                                <span
                                    class="status-pill {(
                                        STATUS_DISPLAY[asset.status] ||
                                        asset.status
                                    )
                                        .toLowerCase()
                                        .replace(/\s+/g, '-')}"
                                >
                                    {STATUS_DISPLAY[asset.status] ||
                                        asset.status}
                                </span>
                            </td>
                            <td class="location">{asset.location}</td>
                            <td>
                                <button
                                    class="action-btn delete"
                                    onclick={() =>
                                        triggerDelete(
                                            asset.id,
                                            asset.lotNumber,
                                        )}
                                    aria-label="Delete asset"
                                >
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
                                        class="lucide lucide-trash-2"
                                        ><path d="M3 6h18" /><path
                                            d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"
                                        /><path
                                            d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"
                                        /><line
                                            x1="10"
                                            y1="11"
                                            x2="10"
                                            y2="17"
                                        /><line
                                            x1="14"
                                            y1="11"
                                            x2="14"
                                            y2="17"
                                        /></svg
                                    >
                                </button>
                            </td>
                        </tr>
                    {:else}
                        <tr>
                            <td colspan="5">
                                <div class="empty-state">
                                    <div class="empty-icon">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="48"
                                            height="48"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            stroke-width="1.5"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            class="lucide lucide-package-open"
                                            ><path d="M12 22v-9" /><path
                                                d="M15.17 2.21a2 2 0 0 1 2.48 2.48L20 12v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2l2.35-7.31a2 2 0 0 1 2.48-2.48Z"
                                            /><path d="M3.5 12h17" /><path
                                                d="m5.5 16-1.5 5h16l-1.5-5"
                                            /></svg
                                        >
                                    </div>
                                    <h4>No Assets Found</h4>
                                    <p>
                                        Start managing your inventory by adding
                                        your first asset above.
                                    </p>
                                </div>
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>

        <!-- Mobile Navigation Arrows (Inside Table Section) -->
        <div class="mobile-nav-controls">
            <button
                class="nav-arrow left"
                onclick={() => scrollTable("left")}
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
                onclick={() => scrollTable("right")}
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
</div>

{#if showDeleteModal}
    <div
        class="modal-overlay animate-fade-in"
        onclick={cancelDelete}
        onkeydown={(e) => e.key === "Escape" && cancelDelete()}
        role="button"
        tabindex="-1"
        aria-label="Close modal"
    >
        <div
            class="glass-card modal-content"
            onclick={(e) => e.stopPropagation()}
            onkeydown={(e) => e.stopPropagation()}
            role="presentation"
        >
            <div class="modal-header">
                <h3>Confirm Deletion</h3>
                <button class="close-btn" onclick={cancelDelete}>&times;</button
                >
            </div>
            <div class="modal-body">
                <p>
                    Are you sure you want to delete asset <strong
                        >{assetToDelete?.lotNumber}</strong
                    >? This action cannot be undone.
                </p>
            </div>
            <div class="modal-footer">
                <button class="premium-btn cancel-btn" onclick={cancelDelete}
                    >Cancel</button
                >
                <form
                    method="POST"
                    action="?/deleteAsset"
                    use:enhance={() => {
                        showDeleteModal = false;
                        return async ({ result, update }) => {
                            if (result.type === "success") {
                                toastStore.add(
                                    "Asset deleted successfully",
                                    "success",
                                );
                            } else {
                                const message =
                                    (result as any).data?.message ||
                                    "Failed to delete asset";
                                toastStore.add(message, "error");
                            }
                            await update();
                        };
                    }}
                >
                    <input type="hidden" name="id" value={assetToDelete?.id} />
                    <button type="submit" class="premium-btn delete-confirm-btn"
                        >Delete Asset</button
                    >
                </form>
            </div>
        </div>
    </div>
{/if}

<style>
    .dashboard {
        display: flex;
        flex-direction: column;
        gap: 2rem;
    }

    .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 1.5rem;
    }

    .stat-card {
        padding: 1rem 1.5rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: relative;
        overflow: hidden;
        transition:
            transform 0.2s ease,
            box-shadow 0.2s ease;
    }

    .stat-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 12px 24px -10px rgba(0, 0, 0, 0.1);
    }

    .stat-info {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        z-index: 2;
    }

    .stat-label {
        color: var(--text-muted);
        font-size: 0.9rem;
        font-weight: 600;
        letter-spacing: 0.01em;
    }

    .stat-value {
        font-size: 2.25rem;
        font-weight: 800;
        color: var(--text-main);
        line-height: 1;
    }

    .stat-icon-wrapper {
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: color-mix(in srgb, var(--accent-color) 10%, transparent);
        color: var(--accent-color);
        border-radius: 10px;
        z-index: 2;
    }

    .stat-line {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: var(--accent-color);
    }

    .stat-progress {
        height: 4px;
        background: rgba(0, 0, 0, 0.05);
        border-radius: 2px;
        overflow: hidden;
    }

    .stat-progress-bar {
        height: 100%;
        border-radius: 2px;
    }

    .main-grid {
        display: grid;
        grid-template-columns: 1fr 2fr;
        gap: 1.5rem;
    }

    .chart-container,
    .quick-add {
        padding: 0.75rem 1.25rem;
        display: flex;
        flex-direction: column;
    }

    .donut-chart-wrapper {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        gap: 2rem;
        margin-top: 1rem;
        flex: 1; /* Take up all available vertical space */
    }

    .donut-chart {
        width: 130px;
        height: 130px;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .donut-chart svg {
        width: 100%;
        height: 100%;
        transform: rotate(0deg);
        filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.05));
    }

    .chart-segment,
    .chart-bg {
        transition:
            stroke-width 0.3s ease,
            stroke-dashoffset 0.5s ease,
            opacity 0.2s ease;
        cursor: pointer;
    }

    .chart-segment:hover,
    .chart-bg:hover {
        stroke-width: 15;
    }

    .donut-center {
        position: absolute;
        width: 85px;
        height: 85px;
        background: white;
        border-radius: 50%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.05);
        z-index: 10;
        pointer-events: none;
        transition: transform 0.2s ease;
    }

    .donut-center .total {
        font-size: 2.25rem;
        font-weight: 800;
        color: var(--text-main);
        line-height: 1;
        transition: all 0.2s ease;
    }

    .donut-center .label {
        font-size: 0.75rem;
        color: var(--text-muted);
        text-transform: uppercase;
        letter-spacing: 0.1em;
        font-weight: 800;
        margin-top: 2px;
    }

    .chart-legend {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        padding-left: 0.5rem;
    }

    .legend-item {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        font-size: 0.95rem;
        font-weight: 700;
        color: var(--text-muted);
        cursor: pointer;
        transition: all 0.2s ease;
        padding: 4px 12px;
        border-radius: 8px;
    }

    .legend-item:hover {
        color: var(--text-main);
        background: rgba(0, 0, 0, 0.02);
    }

    .dot {
        width: 12px;
        height: 12px;
        border-radius: 50%;
    }

    .dot.available {
        background: var(--success);
        box-shadow: 0 0 0 4px
            color-mix(in srgb, var(--success) 15%, transparent);
    }
    .dot.allocated {
        background: #2563eb;
        box-shadow: 0 0 0 4px color-mix(in srgb, #2563eb 15%, transparent);
    }

    .quick-form {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        margin-top: 0.75rem;
        justify-content: center;
        flex: 1;
    }

    .input-group {
        display: flex;
        flex-direction: column;
        gap: 0.35rem;
    }

    .input-group label {
        font-size: 0.8rem;
        font-weight: 600;
        color: var(--text-muted);
    }

    .input-group input {
        width: 100%;
        padding: 0.75rem 1rem 0.75rem 2.8rem;
        border-radius: var(--radius-md);
        border: 1px solid #000000;
        background: rgba(255, 255, 255, 0.8);
        transition: var(--transition);
        font-size: 0.95rem;
        color: var(--text-main);
    }

    .input-group input::placeholder {
        color: #64748b; /* Slate 500 - High Contrast */
        opacity: 1;
    }

    .input-wrapper {
        position: relative;
        display: flex;
        align-items: center;
    }

    .input-icon {
        position: absolute;
        left: 1rem;
        color: var(--primary);
        opacity: 0.7;
        pointer-events: none;
    }

    .input-group input:focus {
        outline: none;
        border-color: var(--primary);
        background: white;
        box-shadow: 0 0 0 4px var(--primary-glow);
    }

    .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1.25rem;
    }

    .full-width {
        width: fit-content;
        min-width: 180px;
        align-self: flex-end;
        margin-top: 0.5rem;
        justify-content: center;
    }

    .legend-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.85rem;
        font-weight: 600;
        color: var(--text-muted);
        padding: 4px 8px;
        border-radius: 8px;
        transition: all 0.2s ease;
        cursor: pointer;
    }

    .legend-label {
        flex: 1;
    }

    .legend-count {
        background: rgba(0, 0, 0, 0.04);
        padding: 1px 6px;
        border-radius: 4px;
        font-size: 0.75rem;
        color: var(--text-main);
    }

    /* Responsiveness Updates */
    @media (max-width: 1024px) {
        .stats-grid {
            grid-template-columns: repeat(2, 1fr);
        }
        .main-grid {
            grid-template-columns: 1fr;
        }
    }

    @media (max-width: 768px) {
        .stats-grid {
            grid-template-columns: repeat(3, 1fr); /* Force 3 columns */
            gap: 0.5rem; /* Tighter gap */
        }
        .stat-card {
            padding: 0.5rem 0.25rem;
            flex-direction: column;
            align-items: center;
            text-align: center;
            gap: 0;
            position: relative;
            min-height: 80px;
            justify-content: flex-start; /* Move text to top */
            padding-top: 0.75rem;
        }
        .stat-info {
            align-items: center;
            gap: 0.1rem;
            width: 100%;
        }
        .stat-label {
            font-size: 0.55rem; /* Even smaller to fit */
            line-height: 1;
            white-space: nowrap; /* Force single line */
            color: #0f172a;
            font-weight: 800;
            letter-spacing: -0.5px; /* Squeeze text */
            max-width: 100%;
            overflow: hidden;
            text-overflow: ellipsis; /* Just in case */
        }
        .stat-value {
            font-size: 1.25rem;
            margin-top: 0.5rem;
            margin-bottom: 0.25rem;
            z-index: 2;
        }
        .stat-icon-wrapper {
            position: absolute;
            bottom: 4px;
            right: 4px;
            width: 20px; /* Smaller */
            height: 20px;
            margin: 0;
            opacity: 0.8;
            background: transparent; /* Remove bg to be cleaner in corner */
        }
        .stat-icon-wrapper :global(svg) {
            width: 14px; /* Keep icon visible */
            height: 14px;
        }
        /* Re-order for column layout: Icon top ?? Or keep side by side but smaller? 
           User said "aik line mn teno ko lao". Column flex inside card is safest for narrow width.
        */

        .donut-chart-wrapper {
            flex-direction: column;
            gap: 1rem;
        }
        .chart-legend {
            width: 100%;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 0.5rem;
        }
        .stat-card {
            padding: 1rem;
        }
    }

    @media (max-width: 480px) {
        .chart-legend {
            grid-template-columns: 1fr;
        }
        .full-width {
            width: 100%;
        }
        .form-row {
            grid-template-columns: 1fr;
        }
    }

    .empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 4rem 2rem;
        text-align: center;
        color: var(--text-muted);
    }

    .empty-icon {
        margin-bottom: 1.5rem;
        color: var(--primary);
        opacity: 0.4;
    }

    .empty-state h4 {
        margin-bottom: 0.5rem;
        color: var(--text-main);
        font-weight: 600;
    }

    .empty-state p {
        font-size: 0.9rem;
        max-width: 300px;
    }

    .table-section {
        padding: 1.5rem;
    }

    .table-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1.5rem;
    }

    .table-wrapper {
        overflow-x: auto;
    }

    table {
        width: 100%;
        border-collapse: collapse;
    }

    th {
        text-align: left;
        padding: 1rem;
        color: #000000;
        font-size: 0.7rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        border-bottom: 1px solid rgba(0, 0, 0, 0.06);
        background: #f8fafc; /* Subtle header background */
    }

    td {
        padding: 1rem;
        border-bottom: 1px solid rgba(0, 0, 0, 0.2); /* Higher contrast border */
        color: var(--text-main);
        font-size: 0.9rem;
    }

    tr:last-child td {
        border-bottom: none;
    }

    tr {
        transition: background-color 0.2s ease;
    }

    tr:hover {
        background-color: #f8fafc;
    }

    /* Column Specifics */
    td:nth-child(3),
    td:nth-child(4),
    td:nth-child(5) {
        text-align: center;
    }

    .serial {
        font-family: inherit;
        font-weight: 700;
        color: var(--text-main);
    }

    .status-pill {
        padding: 4px 12px;
        border-radius: 20px;
        font-size: 0.75rem;
        font-weight: 600;
    }

    .status-pill.available {
        background: #ecfdf5;
        color: #059669;
        border: 1px solid #d1fae5;
    }
    .status-pill.allocated {
        background: #eff6ff;
        color: #2563eb;
        border: 1px solid #dbeafe;
    }
    .status-pill.picked {
        background: #fffbeb;
        color: #d97706;
        border: 1px solid #fef3c7;
    }
    .status-pill.on-hold {
        background: #fef2f2;
        color: #991b1b;
        border: 1px solid #fee2e2;
    }
    .status-pill.out,
    .status-pill.dispatched {
        background: #f1f5f9;
        color: #475569;
        border: 1px solid #e2e8f0;
    }

    .serial {
        font-family: monospace;
        font-weight: 600;
    }

    .action-btn {
        padding: 6px;
        border-radius: 6px;
        opacity: 0.6;
    }

    .action-btn:hover {
        opacity: 1;
        background: rgba(0, 0, 0, 0.05);
    }
    .action-btn.delete {
        color: var(--error);
    }
    .action-btn.delete:hover {
        background: #fef2f2;
        transform: scale(1.1);
    }

    /* Modal Styling */
    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.4);
        backdrop-filter: blur(4px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        padding: 1.5rem;
    }

    .modal-content {
        max-width: 450px;
        width: 100%;
        padding: 2rem;
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        background: white;
    }

    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .close-btn {
        font-size: 1.5rem;
        color: var(--text-muted);
        line-height: 1;
    }

    .modal-body p {
        color: var(--text-muted);
        font-size: 0.95rem;
    }

    .modal-footer {
        display: flex;
        justify-content: flex-end;
        gap: 1rem;
        margin-top: 0.5rem;
    }

    .cancel-btn {
        background: #f1f5f9;
        color: var(--text-main);
    }

    .delete-confirm-btn {
        background: var(--error);
        color: white;
    }

    .delete-confirm-btn:hover {
        filter: brightness(1.1);
        transform: scale(1.02);
    }

    /* Mobile Nav Controls */
    .table-section {
        position: relative; /* Context for arrows */
    }

    .mobile-nav-controls {
        display: none; /* Hidden on desktop by default */
        position: absolute;
        bottom: 0.5rem; /* Move down slightly */
        right: 1rem;
        gap: 0.5rem;
        z-index: 10;
    }

    .nav-arrow {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background: rgba(15, 23, 42, 0.85); /* Reduced bg opacity */
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
