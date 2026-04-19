import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import { SellerProvider } from "./contexts/SellerContext";
import { OrdersProvider } from "./contexts/OrdersContext";
import CartDrawer from "./components/cart/CartDrawer";
import MobileBottomNav from "./components/MobileBottomNav";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Marketplace from "./pages/Marketplace";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Payment from "./pages/Payment";
import OrderSuccess from "./pages/OrderSuccess";
import Orders from "./pages/Orders";
import Profile from "./pages/Profile";
import VerifyEmail from "./pages/VerifyEmail";
import SellerOnboarding from "./pages/SellerOnboarding";
import SellerProfile from "./pages/SellerProfile";
import AddProduct from "./pages/AddProduct";

function Router() {
  return (
    <Switch>
      <Route path="/"                   component={Home} />
      <Route path="/login"              component={Login} />
      <Route path="/signup"             component={Signup} />
      <Route path="/marketplace"        component={Marketplace} />
      <Route path="/product/:id"        component={ProductDetail} />
      <Route path="/cart"               component={Cart} />
      <Route path="/checkout"           component={Checkout} />
      <Route path="/payment"            component={Payment} />
      <Route path="/order-success"      component={OrderSuccess} />
      <Route path="/orders"             component={Orders} />
      <Route path="/profile"            component={Profile} />
      <Route path="/verify-email"       component={VerifyEmail} />
      <Route path="/seller/onboarding"  component={SellerOnboarding} />
      <Route path="/seller/profile"     component={SellerProfile} />
      <Route path="/seller/add-product" component={AddProduct} />
      <Route path="/404"                component={NotFound} />
      <Route                            component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <AuthProvider>
          <SellerProvider>
            <CartProvider>
              <OrdersProvider>
                <TooltipProvider>
                  <Toaster />
                  <Router />
                  <MobileBottomNav />
                  <CartDrawer />
                </TooltipProvider>
              </OrdersProvider>
            </CartProvider>
          </SellerProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
