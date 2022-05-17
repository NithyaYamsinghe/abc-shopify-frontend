import "./cartList.css";
import { DataGrid } from "@material-ui/data-grid";
import { DeleteOutline } from "@material-ui/icons";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function CartList() {
  const [carts, setCarts] = useState([]);
  const user = JSON.parse(localStorage.getItem("persist:root"))?.user;
  const currentUsers = user && JSON.parse(user).currentUser;
  const TOKEN = currentUsers?.accessToken;

  const headers = { token: `Bearer ${TOKEN}` };

  useEffect(async () => {
    const response = await axios.get(
      "http://a21f6cee680614373bf75e2759b51e67-1616939274.us-west-2.elb.amazonaws.com:5000/api/carts",
      {
        headers: headers,
      }
    );
    setCarts(response.data);
  }, [carts]);

  const handleDelete = async (id) => {
    await axios.delete(
      "http://a21f6cee680614373bf75e2759b51e67-1616939274.us-west-2.elb.amazonaws.com:5000/api/carts/" +
        id,
      {
        headers: headers,
      }
    );
  };

  const columns = [
    { field: "_id", headerName: "ID", width: 220 },
    { field: "userId", headerName: "ID", width: 220 },
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => {
        return (
          <>
            <Link to={"/cartItems/" + params.row._id}>
              <button className="cartListEdit">View Items</button>
            </Link>
            <DeleteOutline
              className="cartListDelete"
              onClick={() => handleDelete(params.row._id)}
            />
          </>
        );
      },
    },
  ];

  return (
    <div className="cartList">
      <DataGrid
        rows={carts}
        disableSelectionOnClick
        columns={columns}
        getRowId={(row) => row._id}
        pageSize={8}
        checkboxSelection
      />
    </div>
  );
}
