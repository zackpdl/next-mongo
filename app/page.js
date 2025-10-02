import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

export default function BoxBasic() {
  return (
    <main>
      <Box component="section" className="border border-gray-800 m-5 text-center">
        <h1 className="text-3xl text-violet-950">Stock Management v1.0</h1>
        <ul>
          <li><a href="/app/stock/product">Products</a></li>
          <li><a href="/app/stock/category">Category</a></li>
          <li><a href="/app/stock/stock">Stock Management</a></li>
          <li><a href="/app/stock/fin-customer">Customer Management</a></li>
        </ul>
        
      </Box>
    </main>
  );
}

