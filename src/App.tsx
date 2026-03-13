import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Globe, 
  Truck, 
  BarChart, 
  ShieldCheck, 
  Menu, 
  X, 
  ArrowRight, 
  Mail, 
  Phone, 
  MapPin, 
  Linkedin, 
  Instagram, 
  Facebook,
  Plus,
  Trash2,
  LayoutDashboard,
  Home as HomeIcon,
  Settings,
  Users,
  CheckCircle2,
  MessageSquare,
  Search,
  FileText,
  Ship,
  ClipboardCheck,
  Lock,
  LogOut
} from 'lucide-react';
import { siteConfig } from './config';
import { Post, Consultation } from './types';

// --- Components ---

const ConsultationModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const [formData, setFormData] = useState({ title: '', contact: '', email: '', content: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.contact || !formData.email || !formData.content) return;
    
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/consultations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
          setFormData({ title: '', contact: '', email: '', content: '' });
          onClose();
        }, 2000);
      }
    } catch (error) {
      console.error('Submission failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg glass rounded-3xl border border-white/10 p-8 shadow-2xl"
          >
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>

            {isSuccess ? (
              <div className="py-12 text-center">
                <div className="w-20 h-20 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 size={40} />
                </div>
                <h3 className="text-2xl font-bold mb-2">신청 완료!</h3>
                <p className="text-gray-400">빠른 시일 내에 연락드리겠습니다.</p>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold mb-6">상담 신청하기</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">제목</label>
                    <input
                      required
                      type="text"
                      value={formData.title}
                      onChange={e => setFormData({ ...formData, title: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                      placeholder="상담 제목을 입력하세요"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">연락처</label>
                      <input
                        required
                        type="tel"
                        value={formData.contact}
                        onChange={e => setFormData({ ...formData, contact: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                        placeholder="010-0000-0000"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1">이메일</label>
                      <input
                        required
                        type="email"
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                        placeholder="example@email.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">내용</label>
                    <textarea
                      required
                      rows={5}
                      value={formData.content}
                      onChange={e => setFormData({ ...formData, content: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none"
                      placeholder="상담 내용을 상세히 적어주세요"
                    />
                  </div>
                  <button
                    disabled={isSubmitting}
                    className="w-full py-4 bg-primary hover:bg-accent text-white rounded-xl font-bold transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
                  >
                    {isSubmitting ? '제출 중...' : '상담 신청 제출'}
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const Navbar = ({ onNavigate, currentPath }: { onNavigate: (path: string) => void, currentPath: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center cursor-pointer" onClick={() => onNavigate('home')}>
            <span className="text-2xl font-bold tracking-tighter text-gradient">BRIDGEWAY</span>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {['Home', 'About', 'Services', 'News', 'Admin'].map((item) => (
                <button
                  key={item}
                  onClick={() => onNavigate(item.toLowerCase())}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    currentPath === item.toLowerCase() ? 'text-primary' : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {item === 'About' ? '회사 소개' : item}
                </button>
              ))}
            </div>
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-400 hover:text-white">
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden glass border-b border-white/10"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {['Home', 'About', 'Services', 'News', 'Admin'].map((item) => (
                <button
                  key={item}
                  onClick={() => { onNavigate(item.toLowerCase()); setIsOpen(false); }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-white/5"
                >
                  {item === 'About' ? '회사 소개' : item}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Footer = () => (
  <footer className="bg-black border-t border-white/10 pt-20 pb-10">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <span className="text-2xl font-bold tracking-tighter text-gradient">BRIDGEWAY</span>
          <p className="mt-4 text-gray-400 max-w-sm">
            {siteConfig.description}
          </p>
        </div>
        
        <div>
          <h4 className="text-white font-semibold mb-6">Contact</h4>
          <ul className="space-y-4 text-gray-400 text-sm">
            <li className="flex items-center gap-2"><Mail size={16} /> {siteConfig.contact.email}</li>
            <li className="flex items-center gap-2"><Phone size={16} /> {siteConfig.contact.phone}</li>
            <li className="flex items-start gap-2"><MapPin size={16} className="mt-1 shrink-0" /> {siteConfig.contact.address}</li>
          </ul>
        </div>
      </div>
      <div className="mt-20 pt-8 border-t border-white/5 text-center text-gray-500 text-xs">
        © 2024 Bridgeway Global. All rights reserved.
      </div>
    </div>
  </footer>
);

// --- Pages ---

const About = () => (
  <div className="pt-32 pb-24">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-20"
      >
        <span className="text-primary font-semibold tracking-wider uppercase text-sm mb-4 block">About Us</span>
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          중국 소싱과 무역, <br />
          <span className="text-gradient">현지에서 실행하는 파트너</span>
        </h2>
        <div className="w-24 h-1 bg-primary mx-auto mb-8"></div>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
          중국 거래가 처음이신가요? 사내에 중국어 인력이 없어도 괜찮습니다.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="space-y-8"
        >
          <div className="glass p-8 rounded-3xl border-l-4 border-primary">
            <p className="text-lg text-gray-200 leading-relaxed">
              저희는 한국 기업을 대신하여 중국 현지에서 
              <span className="text-white font-semibold"> 공급처 발굴, 업체 소통, 샘플 진행, 출하 관리, 박람회 통역 및 대리참석</span>까지 
              실무 중심으로 지원하는 중국 무역 에이전시입니다.
            </p>
          </div>
          
          <div className="space-y-6">
            <h3 className="text-2xl font-bold flex items-center gap-3">
              <CheckCircle2 className="text-primary" /> 단순 연결이 아닌, 실행 파트너
            </h3>
            <p className="text-gray-400 leading-relaxed">
              우리는 단순한 정보를 전달하는 중개인이 아닙니다. 
              고객사의 거래가 실제로 성사되고 안전하게 물품이 인도될 때까지 
              현지에서 직접 발로 뛰며 문제를 해결하는 실무 파트너입니다.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="aspect-square rounded-3xl overflow-hidden glass p-4">
            <img 
              src="https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&q=80&w=800" 
              alt="China Trade" 
              className="w-full h-full object-cover rounded-2xl opacity-80"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="absolute -bottom-6 -left-6 glass p-6 rounded-2xl purple-glow hidden md:block">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                <Users className="text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">현지 전문가 상주</p>
                <p className="text-xs text-gray-400">중국 전역 네트워크 보유</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {siteConfig.services.map((service, i) => {
          const Icon = { 
            Globe, 
            Truck, 
            BarChart, 
            ShieldCheck, 
            Search, 
            MessageSquare, 
            Ship, 
            Users, 
            ClipboardCheck 
          }[service.icon] || Globe;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="glass p-8 rounded-3xl hover:bg-white/5 transition-all border border-white/5 hover:border-primary/30 group"
            >
              <div className="flex gap-6 items-start">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                  <Icon size={24} />
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">{service.title}</h4>
                  <p className="text-gray-400 text-sm leading-relaxed">{service.description}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  </div>
);

const Services = ({ onOpenConsultation }: { onOpenConsultation: () => void }) => (
  <div className="pt-32 pb-24">
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Our Services</h2>
          <div className="w-24 h-1 bg-primary mx-auto mb-8"></div>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            브릿지웨이 글로벌은 전문적인 지식과 현지 네트워크를 바탕으로 <br className="hidden md:block" />
            최상의 무역 서비스를 제공합니다.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {siteConfig.services.map((service, index) => {
            const Icon = { 
              Globe, 
              Truck, 
              BarChart, 
              ShieldCheck, 
              Search, 
              MessageSquare, 
              Ship, 
              Users, 
              ClipboardCheck 
            }[service.icon] || Globe;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="p-8 glass rounded-3xl border border-white/5 hover:border-primary/30 transition-all group"
              >
                <div className="flex flex-col sm:flex-row gap-6 items-start">
                  <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shrink-0 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                    <Icon size={28} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">{service.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>

    {/* CTA Section */}
    <section className="py-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass p-12 rounded-3xl text-center border border-primary/20 purple-glow">
          <h3 className="text-3xl font-bold mb-6">비즈니스 성장을 위한 파트너를 찾으시나요?</h3>
          <p className="text-gray-400 mb-10">지금 바로 브릿지웨이 글로벌의 전문가와 상담하세요.</p>
          <button 
            onClick={onOpenConsultation}
            className="px-10 py-4 bg-primary hover:bg-accent text-white rounded-full font-bold transition-all"
          >
            무료 상담 신청하기
          </button>
        </div>
      </div>
    </section>
  </div>
);

const Home = ({ onNavigate, onViewPost, onOpenConsultation }: { onNavigate: (path: string) => void, onViewPost: (id: number) => void, onOpenConsultation: () => void }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [bgImage, setBgImage] = useState('');

  const backgroundImages = [
    'https://images.unsplash.com/photo-1474181487882-5abf3f0ba6c2?auto=format&fit=crop&q=80&w=1920', // Shanghai
    'https://images.unsplash.com/photo-1547984609-4b749624b79b?auto=format&fit=crop&q=80&w=1920', // Beijing
    'https://images.unsplash.com/photo-1523365280197-f1783db9fe62?auto=format&fit=crop&q=80&w=1920'  // Shenzhen
  ];

  useEffect(() => {
    fetch('/api/posts')
      .then(res => res.json())
      .then(data => setPosts(data));
    
    // Pick a random background image
    const randomIdx = Math.floor(Math.random() * backgroundImages.length);
    setBgImage(backgroundImages[randomIdx]);
  }, []);

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          {bgImage && (
            <img 
              src={bgImage} 
              alt="Trade Background" 
              className="w-full h-full object-cover opacity-40"
              referrerPolicy="no-referrer"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-1 rounded-full bg-primary/20 text-primary text-sm font-medium mb-6 border border-primary/30">
              Global Trade Agency
            </span>
            <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-8">
              중국 비즈니스의 <br />
              <span className="text-gradient">새로운 기준</span>을 세우다
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mb-10 leading-relaxed">
              브릿지웨이 글로벌은 중국 시장에서의 최적의 무역 솔루션을 제공합니다. 
              저희는 단순한 중개를 넘어 고객들의 비즈니스가 세계로 뻗어나가는 든든한 가교가 되어드립니다.
            </p>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={onOpenConsultation}
                className="px-8 py-4 bg-primary hover:bg-accent text-white rounded-full font-semibold transition-all flex items-center gap-2 purple-glow"
              >
                상담 신청하기 <ArrowRight size={20} />
              </button>
              <button 
                onClick={() => onNavigate('services')}
                className="px-8 py-4 glass hover:bg-white/10 text-white rounded-full font-semibold transition-all"
              >
                서비스 둘러보기
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* News Section */}
      <section className="py-24 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-2">Latest Insights</h2>
              <p className="text-gray-400">무역 트렌드와 브릿지웨이의 소식을 전해드립니다.</p>
            </div>
            <button 
              onClick={() => onNavigate('news')}
              className="text-primary hover:text-white transition-colors flex items-center gap-2 text-sm font-medium"
            >
              전체보기 <ArrowRight size={16} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {posts.slice(0, 3).map((post) => (
              <div 
                key={post.id} 
                onClick={() => onViewPost(post.id)}
                className="group cursor-pointer"
              >
                <div className="relative aspect-[16/10] overflow-hidden rounded-2xl mb-6">
                  <img 
                    src={post.image_url} 
                    alt={post.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-black/60 backdrop-blur-md text-xs font-medium rounded-full border border-white/10">
                      {post.category}
                    </span>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">{post.title}</h3>
                <p className="text-gray-400 text-sm line-clamp-2 mb-4">{post.content}</p>
                <span className="text-gray-500 text-xs">{new Date(post.created_at).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

const News = ({ onViewPost }: { onViewPost: (id: number) => void }) => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    fetch('/api/posts')
      .then(res => res.json())
      .then(data => setPosts(data));
  }, []);

  return (
    <div className="pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Latest Insights</h2>
          <div className="w-24 h-1 bg-primary mx-auto mb-8"></div>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            무역 트렌드와 브릿지웨이 글로벌의 최신 소식을 전해드립니다.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {posts.map((post) => (
            <motion.div 
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              onClick={() => onViewPost(post.id)}
              className="group cursor-pointer"
            >
              <div className="relative aspect-[16/10] overflow-hidden rounded-3xl mb-8 glass p-2">
                <img 
                  src={post.image_url} 
                  alt={post.title} 
                  className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-6 left-6">
                  <span className="px-4 py-1.5 bg-primary text-white text-xs font-bold rounded-full shadow-lg">
                    {post.category}
                  </span>
                </div>
              </div>
              <div className="px-2">
                <div className="flex items-center gap-3 text-gray-500 text-xs mb-4">
                  <span>{new Date(post.created_at).toLocaleDateString()}</span>
                  <span className="w-1 h-1 bg-gray-700 rounded-full" />
                  <span>Admin</span>
                </div>
                <h3 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors leading-tight">{post.title}</h3>
                <p className="text-gray-400 leading-relaxed mb-6 line-clamp-3">{post.content}</p>
                <button className="flex items-center gap-2 text-primary font-bold text-sm group-hover:gap-3 transition-all">
                  자세히 보기 <ArrowRight size={18} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

const PostDetail = ({ postId, onBack }: { postId: number, onBack: () => void }) => {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/posts`)
      .then(res => res.json())
      .then(data => {
        const found = data.find((p: Post) => p.id === postId);
        setPost(found);
        setLoading(false);
      });
    window.scrollTo(0, 0);
  }, [postId]);

  if (loading) return <div className="pt-40 text-center text-gray-400">Loading...</div>;
  if (!post) return <div className="pt-40 text-center text-gray-400">Post not found.</div>;

  return (
    <div className="pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-gray-400 hover:text-primary transition-colors mb-12 group"
        >
          <ArrowRight size={20} className="rotate-180 group-hover:-translate-x-1 transition-transform" />
          목록으로 돌아가기
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <span className="px-4 py-1.5 bg-primary/20 text-primary text-xs font-bold rounded-full border border-primary/30">
              {post.category}
            </span>
            <span className="text-gray-500 text-sm">{new Date(post.created_at).toLocaleDateString()}</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-12 leading-tight">{post.title}</h1>

          <div className="aspect-[21/9] rounded-3xl overflow-hidden mb-12 glass p-2">
            <img 
              src={post.image_url} 
              alt={post.title} 
              className="w-full h-full object-cover rounded-2xl"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="prose prose-invert prose-lg max-w-none">
            <p className="text-gray-300 leading-relaxed whitespace-pre-wrap text-lg">
              {post.content}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const Admin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [posts, setPosts] = useState<Post[]>([]);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [activeTab, setActiveTab] = useState<'posts' | 'consultations'>('posts');
  const [newPost, setNewPost] = useState({ title: '', content: '', category: '무역 뉴스', image_url: '' });
  const [loading, setLoading] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      fetchPosts();
      fetchConsultations();
    }
  }, [isLoggedIn]);

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/admin/check');
      const data = await res.json();
      if (data.authenticated) {
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setIsChecking(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await response.json();
      if (data.success) {
        setIsLoggedIn(true);
      } else {
        setLoginError(data.message || '로그인 실패');
      }
    } catch (error) {
      setLoginError('서버 오류가 발생했습니다.');
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      setIsLoggedIn(false);
      setPassword('');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const fetchPosts = () => {
    fetch('/api/posts')
      .then(res => res.json())
      .then(data => setPosts(data));
  };

  const fetchConsultations = () => {
    fetch('/api/consultations')
      .then(res => res.json())
      .then(data => setConsultations(data));
  };

  const handleAddPost = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPost),
      });
      setNewPost({ title: '', content: '', category: '무역 뉴스', image_url: '' });
      fetchPosts();
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (deleteConfirmId !== id) {
      setDeleteConfirmId(id);
      setTimeout(() => setDeleteConfirmId(null), 3000); // 3초 후 초기화
      return;
    }

    try {
      const response = await fetch(`/api/posts/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setDeleteConfirmId(null);
        fetchPosts();
      }
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const handleDeleteConsultation = async (id: number) => {
    try {
      const response = await fetch(`/api/consultations/${id}`, { method: 'DELETE' });
      if (response.ok) {
        fetchConsultations();
      }
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  if (isChecking) {
    return <div className="pt-40 text-center text-gray-400">인증 확인 중...</div>;
  }

  if (!isLoggedIn) {
    return (
      <div className="pt-40 pb-24 flex items-center justify-center px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass p-10 rounded-3xl border border-white/10 w-full max-w-md text-center"
        >
          <div className="w-20 h-20 bg-primary/20 text-primary rounded-2xl flex items-center justify-center mx-auto mb-8">
            <Lock size={40} />
          </div>
          <h2 className="text-3xl font-bold mb-4">Admin Access</h2>
          <p className="text-gray-400 mb-8">관리자 비밀번호를 입력해 주세요.</p>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <input 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 text-white text-center focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
              autoFocus
            />
            {loginError && <p className="text-red-500 text-sm">{loginError}</p>}
            <button className="w-full py-4 bg-primary hover:bg-accent text-white rounded-xl font-bold transition-all shadow-lg shadow-primary/20">
              로그인
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-12">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/20 text-primary rounded-xl">
            <LayoutDashboard size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-gray-400">콘텐츠를 관리하고 웹사이트를 최신 상태로 유지하세요.</p>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 glass hover:bg-white/10 text-gray-400 hover:text-white rounded-xl transition-all text-sm font-medium"
        >
          <LogOut size={18} /> 로그아웃
        </button>
      </div>

      <div className="flex items-center gap-4 mb-8">
        <button 
          onClick={() => setActiveTab('posts')}
          className={`px-6 py-2 rounded-xl font-medium transition-all ${activeTab === 'posts' ? 'bg-primary text-white' : 'glass text-gray-400 hover:text-white'}`}
        >
          게시글 관리
        </button>
        <button 
          onClick={() => setActiveTab('consultations')}
          className={`px-6 py-2 rounded-xl font-medium transition-all ${activeTab === 'consultations' ? 'bg-primary text-white' : 'glass text-gray-400 hover:text-white'}`}
        >
          상담 신청 목록
        </button>
      </div>

      <AnimatePresence>
        {selectedConsultation && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedConsultation(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl glass rounded-3xl border border-white/10 p-10 shadow-2xl"
            >
              <button 
                onClick={() => setSelectedConsultation(null)}
                className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
              
              <div className="mb-8">
                <span className="text-primary font-bold text-xs uppercase tracking-widest mb-2 block">상담 상세 내용</span>
                <h2 className="text-3xl font-bold">{selectedConsultation.title}</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="glass p-4 rounded-2xl border border-white/5">
                  <p className="text-xs text-gray-500 uppercase mb-1">연락처</p>
                  <p className="text-white font-medium">{selectedConsultation.contact}</p>
                </div>
                <div className="glass p-4 rounded-2xl border border-white/5">
                  <p className="text-xs text-gray-500 uppercase mb-1">이메일</p>
                  <p className="text-white font-medium">{selectedConsultation.email}</p>
                </div>
              </div>

              <div className="glass p-6 rounded-2xl border border-white/5 mb-8">
                <p className="text-xs text-gray-500 uppercase mb-3">상담 내용</p>
                <p className="text-gray-200 whitespace-pre-wrap leading-relaxed">
                  {selectedConsultation.content}
                </p>
              </div>

              <div className="flex justify-between items-center">
                <p className="text-xs text-gray-500">
                  신청일: {new Date(selectedConsultation.created_at).toLocaleString()}
                </p>
                <button 
                  onClick={() => setSelectedConsultation(null)}
                  className="px-6 py-2 glass hover:bg-white/10 rounded-xl text-sm font-bold transition-all"
                >
                  닫기
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {activeTab === 'posts' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Form */}
          <div className="lg:col-span-1">
            <div className="glass p-8 rounded-2xl sticky top-32">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Plus size={20} className="text-primary" /> 새 게시글 작성
              </h2>
              <form onSubmit={handleAddPost} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">제목</label>
                  <input 
                    type="text" 
                    required
                    value={newPost.title}
                    onChange={e => setNewPost({...newPost, title: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                    placeholder="제목을 입력하세요"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">카테고리</label>
                  <select 
                    value={newPost.category}
                    onChange={e => setNewPost({...newPost, category: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                  >
                    <option value="무역 뉴스">무역 뉴스</option>
                    <option value="공지사항">공지사항</option>
                    <option value="글로벌 트렌드">글로벌 트렌드</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">이미지 URL</label>
                  <input 
                    type="text" 
                    value={newPost.image_url}
                    onChange={e => setNewPost({...newPost, image_url: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">내용</label>
                  <textarea 
                    required
                    rows={5}
                    value={newPost.content}
                    onChange={e => setNewPost({...newPost, content: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none"
                    placeholder="내용을 입력하세요"
                  />
                </div>
                <button 
                  disabled={loading}
                  className="w-full py-4 bg-primary hover:bg-accent text-white rounded-xl font-semibold transition-all disabled:opacity-50"
                >
                  {loading ? '저장 중...' : '게시글 등록하기'}
                </button>
              </form>
            </div>
          </div>

          {/* List */}
          <div className="lg:col-span-2">
            <div className="glass rounded-2xl overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-white/5 border-b border-white/10">
                  <tr>
                    <th className="px-6 py-4 text-sm font-medium text-gray-400">게시글</th>
                    <th className="px-6 py-4 text-sm font-medium text-gray-400">카테고리</th>
                    <th className="px-6 py-4 text-sm font-medium text-gray-400">날짜</th>
                    <th className="px-6 py-4 text-sm font-medium text-gray-400 text-right">관리</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {posts.map((post) => (
                    <tr key={post.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={post.image_url} className="w-10 h-10 rounded-lg object-cover" referrerPolicy="no-referrer" />
                          <span className="font-medium text-sm">{post.title}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-white/10 rounded text-[10px] font-bold uppercase tracking-wider">
                          {post.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400">
                        {new Date(post.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => handleDelete(post.id)}
                          className={`p-2 rounded-lg transition-all flex items-center gap-2 ml-auto ${
                            deleteConfirmId === post.id 
                              ? 'bg-red-500 text-white px-3' 
                              : 'text-gray-400 hover:text-red-500'
                          }`}
                        >
                          {deleteConfirmId === post.id ? (
                            <>
                              <span className="text-xs font-bold">정말 삭제?</span>
                              <Trash2 size={18} />
                            </>
                          ) : (
                            <Trash2 size={18} />
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="glass rounded-2xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-white/5 border-b border-white/10">
              <tr>
                <th className="px-6 py-4 text-sm font-medium text-gray-400">상담 제목</th>
                <th className="px-6 py-4 text-sm font-medium text-gray-400">연락처</th>
                <th className="px-6 py-4 text-sm font-medium text-gray-400">이메일</th>
                <th className="px-6 py-4 text-sm font-medium text-gray-400">날짜</th>
                <th className="px-6 py-4 text-sm font-medium text-gray-400 text-right">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {consultations.map((item) => (
                <tr 
                  key={item.id} 
                  onClick={() => setSelectedConsultation(item)}
                  className="hover:bg-white/5 transition-colors cursor-pointer group"
                >
                  <td className="px-6 py-4">
                    <div className="font-medium text-sm mb-1 group-hover:text-primary transition-colors">{item.title}</div>
                    <div className="text-xs text-gray-400 line-clamp-1">{item.content}</div>
                  </td>
                  <td className="px-6 py-4 text-sm">{item.contact}</td>
                  <td className="px-6 py-4 text-sm">{item.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-400">
                    {new Date(item.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteConsultation(item.id);
                      }}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {consultations.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                    접수된 상담 내역이 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [path, setPath] = useState('home');
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [isConsultationModalOpen, setIsConsultationModalOpen] = useState(false);

  const handleViewPost = (id: number) => {
    setSelectedPostId(id);
    setPath('post-detail');
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar onNavigate={(p) => { setPath(p); setSelectedPostId(null); }} currentPath={path} />
      <ConsultationModal isOpen={isConsultationModalOpen} onClose={() => setIsConsultationModalOpen(false)} />
      
      <main>
        {path === 'home' && <Home onNavigate={setPath} onViewPost={handleViewPost} onOpenConsultation={() => setIsConsultationModalOpen(true)} />}
        {path === 'about' && <About />}
        {path === 'services' && <Services onOpenConsultation={() => setIsConsultationModalOpen(true)} />}
        {path === 'news' && <News onViewPost={handleViewPost} />}
        {path === 'post-detail' && selectedPostId && (
          <PostDetail postId={selectedPostId} onBack={() => setPath('news')} />
        )}
        {path === 'admin' && <Admin />}
      </main>

      <Footer />
    </div>
  );
}
