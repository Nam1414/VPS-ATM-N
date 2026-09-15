import React, { useState } from 'react';
import { Product, CategoryTab, ScreenType, UserProfile } from './types';
import { INITIAL_PRODUCTS } from './data/mockData';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { HomeView } from './views/HomeView';
import { CatalogView } from './views/CatalogView';
import { ProductDetailView } from './views/ProductDetailView';
import { CreateListingView } from './views/CreateListingView';
import { ProfileView } from './views/ProfileView.tsx';
import { AuthView } from './views/AuthView';
import { CheckCircle2, ShieldCheck } from 'lucide-react';

export default function App() {
  // Navigation & Page state:
  // 'home' -> Trang chủ phong cách mới (Hero banner + Ngành Hàng Trọng Tâm + Mới Lên Sàn Hôm Nay)
  // 'catalog' -> Trang danh mục chi tiết với Bộ Lọc 2Hand bên trái (Đồ điện tử / Đồ thể thao)
  // 'detail' -> Chi tiết sản phẩm & tình trạng
  // 'sell' -> Trang đăng bài thanh lý
  // 'profile' -> Trang hồ sơ cá nhân
  // 'auth' -> Trang đăng nhập / đăng ký
  const [selectedCategory, setSelectedCategory] = useState<CategoryTab>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeView, setActiveView] = useState<ScreenType>('home');

  // User Authentication State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authInitialMode, setAuthInitialMode] = useState<'login' | 'register'>('login');
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  // Products state
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [selectedProduct, setSelectedProduct] = useState<Product>(INITIAL_PRODUCTS[0]);
  const [savedProductIds, setSavedProductIds] = useState<string[]>(['sony-wh1000xm5', 'yonex-astrox-88d']);

  // Cart state
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Escrow Checkout Success Modal
  const [isCheckoutSuccessOpen, setIsCheckoutSuccessOpen] = useState(false);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Category switching:
  // 'all' -> Displays the dedicated Trang Chủ (HomeView) with Hero & 2 big category cards
  // 'electronics' | 'sports' -> Displays the dedicated CatalogView with left filter sidebar
  const handleSelectCategory = (cat: CategoryTab) => {
    setSelectedCategory(cat);
    if (cat === 'all') {
      setActiveView('home');
    } else {
      setActiveView('catalog');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Search input handler
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    if (query.trim().length > 0) {
      setActiveView('catalog');
    }
  };

  // Add to cart handler
  const handleAddToCart = (product: Product) => {
    if (!isLoggedIn) {
      showToast('Vui lòng đăng nhập để mua hàng!');
      handleOpenAuth('login');
      return;
    }

    setCartItems((prev) => {
      if (prev.some((item) => item.id === product.id)) {
        showToast(`"${product.title.slice(0, 30)}..." đã có trong giỏ hàng!`);
        return prev;
      }
      showToast(`Đã thêm vào giỏ hàng!`);
      return [...prev, product];
    });
  };

  const handleRemoveFromCart = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== productId));
    showToast('Đã xóa món đồ khỏi giỏ hàng');
  };

  const handleClearCart = () => {
    setCartItems([]);
    showToast('Đã làm trống giỏ hàng');
  };

  const handleCheckout = () => {
    if (!isLoggedIn) {
      setIsCartOpen(false);
      showToast('Vui lòng đăng nhập để mua hàng!');
      handleOpenAuth('login');
      return;
    }

    setIsCartOpen(false);
    setIsCheckoutSuccessOpen(true);
    setCartItems([]);
  };

  // Product Selection (Opens Detail View)
  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setActiveView('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Toggle Like / Bookmark
  const handleToggleLike = (productId: string) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const isLiked = !p.isLiked;
          showToast(isLiked ? 'Đã lưu vào danh sách yêu thích' : 'Đã bỏ lưu món đồ');
          return {
            ...p,
            isLiked,
            likes: isLiked ? p.likes + 1 : Math.max(0, p.likes - 1),
          };
        }
        return p;
      })
    );

    setSavedProductIds((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  // Create Listing
  const handleListingCreated = (newProduct: Product) => {
    setProducts((prev) => [newProduct, ...prev]);
    setSelectedCategory(newProduct.category);
    setActiveView('catalog');
    showToast('Tin đăng của bạn đã được duyệt và đưa lên sàn thành công!');
  };

  // Open Auth Page
  const handleOpenAuth = (mode: 'login' | 'register' = 'login') => {
    setAuthInitialMode(mode);
    setActiveView('auth');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Logout Handler
  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    showToast('Đã đăng xuất tài khoản');
    setActiveView('home');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#f2f8fc] via-[#fdf6fa] to-[#f3f8fd] text-[#1E293B]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-from-bottom-3 duration-200">
          <span className="w-2 h-2 rounded-full bg-[#F29BC4] animate-pulse"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Header with Navigation, Search, and Actions:
          [ (+) Đăng tin thanh lý ]  [ Shopping Bag ]  [ 👤 Đăng nhập ]
      */}
      <Header
        selectedCategory={activeView === 'home' ? 'all' : selectedCategory}
        onSelectCategory={handleSelectCategory}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        cartCount={cartItems.length}
        onOpenCart={() => {
          if (!isLoggedIn) {
            showToast('Vui lòng đăng nhập để xem giỏ hàng của bạn!');
            handleOpenAuth('login');
          } else {
            setIsCartOpen(true);
          }
        }}
        onOpenSell={() => {
          if (!isLoggedIn) {
            showToast('Vui lòng đăng nhập tài khoản để đăng bài thanh lý!');
            handleOpenAuth('login');
          } else {
            setActiveView('sell');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
        onOpenProfile={() => {
          if (!isLoggedIn) {
            handleOpenAuth('login');
          } else {
            setActiveView('profile');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
        onOpenAuth={handleOpenAuth}
        isLoggedIn={isLoggedIn}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* 1. TRANG CHỦ (HomeView: Hero Card + Ngành Hàng Trọng Tâm + Mới Lên Sàn Hôm Nay) */}
        {activeView === 'home' && (
          <HomeView
            products={products}
            onSelectProduct={handleSelectProduct}
            onSelectCategory={(cat) => handleSelectCategory(cat)}
            onExploreAll={() => {
              setSelectedCategory('all');
              setActiveView('catalog');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenSell={() => {
              if (!isLoggedIn) {
                showToast('Vui lòng đăng nhập tài khoản để đăng bài thanh lý!');
                handleOpenAuth('login');
              } else {
                setActiveView('sell');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            onAddToCart={handleAddToCart}
          />
        )}

        {/* 2. TRANG DANH MỤC (CatalogView: Sidebar "Bộ Lọc 2Hand" + 4-column product grid) */}
        {activeView === 'catalog' && (
          <CatalogView
            products={products}
            selectedCategory={selectedCategory}
            onSelectCategory={(cat) => {
              setSelectedCategory(cat);
            }}
            searchQuery={searchQuery}
            onClearSearch={() => setSearchQuery('')}
            onSelectProduct={handleSelectProduct}
            onAddToCart={handleAddToCart}
            onToggleLike={handleToggleLike}
          />
        )}

        {/* 3. Chi Tiết Sản Phẩm (DetailView) */}
        {activeView === 'detail' && (
          <ProductDetailView
            product={selectedProduct}
            allProducts={products}
            onSelectProduct={handleSelectProduct}
            onNavigate={(screen: ScreenType) => {
              setActiveView(screen);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onToggleLike={handleToggleLike}
          />
        )}

        {/* 4. TRANG ĐĂNG BÀI ("+ Đăng tin thanh lý" - CreateListingView) */}
        {activeView === 'sell' && (
          <CreateListingView
            onListingCreated={handleListingCreated}
            onNavigate={(screen: ScreenType) => {
              setActiveView(screen);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* 5. TRANG HỒ SƠ CÁ NHÂN */}
        {activeView === 'profile' && (
          <ProfileView
            currentUser={currentUser}
            onNavigate={(screen) => {
              setActiveView(screen);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSelectProduct={handleSelectProduct}
            onLogout={handleLogout}
            onUpdateUser={(updated: Partial<UserProfile>) => {
              setCurrentUser((prev) => (prev ? { ...prev, ...updated } : null));
              showToast('Đã cập nhật thông tin hồ sơ');
            }}
            onChangePassword={() => {
              showToast('Đã thay đổi mật khẩu thành công');
            }}
          />
        )}

        {/* 6. TRANG ĐĂNG NHẬP / ĐĂNG KÝ (AuthView) */}
        {activeView === 'auth' && (
          <AuthView
            initialMode={authInitialMode}
            onNavigate={(screen) => {
              setActiveView(screen);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onLoginSuccess={(user) => {
              setIsLoggedIn(true);
              setCurrentUser(user);
              showToast(`Chào mừng ${user.name} đến với 2HAND.VN!`);
            }}
          />
        )}
      </main>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
        onCheckout={handleCheckout}
      />

      {/* Escrow Deposit & Checkout Success Modal */}
      {isCheckoutSuccessOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 border border-slate-200 shadow-2xl space-y-5 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-xl font-black text-slate-900">
                Đặt cọc giữ hàng thành công!
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Khoản cọc đã được lưu ký an toàn tại <strong>2HAND.VN Escrow</strong>. Người bán đã nhận được thông báo để đóng gói và chuẩn bị giao hàng đồng kiểm.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-sky-50 border border-sky-100 text-left space-y-2 text-xs">
              <div className="flex items-center gap-2 font-bold text-sky-900">
                <ShieldCheck className="w-4 h-4 text-sky-600" />
                <span>Quyền lợi đồng kiểm 48h của bạn</span>
              </div>
              <ul className="text-sky-700 space-y-1 text-[11px] list-disc pl-4">
                <li>Được mở hộp và kiểm tra ngoại quan máy cùng shipper.</li>
                <li>48h test pin, chức năng và hoàn tiền 100% nếu sai mô tả.</li>
                <li>Tiền chỉ chuyển cho người bán khi bạn ấn &quot;Xác nhận hài lòng&quot;.</li>
              </ul>
            </div>

            <button
              type="button"
              onClick={() => setIsCheckoutSuccessOpen(false)}
              className="w-full py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
            >
              Đã hiểu, quay lại mua sắm
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer
        onNavigate={(screen) => {
          setActiveView(screen);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
}

