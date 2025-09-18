import React from 'react'

export default function EmployeesRoutesPage() {
  const routes = [
    { path: "/employess/banners", name: "Banner" },
    { path: "/employess/products", name: "ProdcutsCreated" },
    { path: "/employess/category", name: "Category" },
    { path: "/employess/order", name: "OrderSection" },
    { path: "/employess/bulkorder", name: "OrderBulk" },
    { path: "/employess/sales", name: "AnalyticsDashboard" },
    { path: "/employess/users", name: "UserInfo" },
    { path: "/employess/logistic", name: "LogisticsManager" },
    { path: "/employess/charges", name: "ChargePlanManager" },
    { path: "/employess/bankdetails", name: "BankDetailsManager" },
    { path: "/employess/invoice", name: "Invoice" },
  ]

  const copyToClipboard = (url) => {
    navigator.clipboard.writeText(url)
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Employees Routes</h1>
        <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
          {routes.map((route, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-4 hover:bg-gray-50"
            >
              <div>
                <p className="text-sm font-medium text-gray-900">{route.name}</p>
                <p className="text-xs text-gray-500">{route.path}</p>
              </div>
              <button
                onClick={() => copyToClipboard(route.path)}
                className="px-3 py-1.5 text-xs bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none"
              >
                Copy URL
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
