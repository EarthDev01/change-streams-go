import { _ as __nuxt_component_0 } from './nuxt-link-CT0YijYu.mjs';
import { defineComponent, computed, mergeProps, unref, withCtx, openBlock, createBlock, createCommentVNode, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderComponent, ssrRenderSlot } from 'vue/server-renderer';
import { u as useAuthStore } from './auth.store-Dw2_dY2Q.mjs';
import { u as useRouter, a as useRoute } from './server.mjs';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import 'pinia';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import 'vue-router';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "default",
  __ssrInlineRender: true,
  setup(__props) {
    const authStore = useAuthStore();
    useRouter();
    const route = useRoute();
    const isAdminArea = computed(() => route.path.startsWith("/admin"));
    const navLinks = computed(
      () => isAdminArea.value ? [{ label: "Dashboard", path: "/admin/dashboard", icon: "grid" }] : [
        { label: "Dashboard", path: "/dashboard", icon: "grid" }
      ]
    );
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c, _d, _e;
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-slate-950 flex" }, _attrs))}><aside class="w-64 bg-slate-900 border-r border-slate-800 flex flex-col fixed inset-y-0 left-0 z-30"><div class="flex items-center gap-3 px-6 py-5 border-b border-slate-800"><div class="w-9 h-9 rounded-xl bg-primary-600 flex items-center justify-center shrink-0"><svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg></div><div><p class="text-white font-semibold text-sm leading-tight">ChangeStreams</p><p class="text-primary-400 text-xs">${ssrInterpolate(unref(isAdminArea) ? "Admin Panel" : "User Portal")}</p></div></div><nav class="flex-1 px-4 py-4 space-y-1"><!--[-->`);
      ssrRenderList(unref(navLinks), (link) => {
        _push(ssrRenderComponent(_component_NuxtLink, {
          key: link.path,
          to: link.path,
          class: ["flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors", unref(route).path === link.path ? "bg-primary-600/20 text-primary-400" : "text-slate-400 hover:bg-slate-800 hover:text-slate-100"]
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"${_scopeId}>`);
              if (link.icon === "grid") {
                _push2(`<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"${_scopeId}></path>`);
              } else {
                _push2(`<!---->`);
              }
              _push2(`</svg> ${ssrInterpolate(link.label)}`);
            } else {
              return [
                (openBlock(), createBlock("svg", {
                  class: "w-4 h-4",
                  fill: "none",
                  stroke: "currentColor",
                  viewBox: "0 0 24 24"
                }, [
                  link.icon === "grid" ? (openBlock(), createBlock("path", {
                    key: 0,
                    "stroke-linecap": "round",
                    "stroke-linejoin": "round",
                    "stroke-width": "2",
                    d: "M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                  })) : createCommentVNode("", true)
                ])),
                createTextVNode(" " + toDisplayString(link.label), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></nav><div class="px-4 py-4 border-t border-slate-800"><div class="bg-slate-800 rounded-xl p-3 mb-3"><div class="flex items-center gap-3"><div class="w-8 h-8 rounded-lg bg-primary-700 flex items-center justify-center shrink-0"><span class="text-primary-200 text-xs font-bold uppercase">${ssrInterpolate((_c = (_b = (_a = unref(authStore).user) == null ? void 0 : _a.username) == null ? void 0 : _b.charAt(0)) != null ? _c : "?")}</span></div><div class="min-w-0"><p class="text-white text-sm font-medium truncate">${ssrInterpolate((_d = unref(authStore).user) == null ? void 0 : _d.username)}</p><p class="text-slate-400 text-xs truncate">${ssrInterpolate((_e = unref(authStore).user) == null ? void 0 : _e.email)}</p></div></div>`);
      if (!unref(isAdminArea)) {
        _push(`<div class="mt-2 pt-2 border-t border-slate-700 flex items-center justify-between"><span class="text-slate-400 text-xs">Balance</span><span class="text-emerald-400 text-xs font-semibold"> $${ssrInterpolate(unref(authStore).creditBalance.toFixed(2))}</span></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><button class="w-full flex items-center gap-2 px-3 py-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg text-sm transition-colors"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg> Sign out </button></div></aside><main class="flex-1 ml-64 min-h-screen">`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</main></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/default.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=default-BDXY6pN_.mjs.map
