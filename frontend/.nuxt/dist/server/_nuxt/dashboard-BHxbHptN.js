import { defineComponent, ref, reactive, computed, unref, useSSRContext } from "vue";
import { ssrInterpolate, ssrRenderClass, ssrRenderList, ssrIncludeBooleanAttr, ssrRenderTeleport, ssrRenderAttr } from "vue/server-renderer";
import { u as usePackages, a as useOrders } from "./useOrders-CJuSKsjG.js";
import "/Users/earth/Documents/MyApp/ChangeStreams/frontend/node_modules/hookable/dist/index.mjs";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "dashboard",
  __ssrInlineRender: true,
  setup(__props) {
    const { packages, loading: packagesLoading } = usePackages();
    const {
      orders,
      loading: ordersLoading,
      actionLoading,
      error: ordersError
    } = useOrders();
    const activeTab = ref("orders");
    const orderStatusFilter = ref("pending");
    const showCreateModal = ref(false);
    const packageForm = reactive({ name: "", description: "", price: 0 });
    const createError = ref(null);
    const createLoading = ref(false);
    const orderStatusOptions = [
      { value: "pending", label: "Pending" },
      { value: "approved", label: "Approved" },
      { value: "rejected", label: "Rejected" },
      { value: "refund_requested", label: "Refund Requested" },
      { value: "refunded", label: "Refunded" }
    ];
    const statusColors = {
      pending: "bg-amber-500/10 text-amber-400 border-amber-500/30",
      approved: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
      rejected: "bg-rose-500/10 text-rose-400 border-rose-500/30",
      refund_requested: "bg-violet-500/10 text-violet-400 border-violet-500/30",
      refunded: "bg-slate-500/10 text-slate-400 border-slate-500/30"
    };
    const pendingOrders = computed(() => orders.value.filter((o) => o.status === "pending"));
    const refundRequests = computed(() => orders.value.filter((o) => o.status === "refund_requested"));
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[--><div class="p-8"><div class="mb-8"><h1 class="text-2xl font-bold text-white">Admin Dashboard</h1><p class="text-slate-400 text-sm mt-0.5">Manage packages, orders and refunds</p></div><div class="grid grid-cols-4 gap-4 mb-8"><div class="bg-slate-900 border border-slate-800 rounded-xl p-5"><p class="text-slate-400 text-xs font-medium uppercase tracking-wide mb-1">Total Packages</p><p class="text-2xl font-bold text-white">${ssrInterpolate(unref(packages).length)}</p></div><div class="bg-slate-900 border border-slate-800 rounded-xl p-5"><p class="text-slate-400 text-xs font-medium uppercase tracking-wide mb-1">Pending Orders</p><p class="text-2xl font-bold text-amber-400">${ssrInterpolate(unref(pendingOrders).length)}</p></div><div class="bg-slate-900 border border-slate-800 rounded-xl p-5"><p class="text-slate-400 text-xs font-medium uppercase tracking-wide mb-1">Refund Requests</p><p class="text-2xl font-bold text-violet-400">${ssrInterpolate(unref(refundRequests).length)}</p></div><div class="bg-slate-900 border border-slate-800 rounded-xl p-5"><p class="text-slate-400 text-xs font-medium uppercase tracking-wide mb-1">Active Packages</p><p class="text-2xl font-bold text-emerald-400">${ssrInterpolate(unref(packages).filter((p) => p.is_active).length)}</p></div></div><div class="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-xl p-1 w-fit mb-6"><button class="${ssrRenderClass([unref(activeTab) === "orders" ? "bg-primary-600 text-white" : "text-slate-400 hover:text-slate-200", "px-5 py-2 rounded-lg text-sm font-medium transition-colors"])}"> Orders </button><button class="${ssrRenderClass([unref(activeTab) === "packages" ? "bg-primary-600 text-white" : "text-slate-400 hover:text-slate-200", "px-5 py-2 rounded-lg text-sm font-medium transition-colors"])}"> Packages </button></div>`);
      if (unref(activeTab) === "orders") {
        _push(`<div><div class="flex items-center gap-2 mb-5"><!--[-->`);
        ssrRenderList(orderStatusOptions, (opt) => {
          _push(`<button class="${ssrRenderClass([unref(orderStatusFilter) === opt.value ? "bg-primary-600/20 text-primary-400 border-primary-500/50" : "text-slate-400 border-slate-700 hover:border-slate-600 hover:text-slate-200", "px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors"])}">${ssrInterpolate(opt.label)}</button>`);
        });
        _push(`<!--]--></div>`);
        if (unref(ordersError)) {
          _push(`<div class="mb-4 px-4 py-3 bg-rose-500/10 border border-rose-500/30 rounded-lg text-rose-400 text-sm">${ssrInterpolate(unref(ordersError))}</div>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(ordersLoading)) {
          _push(`<div class="flex justify-center py-16"><div class="w-7 h-7 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div></div>`);
        } else if (unref(orders).length === 0) {
          _push(`<div class="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center"><p class="text-slate-500">No orders with status &quot;${ssrInterpolate(unref(orderStatusFilter).replace("_", " "))}&quot;</p></div>`);
        } else {
          _push(`<div class="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden"><table class="w-full"><thead><tr class="border-b border-slate-800"><th class="text-left text-xs font-medium text-slate-400 uppercase tracking-wide px-5 py-3.5">Order ID</th><th class="text-left text-xs font-medium text-slate-400 uppercase tracking-wide px-5 py-3.5">User ID</th><th class="text-left text-xs font-medium text-slate-400 uppercase tracking-wide px-5 py-3.5">Amount</th><th class="text-left text-xs font-medium text-slate-400 uppercase tracking-wide px-5 py-3.5">Status</th><th class="text-left text-xs font-medium text-slate-400 uppercase tracking-wide px-5 py-3.5">Date</th><th class="text-right text-xs font-medium text-slate-400 uppercase tracking-wide px-5 py-3.5">Actions</th></tr></thead><tbody><!--[-->`);
          ssrRenderList(unref(orders), (order) => {
            _push(`<tr class="border-b border-slate-800/50 last:border-0 hover:bg-slate-800/30 transition-colors"><td class="px-5 py-3.5 text-sm font-mono text-slate-400">${ssrInterpolate(order.id.slice(-8))}</td><td class="px-5 py-3.5 text-sm font-mono text-slate-400">${ssrInterpolate(order.user_id.slice(-8))}</td><td class="px-5 py-3.5 text-sm font-semibold text-white">$${ssrInterpolate(order.amount.toFixed(2))}</td><td class="px-5 py-3.5"><span class="${ssrRenderClass([statusColors[order.status], "text-xs font-medium px-2.5 py-1 rounded-full border"])}">${ssrInterpolate(order.status.replace("_", " "))}</span></td><td class="px-5 py-3.5 text-sm text-slate-400">${ssrInterpolate(new Date(order.created_at).toLocaleDateString())}</td><td class="px-5 py-3.5 text-right"><div class="flex items-center justify-end gap-2">`);
            if (order.status === "pending") {
              _push(`<!--[--><button${ssrIncludeBooleanAttr(unref(actionLoading) === order.id) ? " disabled" : ""} class="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 disabled:opacity-40 px-3 py-1.5 rounded-lg transition-colors">`);
              if (unref(actionLoading) === order.id) {
                _push(`<span>...</span>`);
              } else {
                _push(`<span>Approve</span>`);
              }
              _push(`</button><button${ssrIncludeBooleanAttr(unref(actionLoading) === order.id) ? " disabled" : ""} class="text-xs bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500/20 disabled:opacity-40 px-3 py-1.5 rounded-lg transition-colors">`);
              if (unref(actionLoading) === order.id) {
                _push(`<span>...</span>`);
              } else {
                _push(`<span>Reject</span>`);
              }
              _push(`</button><!--]-->`);
            } else if (order.status === "refund_requested") {
              _push(`<button${ssrIncludeBooleanAttr(unref(actionLoading) === order.id) ? " disabled" : ""} class="text-xs bg-violet-500/10 text-violet-400 border border-violet-500/30 hover:bg-violet-500/20 disabled:opacity-40 px-3 py-1.5 rounded-lg transition-colors">`);
              if (unref(actionLoading) === order.id) {
                _push(`<span>...</span>`);
              } else {
                _push(`<span>Approve refund</span>`);
              }
              _push(`</button>`);
            } else {
              _push(`<span class="text-slate-600 text-xs">—</span>`);
            }
            _push(`</div></td></tr>`);
          });
          _push(`<!--]--></tbody></table></div>`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(activeTab) === "packages") {
        _push(`<div><div class="flex items-center justify-between mb-5"><p class="text-slate-400 text-sm">${ssrInterpolate(unref(packages).length)} packages total</p><button class="flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-white font-medium px-4 py-2 rounded-lg text-sm transition-colors"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg> Create package </button></div>`);
        if (unref(packagesLoading)) {
          _push(`<div class="flex justify-center py-16"><div class="w-7 h-7 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div></div>`);
        } else if (unref(packages).length === 0) {
          _push(`<div class="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center"><p class="text-slate-500 mb-3">No packages yet</p><button class="text-primary-400 hover:text-primary-300 text-sm transition-colors"> Create your first package → </button></div>`);
        } else {
          _push(`<div class="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden"><table class="w-full"><thead><tr class="border-b border-slate-800"><th class="text-left text-xs font-medium text-slate-400 uppercase tracking-wide px-5 py-3.5">Name</th><th class="text-left text-xs font-medium text-slate-400 uppercase tracking-wide px-5 py-3.5">Description</th><th class="text-left text-xs font-medium text-slate-400 uppercase tracking-wide px-5 py-3.5">Price</th><th class="text-left text-xs font-medium text-slate-400 uppercase tracking-wide px-5 py-3.5">Status</th><th class="text-left text-xs font-medium text-slate-400 uppercase tracking-wide px-5 py-3.5">Created</th></tr></thead><tbody><!--[-->`);
          ssrRenderList(unref(packages), (pkg) => {
            _push(`<tr class="border-b border-slate-800/50 last:border-0 hover:bg-slate-800/30 transition-colors"><td class="px-5 py-3.5 text-sm font-medium text-white">${ssrInterpolate(pkg.name)}</td><td class="px-5 py-3.5 text-sm text-slate-400 max-w-xs truncate">${ssrInterpolate(pkg.description)}</td><td class="px-5 py-3.5 text-sm font-semibold text-emerald-400">$${ssrInterpolate(pkg.price.toFixed(2))}</td><td class="px-5 py-3.5"><span class="${ssrRenderClass([pkg.is_active ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" : "bg-slate-500/10 text-slate-400 border-slate-500/30", "text-xs font-medium px-2.5 py-1 rounded-full border"])}">${ssrInterpolate(pkg.is_active ? "Active" : "Inactive")}</span></td><td class="px-5 py-3.5 text-sm text-slate-400">${ssrInterpolate(new Date(pkg.created_at).toLocaleDateString())}</td></tr>`);
          });
          _push(`<!--]--></tbody></table></div>`);
        }
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
      ssrRenderTeleport(_push, (_push2) => {
        if (unref(showCreateModal)) {
          _push2(`<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"><div class="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md"><div class="flex items-center justify-between mb-5"><h3 class="text-white font-semibold">Create new package</h3><button class="text-slate-500 hover:text-slate-300 transition-colors"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button></div>`);
          if (unref(createError)) {
            _push2(`<div class="mb-4 px-4 py-3 bg-rose-500/10 border border-rose-500/30 rounded-lg text-rose-400 text-sm">${ssrInterpolate(unref(createError))}</div>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`<form class="space-y-4"><div><label class="block text-slate-300 text-sm font-medium mb-1.5">Name</label><input${ssrRenderAttr("value", unref(packageForm).name)} type="text" required placeholder="Premium Plan" class="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"></div><div><label class="block text-slate-300 text-sm font-medium mb-1.5">Description</label><textarea required rows="3" placeholder="Describe what this package includes..." class="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition resize-none">${ssrInterpolate(unref(packageForm).description)}</textarea></div><div><label class="block text-slate-300 text-sm font-medium mb-1.5">Price ($)</label><input${ssrRenderAttr("value", unref(packageForm).price)} type="number" required min="0.01" step="0.01" placeholder="0.00" class="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"></div><div class="flex gap-3 pt-1"><button type="button" class="flex-1 border border-slate-700 text-slate-300 hover:bg-slate-800 font-medium py-2.5 rounded-lg text-sm transition-colors"> Cancel </button><button type="submit"${ssrIncludeBooleanAttr(unref(createLoading)) ? " disabled" : ""} class="flex-1 bg-primary-600 hover:bg-primary-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg text-sm transition-colors">`);
          if (unref(createLoading)) {
            _push2(`<span class="flex items-center justify-center gap-2"><span class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span> Creating... </span>`);
          } else {
            _push2(`<span>Create package</span>`);
          }
          _push2(`</button></div></form></div></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
      _push(`<!--]-->`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/dashboard.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=dashboard-BHxbHptN.js.map
