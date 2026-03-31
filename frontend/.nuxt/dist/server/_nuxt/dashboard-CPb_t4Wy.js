import { ref, defineComponent, unref, useSSRContext } from "vue";
import { ssrInterpolate, ssrRenderList, ssrIncludeBooleanAttr, ssrRenderClass, ssrRenderTeleport, ssrRenderAttr } from "vue/server-renderer";
import { u as useAuthStore } from "./auth.store-Dw2_dY2Q.js";
import { o as orderService, u as usePackages, a as useOrders } from "./useOrders-CJuSKsjG.js";
import "/Users/earth/Documents/MyApp/ChangeStreams/frontend/node_modules/hookable/dist/index.mjs";
import "pinia";
function useCredit() {
  const authStore = useAuthStore();
  const loading = ref(false);
  const error = ref(null);
  const success = ref(false);
  async function topup(amount) {
    loading.value = true;
    error.value = null;
    success.value = false;
    try {
      await orderService.topup({ amount });
      authStore.updateCreditBalance(authStore.creditBalance + amount);
      success.value = true;
      return true;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Top-up failed";
      return false;
    } finally {
      loading.value = false;
    }
  }
  function reset() {
    error.value = null;
    success.value = false;
  }
  return { loading, error, success, topup, reset };
}
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "dashboard",
  __ssrInlineRender: true,
  setup(__props) {
    const authStore = useAuthStore();
    const { packages, loading: packagesLoading } = usePackages();
    const { orders, loading: ordersLoading, actionLoading, error: ordersError } = useOrders();
    const { loading: topupLoading, error: topupError, success: topupSuccess } = useCredit();
    const showTopupModal = ref(false);
    const topupAmount = ref(0);
    const statusColors = {
      pending: "bg-amber-500/10 text-amber-400 border-amber-500/30",
      approved: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
      rejected: "bg-rose-500/10 text-rose-400 border-rose-500/30",
      refund_requested: "bg-violet-500/10 text-violet-400 border-violet-500/30",
      refunded: "bg-slate-500/10 text-slate-400 border-slate-500/30"
    };
    const canRefund = (status) => status === "approved";
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[--><div class="p-8"><div class="flex items-center justify-between mb-8"><div><h1 class="text-2xl font-bold text-white">Dashboard</h1><p class="text-slate-400 text-sm mt-0.5">Manage your packages and orders</p></div><button class="flex items-center gap-2 bg-primary-600 hover:bg-primary-500 text-white font-medium px-4 py-2 rounded-lg text-sm transition-colors"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg> Top up credit </button></div><div class="grid grid-cols-3 gap-4 mb-8"><div class="bg-slate-900 border border-slate-800 rounded-xl p-5"><p class="text-slate-400 text-xs font-medium uppercase tracking-wide mb-1">Credit Balance</p><p class="text-2xl font-bold text-emerald-400">$${ssrInterpolate(unref(authStore).creditBalance.toFixed(2))}</p></div><div class="bg-slate-900 border border-slate-800 rounded-xl p-5"><p class="text-slate-400 text-xs font-medium uppercase tracking-wide mb-1">Total Orders</p><p class="text-2xl font-bold text-white">${ssrInterpolate(unref(orders).length)}</p></div><div class="bg-slate-900 border border-slate-800 rounded-xl p-5"><p class="text-slate-400 text-xs font-medium uppercase tracking-wide mb-1">Available Packages</p><p class="text-2xl font-bold text-white">${ssrInterpolate(unref(packages).filter((p) => p.is_active).length)}</p></div></div><div class="grid grid-cols-5 gap-6"><div class="col-span-3"><h2 class="text-base font-semibold text-white mb-4">Available Packages</h2>`);
      if (unref(packagesLoading)) {
        _push(`<div class="flex justify-center py-12"><div class="w-7 h-7 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div></div>`);
      } else if (unref(packages).length === 0) {
        _push(`<div class="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center"><p class="text-slate-500 text-sm">No packages available</p></div>`);
      } else {
        _push(`<div class="space-y-3"><!--[-->`);
        ssrRenderList(unref(packages).filter((p) => p.is_active), (pkg) => {
          _push(`<div class="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl p-4 transition-colors"><div class="flex items-start justify-between gap-4"><div class="min-w-0"><p class="text-white font-medium text-sm truncate">${ssrInterpolate(pkg.name)}</p><p class="text-slate-400 text-xs mt-0.5 line-clamp-2">${ssrInterpolate(pkg.description)}</p></div><div class="shrink-0 flex items-center gap-3"><span class="text-emerald-400 font-bold text-sm">$${ssrInterpolate(pkg.price.toFixed(2))}</span><button${ssrIncludeBooleanAttr(unref(actionLoading) === pkg.id || unref(authStore).creditBalance < pkg.price) ? " disabled" : ""} class="bg-primary-600 hover:bg-primary-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors">`);
          if (unref(actionLoading) === pkg.id) {
            _push(`<span class="flex items-center gap-1.5"><span class="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></span> Buying... </span>`);
          } else {
            _push(`<span>Buy</span>`);
          }
          _push(`</button></div></div></div>`);
        });
        _push(`<!--]--></div>`);
      }
      _push(`</div><div class="col-span-2"><h2 class="text-base font-semibold text-white mb-4">My Orders</h2>`);
      if (unref(ordersError)) {
        _push(`<div class="mb-3 px-3 py-2 bg-rose-500/10 border border-rose-500/30 rounded-lg text-rose-400 text-xs">${ssrInterpolate(unref(ordersError))}</div>`);
      } else {
        _push(`<!---->`);
      }
      if (unref(ordersLoading)) {
        _push(`<div class="flex justify-center py-12"><div class="w-7 h-7 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div></div>`);
      } else if (unref(orders).length === 0) {
        _push(`<div class="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center"><p class="text-slate-500 text-sm">No orders yet</p></div>`);
      } else {
        _push(`<div class="space-y-2"><!--[-->`);
        ssrRenderList(unref(orders), (order) => {
          _push(`<div class="bg-slate-900 border border-slate-800 rounded-xl p-3"><div class="flex items-center justify-between gap-2 mb-1"><span class="text-slate-400 text-xs font-mono">${ssrInterpolate(order.id.slice(-8))}</span><span class="${ssrRenderClass([statusColors[order.status], "text-xs font-medium px-2 py-0.5 rounded-full border"])}">${ssrInterpolate(order.status.replace("_", " "))}</span></div><div class="flex items-center justify-between"><span class="text-white text-sm font-semibold">$${ssrInterpolate(order.amount.toFixed(2))}</span>`);
          if (canRefund(order.status)) {
            _push(`<button${ssrIncludeBooleanAttr(unref(actionLoading) === order.id) ? " disabled" : ""} class="text-xs text-slate-400 hover:text-rose-400 disabled:opacity-40 transition-colors">`);
            if (unref(actionLoading) === order.id) {
              _push(`<span>Requesting...</span>`);
            } else {
              _push(`<span>Request refund</span>`);
            }
            _push(`</button>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div><p class="text-slate-500 text-xs mt-1">${ssrInterpolate(new Date(order.created_at).toLocaleDateString())}</p></div>`);
        });
        _push(`<!--]--></div>`);
      }
      _push(`</div></div></div>`);
      ssrRenderTeleport(_push, (_push2) => {
        if (unref(showTopupModal)) {
          _push2(`<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"><div class="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-sm"><div class="flex items-center justify-between mb-5"><h3 class="text-white font-semibold">Top up credit</h3><button class="text-slate-500 hover:text-slate-300 transition-colors"><svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg></button></div>`);
          if (unref(topupSuccess)) {
            _push2(`<div class="mb-4 px-4 py-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400 text-sm text-center"> ✓ Credit topped up successfully! </div>`);
          } else {
            _push2(`<!---->`);
          }
          if (unref(topupError)) {
            _push2(`<div class="mb-4 px-4 py-3 bg-rose-500/10 border border-rose-500/30 rounded-lg text-rose-400 text-sm">${ssrInterpolate(unref(topupError))}</div>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`<div class="mb-4"><label class="block text-slate-300 text-sm font-medium mb-1.5">Amount ($)</label><input${ssrRenderAttr("value", unref(topupAmount))} type="number" min="1" step="0.01" placeholder="0.00" class="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"></div><div class="flex gap-3"><button class="flex-1 border border-slate-700 text-slate-300 hover:bg-slate-800 font-medium py-2.5 rounded-lg text-sm transition-colors"> Cancel </button><button${ssrIncludeBooleanAttr(unref(topupLoading) || unref(topupAmount) <= 0) ? " disabled" : ""} class="flex-1 bg-primary-600 hover:bg-primary-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-lg text-sm transition-colors">`);
          if (unref(topupLoading)) {
            _push2(`<span class="flex items-center justify-center gap-2"><span class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span> Processing... </span>`);
          } else {
            _push2(`<span>Confirm</span>`);
          }
          _push2(`</button></div></div></div>`);
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=dashboard-CPb_t4Wy.js.map
