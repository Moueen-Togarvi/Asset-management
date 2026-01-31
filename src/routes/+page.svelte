<script lang="ts">
    import { onMount } from "svelte";

    // Mock data for initial UI build
    let stats = [
        {
            label: "Total Assets",
            value: 4,
            grow: "+2%",
            color: "var(--primary)",
        },
        {
            label: "In Stock / Available",
            value: 1,
            grow: "-1",
            color: "var(--success)",
        },
        {
            label: "Allocated / Out",
            value: 2,
            grow: "+1",
            color: "var(--warning)",
        },
    ];

    let recentAssets = [
        { serial: "432", desc: "sdf", status: "Out", location: "as" },
        {
            serial: "123",
            desc: "as",
            status: "Allocated",
            location: "Staging Area",
        },
        {
            serial: "SN-123",
            desc: "test",
            status: "Allocated",
            location: "Staging Area",
        },
        {
            serial: "sn",
            desc: "adf",
            status: "Available",
            location: "Warehouse-A",
        },
    ];

    onMount(() => {
        // Animation triggers or data fetching would go here
    });
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
                <div class="stat-growth" style="color: {stat.color}">
                    {stat.grow}
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
                    <div class="donut-center">
                        <span class="total">4</span>
                        <span class="label">Total</span>
                    </div>
                </div>
                <div class="chart-legend">
                    <div class="legend-item">
                        <span class="dot available"></span> Available
                    </div>
                    <div class="legend-item">
                        <span class="dot allocated"></span> In Use/Allocated
                    </div>
                </div>
            </div>
        </div>

        <div class="glass-card quick-add animate-fade-in">
            <h3>Quick Add Asset</h3>
            <form class="quick-form">
                <div class="input-group">
                    <label for="desc">Description</label>
                    <input
                        type="text"
                        id="desc"
                        placeholder="e.g. MRI Controller"
                    />
                </div>
                <div class="input-group">
                    <label for="serial">Serial Number</label>
                    <input type="text" id="serial" placeholder="SN-2024-..." />
                </div>
                <button type="submit" class="premium-btn premium-btn-primary"
                    >Add Asset</button
                >
            </form>
        </div>
    </div>

    <div class="glass-card table-section animate-fade-in">
        <div class="table-header">
            <h3>All Assets</h3>
            <button class="refresh-btn">↺ Refresh</button>
        </div>
        <div class="table-wrapper">
            <table>
                <thead>
                    <tr>
                        <th>SERIAL</th>
                        <th>DESCRIPTION</th>
                        <th>STATUS</th>
                        <th>LOCATION</th>
                        <th>ACTION</th>
                    </tr>
                </thead>
                <tbody>
                    {#each recentAssets as asset}
                        <tr>
                            <td class="serial">{asset.serial}</td>
                            <td>{asset.desc}</td>
                            <td>
                                <span
                                    class="status-pill {asset.status
                                        .toLowerCase()
                                        .replace(' ', '-')}"
                                >
                                    {asset.status}
                                </span>
                            </td>
                            <td class="location">{asset.location}</td>
                            <td>
                                <button class="action-btn delete">🗑️</button>
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    </div>
</div>

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
        padding: 1.5rem;
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        position: relative;
        overflow: hidden;
    }

    .stat-line {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 4px;
        background: var(--accent-color);
        opacity: 0.3;
    }

    .stat-info {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .stat-label {
        color: var(--text-muted);
        font-size: 0.875rem;
        font-weight: 500;
    }

    .stat-value {
        font-size: 2.5rem;
        font-weight: 700;
    }

    .main-grid {
        display: grid;
        grid-template-columns: 1fr 2fr;
        gap: 1.5rem;
    }

    .chart-container,
    .quick-add {
        padding: 1.5rem;
    }

    .donut-chart-wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1.5rem;
        margin-top: 2rem;
    }

    .donut-chart {
        width: 180px;
        height: 180px;
        border-radius: 50%;
        background: conic-gradient(
            var(--success) 0% 33%,
            var(--warning) 33% 100%
        );
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
    }

    .donut-center {
        width: 130px;
        height: 130px;
        background: var(--bg-main);
        border-radius: 50%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        box-shadow: inset 0 2px 10px rgba(0, 0, 0, 0.05);
    }

    .donut-center .total {
        font-size: 2rem;
        font-weight: 700;
    }
    .donut-center .label {
        font-size: 0.875rem;
        color: var(--text-muted);
    }

    .chart-legend {
        display: flex;
        gap: 1.5rem;
    }

    .legend-item {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.875rem;
        color: var(--text-muted);
    }

    .dot {
        width: 10px;
        height: 10px;
        border-radius: 2px;
    }
    .dot.available {
        background: var(--success);
    }
    .dot.allocated {
        background: var(--warning);
    }

    .quick-form {
        display: flex;
        flex-direction: column;
        gap: 1.25rem;
        margin-top: 1.5rem;
    }

    .input-group {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .input-group label {
        font-size: 0.875rem;
        font-weight: 500;
        color: var(--text-muted);
    }

    .input-group input {
        padding: 0.75rem 1rem;
        border-radius: var(--radius-md);
        border: 1px solid var(--glass-border);
        background: rgba(255, 255, 255, 0.5);
        transition: var(--transition);
    }

    .input-group input:focus {
        outline: none;
        border-color: var(--primary);
        background: white;
        box-shadow: 0 0 0 4px var(--primary-glow);
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
        color: var(--text-muted);
        font-size: 0.75rem;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        border-bottom: 1px solid var(--glass-border);
    }

    td {
        padding: 1rem;
        border-bottom: 1px solid rgba(0, 0, 0, 0.02);
    }

    .status-pill {
        padding: 4px 12px;
        border-radius: 20px;
        font-size: 0.75rem;
        font-weight: 600;
    }

    .status-pill.available {
        background: #dcfce7;
        color: #166534;
    }
    .status-pill.allocated {
        background: #fef9c3;
        color: #854d0e;
    }
    .status-pill.out {
        background: #f1f5f9;
        color: #475569;
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
    .action-btn.delete:hover {
        background: #fef2f2;
    }
</style>
