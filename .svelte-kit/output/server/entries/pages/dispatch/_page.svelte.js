import { F as attr, w as ensure_array_like } from "../../../chunks/index2.js";
import "@sveltejs/kit/internal";
import "../../../chunks/exports.js";
import "../../../chunks/utils.js";
import "@sveltejs/kit/internal/server";
import "../../../chunks/state.svelte.js";
import { k as escape_html } from "../../../chunks/context.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let { data } = $$props;
    let orderQty = 1;
    let optimisticUpdates = /* @__PURE__ */ new Map();
    let processedColumns = (() => {
      const groups = {
        Available: [],
        Allocated: [],
        Picked: [],
        On_Hold: [],
        Dispatched: []
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
          const step = optimisticUpdates.get(a.id) || a.step;
          if (groups[step]) groups[step].push(a);
        }
      }
      return [
        {
          id: 1,
          title: "1. Racks (Available)",
          items: groups.Available
        },
        { id: 2, title: "2. Allocated", items: groups.Allocated },
        { id: 3, title: "3. Picked", items: groups.Picked },
        { id: 4, title: "4. On Hold", items: groups.On_Hold },
        { id: 5, title: "5. Dispatched", items: groups.Dispatched }
      ];
    })();
    $$renderer2.push(`<div class="dispatch-board-container animate-fade-in svelte-1rbnhif"><header class="board-header svelte-1rbnhif"><div class="header-text svelte-1rbnhif"><h2 class="svelte-1rbnhif">Dispatch Process Flow</h2> <p class="svelte-1rbnhif">Manage Allocation, Picking, and Dispatch workflows</p></div> <div class="board-controls glass-card svelte-1rbnhif"><form method="POST" action="?/autoAllocate"><div class="control-group svelte-1rbnhif"><label for="qty" class="svelte-1rbnhif">New Order Qty:</label> <input type="number" name="qty" id="qty"${attr("value", orderQty)} min="1" class="svelte-1rbnhif"/> <button type="submit" class="premium-btn auto-alloc-btn svelte-1rbnhif"><span><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-zap"><path d="M4 14.5 14 3 12 10.5 20 9.5 10 21l2-7.5Z"></path></svg></span> Auto-Allocate (FIFO)</button></div></form></div></header> <div class="kanban-board svelte-1rbnhif"><!--[-->`);
    const each_array = ensure_array_like(processedColumns);
    for (let $$index_1 = 0, $$length = each_array.length; $$index_1 < $$length; $$index_1++) {
      let column = each_array[$$index_1];
      $$renderer2.push(`<div class="column-wrapper svelte-1rbnhif"><div class="column-header svelte-1rbnhif"><span class="column-title svelte-1rbnhif">${escape_html(column.title)}</span> <span class="badge svelte-1rbnhif">${escape_html(column.items.length)}</span></div> <div class="column-body glass-card svelte-1rbnhif"><!--[-->`);
      const each_array_1 = ensure_array_like(column.items);
      for (let $$index = 0, $$length2 = each_array_1.length; $$index < $$length2; $$index++) {
        let item = each_array_1[$$index];
        $$renderer2.push(`<div class="item-card animate-fade-in svelte-1rbnhif">`);
        if (column.id === 1) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<div class="item-id svelte-1rbnhif">${escape_html(item.lotNumber)}</div> <div class="item-desc svelte-1rbnhif">${escape_html(item.description)}</div>`);
        } else {
          $$renderer2.push("<!--[!-->");
          $$renderer2.push(`<div class="item-id svelte-1rbnhif">${escape_html(item.asset?.lotNumber)}</div> <div class="item-desc svelte-1rbnhif">${escape_html(item.asset?.description)}</div> <div class="alloc-badge svelte-1rbnhif">${escape_html(item.allocationNumber)}</div>`);
        }
        $$renderer2.push(`<!--]--> <div class="item-actions svelte-1rbnhif">`);
        if (column.id === 2) {
          $$renderer2.push("<!--[-->");
          $$renderer2.push(`<form method="POST" action="?/pickAndSync" class="svelte-1rbnhif"><input type="hidden" name="allocationId"${attr("value", item.id)}/> <button type="submit" class="premium-btn action-btn pick svelte-1rbnhif">Pick &amp; Sync</button></form>`);
        } else {
          $$renderer2.push("<!--[!-->");
          if (column.id === 3) {
            $$renderer2.push("<!--[-->");
            $$renderer2.push(`<div class="btn-group svelte-1rbnhif"><form method="POST" action="?/updateStep" class="svelte-1rbnhif"><input type="hidden" name="allocationId"${attr("value", item.id)}/> <input type="hidden" name="step" value="Dispatched"/> <button type="submit" class="premium-btn action-btn approve svelte-1rbnhif">Approve</button></form> <form method="POST" action="?/updateStep" class="svelte-1rbnhif"><input type="hidden" name="allocationId"${attr("value", item.id)}/> <input type="hidden" name="step" value="On_Hold"/> <button type="submit" class="premium-btn action-btn hold svelte-1rbnhif">Hold</button></form></div>`);
          } else {
            $$renderer2.push("<!--[!-->");
            if (column.id === 4) {
              $$renderer2.push("<!--[-->");
              $$renderer2.push(`<div class="btn-group svelte-1rbnhif"><form method="POST" action="?/updateStep" class="svelte-1rbnhif"><input type="hidden" name="allocationId"${attr("value", item.id)}/> <input type="hidden" name="step" value="Picked"/> <button type="submit" class="premium-btn action-btn retry-btn svelte-1rbnhif">Retry</button></form> <form method="POST" action="?/returnAsset" class="svelte-1rbnhif"><input type="hidden" name="allocationId"${attr("value", item.id)}/> <button type="submit" class="premium-btn action-btn return-btn svelte-1rbnhif">Return</button></form></div>`);
            } else {
              $$renderer2.push("<!--[!-->");
              if (column.id === 5) {
                $$renderer2.push("<!--[-->");
                $$renderer2.push(`<form method="POST" action="?/returnAsset" class="svelte-1rbnhif"><input type="hidden" name="allocationId"${attr("value", item.id)}/> <button type="submit" class="premium-btn action-btn return-btn svelte-1rbnhif">Return to Stock</button></form>`);
              } else {
                $$renderer2.push("<!--[!-->");
              }
              $$renderer2.push(`<!--]-->`);
            }
            $$renderer2.push(`<!--]-->`);
          }
          $$renderer2.push(`<!--]-->`);
        }
        $$renderer2.push(`<!--]--></div></div>`);
      }
      $$renderer2.push(`<!--]--></div></div>`);
    }
    $$renderer2.push(`<!--]--></div></div>`);
  });
}
export {
  _page as default
};
