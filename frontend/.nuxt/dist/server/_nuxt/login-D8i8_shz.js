import { _ as __nuxt_component_0 } from "./nuxt-link-CT0YijYu.js";
import { defineComponent, reactive, ref, mergeProps, unref, withCtx, createTextVNode, useSSRContext } from "vue";
import { ssrRenderAttrs, ssrInterpolate, ssrRenderAttr, ssrIncludeBooleanAttr, ssrRenderComponent } from "vue/server-renderer";
import { u as useAuthStore } from "./auth.store-Dw2_dY2Q.js";
import "/Users/earth/Documents/MyApp/ChangeStreams/frontend/node_modules/hookable/dist/index.mjs";
import { u as useRouter } from "../server.mjs";
import "/Users/earth/Documents/MyApp/ChangeStreams/frontend/node_modules/ufo/dist/index.mjs";
import "/Users/earth/Documents/MyApp/ChangeStreams/frontend/node_modules/defu/dist/defu.mjs";
import "pinia";
import "/Users/earth/Documents/MyApp/ChangeStreams/frontend/node_modules/ofetch/dist/node.mjs";
import "#internal/nuxt/paths";
import "/Users/earth/Documents/MyApp/ChangeStreams/frontend/node_modules/unctx/dist/index.mjs";
import "/Users/earth/Documents/MyApp/ChangeStreams/frontend/node_modules/h3/dist/index.mjs";
import "vue-router";
import "/Users/earth/Documents/MyApp/ChangeStreams/frontend/node_modules/klona/dist/index.mjs";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "login",
  __ssrInlineRender: true,
  setup(__props) {
    useAuthStore();
    useRouter();
    const form = reactive({ email: "", password: "" });
    const loading = ref(false);
    const error = ref(null);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "bg-slate-900 border border-slate-800 rounded-2xl p-8" }, _attrs))}><h2 class="text-xl font-bold text-white mb-1">Welcome back</h2><p class="text-slate-400 text-sm mb-6">Sign in to your account</p>`);
      if (unref(error)) {
        _push(`<div class="mb-4 px-4 py-3 bg-rose-500/10 border border-rose-500/30 rounded-lg text-rose-400 text-sm">${ssrInterpolate(unref(error))}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<form class="space-y-4"><div><label class="block text-slate-300 text-sm font-medium mb-1.5">Email</label><input${ssrRenderAttr("value", unref(form).email)} type="email" required placeholder="you@example.com" class="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"></div><div><label class="block text-slate-300 text-sm font-medium mb-1.5">Password</label><input${ssrRenderAttr("value", unref(form).password)} type="password" required placeholder="••••••••" class="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"></div><button type="submit"${ssrIncludeBooleanAttr(unref(loading)) ? " disabled" : ""} class="w-full bg-primary-600 hover:bg-primary-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2.5 px-4 rounded-lg transition-colors text-sm">`);
      if (unref(loading)) {
        _push(`<span class="flex items-center justify-center gap-2"><span class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span> Signing in... </span>`);
      } else {
        _push(`<span>Sign in</span>`);
      }
      _push(`</button></form><p class="text-slate-400 text-sm text-center mt-6"> No account? `);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/register",
        class: "text-primary-400 hover:text-primary-300 font-medium transition-colors"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Register here `);
          } else {
            return [
              createTextVNode(" Register here ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</p><p class="text-slate-500 text-xs text-center mt-2"> Admin? `);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/admin/login",
        class: "text-slate-400 hover:text-slate-300 transition-colors"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Go to admin login `);
          } else {
            return [
              createTextVNode(" Go to admin login ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</p></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/login.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=login-D8i8_shz.js.map
