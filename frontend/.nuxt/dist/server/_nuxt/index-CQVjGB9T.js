import { defineComponent, mergeProps, useSSRContext } from "vue";
import { ssrRenderAttrs } from "vue/server-renderer";
import "/Users/earth/Documents/MyApp/ChangeStreams/frontend/node_modules/hookable/dist/index.mjs";
import "../server.mjs";
import "/Users/earth/Documents/MyApp/ChangeStreams/frontend/node_modules/ofetch/dist/node.mjs";
import "#internal/nuxt/paths";
import "/Users/earth/Documents/MyApp/ChangeStreams/frontend/node_modules/unctx/dist/index.mjs";
import "/Users/earth/Documents/MyApp/ChangeStreams/frontend/node_modules/h3/dist/index.mjs";
import "pinia";
import "/Users/earth/Documents/MyApp/ChangeStreams/frontend/node_modules/defu/dist/defu.mjs";
import "vue-router";
import "/Users/earth/Documents/MyApp/ChangeStreams/frontend/node_modules/ufo/dist/index.mjs";
import "/Users/earth/Documents/MyApp/ChangeStreams/frontend/node_modules/klona/dist/index.mjs";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-slate-950 flex items-center justify-center" }, _attrs))}><div class="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
export {
  _sfc_main as default
};
//# sourceMappingURL=index-CQVjGB9T.js.map
