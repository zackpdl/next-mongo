import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Link from "next/link";

export default function BoxBasic() {
  const basePath = "/app/stock"; // base path for deployment

  return (
    <main>
      <Box component="section" className="border border-gray-800 m-5 text-center">
        <h1 className="text-3xl text-violet-950">Stock Management v1.0</h1>
        <ul>
          <li><Link href={`${basePath}/product`}>Products</Link></li>
          <li><Link href={`${basePath}/category`}>Category</Link></li>
          <li><Link href={`${basePath}/stock`}>Stock Management</Link></li>
        </ul>
      </Box>
    </main>
  );
}
