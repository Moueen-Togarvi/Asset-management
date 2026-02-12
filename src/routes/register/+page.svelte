<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
	let loading = $state(false);
</script>

<svelte:head>
	<title>Register - Hospital Asset Manager</title>
</svelte:head>

<div class="auth-container">
	<div class="auth-card glass-card">
		<div class="auth-header">
			<h1>Create Account</h1>
			<p>Join Hospital Asset Manager</p>
		</div>

		<form
			method="POST"
			use:enhance={() => {
				loading = true;
				return async ({ update }) => {
					await update();
					loading = false;
				};
			}}
		>
			<div class="form-group">
				<label for="name">Full Name</label>
				<input
					type="text"
					id="name"
					name="name"
					required
					class="premium-input"
					placeholder="John Doe"
				/>
				{#if form?.errors?.name}
					<span class="error-message">{form.errors.name}</span>
				{/if}
			</div>

			<div class="form-group">
				<label for="email">Email Address</label>
				<input
					type="email"
					id="email"
					name="email"
					required
					class="premium-input"
					placeholder="you@example.com"
				/>
				{#if form?.errors?.email}
					<span class="error-message">{form.errors.email}</span>
				{/if}
			</div>

			<div class="form-group">
				<label for="password">Password</label>
				<input
					type="password"
					id="password"
					name="password"
					required
					class="premium-input"
					placeholder="••••••••"
				/>
				<small class="password-hint">
					Must be at least 8 characters with uppercase, lowercase, and number
				</small>
				{#if form?.errors?.password}
					<span class="error-message">{form.errors.password}</span>
				{/if}
			</div>

			{#if form?.error}
				<div class="alert alert-error">
					{form.error}
				</div>
			{/if}

			<button type="submit" class="premium-btn premium-btn-primary" disabled={loading}>
				{loading ? 'Creating Account...' : 'Create Account'}
			</button>
		</form>

		<div class="auth-footer">
			<p>Already have an account? <a href="/login">Sign in</a></p>
		</div>
	</div>
</div>

<style>
	.auth-container {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 2rem;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	}

	.auth-card {
		width: 100%;
		max-width: 450px;
		padding: 3rem;
	}

	.auth-header {
		text-align: center;
		margin-bottom: 2rem;
	}

	.auth-header h1 {
		font-size: 2rem;
		font-weight: 800;
		margin-bottom: 0.5rem;
		background: linear-gradient(135deg, #1e293b 0%, var(--primary) 100%);
		background-clip: text;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
	}

	.auth-header p {
		color: #64748b;
		font-size: 0.95rem;
	}

	.form-group {
		margin-bottom: 1.5rem;
	}

	.form-group label {
		display: block;
		margin-bottom: 0.5rem;
		font-weight: 600;
		color: #1e293b;
		font-size: 0.9rem;
	}

	.password-hint {
		display: block;
		margin-top: 0.5rem;
		color: #64748b;
		font-size: 0.8rem;
	}

	.error-message {
		display: block;
		margin-top: 0.5rem;
		color: var(--error);
		font-size: 0.85rem;
		font-weight: 500;
	}

	.alert {
		padding: 1rem;
		border-radius: var(--radius-md);
		margin-bottom: 1.5rem;
		font-size: 0.9rem;
		font-weight: 500;
	}

	.alert-error {
		background: rgba(239, 68, 68, 0.1);
		color: var(--error);
		border: 1px solid rgba(239, 68, 68, 0.2);
	}

	.alert-success {
		background: rgba(34, 197, 94, 0.1);
		color: var(--success);
		border: 1px solid rgba(34, 197, 94, 0.2);
	}

	.premium-btn {
		width: 100%;
		margin-top: 0.5rem;
	}

	.auth-footer {
		text-align: center;
		margin-top: 2rem;
		padding-top: 2rem;
		border-top: 1px solid rgba(0, 0, 0, 0.1);
	}

	.auth-footer p {
		color: #64748b;
		font-size: 0.9rem;
	}

	.auth-footer a {
		color: var(--primary);
		font-weight: 600;
		text-decoration: none;
		transition: var(--transition);
	}

	.auth-footer a:hover {
		text-decoration: underline;
	}
</style>
