import { useLocation } from "react-router-dom";
import "./order.css";
import { useState } from "react";
import axios from "axios";

export default function Order() {
  const location = useLocation();
  const orderId = location.pathname.split("/")[2];
  const [status, setStatus] = useState();

  const user = JSON.parse(localStorage.getItem("persist:root"))?.user;
  const currentUsers = user && JSON.parse(user).currentUser;
  const TOKEN = currentUsers?.accessToken;

  const headers = { token: `Bearer ${TOKEN}` };

  const handleChange = (event) => {
    setStatus(event.target.value);
  };

  const handleClick = async (e) => {
    e.preventDefault();
    axios.put(
      "http://localhost:5000/api/orders/" + orderId,
      {
        status: status,
      },
      { headers: headers }
    );
  };

  return (
    <div className="order">
      <div className="orderTitleContainer">
        <h1 className="orderTitle">Order Information</h1>
      </div>
      <div className="orderTop">
        <div className="productTopLeft"></div>
      </div>
      <div className="orderBottom">
        <h1 className="orderTitle">Update Order status</h1>
        <br />
        <form className="orderForm">
          <div className="orderFormLeft">
            <label>Status</label>
            <select name="inStock" onChange={handleChange}>
              <option value="pending">Pending</option>
              <option value="inprogress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <button className="orderButton" onClick={handleClick}>
            Update Order Status
          </button>
        </form>
      </div>
    </div>
  );
}