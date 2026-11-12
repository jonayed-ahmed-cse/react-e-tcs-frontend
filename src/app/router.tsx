import { createBrowserRouter, Navigate } from 'react-router-dom'

import PlaceholderPage from '@/app/PlaceholderPage'
import AppLayout from '@/components/layout/AppLayout'
import DashboardPage from '@/features/dashboard/pages/DashboardPage'
import AddRetailerPage from '@/features/retailers/pages/AddRetailerPage'
import EditRetailerPage from '@/features/retailers/pages/EditRetailerPage'
import RetailerDetailsPage from '@/features/retailers/pages/RetailerDetailsPage'
import RetailerListPage from '@/features/retailers/pages/RetailerListPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: 'retailers',
        element: <RetailerListPage />,
      },
      {
        path: 'retailers/new',
        element: <AddRetailerPage />,
      },
      {
        path: 'retailers/:id',
        element: <RetailerDetailsPage />,
      },
      {
        path: 'retailers/:id/edit',
        element: <EditRetailerPage />,
      },
      {
        path: 'collections',
        element: (
          <PlaceholderPage
            title="Collections"
            description="Manage TCS collection transactions."
          />
        ),
      },
      {
        path: 'challan',
        element: (
          <PlaceholderPage
            title="Challan History"
            description="View and manage payment challans."
          />
        ),
      },
      {
        path: 'rso',
        element: (
          <PlaceholderPage
            title="RSO Management"
            description="Manage RSO information."
          />
        ),
      },
      {
        path: 'collect-tcs',
        element: (
          <PlaceholderPage
            title="Collect TCS"
            description="Collect tax from a retailer."
          />
        ),
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
])
