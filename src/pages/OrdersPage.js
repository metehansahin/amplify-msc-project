import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  CircularProgress,
  Stack,
  Button,
} from "@mui/material";
import axios from "axios";
import NavigationBar from "../components/NavigationBar";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [products, setProducts] = useState({});

  const userId =
    sessionStorage.getItem("userId") || localStorage.getItem("userId");
  const merchant =
    sessionStorage.getItem("merchant") === "true" ||
    localStorage.getItem("merchant") === "true";

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        let response;
        if (merchant) {
          response = await axios.get(`${process.env.SERVER_URL}/order`);
        } else {
          response = await axios.get(
            `${process.env.SERVER_URL}order/${userId}/all`
          );
        }

        const sortedOrders = response.data.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
        setOrders(sortedOrders);

        const productPromises = [];
        sortedOrders.forEach((order) =>
          order.products.forEach((product) =>
            productPromises.push(
              axios.get(
                `${process.env.SERVER_URL}/product/${product.productID}`
              )
            )
          )
        );
        const productResponses = await Promise.all(productPromises);

        const productMap = {};
        productResponses.forEach((response) => {
          productMap[response.data._id] = response.data.name;
        });
        setProducts(productMap);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching orders or products:", error);
        setLoading(false);
      }
    };

    fetchOrders();
  }, [merchant, userId]);

  const handleFulfillOrder = async (orderId) => {
    try {
      await axios.put(`${process.env.SERVER_URL}/order/${orderId}/fulfill`);
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, fulfilled: true } : order
        )
      );
    } catch (error) {
      console.error("Error fulfilling order:", error);
    }
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <React.Fragment>
      <NavigationBar />
      <h1>Orders</h1>
      <Container maxWidth="lg" sx={{ marginTop: 4 }}>
        {loading ? (
          <Stack alignItems="center">
            <CircularProgress />
          </Stack>
        ) : (
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="orders table">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Address</TableCell>
                  <TableCell>Products</TableCell>
                  <TableCell align="right">Total Cost</TableCell>
                  <TableCell align="right">Date</TableCell>
                  <TableCell align="center">Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((order) => (
                    <TableRow key={order._id}>
                      <TableCell>{order.name}</TableCell>
                      <TableCell>{order.address}</TableCell>
                      <TableCell>
                        {order.products.map((product, index) => (
                          <div key={index}>
                            {products[product.productID]} (Quantity:{" "}
                            {product.quantity})
                          </div>
                        ))}
                      </TableCell>
                      <TableCell align="right">{order.totalCost}</TableCell>
                      <TableCell align="right">
                        {new Date(order.date).toLocaleString()}
                      </TableCell>
                      <TableCell align="center">
                        {order.fulfilled ? (
                          <Typography sx={{ color: "green" }}>
                            Fulfilled
                          </Typography>
                        ) : merchant ? (
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleFulfillOrder(order._id)}
                          >
                            Fulfill
                          </Button>
                        ) : (
                          <Typography sx={{ color: "red" }}>Pending</Typography>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            <TablePagination
              component="div"
              count={orders.length}
              page={page}
              onPageChange={handlePageChange}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleRowsPerPageChange}
              rowsPerPageOptions={[5, 10, 25]}
            />
          </TableContainer>
        )}
      </Container>
    </React.Fragment>
  );
};

export default Orders;
