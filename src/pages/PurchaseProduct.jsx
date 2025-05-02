import { useEffect, useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchPurchaseCount,
  savePurchaseOrder,
} from "../store/thunk/purchaseOrderThunk";
import { fetchSuppliers } from "../store/thunk/supplierThunk";
import { fetchCategories } from "../store/thunk/CategoryThunk";
import { fetchProductsByCategoryAndType } from "../store/thunk/productThunks";

const PurchaseProduct = () => {
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

  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState({});
  const [suppliers, setSuppliers] = useState([]);

  console.log("Categories:", categories);
  console.log("Products:", products);

  const { purchaseCount } = useSelector((state) => state.purchase);
  const { list: supplierData } = useSelector((state) => state.suppliers);
  const { list: categoryData } = useSelector((state) => state.category);
  const { productsByCategory: productData } = useSelector(
    (state) => state.products
  );

  useEffect(() => {
    dispatch(fetchSuppliers());
    dispatch(fetchCategories());
    dispatch(fetchPurchaseCount());
  }, [dispatch]);

  useEffect(() => {
    if (supplierData) setSuppliers(supplierData);
  }, [supplierData]);

  useEffect(() => {
    if (categoryData) setCategories(categoryData);
  }, [categoryData]);

  useEffect(() => {
    if (productData) setProducts((prev) => ({ ...prev, ...productData }));
  }, [productData]);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const invoice = `PO${today.replace(/-/g, "")}${purchaseCount}`;
    setInvoiceNumber(invoice);
    setValue("purchaseDate", today);
  }, [purchaseCount, setValue]);

  const handleAddItem = () => {
    const selectedCategory = watch("selectedCategory");
    const selectedProduct = watch("selectedProduct");
    const quantity = watch("selectedQuantity");

    if (!selectedCategory || !selectedProduct || quantity < 1) {
      alert("Please select all item fields");
      return;
    }

    const product = Object.values(products).find(
      (p) => p.productId == selectedProduct
    );

    append({
      categoryId: selectedCategory,
      productId: selectedProduct,
      productName: product.product_name,
      categoryName: categories.find((c) => c.categoryId == selectedCategory)
        ?.category_name,
      price: product.product_price,
      quantity: quantity,
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
    console.log("Form Data:", data);
    // console.log("Invoice Number:", invoiceNumber);
    // console.log("Grand Total:", calculateTotals());

    if (fields.length === 0) {
      alert("Please add at least one item to the order");
      return;
    }

    const purchaseOrder = {
      purchaseInvoice: invoiceNumber,
      supplier_id: data.supplier_id,
      supplier_name: suppliers.find(
        (supplier) => supplier.supplier_id == data.supplier_id
      )?.supplier_name,
      purchaseDate: data.purchaseDate,
      grand_total: calculateTotals(),
      items: data.items.map((item) => ({
        product_Id: item.productId,
        item_qty: item.quantity,
        item_total_price: item.price * item.quantity,
      })),
    };

    try {
      await dispatch(savePurchaseOrder(purchaseOrder)).unwrap();
      alert("Purchase order created successfully");
      reset();
      dispatch(fetchPurchaseCount());
      setProducts({});
    } catch (error) {
      alert(error.message || "Failed to create purchase order");
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
            Purchase Products
          </h2>

          {/* Supplier & Invoice Section */}
          <div className="mb-4 p-3 bg-white rounded shadow-sm border">
            <div className="row align-items-center">
              <div className="col-md-6">
                <label className="fw-bold">Invoice:</label>
                <span className="text-secondary ms-2">{invoiceNumber}</span>
              </div>
              <div className="col-md-6 text-md-end">
                <label className="fw-bold">Date:</label>
                <input
                  type="date"
                  {...register("purchaseDate", { required: true })}
                  className="form-control d-inline-block w-auto"
                  required
                />
              </div>
            </div>
            <div className="mt-3">
              <label className="form-label fw-bold">Supplier:</label>
              <select
                {...register("supplier_id", { required: true })}
                className="form-select border"
                required
              >
                <option value="">Select Supplier</option>
                {suppliers.map((supplier) => (
                  <option
                    key={supplier.supplier_id}
                    value={supplier.supplier_id}
                  >
                    {supplier.supplier_name}
                  </option>
                ))}
              </select>
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
                            purchase_sale: "purchase",
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
                      <td>₹{item.price}</td>
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
              {fields.length == 0 && (
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
                ₹{calculateTotals().toLocaleString()}
              </span>
            </h4>
          </div>

          {/* Submit Button */}
          <div className="mt-4 text-center">
            <button
              type="submit"
              className="btn btn-primary btn-lg px-5 fw-semibold"
            >
              Create Purchase Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PurchaseProduct;
