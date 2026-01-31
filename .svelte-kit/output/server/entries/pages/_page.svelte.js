import { w as ensure_array_like, z as attr_style, y as stringify, F as attr, x as attr_class } from "../../chunks/index2.js";
import "@sveltejs/kit/internal";
import "../../chunks/exports.js";
import "../../chunks/utils.js";
import "@sveltejs/kit/internal/server";
import "../../chunks/state.svelte.js";
import { k as escape_html } from "../../chunks/context.js";
function html(value) {
  var html2 = String(value ?? "");
  var open = "<!---->";
  return open + html2 + "<!---->";
}
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { data } = $$props;
    const STATUS_DISPLAY = { On_Hold: "On Hold", Dispatched: "Out" };
    let stats = [
      {
        label: "Total Assets",
        value: data.stats.totalAssets,
        icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-package"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>`,
        color: "var(--primary)"
      },
      {
        label: "In Stock / Available",
        value: data.stats.availableAssets,
        icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check-circle-2"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m9 12 2 2 4-4"/></svg>`,
        color: "var(--success)"
      },
      {
        label: "Allocated / Out",
        value: data.stats.allocatedAssets,
        icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-up-right"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>`,
        color: "var(--warning)"
      }
    ];
    let recentAssets = data.assets.slice(0, 10);
    let availablePct = data.stats.availableAssets / (data.stats.totalAssets || 1) * 100;
    $$renderer2.push(`<div class="dashboard gap-4 svelte-1uha8ag"><div class="stats-grid svelte-1uha8ag"><!--[-->`);
    const each_array = ensure_array_like(stats);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let stat = each_array[$$index];
      $$renderer2.push(`<div class="glass-card stat-card animate-fade-in svelte-1uha8ag"${attr_style(`--accent-color: ${stringify(stat.color)}`)}><div class="stat-info svelte-1uha8ag"><span class="stat-label svelte-1uha8ag">${escape_html(stat.label)}</span> <span class="stat-value svelte-1uha8ag">${escape_html(stat.value)}</span></div> <div class="stat-icon-wrapper svelte-1uha8ag"${attr_style(`color: ${stringify(stat.color)}`)}>${html(stat.icon)}</div> <div class="stat-line svelte-1uha8ag"></div></div>`);
    }
    $$renderer2.push(`<!--]--></div> <div class="main-grid svelte-1uha8ag"><div class="glass-card chart-container animate-fade-in svelte-1uha8ag"><h3>Inventory Status</h3> <div class="donut-chart-wrapper svelte-1uha8ag"><div class="donut-chart svelte-1uha8ag"><svg viewBox="0 0 100 100" role="img" aria-label="Inventory Status Distribution" class="svelte-1uha8ag"><circle cx="50" cy="50" r="40" fill="none" stroke="#2563eb" stroke-width="12" class="chart-bg svelte-1uha8ag" role="button" tabindex="0" aria-label="In Use Segment"></circle><circle cx="50" cy="50" r="40" fill="none" stroke="var(--success)" stroke-width="12" stroke-dasharray="251.32"${attr("stroke-dashoffset", 251.32 * (1 - availablePct / 100))} transform="rotate(-90 50 50)" class="chart-segment svelte-1uha8ag" role="button" tabindex="0" aria-label="Available Segment"></circle></svg> <div class="donut-center svelte-1uha8ag"><span class="total svelte-1uha8ag">${escape_html(data.stats.totalAssets)}</span> <span class="label svelte-1uha8ag">${escape_html("Total")}</span></div></div> <div class="chart-legend svelte-1uha8ag"><div class="legend-item svelte-1uha8ag" role="button" tabindex="0"><span class="dot available svelte-1uha8ag"></span> <span class="legend-label svelte-1uha8ag">Available</span> <span class="legend-count svelte-1uha8ag">${escape_html(data.stats.availableAssets)}</span></div> <div class="legend-item svelte-1uha8ag" role="button" tabindex="0"><span class="dot allocated svelte-1uha8ag"></span> <span class="legend-label svelte-1uha8ag">In Use</span> <span class="legend-count svelte-1uha8ag">${escape_html(data.stats.allocatedAssets)}</span></div></div></div></div> <div class="glass-card quick-add animate-fade-in svelte-1uha8ag"><h3>Quick Add Asset</h3> <form class="quick-form svelte-1uha8ag" method="POST" action="?/addAsset"><div class="input-group svelte-1uha8ag"><label for="desc" class="svelte-1uha8ag">Description</label> <div class="input-wrapper svelte-1uha8ag"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="input-icon svelte-1uha8ag"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg> <input type="text" name="description" id="desc" placeholder="e.g. MRI Controller" required class="svelte-1uha8ag"/></div></div> <div class="form-row svelte-1uha8ag"><div class="input-group svelte-1uha8ag"><label for="serial" class="svelte-1uha8ag">Serial Number</label> <div class="input-wrapper svelte-1uha8ag"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="input-icon svelte-1uha8ag"><path d="M3 5v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2z"></path><path d="M7 7h10"></path><path d="M7 12h10"></path><path d="M7 17h10"></path></svg> <input type="text" name="lotNumber" id="serial" placeholder="SN-2024-..." required class="svelte-1uha8ag"/></div></div> <div class="input-group svelte-1uha8ag"><label for="location" class="svelte-1uha8ag">Location</label> <div class="input-wrapper svelte-1uha8ag"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="input-icon svelte-1uha8ag"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg> <input type="text" name="location" id="location" placeholder="e.g. Warehouse-A" required class="svelte-1uha8ag"/></div></div></div> <button type="submit" class="premium-btn premium-btn-primary full-width svelte-1uha8ag"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plus-circle"><circle cx="12" cy="12" r="10"></circle><path d="M8 12h8"></path><path d="M12 8v8"></path></svg> Add New Asset</button></form></div></div> <div class="glass-card table-section animate-fade-in svelte-1uha8ag"><div class="table-header svelte-1uha8ag"><h3>All Assets</h3> <button class="refresh-btn"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-rotate-ccw"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><path d="M3 3v5h5"></path></svg> Refresh</button></div> <div class="table-wrapper svelte-1uha8ag"><table class="svelte-1uha8ag"><thead><tr class="svelte-1uha8ag"><th style="width: 120px;" class="svelte-1uha8ag">SERIAL</th><th class="svelte-1uha8ag">DESCRIPTION</th><th style="text-align: center; width: 140px;" class="svelte-1uha8ag">STATUS</th><th style="text-align: center;" class="svelte-1uha8ag">LOCATION</th><th style="text-align: center; width: 80px;" class="svelte-1uha8ag">ACTION</th></tr></thead><tbody>`);
    const each_array_1 = ensure_array_like(recentAssets);
    if (each_array_1.length !== 0) {
      $$renderer2.push("<!--[-->");
      for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
        let asset = each_array_1[$$index_1];
        $$renderer2.push(`<tr class="svelte-1uha8ag"><td class="serial svelte-1uha8ag">${escape_html(asset.lotNumber)}</td><td class="svelte-1uha8ag">${escape_html(asset.description)}</td><td class="svelte-1uha8ag"><span${attr_class(`status-pill ${stringify((STATUS_DISPLAY[asset.status] || asset.status).toLowerCase().replace(/\s+/g, "-"))}`, "svelte-1uha8ag")}>${escape_html(STATUS_DISPLAY[asset.status] || asset.status)}</span></td><td class="location svelte-1uha8ag">${escape_html(asset.location)}</td><td class="svelte-1uha8ag"><button class="action-btn delete svelte-1uha8ag" aria-label="Delete asset"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-2"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg></button></td></tr>`);
      }
    } else {
      $$renderer2.push("<!--[!-->");
      $$renderer2.push(`<tr class="svelte-1uha8ag"><td colspan="5" class="svelte-1uha8ag"><div class="empty-state svelte-1uha8ag"><div class="empty-icon svelte-1uha8ag"><svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-package-open"><path d="M12 22v-9"></path><path d="M15.17 2.21a2 2 0 0 1 2.48 2.48L20 12v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2l2.35-7.31a2 2 0 0 1 2.48-2.48Z"></path><path d="M3.5 12h17"></path><path d="m5.5 16-1.5 5h16l-1.5-5"></path></svg></div> <h4 class="svelte-1uha8ag">No Assets Found</h4> <p class="svelte-1uha8ag">Start managing your inventory by adding
                                        your first asset above.</p></div></td></tr>`);
    }
    $$renderer2.push(`<!--]--></tbody></table></div></div></div> `);
    {
      $$renderer2.push("<!--[!-->");
    }
    $$renderer2.push(`<!--]-->`);
  });
}
export {
  _page as default
};
