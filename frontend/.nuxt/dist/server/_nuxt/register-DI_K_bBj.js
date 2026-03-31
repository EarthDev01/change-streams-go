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
  __name: "register",
  __ssrInlineRender: true,
  setup(__props) {
    useAuthStore();
    useRouter();
    const form = reactive({ username: "", email: "", password: "" });
    const loading = ref(false);
    const error = ref(null);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "bg-slate-900 border border-slate-800 rounded-2xl p-8" }, _attrs))}><div class="flex items-center gap-2 mb-1"><span class="text-xs bg-primary-600/20 text-primary-400 border border-primary-500/30 px-2 py-0.5 rounded-full font-medium"> Admin </span><h2 class="text-xl font-bold text-white">Create account</h2></div><p class="text-slate-400 text-sm mb-6">Register a new admin account</p>`);
      if (unref(error)) {
        _push(`<div class="mb-4 px-4 py-3 bg-rose-500/10 border border-rose-500/30 rounded-lg text-rose-400 text-sm">${ssrInterpolate(unref(error))}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<form class="space-y-4"><div><label class="block text-slate-300 text-sm font-medium mb-1.5">Username</label><input${ssrRenderAttr("value", unref(form).username)} type="text" required placeholder="admin" class="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"></div><div><label class="block text-slate-300 text-sm font-medium mb-1.5">Email</label><input${ssrRenderAttr("value", unref(form).email)} type="email" required placeholder="admin@example.com" class="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"></div><div><label class="block text-slate-300 text-sm font-medium mb-1.5">Password</label><input${ssrRenderAttr("value", unref(form).password)} type="password" required minlength="6" placeholder="At least 6 characters" class="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"></div><button type="submit"${ssrIncludeBooleanAttr(unref(loading)) ? " disabled" : ""} class="w-full bg-primary-600 hover:bg-primary-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2.5 px-4 rounded-lg transition-colors text-sm">`);
      if (unref(loading)) {
        _push(`<span class="flex items-center justify-center gap-2"><span class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span> Creating account... </span>`);
      } else {
        _push(`<span>Create admin account</span>`);
      }
      _push(`</button></form><p class="text-slate-400 text-sm text-center mt-6"> Already registered? `);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/admin/login",
        class: "text-primary-400 hover:text-primary-300 font-medium transition-colors"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Sign in `);
          } else {
            return [
              createTextVNode(" Sign in ")
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/admin/register.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=register-DI_K_bBj.js.map
