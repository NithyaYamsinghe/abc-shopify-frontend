import "./orderList.css";
import { DataGrid } from "@material-ui/data-grid";
import { DeleteOutline } from "@material-ui/icons";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function OrderList() {
  const [orders, setOrders] = useState([]);
  const user = JSON.parse(localStorage.getItem("persist:root"))?.user;
  const currentUsers = user && JSON.parse(user).currentUser;
  const TOKEN = currentUsers?.accessToken;

  const headers = { token: `Bearer ${TOKEN}` };

  useEffect(async () => {
    const response = await axios.get("http://localhost:5000/api/orders", {
      headers: headers,
    });
    setOrders(response.data);
  }, [orders]);

  const handleDelete = async (id) => {
    await axios.delete("http://localhost:5000/api/orders/" + id, {
      headers: headers,
    });
  };

  const columns = [
    { field: "_id", headerName: "ID", width: 220 },
    { field: "amount", headerName: "Amount", width: 200 },
    {
      field: "status",
      headerName: "Status",
      width: 160,
    },
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => {
        return (
          <>
            <Link to={"/orderItems/" + params.row._id}>
              <button className="orderListEdit">View Items</button>
            </Link>
            <Link to={"/order/" + params.row._id}>
              <button className="orderListEdit">Edit</button>
            </Link>
            <DeleteOutline
              className="orderListDelete"
              onClick={() => handleDelete(params.row._id)}
            />
          </>
        );
      },
    },
  ];

  return (
    <div className="orderList">
      <DataGrid
        rows={orders}
        disableSelectionOnClick
        columns={columns}
        getRowId={(row) => row._id}
        pageSize={8}
        checkboxSelection
      />
    </div>
  );
}
