<script lang="ts">
	import "../app.css";
	import { toastStore } from "$lib/toasts.svelte";
	import { navigating } from "$app/state";
	let { children } = $props();
</script>

{#if navigating}
	<div class="global-loader"></div>
{/if}

<div class="app-container">
	<nav class="glass-card main-nav">
		<div class="logo">
			<span class="logo-icon">
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
					class="lucide lucide-hospital"
					><path d="M12 6v4" /><path d="M14 14h-4" /><path
						d="M14 18h-4"
					/><path d="M14 8h-4" /><path
						d="M18 12h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2h2"
					/><path
						d="M18 22V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v18"
					/></svg
				>
			</span>
			<span class="logo-text">Hospital Asset</span>
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

	<div class="toast-container">
		{#each toastStore.toasts as toast (toast.id)}
			<div class="toast glass-card {toast.type} animate-fade-in">
				<div class="toast-icon">
					{#if toast.type === "success"}
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							class="lucide lucide-check-circle"
							><path
								d="M22 11.08V12a10 10 0 1 1-5.93-9.14"
							/><polyline points="22 4 12 14.01 9 11.01" /></svg
						>
					{:else if toast.type === "error"}
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							class="lucide lucide-alert-circle"
							><circle cx="12" cy="12" r="10" /><line
								x1="12"
								y1="8"
								x2="12"
								y2="12"
							/><line x1="12" y1="16" x2="12.01" y2="16" /></svg
						>
					{:else if toast.type === "warning"}
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							class="lucide lucide-alert-triangle"
							><path
								d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"
							/><line x1="12" y1="9" x2="12" y2="13" /><line
								x1="12"
								y1="17"
								x2="12.01"
								y2="17"
							/></svg
						>
					{:else}
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="20"
							height="20"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
							class="lucide lucide-info"
							><circle cx="12" cy="12" r="10" /><line
								x1="12"
								y1="16"
								x2="12"
								y2="12"
							/><line x1="12" y1="8" x2="12.01" y2="8" /></svg
						>
					{/if}
				</div>
				<div class="toast-message">{toast.message}</div>
				<button
					class="toast-close"
					onclick={() => toastStore.remove(toast.id)}>&times;</button
				>
			</div>
		{/each}
	</div>
</div>

<style>
	.app-container {
		max-width: 1400px;
		margin: 0 auto;
		padding: 2rem;
		transition: padding 0.3s ease;
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
		transition: all 0.3s ease;
	}

	.logo {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		font-size: 1.35rem;
		font-weight: 800;
		letter-spacing: -0.04em;
		white-space: nowrap;
	}

	.logo-text {
		background: linear-gradient(135deg, #1e293b 0%, var(--primary) 100%);
		background-clip: text;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
	}

	.logo-text .highlight {
		font-weight: 900;
		filter: brightness(1.2);
	}

	.nav-links {
		display: flex;
		gap: 2rem;
	}

	.nav-link {
		text-decoration: none;
		color: #0f172a;
		font-weight: 700;
		transition: var(--transition);
		position: relative;
		font-size: 0.9rem;
		letter-spacing: -0.01em;
	}

	.nav-link::after {
		content: "";
		position: absolute;
		bottom: -4px;
		left: 0;
		width: 0;
		height: 2px;
		background: var(--primary);
		transition: var(--transition);
		border-radius: 2px;
	}

	.nav-link:hover::after,
	.nav-link.active::after {
		width: 100%;
	}

	.nav-link:hover,
	.nav-link.active {
		color: var(--primary);
	}

	main {
		min-height: calc(100vh - 200px);
	}

	/* Responsive Overrides */
	@media (max-width: 1024px) {
		.app-container {
			padding: 1.5rem;
		}
		.nav-links {
			gap: 1.5rem;
		}
	}

	@media (max-width: 768px) {
		.app-container {
			padding: 0.75rem;
		}
		.main-nav {
			padding: 0.75rem 1rem;
			top: 0.5rem;
			margin-bottom: 1rem;
			gap: 0.5rem;
		}
		.logo-text {
			font-size: 0;
			display: inline-block;
		}
		.logo-text .highlight {
			font-size: 1.1rem;
			display: inline-block;
		}
		.nav-links {
			gap: 0.75rem;
		}
		.nav-link {
			font-size: 0.8rem;
		}
	}

	@media (max-width: 480px) {
		.main-nav {
			padding: 0.5rem 0.75rem;
			gap: 0.25rem;
			flex-direction: row;
			justify-content: space-between;
		}
		.nav-links {
			gap: 0.5rem;
			flex-grow: 1;
			justify-content: center;
		}
		.nav-link {
			font-size: 0.75rem;
			padding: 4px;
			color: #000;
		}
		.nav-link::after {
			display: none;
		}
		.user-profile {
			display: none;
		}
	}

	.toast-container {
		position: fixed;
		bottom: 2rem;
		right: 2rem;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
		z-index: 1000;
		max-width: calc(100% - 4rem);
	}

	.toast {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 1rem 1.5rem;
		border-radius: var(--radius-md);
		box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
	}

	.toast.success {
		background: var(--success);
		color: white;
	}
	.toast.error {
		background: var(--error);
		color: white;
	}
	.toast.warning {
		background: var(--warning);
		color: white;
	}
	.toast.info {
		background: var(--primary);
		color: white;
	}

	.toast-icon {
		font-size: 1.25rem;
	}

	.toast-message {
		flex-grow: 1;
		font-size: 0.9rem;
		font-weight: 600;
		color: white;
	}

	.toast-close {
		font-size: 1.5rem;
		color: rgba(255, 255, 255, 0.8);
		line-height: 1;
		padding: 4px;
		transition: var(--transition);
	}

	.toast-close:hover {
		color: white;
		transform: scale(1.1);
	}

	.global-loader {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		height: 3px;
		background: linear-gradient(to right, var(--primary), var(--accent));
		z-index: 9999;
		animation: loader-anim 2s infinite linear;
		transform-origin: 0% 50%;
	}

	@keyframes loader-anim {
		0% {
			transform: scaleX(0);
		}
		50% {
			transform: scaleX(0.7);
		}
		100% {
			transform: scaleX(1);
			opacity: 0;
		}
	}
</style>
