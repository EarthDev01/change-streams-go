import { ref } from "vue";
function getApiClient() {
  {
    throw new Error("API client not initialized. Call initApiClient() first.");
  }
}
const packageService = {
  async listPackages() {
    const { data } = await getApiClient().get(
      "/api/v1/user/packages"
    );
    if (data.error) throw new Error(data.error);
    return data.data ?? [];
  },
  async createPackage(input) {
    const { data } = await getApiClient().post(
      "/api/v1/admin/packages",
      input
    );
    if (data.error) throw new Error(data.error);
    return data.data;
  }
};
function usePackages() {
  const packages = ref([]);
  const loading = ref(false);
  const error = ref(null);
  async function fetchPackages() {
    loading.value = true;
    error.value = null;
    try {
      packages.value = await packageService.listPackages();
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Failed to fetch packages";
    } finally {
      loading.value = false;
    }
  }
  async function createPackage(input) {
    loading.value = true;
    error.value = null;
    try {
      const newPackage = await packageService.createPackage(input);
      packages.value = [newPackage, ...packages.value];
      return newPackage;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Failed to create package";
      return null;
    } finally {
      loading.value = false;
    }
  }
  return { packages, loading, error, fetchPackages, createPackage };
}
const orderService = {
  async buyPackage(packageId) {
    const { data } = await getApiClient().post(
      `/api/v1/user/packages/${packageId}/buy`
    );
    if (data.error) throw new Error(data.error);
    return data.data;
  },
  async getUserOrders() {
    const { data } = await getApiClient().get(
      "/api/v1/user/orders"
    );
    if (data.error) throw new Error(data.error);
    return data.data ?? [];
  },
  async requestRefund(orderId) {
    const { data } = await getApiClient().post(
      `/api/v1/user/orders/${orderId}/refund`
    );
    if (data.error) throw new Error(data.error);
  },
  async topup(input) {
    const { data } = await getApiClient().post(
      "/api/v1/user/topup",
      input
    );
    if (data.error) throw new Error(data.error);
  },
  async getAdminOrders(status = "pending") {
    const { data } = await getApiClient().get(
      "/api/v1/admin/orders",
      { params: { status } }
    );
    if (data.error) throw new Error(data.error);
    return data.data ?? [];
  },
  async approveOrder(orderId) {
    const { data } = await getApiClient().put(
      `/api/v1/admin/orders/${orderId}/approve`
    );
    if (data.error) throw new Error(data.error);
  },
  async rejectOrder(orderId) {
    const { data } = await getApiClient().put(
      `/api/v1/admin/orders/${orderId}/reject`
    );
    if (data.error) throw new Error(data.error);
  },
  async approveRefund(orderId) {
    const { data } = await getApiClient().put(
      `/api/v1/admin/orders/${orderId}/refund`
    );
    if (data.error) throw new Error(data.error);
  }
};
function useOrders() {
  const orders = ref([]);
  const loading = ref(false);
  const actionLoading = ref(null);
  const error = ref(null);
  async function fetchUserOrders() {
    loading.value = true;
    error.value = null;
    try {
      orders.value = await orderService.getUserOrders();
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Failed to fetch orders";
    } finally {
      loading.value = false;
    }
  }
  async function fetchAdminOrders(status = "pending") {
    loading.value = true;
    error.value = null;
    try {
      orders.value = await orderService.getAdminOrders(status);
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Failed to fetch orders";
    } finally {
      loading.value = false;
    }
  }
  async function buyPackage(packageId) {
    actionLoading.value = packageId;
    error.value = null;
    try {
      const order = await orderService.buyPackage(packageId);
      orders.value = [order, ...orders.value];
      return order;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Failed to purchase package";
      return null;
    } finally {
      actionLoading.value = null;
    }
  }
  async function requestRefund(orderId) {
    actionLoading.value = orderId;
    error.value = null;
    try {
      await orderService.requestRefund(orderId);
      const idx = orders.value.findIndex((o) => o.id === orderId);
      if (idx !== -1) {
        orders.value[idx] = { ...orders.value[idx], status: "refund_requested" };
      }
      return true;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Failed to request refund";
      return false;
    } finally {
      actionLoading.value = null;
    }
  }
  async function approveOrder(orderId) {
    actionLoading.value = orderId;
    error.value = null;
    try {
      await orderService.approveOrder(orderId);
      orders.value = orders.value.filter((o) => o.id !== orderId);
      return true;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Failed to approve order";
      return false;
    } finally {
      actionLoading.value = null;
    }
  }
  async function rejectOrder(orderId) {
    actionLoading.value = orderId;
    error.value = null;
    try {
      await orderService.rejectOrder(orderId);
      orders.value = orders.value.filter((o) => o.id !== orderId);
      return true;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Failed to reject order";
      return false;
    } finally {
      actionLoading.value = null;
    }
  }
  async function approveRefund(orderId) {
    actionLoading.value = orderId;
    error.value = null;
    try {
      await orderService.approveRefund(orderId);
      orders.value = orders.value.filter((o) => o.id !== orderId);
      return true;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Failed to approve refund";
      return false;
    } finally {
      actionLoading.value = null;
    }
  }
  return {
    orders,
    loading,
    actionLoading,
    error,
    fetchUserOrders,
    fetchAdminOrders,
    buyPackage,
    requestRefund,
    approveOrder,
    rejectOrder,
    approveRefund
  };
}
export {
  useOrders as a,
  orderService as o,
  usePackages as u
};
//# sourceMappingURL=useOrders-CJuSKsjG.js.map
