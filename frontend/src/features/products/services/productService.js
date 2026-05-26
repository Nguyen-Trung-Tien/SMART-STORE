import { api } from "@/lib/api";

export const productService = {
  getAllProducts: (search = "", limit = 12, page = 0, type = "") => {
    let url = `/product/get-all?limit=${limit}&page=${page}`;
    if (search) {
      url += `&filter=name&filter=${search}`;
    }
    if (type) {
      url += `&filter=type&filter=${type}`;
    }
    return api.get(url);
  },

  getProductDetails: (id) => {
    return api.get(`/product/get-details/${id}`);
  },

  getAllTypes: () => {
    return api.get("/product/get-all-type");
  },

  createProduct: (data) => {
    return api.post("/product/create", data);
  },

  updateProduct: (id, data) => {
    return api.put(`/product/update/${id}`, data);
  },

  deleteProduct: (id) => {
    return api.delete(`/product/delete/${id}`);
  },

  deleteManyProducts: (ids) => {
    return api.post("/product/delete-many", { ids });
  },
};
