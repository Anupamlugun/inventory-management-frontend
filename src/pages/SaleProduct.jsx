import { useEffect, useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { saveSaleOrder } from "../store/thunk/saleOrderThunk";
import { fetchPurchaseCount } from "../store/thunk/purchaseOrderThunk";
import { fetchCategories } from "../store/thunk/categoryThunk";
import { fetchProductsByCategoryAndType } from "../store/thunk/productThunks";

const MIN_GST = 0.05;
const MAX_GST = 0.1;
const MAX_PROFIT = 0.1;
const MIN_PROFIT = 0.05;

const SaleProduct = () => {
  const dispatch = useDispatch();
  const { control, handleSubmit, register, watch, setValue, reset } = useForm({
    defaultValues: {
      selectedCategory: "",
      selectedProduct: "",
      selectedQuantity: 1,
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState({});
  const [availableProducts, setAvailableProducts] = useState([]);

  console.log("Available Products:", availableProducts);

  const { purchaseCount } = useSelector((state) => state.purchase);
  const { list: categoryData } = useSelector((state) => state.category);
  const { productsByCategory: productData } = useSelector(
    (state) => state.products
  );

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchPurchaseCount());
  }, [dispatch]);

  useEffect(() => {
    if (categoryData) setCategories(categoryData);
  }, [categoryData]);

  useEffect(() => {
    if (productData) setProducts((prev) => ({ ...prev, ...productData }));
  }, [productData]);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];

    setValue("saleDate", today);
  }, [purchaseCount, setValue]);

  const handleAddItem = () => {
    const selectedCategory = watch("selectedCategory");
    const selectedProduct = watch("selectedProduct");
    const quantity = watch("selectedQuantity");

    const exists = fields.some((item) => {
      console.log("Category ID:", item.categoryId);
      console.log("Product ID:", item.productId);

      return (
        item.categoryId === selectedCategory &&
        item.productId === selectedProduct
      );
    });

    if (exists) {
      alert("Item already added to the list");
      return;
    }

    if (Number(quantity) > availableProducts.available) {
      alert("No products available for the selected category");
      return;
    }

    if (!selectedCategory || !selectedProduct || quantity < 1) {
      alert("Please select all item fields");
      return;
    }

    const product = Object.values(products).find(
      (p) => p.productId == selectedProduct
    );

    // Calculate profit and GST
    const isPremiumProduct = product.product_price > 1000;

    // Use MIN rates for products over 1000, MAX otherwise
    const profitMargin = isPremiumProduct ? MAX_PROFIT : MIN_PROFIT;
    const gstRate = isPremiumProduct ? MAX_GST : MIN_GST;

    const salePrice =
      product.product_price +
      product.product_price * profitMargin +
      product.product_price * gstRate;

    append({
      categoryId: selectedCategory,
      productId: selectedProduct,
      productName: product.product_name,
      categoryName: categories.find((c) => c.categoryId == selectedCategory)
        ?.category_name,
      price: salePrice,
      quantity: quantity,
      profitMargin,
      gstRate,
    });

    // Reset selection fields
    setValue("selectedCategory", "");
    setValue("selectedProduct", "");
    setValue("selectedQuantity", 1);
  };

  const calculateTotals = () => {
    return fields.reduce(
      (acc, item) => acc + (item.price || 0) * (item.quantity || 0),
      0
    );
  };

  const onSubmit = async (data) => {
    if (fields.length === 0) {
      alert("Please add at least one item to the order");
      return;
    }

    const saleOrder = {
      sale_grand_total: calculateTotals(),
      customer_name: data.customer_name,
      phone_number: data.customer_phone,
      items: data.items.map((item) => ({
        product_Id: item.productId,
        item_qty: item.quantity,
        item_total_price: item.price * item.quantity,
      })),
    };
    console.log("Form Data:", saleOrder);
    try {
      const response = await dispatch(
        saveSaleOrder({ saleData: saleOrder })
      ).unwrap();

      alert(response);

      reset();
      dispatch(fetchPurchaseCount());
      setProducts({});
    } catch (error) {
      alert(error.message || "Failed to create sale order");
    } finally {
      fields.forEach((_, index) => remove(index));
    }
  };

  return (
    <div className="container mt-5">
      <div className="container-fluid">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-4 bg-light rounded shadow-sm border"
        >
          <h2 className="mb-4 text-center text-primary fw-bold">
            Sale Products
          </h2>

          {/* Customer & Invoice Section */}
          <div className="mb-4 p-3 bg-white rounded shadow-sm border">
            {/* <div className="row align-items-center">
              <div
                className="col-md-12
               text-md-end"
              >
                <label className="fw-bold">Date:</label>
                <input
                  type="date"
                  {...register("saleDate")}
                  className="form-control d-inline-block w-auto"
                  readOnly
                  disabled
                />
              </div>
            </div> */}
            <div className="mt-3">
              <div className="row">
                <div className="col-md-6">
                  <label className="form-label fw-bold">Customer Name:</label>
                  <input
                    type="text"
                    {...register("customer_name", { required: true })}
                    className="form-control border"
                    required
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-bold">Customer Phone:</label>
                  <input
                    type="text"
                    {...register("customer_phone", { required: true })}
                    className="form-control border"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Item Selection Row */}
          <div className="p-3 bg-white rounded shadow-sm border mb-4">
            <h4 className="text-secondary fw-semibold mb-3">Add New Item</h4>
            <div className="row g-3 align-items-end">
              <div className="col-md-3">
                <label className="form-label">Category</label>
                <Controller
                  name="selectedCategory"
                  control={control}
                  render={({ field }) => (
                    <select
                      {...field}
                      className="form-select"
                      onChange={(e) => {
                        field.onChange(e.target.value);
                        dispatch(
                          fetchProductsByCategoryAndType({
                            category_id: e.target.value,
                            purchase_sale: "sale",
                          })
                        );
                      }}
                    >
                      <option value="">Select Category</option>
                      {categories.map((category) => (
                        <option
                          key={category.categoryId}
                          value={category.categoryId}
                        >
                          {category.category_name}
                        </option>
                      ))}
                    </select>
                  )}
                />
              </div>

              <div className="col-md-3">
                <label className="form-label">Product</label>
                <Controller
                  name="selectedProduct"
                  control={control}
                  render={({ field }) => (
                    <select
                      {...field}
                      className="form-select"
                      disabled={!watch("selectedCategory")}
                      onChange={(e) => {
                        field.onChange(e.target.value);
                        const selectedProduct = Object.values(products).find(
                          (product) => product.productId == e.target.value
                        );
                        setAvailableProducts(selectedProduct);
                      }}
                    >
                      <option value="">Select Product</option>
                      {Object.values(products)
                        .filter(
                          (product) =>
                            product.categoryId == watch("selectedCategory")
                        )
                        .map((product) => (
                          <option
                            key={product.productId}
                            value={product.productId}
                          >
                            {product.product_name}
                          </option>
                        ))}
                    </select>
                  )}
                />
              </div>

              <div className="col-md-2">
                <label className="form-label">Quantity</label>
                <input
                  type="number"
                  {...register("selectedQuantity", { min: 1 })}
                  className="form-control"
                  min="1"
                  max={availableProducts.available}
                />
              </div>

              <div className="col-md-2">
                <button
                  type="button"
                  className="btn btn-success w-100"
                  onClick={handleAddItem}
                >
                  Add Item
                </button>
              </div>
            </div>
          </div>

          {/* Cart Table */}
          <div className="p-3 bg-white rounded shadow-sm border mb-4">
            <h4 className="text-secondary fw-semibold mb-3">Items List</h4>
            <div className="table-responsive">
              <table className="table table-bordered align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Category</th>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Total</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {fields.map((item, index) => (
                    <tr key={item.id}>
                      <td>{item.categoryName}</td>
                      <td>{item.productName}</td>
                      <td>₹{item.price.toFixed(2)}</td>
                      <td>{item.quantity}</td>
                      <td>₹{(item.price * item.quantity).toFixed(2)}</td>
                      <td className="text-center">
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => remove(index)}
                        >
                          ×
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {fields.length === 0 && (
                <div className="text-center py-3 text-muted">
                  No items added yet
                </div>
              )}
            </div>
          </div>

          {/* Grand Total */}
          <div className="p-3 bg-white rounded shadow-sm border text-center">
            <h4 className="text-dark fw-bold">
              Grand Total:{" "}
              <span className="text-success fw-bold ms-2">
                ₹
                {calculateTotals().toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })}
              </span>
            </h4>
          </div>

          {/* Submit Button */}
          <div className="mt-4 text-center">
            <button
              type="submit"
              className="btn btn-primary btn-lg px-5 fw-semibold"
            >
              Create Sale Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SaleProduct;
