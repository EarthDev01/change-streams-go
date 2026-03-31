import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";
const ROLE_KEY = "auth_role";
const useAuthStore = defineStore("auth", () => {
  const token = ref(null);
  const user = ref(null);
  const isAuthenticated = computed(() => !!token.value);
  const isAdmin = computed(() => {
    var _a;
    return ((_a = user.value) == null ? void 0 : _a.role) === "admin";
  });
  const creditBalance = computed(() => {
    var _a, _b;
    return (_b = (_a = user.value) == null ? void 0 : _a.credit_balance) != null ? _b : 0;
  });
  function setAuth(result) {
    token.value = result.token;
    user.value = result.user;
    localStorage.setItem(TOKEN_KEY, result.token);
    localStorage.setItem(USER_KEY, JSON.stringify(result.user));
    localStorage.setItem(ROLE_KEY, result.user.role);
  }
  function clearAuth() {
    token.value = null;
    user.value = null;
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(ROLE_KEY);
  }
  function updateCreditBalance(newBalance) {
    if (user.value) {
      user.value = { ...user.value, credit_balance: newBalance };
      localStorage.setItem(USER_KEY, JSON.stringify(user.value));
    }
  }
  function loadFromStorage() {
    const storedToken = localStorage.getItem(TOKEN_KEY);
    const storedUser = localStorage.getItem(USER_KEY);
    if (storedToken && storedUser) {
      token.value = storedToken;
      user.value = JSON.parse(storedUser);
    }
  }
  return {
    token,
    user,
    isAuthenticated,
    isAdmin,
    creditBalance,
    setAuth,
    clearAuth,
    updateCreditBalance,
    loadFromStorage
  };
});

export { useAuthStore as u };
//# sourceMappingURL=auth.store-Dw2_dY2Q.mjs.map
