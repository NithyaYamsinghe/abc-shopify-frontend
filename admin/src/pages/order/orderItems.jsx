import { useLocation } from "react-router-dom";
import "./order.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { DataGrid } from "@material-ui/data-grid";

export default function OrderItems() {
  const location = useLocation();
  const orderId = location.pathname.split("/")[2];
  const [products, setProducts] = useState([]);

  const user = JSON.parse(localStorage.getItem("persist:root"))?.user;
  const currentUsers = user && JSON.parse(user).currentUser;
  const TOKEN = currentUsers?.accessToken;

  const headers = { token: `Bearer ${TOKEN}` };

  useEffect(async () => {
    const response = await axios.get("http://localhost:5000/api/orders", {
      headers: headers,
    });
    const value = response.data.find((element) => {
      return element._id === orderId;
    });

    setProducts(value.products);
  }, [products]);

  const columns = [
    { field: "_id", headerName: "ID", width: 220 },
    { field: "productId", headerName: "Product ID", width: 200 },
    {
      field: "quantity",
      headerName: "Quantity",
      width: 160,
    },
  ];
  return (
    <div className="orderList">
      <DataGrid
        rows={products}
        disableSelectionOnClick
        columns={columns}
        getRowId={(row) => row._id}
        pageSize={8}
        checkboxSelection
      />
    </div>
  );
}
