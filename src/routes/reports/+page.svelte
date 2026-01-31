<script lang="ts">
</script>

<div class="reports-container animate-fade-in">
    <div class="placeholder-card glass-card">
        <div class="icon">📊</div>
        <h2>Reports Module</h2>
        <p>Historical data analytics and PDF export features coming soon.</p>
        <div class="progress-bar">
            <div class="progress-fill"></div>
        </div>
    </div>
</div>

<style>
    .reports-container {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 60vh;
    }

    .placeholder-card {
        max-width: 500px;
        padding: 3rem;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1.5rem;
    }

    .icon {
        font-size: 4rem;
    }

    h2 {
        font-size: 1.5rem;
        color: var(--text-main);
    }
    p {
        color: var(--text-muted);
        line-height: 1.6;
    }

    .progress-bar {
        width: 200px;
        height: 6px;
        background: var(--glass-border);
        border-radius: 10px;
        overflow: hidden;
        margin-top: 1rem;
    }

    .progress-fill {
        width: 60%;
        height: 100%;
        background: var(--primary);
        border-radius: 10px;
        animation: pulse 2s infinite ease-in-out;
    }

    @keyframes pulse {
        0% {
            opacity: 0.6;
        }
        50% {
            opacity: 1;
        }
        100% {
            opacity: 0.6;
        }
    }

    @media (max-width: 768px) {
        .placeholder-card {
            padding: 2rem 1.5rem;
            margin: 1rem;
        }
        .icon {
            font-size: 3rem;
        }
        h2 {
            font-size: 1.25rem;
        }
    }
</style>
