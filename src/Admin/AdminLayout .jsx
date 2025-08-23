import React from 'react';
import { Outlet, Link } from 'react-router-dom';

const AdminLayout = () => {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-800 text-white p-5">
        <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
        <nav className="space-y-2">
          <Link to="/admin" className="block hover:text-blue-300">Invertory</Link>
          <Link to="/admin/products" className="block hover:text-blue-300">Products</Link>
        
          <Link to="/admin/category" className="block hover:text-blue-300">Category</Link>
             <Link to="/admin/moneyset" className="block hover:text-blue-300">Set Money</Link>
               <Link to="/admin/order" className="block hover:text-blue-300">Manage Order</Link>
                 <Link to="/admin/users" className="block hover:text-blue-300">Users</Link>
                   <Link
  to="https://dashboard.qikink.com/index.php/client/orders/newOrder"
  target="_blank"
  rel="noopener noreferrer"
  className="block hover:text-blue-300"
>
  Qikink
</Link>
<Link to="/admin/sales" className="block hover:text-blue-300">Analysis</Link>

        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 bg-gray-50 p-6">
        <Outlet /> {/* Render nested routes here */}
      </main>
    </div>
  );
};

export default AdminLayout;
