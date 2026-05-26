import Product from "../models/ProductModel.js";

const createProduct = (newProduct) => {
  return new Promise(async (resolve, reject) => {
    const { name, image, type, price, countInStock, rating, description, discount } = newProduct;
    try {
      const checkProduct = await Product.findOne({
        name: name,
      });
      if (checkProduct !== null) {
        resolve({
          status: "ERR",
          message: "The name of product is already",
        });
      }
      const newProductCreated = await Product.create({
        name,
        image,
        type,
        price,
        countInStock,
        rating,
        description,
        discount,
      });
      if (newProductCreated) {
        resolve({
          status: "OK",
          message: "SUCCESS",
          data: newProductCreated,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const updateProduct = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkProduct = await Product.findOne({
        _id: id,
      });
      if (checkProduct === null) {
        resolve({
          status: "ERR",
          message: "The product is not defined",
        });
      }

      const updatedProduct = await Product.findByIdAndUpdate(id, data, { new: true });
      resolve({
        status: "OK",
        message: "SUCCESS",
        data: updatedProduct,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const deleteProduct = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkProduct = await Product.findOne({
        _id: id,
      });
      if (checkProduct === null) {
        resolve({
          status: "ERR",
          message: "The product is not defined",
        });
      }

      await Product.findByIdAndDelete(id);
      resolve({
        status: "OK",
        message: "Delete product success",
      });
    } catch (e) {
      reject(e);
    }
  });
};

const deleteManyProduct = (ids) => {
  return new Promise(async (resolve, reject) => {
    try {
      await Product.deleteMany({ _id: ids });
      resolve({
        status: "OK",
        message: "Delete products success",
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getDetailsProduct = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const product = await Product.findOne({
        _id: id,
      });
      if (product === null) {
        resolve({
          status: "ERR",
          message: "The product is not defined",
        });
      }
      resolve({
        status: "OK",
        message: "SUCCESS",
        data: product,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getAllProduct = (limit, page, sort, filter) => {
  return new Promise(async (resolve, reject) => {
    try {
      let query = {};
      if (filter && Array.isArray(filter)) {
        for (let i = 0; i < filter.length; i += 2) {
          const label = filter[i];
          const value = filter[i + 1];
          if (label && value) {
             query[label] = { $regex: value, $options: 'i' };
          }
        }
      } else if (filter && typeof filter === 'string') {
          // Fallback if somehow it's a string, though it shouldn't be based on our frontend
      }

      const totalProduct = await Product.countDocuments(query);
      let dbQuery = Product.find(query);

      if (sort && Array.isArray(sort) && sort.length >= 2) {
        const objectSort = {};
        objectSort[sort[1]] = sort[0];
        dbQuery = dbQuery.sort(objectSort).sort({ createdAt: -1, updatedAt: -1 });
      } else {
        dbQuery = dbQuery.sort({ createdAt: -1, updatedAt: -1 });
      }

      if (limit) {
        dbQuery = dbQuery.limit(limit).skip(page * limit);
      }

      const allProduct = await dbQuery;

      resolve({
        status: "OK",
        message: "Success",
        data: allProduct,
        total: totalProduct,
        pageCurrent: Number(page + 1),
        totalPage: limit ? Math.ceil(totalProduct / limit) : 1,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getAllType = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const allType = await Product.distinct("type");
      resolve({
        status: "OK",
        message: "Success",
        data: allType,
      });
    } catch (e) {
      reject(e);
    }
  });
};

export default {
  createProduct,
  updateProduct,
  getDetailsProduct,
  deleteProduct,
  getAllProduct,
  deleteManyProduct,
  getAllType,
};
