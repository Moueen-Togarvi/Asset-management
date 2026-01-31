<script lang="ts">
	import "../app.css";
	let { children } = $props();
</script>

<div class="app-container">
	<nav class="glass-card main-nav">
		<div class="logo">
			<span class="logo-icon">🏥</span>
			<span class="logo-text"
				>Hospital Asset <span class="highlight">Manager</span></span
			>
		</div>
		<div class="nav-links">
			<a href="/" class="nav-link">Dashboard</a>
			<a href="/dispatch" class="nav-link">Dispatch Board</a>
			<a href="/reports" class="nav-link">Reports</a>
		</div>
		<div class="user-profile">
			<!-- Placeholder for Auth -->
			<button class="premium-btn premium-btn-primary">Sign In</button>
		</div>
	</nav>

	<main>
		{@render children()}
	</main>
</div>

<style>
	.app-container {
		max-width: 1400px;
		margin: 0 auto;
		padding: 2rem;
	}

	.main-nav {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem 2rem;
		margin-bottom: 2rem;
		position: sticky;
		top: 1rem;
		z-index: 100;
	}

	.logo {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		font-size: 1.25rem;
		font-weight: 700;
	}

	.logo-text .highlight {
		color: var(--primary);
	}

	.nav-links {
		display: flex;
		gap: 2rem;
	}

	.nav-link {
		text-decoration: none;
		color: var(--text-muted);
		font-weight: 500;
		transition: var(--transition);
		position: relative;
	}

	.nav-link:hover,
	.nav-link.active {
		color: var(--primary);
	}

	main {
		min-height: calc(100vh - 200px);
	}
</style>
