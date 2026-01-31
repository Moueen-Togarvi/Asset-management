import { w as ensure_array_like, x as attr_class, y as stringify } from "../../chunks/index2.js";
import "clsx";
import { n as navigating } from "../../chunks/index3.js";
import { k as escape_html } from "../../chunks/context.js";
class ToastStore {
  toasts = [];
  add(message, type = "success", duration = 3e3) {
    const id = crypto.randomUUID();
    const toast = { id, message, type, duration };
    this.toasts.push(toast);
    if (duration > 0) {
      setTimeout(
        () => {
          this.remove(id);
        },
        duration
      );
    }
  }
  remove(id) {
    this.toasts = this.toasts.filter((t) => t.id !== id);
  }
}
const toastStore = new ToastStore();
function _layout($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { children } = $$props;
    if (navigating) {
      $$renderer2.push("<!--[-->");
      $$renderer2.push(`<div class="global-loader svelte-12qhfyh"></div>`);
    } else {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]--> <div class="app-container svelte-12qhfyh"><nav class="glass-card main-nav svelte-12qhfyh"><div class="logo svelte-12qhfyh"><span class="logo-icon svelte-12qhfyh"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-hospital svelte-12qhfyh"><path d="M12 6v4" class="svelte-12qhfyh"></path><path d="M14 14h-4" class="svelte-12qhfyh"></path><path d="M14 18h-4" class="svelte-12qhfyh"></path><path d="M14 8h-4" class="svelte-12qhfyh"></path><path d="M18 12h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-9a2 2 0 0 1 2-2h2" class="svelte-12qhfyh"></path><path d="M18 22V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v18" class="svelte-12qhfyh"></path></svg></span> <span class="logo-text svelte-12qhfyh">Hospital Asset</span></div> <div class="nav-links svelte-12qhfyh"><a href="/" class="nav-link svelte-12qhfyh">Dashboard</a> <a href="/dispatch" class="nav-link svelte-12qhfyh">Dispatch Board</a> <a href="/reports" class="nav-link svelte-12qhfyh">Reports</a></div> <div class="user-profile svelte-12qhfyh"><button class="premium-btn premium-btn-primary svelte-12qhfyh">Sign In</button></div></nav> <main class="svelte-12qhfyh">`);
    children($$renderer2);
    $$renderer2.push(`<!----></main> <div class="toast-container svelte-12qhfyh"><!--[-->`);
    const each_array = ensure_array_like(toastStore.toasts);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let toast = each_array[$$index];
      $$renderer2.push(`<div${attr_class(`toast glass-card ${stringify(toast.type)} animate-fade-in`, "svelte-12qhfyh")}><div class="toast-icon svelte-12qhfyh">`);
      if (toast.type === "success") {
        $$renderer2.push("<!--[-->");
        $$renderer2.push(`<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check-circle svelte-12qhfyh"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" class="svelte-12qhfyh"></path><polyline points="22 4 12 14.01 9 11.01" class="svelte-12qhfyh"></polyline></svg>`);
      } else {
        $$renderer2.push("<!--[!-->");
        if (toast.type === "error") {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-alert-circle svelte-12qhfyh"><circle cx="12" cy="12" r="10" class="svelte-12qhfyh"></circle><line x1="12" y1="8" x2="12" y2="12" class="svelte-12qhfyh"></line><line x1="12" y1="16" x2="12.01" y2="16" class="svelte-12qhfyh"></line></svg>`);
        } else {
          $$renderer2.push("<!--[!-->");
          if (toast.type === "warning") {
            $$renderer2.push("<!--[-->");
            $$renderer2.push(`<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-alert-triangle svelte-12qhfyh"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" class="svelte-12qhfyh"></path><line x1="12" y1="9" x2="12" y2="13" class="svelte-12qhfyh"></line><line x1="12" y1="17" x2="12.01" y2="17" class="svelte-12qhfyh"></line></svg>`);
          } else {
            $$renderer2.push("<!--[!-->");
            $$renderer2.push(`<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-info svelte-12qhfyh"><circle cx="12" cy="12" r="10" class="svelte-12qhfyh"></circle><line x1="12" y1="16" x2="12" y2="12" class="svelte-12qhfyh"></line><line x1="12" y1="8" x2="12.01" y2="8" class="svelte-12qhfyh"></line></svg>`);
          }
          $$renderer2.push(`<!--]-->`);
        }
        $$renderer2.push(`<!--]-->`);
      }
      $$renderer2.push(`<!--]--></div> <div class="toast-message svelte-12qhfyh">${escape_html(toast.message)}</div> <button class="toast-close svelte-12qhfyh">×</button></div>`);
    }
    $$renderer2.push(`<!--]--></div></div>`);
  });
}
export {
  _layout as default
};
