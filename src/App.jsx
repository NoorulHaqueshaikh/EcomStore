import {createBrowserRouter, RouterProvider} from 'react-router-dom'
import React from 'react'
import Login from './components/Login'
import Signup from './components/Signup'
import Navbar from './Pages/Navbar'
import Products from './Pages/Products'
import Footer from './Pages/Footer'
import Cart from './Pages/Cart'
import Account from './Pages/Account'
import Wishlist from './Pages/Wishlist'
import Vieworders from './Pages/Vieworders'
import Manageaddress from './Pages/Manageaddress'
import Admin from './Pages/Admin'
import ProductShow from './Pages/productShow'
import SearchProducts from './Pages/SearchProducts'
import PaymentOption from './Pages/PaymentOption'
import OrderSuccess from './Pages/OrderSuccess'
import ViewOrder from './Pages/ViewOrder'
import ProductMen from './Pages/ProductMen'
import ProductWomen from './Pages/ProductWomen'
import ProductKids from './Pages/ProductKids'
import ProductNew from './Pages/ProductNew'
import ProductSale from './Pages/ProductSale'

const router = createBrowserRouter(
  [
    {
      path:"/",
      element: <div> <Products/> <Footer/> </div>
    },
    {
      path:"/auth/signup",
      element: <div> <Signup/> </div>
    },
    {
      path:"/auth/login",
      element: <div> <Login/> </div>
    },
    {
      path: "/cart",
      element: <div> <Cart/> </div>
    },
    {
      path: "/account",
      element: <div> <Account/> </div>
    },
    {
      path: "/wishlist",
      element: <div> <Wishlist/> </div>
    },
    {
      path: "/orders",
      element: <div> <Vieworders/> </div>
    },
    {
      path: "/addresses",
      element: <div> <Manageaddress/> </div>
    },
    {
      path: "/admin",
      element: <div> <Admin/> </div>
    },
    {
      path: "/product/:id",
      element: <div> <ProductShow/> </div>
    },
    {
      path: "/product/search/:id",
      element: <div> <SearchProducts/> <Footer/> </div>
    },
    {
      path: "/checkout/payment/options/:totalprice",
      element: <div> <PaymentOption/> </div>
    },
    {
      path: "/order/success",
      element: <div> <OrderSuccess/> </div>
    },
    {
      path: "/view/order/:id",
      element: <div> <ViewOrder/> </div>
    },
    {
      path: "/product/men",
      element: <div> <ProductMen/> <Footer/> </div>
    },
    {
      path: "/product/women",
      element: <div> <ProductWomen/> <Footer/> </div>
    },
    {
      path: "/product/kids",
      element: <div> <ProductKids/> <Footer/> </div>
    },
    {
      path: "/product/new",
      element: <div> <ProductNew/> <Footer/> </div>
    },
    {
      path: "/product/sale",
      element: <div> <ProductSale/> <Footer/> </div>
    }
  ]
)

function App() {
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  )
}

export default App