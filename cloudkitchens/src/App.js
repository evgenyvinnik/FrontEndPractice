import React, { useEffect, useState} from 'react';
import io from "socket.io-client";
import './App.css';

function App() {
  const [socket, setSocket] = useState(null);
  const [orders, setOrders] = useState({});
  // const [filter, setFilter] = useState(undefined);
  const [pageFilter, setPageFilter] = useState(0);
  // const [filtered, filterOrders] = useState({});
 
  // establish socket connection
  useEffect(() => {
    setSocket(io('http://localhost:4000'));
  }, []);

  useEffect(() => {
    console.log("pageFilter value" + pageFilter);
  }, [pageFilter]);

 
  // subscribe to the socket event
  useEffect(() => {
    if (!socket) return;
 
    socket.on('connect', () => {
      socket.emit('order_event');
    });

    socket.on('order_event', (data) => {
      var newOrderData = {};
      data.forEach((orderData) => {
          newOrderData = {...newOrderData, [orderData.id]: orderData};
      });

      setOrders({...orders, ...newOrderData});
    });
  }, [socket, orders]);

  function page(pageId){
    var page = {};
    const pageSize = 10;

    console.log("pageId" +  pageId);
    console.log("pageId" +  pageId);
    page =  Object.values(orders).slice(pageId * pageSize, pageId * pageSize + pageSize);
    // page 0
    // slice from 0, 10
    // page 1
    // slice from 10, 20
    // page 2
    // slice from 20 to 30

    console.log("page length" +  Object.values(page).length);

    return Object.values(page)
    .map((order) => {
      return (
          <tr key={order.id}>
            <td>{order.id}</td>
            <td>{order.customer}</td>
            <td>{order.item}</td>
            <td>{order.price}</td>
            <td>{order.event_name}</td>
          </tr>
      )
    });
  };
 
  return (
    <div className="app">
      <div className="search">
        {<input
          name="searchFilter"
          type="number"
          onChange={(e) => setPageFilter(e.target.value)}
          value={pageFilter}>
        </input>}
      </div>
      <div className="table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Customer</th>
              <th>Item</th>
              <th>Price</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {
              page(pageFilter)
            }
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
