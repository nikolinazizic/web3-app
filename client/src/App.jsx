import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AllPropertiesPage from "./pages/AllPropertiesPage";
import MyPropertiesPage from "./pages/MyPropertiesPage";
import SinglePropertyPage from "./pages/SinglePropertyPage";
import TransactionList from "./pages/TransactionList";
import AllTransactions from "./pages/AllTransactions";
import './App.css';

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <HomePage />
    },
    {
      path: "/allproperties",
      element: <AllPropertiesPage />
    },
    {
      path: "/transactions",
      element: <AllTransactions />
    },
    {
      path: "/myproperties/:owner",
      element: <MyPropertiesPage />
    },
    {
      path: "/property/:id",
      element: <SinglePropertyPage />
    },
    {
      path: "/transactions/:id",
      element: <TransactionList />
    },
 ]);

 return (
    <RouterProvider router={router} />
 );
}

export default App;