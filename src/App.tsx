import React, { useState, useEffect } from 'react';
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
import { AdminView } from './views/AdminView';
import { CheckCircle2, ShieldCheck, QrCode } from 'lucide-react';

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryTab>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeView, setActiveView] = useState<ScreenType>('home');

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authInitialMode, setAuthInitialMode] = useState<'login' | 'register'>('login');
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product>(INITIAL_PRODUCTS[0]);
  const [savedProductIds, setSavedProductIds] = useState<string[]>(['sony-wh1000xm5', 'yonex-astrox-88d']);

  const [cartItems, setCartItems] = useState<any[]>([]); // Dữ liệu giỏ hàng từ API
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  const [isCheckoutSuccessOpen, setIsCheckoutSuccessOpen] = useState(false);
  const [checkoutQrUrl, setCheckoutQrUrl] = useState<string | null>(null); // Lưu QR Code
  
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // TỰ ĐỘNG KHÔI PHỤC PHIÊN ĐĂNG NHẬP VÀ GIỎ HÀNG
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) return;

      try {
        const res = await fetch('https://atmn.sytes.net/api/v1/auth/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (res.ok) {
          const userData = await res.json();
          const mappedUser: UserProfile = {
            id: userData.id?.toString() || '1',
            name: userData.full_name || userData.username || 'Thành viên',
            email: userData.email,
            phone: userData.phone_number || '',
            avatar: userData.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
            isVerified: true,
            walletBalance: 12500000,
            escrowPending: 2800000,
            itemsSold: 12,
            itemsListed: 4,
            rating: 5.0,
            reviewCount: 10,
            joinedDate: userData.created_at ? userData.created_at.split('T')[0] : 'Hôm nay',
            location: 'Việt Nam',
            role: userData.role || 'user',
          };
          setIsLoggedIn(true);
          setCurrentUser(mappedUser);
          fetchCart(token); // Tải giỏ hàng nếu đăng nhập thành công
        } else {
          localStorage.removeItem('accessToken');
        }
      } catch (error) {
        console.error("Lỗi khôi phục phiên đăng nhập:", error);
      }
    };

    initAuth();
  }, []);

  // LẤY DỮ LIỆU SẢN PHẨM TRÊN SÀN
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://atmn.sytes.net/api/v1/products');
        if (!response.ok) throw new Error('Không thể kết nối BE');
        
        const data = await response.json();

        const formattedProducts: Product[] = data.map((item: any) => ({
          id: item.id.toString(),
          title: item.name,
          category: 'electronics',
          subCategory: 'Linh kiện',
          brand: 'Khác',
          price: item.price,
          originalPrice: item.price * 1.2,
          condition: 'good',
          conditionLabel: item.condition_status || 'Đã qua sử dụng',
          image: item.cover || 'https://via.placeholder.com/400',
          location: 'Kho tổng',
          seller: {
            id: item.seller_id?.toString() || 'admin',
            name: item.seller_name || item.seller?.full_name || 'Người bán',
            avatar: (!item.seller_avatar && !item.seller?.avatar) 
              ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80' 
              : (item.seller_avatar || item.seller?.avatar),
            rating: item.seller_rating || 5.0,
            reviewCount: item.seller_review_count || 0,
            verified: true,
          },
          tags: ['Giao nhanh'],
          likes: 0,
        }));

        setProducts(formattedProducts);
      } catch (error) {
        console.error("Lỗi lấy dữ liệu sản phẩm:", error);
      }
    };

    fetchProducts();
  }, []);

  // =========================================================================
  // API GIỎ HÀNG THỰC TẾ
  // =========================================================================
  const fetchCart = async (token: string) => {
    try {
      const res = await fetch('https://atmn.sytes.net/api/v1/cart', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setCartItems(data.items || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddToCart = async (product: Product) => {
    if (!isLoggedIn) {
      showToast('Vui lòng đăng nhập để mua hàng!');
      handleOpenAuth('login');
      return;
    }
    
    const token = localStorage.getItem('accessToken');
    try {
      const res = await fetch('https://atmn.sytes.net/api/v1/cart/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ product_id: parseInt(product.id), quantity: 1 })
      });
      
      if (res.ok) {
        const data = await res.json();
        setCartItems(data.items);
        showToast(`Đã thêm vào giỏ hàng!`);
      } else {
        if (res.status === 401) {
          handleLogout();
          showToast("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại!");
          handleOpenAuth('login');
        } else {
          const err = await res.json();
          showToast(err.detail || 'Lỗi thêm vào giỏ hàng');
        }
      }
    } catch (err) {
      showToast('Lỗi kết nối máy chủ');
    }
  };

  const handleRemoveFromCart = async (cartItemId: string) => {
    const token = localStorage.getItem('accessToken');
    try {
      const res = await fetch(`https://atmn.sytes.net/api/v1/cart/items/${cartItemId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setCartItems(data.items);
        showToast('Đã xóa món đồ khỏi giỏ hàng');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleClearCart = async () => {
    const token = localStorage.getItem('accessToken');
    try {
      const res = await fetch(`https://atmn.sytes.net/api/v1/cart`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setCartItems([]);
        showToast('Đã làm trống giỏ hàng');
      }
    } catch (err) {}
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

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleSelectCategory = (cat: CategoryTab) => {
    setSelectedCategory(cat);
    if (cat === 'all') {
      setActiveView('home');
    } else {
      setActiveView('catalog');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    if (query.trim().length > 0) {
      setActiveView('catalog');
    }
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setActiveView('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleLike = (productId: string) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const isLiked = !p.isLiked;
          showToast(isLiked ? 'Đã lưu vào danh sách yêu thích' : 'Đã bỏ lưu món đồ');
          return { ...p, isLiked, likes: isLiked ? p.likes + 1 : Math.max(0, p.likes - 1) };
        }
        return p;
      })
    );
    setSavedProductIds((prev) => prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]);
  };

  const handleListingCreated = (newProduct: Product) => {
    // Thêm ảo lên UI ngay lập tức
    setProducts((prev) => [newProduct, ...prev]);
    setSelectedCategory(newProduct.category);
    setActiveView('catalog');
    showToast('Tin đăng đã gửi! Chờ quản trị viên duyệt để lên sàn.');
  };

  const handleOpenAuth = (mode: 'login' | 'register' = 'login') => {
    setAuthInitialMode(mode);
    setActiveView('auth');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    setIsLoggedIn(false);
    setCurrentUser(null);
    setCartItems([]); // Xóa giỏ hàng local
    showToast('Đã đăng xuất tài khoản');
    setActiveView('home');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#f2f8fc] via-[#fdf6fa] to-[#f3f8fd] text-[#1E293B]">
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-from-bottom-3 duration-200">
          <span className="w-2 h-2 rounded-full bg-[#F29BC4] animate-pulse"></span>
          <span>{toastMessage}</span>
        </div>
      )}

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
        onOpenAdmin={() => {
          setActiveView('admin' as ScreenType);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenAuth={handleOpenAuth}
        isLoggedIn={isLoggedIn}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      <main className="flex-1">
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

        {activeView === 'admin' && (
          <AdminView
            onNavigate={(screen) => {
              setActiveView(screen);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

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

        {activeView === 'detail' && (
          <ProductDetailView
            currentUser={currentUser}
            product={selectedProduct}
            allProducts={products}
            onSelectProduct={handleSelectProduct}
            onAddToCart={handleAddToCart} // ĐÃ TRUYỀN HÀM THÊM GIỎ HÀNG CHO PRODUCT DETAIL
            onOpenCart={() => setIsCartOpen(true)} // ĐÃ TRUYỀN HÀM MỞ GIỎ HÀNG
            onNavigate={(screen: ScreenType) => {
              setActiveView(screen);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onToggleLike={handleToggleLike}
          />
        )}

        {activeView === 'sell' && (
          <CreateListingView
            onListingCreated={handleListingCreated}
            onNavigate={(screen: ScreenType) => {
              setActiveView(screen);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

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
              const token = localStorage.getItem('accessToken');
              if (token) fetchCart(token);
              if (user.email === 'admin@2hand.com') {
                setActiveView('admin' as ScreenType);
              }
            }}
          />
        )}
      </main>

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
        onCheckoutSuccess={(qrUrl) => {
          setIsCartOpen(false);
          setCheckoutQrUrl(qrUrl);
          setIsCheckoutSuccessOpen(true);
          setCartItems([]); 
        }}
      />

      {isCheckoutSuccessOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 border border-slate-200 shadow-2xl space-y-5 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-xl font-black text-slate-900">
                Đặt hàng thành công!
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Đơn hàng đã được lưu ký an toàn tại <strong>2HAND.VN Escrow</strong>. Người bán đã nhận được thông báo để chuẩn bị giao hàng.
              </p>
            </div>

            {checkoutQrUrl && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <p className="text-[11px] font-bold text-slate-700">
                  <QrCode className="w-4 h-4 inline-block mr-1 text-sky-600"/> 
                  Mở ứng dụng ngân hàng và quét mã để thanh toán (Hoặc COD)
                </p>
                <img src={checkoutQrUrl} alt="VietQR" className="w-48 h-48 mx-auto rounded-xl shadow-sm border border-slate-200 bg-white p-2" />
              </div>
            )}

            <div className="p-4 rounded-2xl bg-sky-50 border border-sky-100 text-left space-y-2 text-xs">
              <div className="flex items-center gap-2 font-bold text-sky-900">
                <ShieldCheck className="w-4 h-4 text-sky-600" />
                <span>Quyền lợi đồng kiểm 48h của bạn</span>
              </div>
              <ul className="text-sky-700 space-y-1 text-[11px] list-disc pl-4">
                <li>Được mở hộp và kiểm tra ngoại quan máy cùng shipper.</li>
                <li>48h test chức năng và hoàn tiền 100% nếu sai mô tả.</li>
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

      <Footer
        onNavigate={(screen) => {
          setActiveView(screen);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
}