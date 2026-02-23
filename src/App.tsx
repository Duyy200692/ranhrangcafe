import { useState, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Coffee, 
  MapPin, 
  Clock, 
  Instagram, 
  Facebook, 
  ShoppingBag, 
  Trees, 
  Store, 
  GraduationCap, 
  Menu as MenuIcon,
  X,
  Edit,
  Plus,
  Trash2,
  LogIn,
  LogOut,
  Save,
  Phone
} from 'lucide-react';

// Initial Data
const INITIAL_DATA = {
  hero: {
    est: "EST. 2024",
    title: "Chậm lại một chút,",
    subtitle: "Rảnh Rang",
    subtitleSuffix: " hơn.",
    description: "Một góc nhỏ bình yên để bạn gác lại âu lo, thưởng thức tách cà phê thơm lừng và tận hưởng những khoảnh khắc thảnh thơi giữa lòng phố thị.",
    image: "https://picsum.photos/seed/coffee1/800/1000",
    imageRatio: "4/5"
  },
  services: [
    { icon: "ShoppingBag", label: "Takeout", desc: "Mang đi tiện lợi" },
    { icon: "Trees", label: "Outdoor Seating", desc: "Không gian ngoài trời thoáng đãng" },
    { icon: "Store", label: "In-store Pickup", desc: "Đặt trước, lấy ngay tại quán" },
    { icon: "GraduationCap", label: "Workshops", desc: "Các lớp học pha chế & nghệ thuật" },
    { icon: "Coffee", label: "In-store Shopping", desc: "Mua sắm hạt cà phê & dụng cụ" },
  ],
  menu: {
    title: "Hương Vị\nĐặc Trưng",
    description: "Mỗi thức uống tại Rảnh Rang đều được pha chế bằng cả tâm huyết, từ những hạt cà phê tuyển chọn kỹ lưỡng đến các nguyên liệu tươi ngon nhất.",
    items: [
      { name: "Cà Phê Muối", price: "45.000đ", desc: "Vị mặn nhẹ của kem muối hòa quyện cùng cà phê đậm đà." },
      { name: "Trà Lài Hạt Sen", price: "50.000đ", desc: "Thanh mát, nhẹ nhàng với hạt sen bùi bùi." },
      { name: "Croissant Trứng Muối", price: "35.000đ", desc: "Bánh sừng bò thơm bơ nhân trứng muối tan chảy." },
      { name: "Cold Brew Cam Sả", price: "55.000đ", desc: "Cà phê ủ lạnh kết hợp vị chua thanh của cam vàng." },
    ]
  },
  workshop: {
    tag: "WORKSHOP",
    title: "Lớp Học Pha Chế & Nghệ Thuật",
    description: "Tham gia các buổi workshop cuối tuần tại Rảnh Rang để tự tay pha những tách cà phê ngon hoặc thỏa sức sáng tạo với các lớp học vẽ tranh, làm gốm.",
    features: [
      "Kỹ năng pha chế cơ bản (Barista Basic)",
      "Latte Art cho người mới bắt đầu",
      "Workshop vẽ tranh thư giãn"
    ],
    image: "https://picsum.photos/seed/workshop/800/600"
  },
  footer: {
    about: "Nơi những câu chuyện được sẻ chia bên tách cà phê đậm đà. Hãy đến và cảm nhận sự bình yên.",
    address: "123 Đường Cà Phê, Quận 1, TP. Hồ Chí Minh (Địa chỉ giả định)",
    phone: "090 123 4567",
    hours: "07:00 - 22:00 (Mỗi ngày)",
    emailPlaceholder: "Email của bạn...",
    copyright: "© 2024 Rảnh Rang Cafe. All rights reserved.",
    designer: "Designed with ❤️ for coffee lovers."
  },
  branding: {
    logoUrl: "", 
    logoText: "Rảnh Rang"
  },
  gallery: [
    "https://picsum.photos/seed/cafe11/600/800",
    "https://picsum.photos/seed/cafe12/600/800",
    "https://picsum.photos/seed/cafe13/600/800",
    "https://picsum.photos/seed/cafe14/600/800"
  ],
  partner: {
    title: "Hạt Cà Phê Chất Lượng",
    subtitle: "Đồng hành cùng Ysim Coffee Roasters",
    description: "Chúng tôi tự hào sử dụng những hạt cà phê thượng hạng được rang xay cẩn thận bởi Ysim Coffee Roasters, mang đến hương vị đậm đà và tinh tế nhất.",
    image: "https://picsum.photos/seed/roaster/800/600",
    link: "https://www.instagram.com/ysim.coffee.roasters/"
  }
};

// Icon mapping for dynamic rendering
const IconMap: Record<string, any> = {
  ShoppingBag, Trees, Store, GraduationCap, Coffee
};

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [password, setPassword] = useState("");
  
  // Content State
  const [content, setContent] = useState(() => {
    try {
      // Use a unique key to avoid conflicts with other apps on localhost
      const saved = localStorage.getItem('ranhrang_cafe_content');
      if (saved) {
        const parsed = JSON.parse(saved);
        
        // Validate parsed data is an object and not null
        if (!parsed || typeof parsed !== 'object') {
          return INITIAL_DATA;
        }

        // Data Repair: Fix gallery if it became an object { gallery: [...] } instead of [...]
        if (parsed.gallery && !Array.isArray(parsed.gallery) && Array.isArray(parsed.gallery.gallery)) {
          parsed.gallery = parsed.gallery.gallery;
        }
        // Data Repair: Fix services if needed
        if (parsed.services && !Array.isArray(parsed.services) && Array.isArray(parsed.services.services)) {
          parsed.services = parsed.services.services;
        }

        // Merge saved content with INITIAL_DATA safely
        return { 
          ...INITIAL_DATA, 
          ...parsed,
          hero: { ...INITIAL_DATA.hero, ...(parsed.hero || {}) },
          footer: { ...INITIAL_DATA.footer, ...(parsed.footer || {}) },
          partner: { ...INITIAL_DATA.partner, ...(parsed.partner || {}) },
          branding: { ...INITIAL_DATA.branding, ...(parsed.branding || {}) },
          menu: { ...INITIAL_DATA.menu, ...(parsed.menu || {}) },
          workshop: { ...INITIAL_DATA.workshop, ...(parsed.workshop || {}) },
        };
      }
      return INITIAL_DATA;
    } catch (e) {
      console.error("Failed to load content from localStorage", e);
      return INITIAL_DATA;
    }
  });

  // Editing State
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>(null);

  useEffect(() => {
    localStorage.setItem('ranhrang_cafe_content', JSON.stringify(content));
  }, [content]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') { // Simple hardcoded password
      setIsAdmin(true);
      setShowLoginModal(false);
      setPassword("");
    } else {
      alert("Sai mật khẩu!");
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
  };

  const startEdit = (section: string, data: any) => {
    setEditingSection(section);
    setEditForm(JSON.parse(JSON.stringify(data))); // Deep copy
  };

  const saveEdit = () => {
    if (editingSection) {
      setContent((prev: any) => {
        const newData = { ...prev };
        
        // Handle nested updates based on section key logic
        if (editingSection.includes('.')) {
          const [parent, child] = editingSection.split('.');
          newData[parent][child] = editForm;
        } else {
          // Check if we are editing a top-level key that is an array in the content
          // but wrapped in an object in editForm (like gallery or services)
          if (editForm && typeof editForm === 'object' && editingSection in editForm) {
             newData[editingSection] = editForm[editingSection];
          } else {
             newData[editingSection] = editForm;
          }
        }
        return newData;
      });
      setEditingSection(null);
      setEditForm(null);
    }
  };

  // Helper to render edit button
  const EditBtn = ({ section, data, className = "" }: { section: string, data: any, className?: string }) => (
    isAdmin ? (
      <button 
        onClick={() => startEdit(section, data)}
        className={`absolute z-50 p-2 bg-brand-accent text-white rounded-full shadow-lg hover:bg-brand-accent/80 transition-all ${className}`}
        title="Chỉnh sửa"
      >
        <Edit className="w-4 h-4" />
      </button>
    ) : null
  );

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Admin Login Modal */}
      <AnimatePresence>
        {showLoginModal && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-2xl p-8 w-full max-w-md relative">
              <button onClick={() => setShowLoginModal(false)} className="absolute top-4 right-4 text-gray-500 hover:text-black">
                <X className="w-6 h-6" />
              </button>
              <h2 className="text-2xl font-serif font-bold mb-6 text-brand-green">Đăng Nhập Admin</h2>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent outline-none"
                    placeholder="Nhập mật khẩu (admin123)"
                  />
                </div>
                <button type="submit" className="w-full bg-brand-green text-white py-3 rounded-lg font-medium hover:bg-brand-green/90 transition-colors">
                  Đăng Nhập
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
        {editingSection && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4 overflow-y-auto"
          >
            <div className="bg-white rounded-2xl p-8 w-full max-w-2xl relative my-8">
              <button onClick={() => setEditingSection(null)} className="absolute top-4 right-4 text-gray-500 hover:text-black">
                <X className="w-6 h-6" />
              </button>
              <h2 className="text-2xl font-serif font-bold mb-6 text-brand-green capitalize">Chỉnh sửa: {editingSection}</h2>
              
              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                {/* Dynamic Form Generation based on editForm structure */}
                {Object.keys(editForm).map((key) => {
                  const value = editForm[key];
                  if (typeof value === 'string') {
                    return (
                      <div key={key}>
                        <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">{key}</label>
                        {key === 'description' || key.includes('desc') || key === 'about' ? (
                          <textarea 
                            value={value}
                            onChange={(e) => setEditForm({...editForm, [key]: e.target.value})}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green outline-none h-32"
                          />
                        ) : (
                          <input 
                            type="text" 
                            value={value}
                            onChange={(e) => setEditForm({...editForm, [key]: e.target.value})}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green outline-none"
                          />
                        )}
                      </div>
                    );
                  }
                  // Handle Array of Strings (e.g., features)
                  if (Array.isArray(value) && typeof value[0] === 'string') {
                     return (
                      <div key={key}>
                        <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">{key}</label>
                        {value.map((item: string, idx: number) => (
                          <div key={idx} className="flex gap-2 mb-2">
                            <input 
                              type="text" 
                              value={item}
                              onChange={(e) => {
                                const newArr = [...value];
                                newArr[idx] = e.target.value;
                                setEditForm({...editForm, [key]: newArr});
                              }}
                              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green outline-none"
                            />
                            <button 
                              onClick={() => {
                                const newArr = value.filter((_, i) => i !== idx);
                                setEditForm({...editForm, [key]: newArr});
                              }}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        ))}
                        <button 
                          onClick={() => setEditForm({...editForm, [key]: [...value, ""]})}
                          className="flex items-center gap-2 text-brand-green font-medium mt-2"
                        >
                          <Plus className="w-4 h-4" /> Thêm dòng
                        </button>
                      </div>
                     )
                  }
                  // Handle Array of Objects (e.g., menu items, services)
                  if (Array.isArray(value) && typeof value[0] === 'object') {
                    return (
                      <div key={key}>
                        <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">{key}</label>
                        <div className="space-y-4">
                          {value.map((item: any, idx: number) => (
                            <div key={idx} className="p-4 border border-gray-200 rounded-lg relative">
                              <button 
                                onClick={() => {
                                  const newArr = value.filter((_, i) => i !== idx);
                                  setEditForm({...editForm, [key]: newArr});
                                }}
                                className="absolute top-2 right-2 text-red-500 hover:bg-red-50 p-1 rounded"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                              <div className="grid grid-cols-2 gap-4">
                                {Object.keys(item).map((subKey) => (
                                  <div key={subKey}>
                                    <label className="text-xs text-gray-500 capitalize">{subKey}</label>
                                    <input 
                                      type="text"
                                      value={item[subKey]}
                                      onChange={(e) => {
                                        const newArr = [...value];
                                        newArr[idx] = { ...newArr[idx], [subKey]: e.target.value };
                                        setEditForm({...editForm, [key]: newArr});
                                      }}
                                      className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-brand-green outline-none"
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                        <button 
                          onClick={() => {
                            // Create empty object based on first item structure
                            const template = Object.keys(value[0] || {}).reduce((acc, k) => ({...acc, [k]: ""}), {});
                            setEditForm({...editForm, [key]: [...value, template]});
                          }}
                          className="flex items-center gap-2 text-brand-green font-medium mt-4"
                        >
                          <Plus className="w-4 h-4" /> Thêm mục mới
                        </button>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>

              <div className="mt-8 flex justify-end gap-4">
                <button 
                  onClick={() => setEditingSection(null)}
                  className="px-6 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button 
                  onClick={saveEdit}
                  className="px-6 py-2 bg-brand-green text-white rounded-lg font-medium hover:bg-brand-green/90 flex items-center gap-2"
                >
                  <Save className="w-4 h-4" /> Lưu Thay Đổi
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-brand-cream/90 backdrop-blur-md border-b border-brand-green/10 group/nav">
        <EditBtn section="branding" data={content.branding} className="top-4 left-4" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo Text */}
            <div className="flex-shrink-0 flex items-center gap-2">
              {content.branding.logoUrl ? (
                <img src={content.branding.logoUrl} alt={content.branding.logoText} className="h-12 w-auto object-contain" />
              ) : (
                <div className="w-10 h-10 bg-brand-green rounded-lg flex items-center justify-center text-brand-cream font-serif font-bold text-xl">
                  R
                </div>
              )}
              <span className="font-serif font-bold text-2xl text-brand-green tracking-tight">{content.branding.logoText}</span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#about" className="text-brand-dark hover:text-brand-green font-medium transition-colors">Về Chúng Tôi</a>
              <a href="#menu" className="text-brand-dark hover:text-brand-green font-medium transition-colors">Thực Đơn</a>
              <a href="#services" className="text-brand-dark hover:text-brand-green font-medium transition-colors">Dịch Vụ</a>
              <a href="#contact" className="px-5 py-2.5 bg-brand-green text-brand-cream rounded-full font-medium hover:bg-brand-green/90 transition-colors">
                Liên Hệ
              </a>
              {/* Admin Button */}
              {isAdmin ? (
                <button onClick={handleLogout} className="flex items-center gap-2 text-red-600 font-medium hover:bg-red-50 px-3 py-2 rounded-lg transition-colors">
                  <LogOut className="w-5 h-5" /> Admin
                </button>
              ) : (
                <button onClick={() => setShowLoginModal(true)} className="text-brand-dark/50 hover:text-brand-green transition-colors" title="Admin Login">
                  <LogIn className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center gap-4">
              {isAdmin && (
                <button onClick={handleLogout} className="text-red-600">
                  <LogOut className="w-5 h-5" />
                </button>
              )}
              <button onClick={toggleMenu} className="text-brand-dark p-2">
                {isMenuOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden bg-brand-cream border-b border-brand-green/10 absolute w-full"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              <a href="#about" onClick={toggleMenu} className="block px-3 py-3 text-brand-dark hover:bg-brand-green/5 rounded-lg font-medium">Về Chúng Tôi</a>
              <a href="#menu" onClick={toggleMenu} className="block px-3 py-3 text-brand-dark hover:bg-brand-green/5 rounded-lg font-medium">Thực Đơn</a>
              <a href="#services" onClick={toggleMenu} className="block px-3 py-3 text-brand-dark hover:bg-brand-green/5 rounded-lg font-medium">Dịch Vụ</a>
              <a href="#contact" onClick={toggleMenu} className="block px-3 py-3 text-brand-green font-bold">Liên Hệ Ngay</a>
              {!isAdmin && (
                <button onClick={() => { toggleMenu(); setShowLoginModal(true); }} className="w-full text-left px-3 py-3 text-brand-dark/50 hover:text-brand-green font-medium">
                  Admin Login
                </button>
              )}
            </div>
          </motion.div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 lg:pt-28 pb-16 lg:pb-24 overflow-hidden group/section">
        <EditBtn section="hero" data={content.hero} className="top-24 right-4" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="inline-block py-1 px-3 rounded-full bg-brand-green/10 text-brand-green text-sm font-semibold tracking-wide mb-6">
                {content.hero.est}
              </span>
              <h1 className="text-5xl lg:text-7xl font-serif font-bold text-brand-green leading-[1.1] mb-6">
                {content.hero.title}<br />
                <span className="italic text-brand-accent">{content.hero.subtitle}</span>{content.hero.subtitleSuffix}
              </h1>
              <p className="text-lg text-brand-dark/70 mb-8 max-w-lg leading-relaxed">
                {content.hero.description}
              </p>
              <div className="flex flex-wrap gap-4">
                <a href="https://www.facebook.com/profile.php?id=61574213638994" target="_blank" rel="noreferrer" className="px-8 py-4 bg-brand-green text-brand-cream rounded-full font-medium hover:bg-brand-green/90 transition-all shadow-lg hover:shadow-xl flex items-center gap-2">
                  <Facebook className="w-5 h-5" />
                  Ghé thăm Fanpage
                </a>
                <a href="#menu" className="px-8 py-4 bg-white border border-brand-green/20 text-brand-green rounded-full font-medium hover:bg-brand-green/5 transition-all">
                  Xem Menu
                </a>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div 
                className="rounded-2xl overflow-hidden shadow-2xl relative z-10 rotate-2 hover:rotate-0 transition-transform duration-500 w-full"
                style={{ aspectRatio: content.hero.imageRatio || "4/5" }}
              >
                <img 
                  src={content.hero.image} 
                  alt="Rảnh Rang Cafe Interior" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 w-48 h-48 bg-brand-accent/10 rounded-full blur-3xl -z-10"></div>
              <div className="absolute -top-6 -right-6 w-64 h-64 bg-brand-green/10 rounded-full blur-3xl -z-10"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-white relative group/section">
        <EditBtn section="services" data={{ services: content.services }} className="top-4 right-4" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-green mb-4">Dịch Vụ Của Chúng Tôi</h2>
            <p className="text-brand-dark/60 max-w-2xl mx-auto">
              Không chỉ là cà phê, Rảnh Rang mang đến trải nghiệm trọn vẹn cho mọi nhu cầu của bạn.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {content.services?.map((service: any, index: number) => {
              const IconComponent = IconMap[service.icon] || Store;
              return (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex flex-col items-center text-center p-6 rounded-2xl hover:bg-brand-cream transition-colors group"
                >
                  <div className="w-14 h-14 bg-brand-green/5 text-brand-green rounded-full flex items-center justify-center mb-4 group-hover:bg-brand-green group-hover:text-brand-cream transition-colors">
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif font-bold text-lg mb-2">{service.label}</h3>
                  <p className="text-sm text-brand-dark/60">{service.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Menu Preview */}
      <section id="menu" className="py-20 bg-brand-green text-brand-cream relative overflow-hidden group/section">
        <EditBtn section="menu" data={content.menu} className="top-4 right-4 bg-white text-brand-green hover:bg-brand-cream" />
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
           <svg width="100%" height="100%">
             <pattern id="pattern-circles" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
               <circle cx="2" cy="2" r="1" fill="currentColor" />
             </pattern>
             <rect x="0" y="0" width="100%" height="100%" fill="url(#pattern-circles)" />
           </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-serif font-bold mb-8 whitespace-pre-line">{content.menu.title}</h2>
              <p className="text-brand-cream/80 text-lg mb-8 leading-relaxed">
                {content.menu.description}
              </p>
              <a href="#" className="inline-flex items-center text-brand-accent font-medium hover:text-white transition-colors">
                Xem toàn bộ menu <span className="ml-2">→</span>
              </a>
            </div>

            <div className="bg-brand-cream/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10">
              <div className="space-y-8">
                {content.menu?.items?.map((item: any, idx: number) => (
                  <div key={idx} className="flex justify-between items-start group cursor-default">
                    <div>
                      <h3 className="font-serif font-bold text-xl mb-1 group-hover:text-brand-accent transition-colors">{item.name}</h3>
                      <p className="text-sm text-brand-cream/60">{item.desc}</p>
                    </div>
                    <span className="font-mono text-brand-accent font-medium">{item.price}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Workshop Section */}
      <section className="py-20 bg-brand-cream relative group/section">
        <EditBtn section="workshop" data={content.workshop} className="top-4 right-4" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-xl rotate-1 hover:rotate-0 transition-transform duration-500">
                <img 
                  src={content.workshop.image} 
                  alt="Coffee Workshop" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
            <div className="order-1 md:order-2">
              <span className="inline-block py-1 px-3 rounded-full bg-brand-accent/10 text-brand-accent text-sm font-semibold tracking-wide mb-4">
                {content.workshop.tag}
              </span>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-green mb-6">{content.workshop.title}</h2>
              <p className="text-brand-dark/70 mb-6 leading-relaxed">
                {content.workshop.description}
              </p>
              <ul className="space-y-3 mb-8">
                {content.workshop?.features?.map((feature: string, idx: number) => (
                  <li key={idx} className="flex items-center gap-3 text-brand-dark/80">
                    <div className="w-2 h-2 bg-brand-accent rounded-full"></div>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <button className="px-6 py-3 bg-brand-green text-brand-cream rounded-full font-medium hover:bg-brand-green/90 transition-colors">
                Đăng Ký Ngay
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Partner Section */}
      <section className="py-20 bg-brand-green/5 relative group/section">
        <EditBtn section="partner" data={content.partner} className="top-4 right-4" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block py-1 px-3 rounded-full bg-brand-green/10 text-brand-green text-sm font-semibold tracking-wide mb-4">
                OUR PARTNER
              </span>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-green mb-4">{content.partner.title}</h2>
              <h3 className="text-xl font-serif italic text-brand-accent mb-6">{content.partner.subtitle}</h3>
              <p className="text-brand-dark/70 mb-8 leading-relaxed">
                {content.partner.description}
              </p>
              <a 
                href={content.partner.link} 
                target="_blank" 
                rel="noreferrer" 
                className="inline-flex items-center gap-2 text-brand-green font-medium hover:text-brand-accent transition-colors"
              >
                <Instagram className="w-5 h-5" />
                Xem thêm tại Ysim Coffee Roasters
              </a>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-full overflow-hidden border-8 border-white shadow-xl">
                <img 
                  src={content.partner.image} 
                  alt="Coffee Roaster" 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-brand-accent/10 rounded-full -z-10"></div>
              <div className="absolute -top-4 -left-4 w-48 h-48 bg-brand-green/10 rounded-full -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery / Vibe Section */}
      <section className="py-20 bg-white relative group/section">
        <EditBtn section="gallery" data={{ gallery: content.gallery }} className="top-4 right-4" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-brand-green mb-2">Góc Nhỏ Rảnh Rang</h2>
              <p className="text-brand-dark/60">Theo dõi chúng tôi trên Instagram <a href="https://www.instagram.com/ranhrang.cafe" className="text-brand-accent hover:underline">@ranhrang.cafe</a></p>
            </div>
            <a href="https://www.instagram.com/ranhrang.cafe" target="_blank" rel="noreferrer" className="hidden md:flex items-center gap-2 px-6 py-3 bg-white border border-brand-dark/10 rounded-full hover:bg-brand-dark hover:text-white transition-all">
              <Instagram className="w-5 h-5" />
              Follow Us
            </a>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.isArray(content.gallery) && content.gallery.map((imgUrl: string, i: number) => (
              <div key={i} className="rounded-xl overflow-hidden aspect-[3/4] group relative">
                <img 
                  src={imgUrl} 
                  alt="Gallery" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Instagram className="text-white w-8 h-8 drop-shadow-lg" />
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8 md:hidden flex justify-center">
             <a href="https://www.instagram.com/ranhrang.cafe" target="_blank" rel="noreferrer" className="flex items-center gap-2 px-6 py-3 bg-white border border-brand-dark/10 rounded-full hover:bg-brand-dark hover:text-white transition-all">
              <Instagram className="w-5 h-5" />
              Follow Us
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-brand-dark text-brand-cream pt-20 pb-10 relative group/section">
        <EditBtn section="footer" data={content.footer} className="top-4 right-4" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-12 mb-16">
            <div>
              <div className="flex items-center gap-2 mb-6">
                {content.branding.logoUrl ? (
                  <img src={content.branding.logoUrl} alt={content.branding.logoText} className="h-10 w-auto object-contain" />
                ) : (
                  <div className="w-8 h-8 bg-brand-green rounded flex items-center justify-center font-serif font-bold">R</div>
                )}
                <span className="font-serif font-bold text-2xl">{content.branding.logoText}</span>
              </div>
              <p className="text-brand-cream/60 mb-6 max-w-xs">
                {content.footer.about}
              </p>
              <div className="flex gap-4">
                <a href="https://www.facebook.com/profile.php?id=61574213638994" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-green transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="https://www.instagram.com/ranhrang.cafe" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-brand-green transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
              </div>
            </div>

            <div>
              <h3 className="font-serif font-bold text-lg mb-6 text-white">Liên Hệ</h3>
              <ul className="space-y-4 text-brand-cream/70">
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-brand-green shrink-0 mt-1" />
                  <span>{content.footer.address}</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-brand-green shrink-0" />
                  <span>{content.footer.phone}</span>
                </li>
                <li className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-brand-green shrink-0" />
                  <span>{content.footer.hours}</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-serif font-bold text-lg mb-6 text-white">Đăng Ký Nhận Tin</h3>
              <p className="text-brand-cream/60 mb-4 text-sm">Nhận thông tin về các workshop và ưu đãi mới nhất.</p>
              <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
                <input 
                  type="email" 
                  placeholder={content.footer.emailPlaceholder}
                  className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 w-full focus:outline-none focus:border-brand-green text-sm"
                />
                <button className="bg-brand-green text-white px-4 py-2 rounded-lg hover:bg-brand-green/80 transition-colors">
                  Gửi
                </button>
              </form>
            </div>
          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-brand-cream/40">
            <p>{content.footer.copyright}</p>
            <p>{content.footer.designer}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
