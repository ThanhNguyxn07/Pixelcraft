'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, Globe, Minus, Plus, ShoppingBag } from 'lucide-react';

type Locale = 'en' | 'vi';

interface Product {
  id: string;
  code: string;
  priceUsd: number;
  en: { name: string; material: string; desc: string };
  vi: { name: string; material: string; desc: string };
  tone: string;
}

const PRODUCTS: Product[] = [
  {
    id: 'vessel-01',
    code: 'KB—01',
    priceUsd: 140,
    tone: '#dfd8cc',
    en: {
      name: 'Shigaraki Ash-Glaze Vessel',
      material: 'Wood-fired stoneware · 18 cm',
      desc: 'Thrown by hand from coarse iron-rich clay; natural kiln ash settles into a matte mineral shoulder.',
    },
    vi: {
      name: 'Bình gốm men tro Shigaraki',
      material: 'Đất nung củi nguyên khối · 18 cm',
      desc: 'Vuốt tay từ đất sét giàu sắt; tro củi tự nhiên trong lò tạo lớp men khoáng mờ không lặp lại.',
    },
  },
  {
    id: 'monograph-04',
    code: 'KB—02',
    priceUsd: 68,
    tone: '#e5e2dc',
    en: {
      name: 'Spatial Timber & Light (Vol. IV)',
      material: 'Thread-sewn linen hardcover · 240 pp',
      desc: 'Measured architectural drawings and daylight essays documenting twelve Japanese residential courtyards.',
    },
    vi: {
      name: 'Chuyên khảo Gỗ & Ánh sáng (Tập IV)',
      material: 'Bìa vải lanh khâu chỉ · 240 trang',
      desc: 'Bản vẽ đo đạc kiến trúc và tiểu luận ánh sáng ghi chép mười hai khoảng sân nhà ở truyền thống.',
    },
  },
  {
    id: 'pour-03',
    code: 'KB—03',
    priceUsd: 92,
    tone: '#d8d2c7',
    en: {
      name: 'Kuro-Yū Pour-Over Carafe',
      material: 'Reduction-fired porcelain · 450 ml',
      desc: 'Sharp drip-free spout geometry paired with an unglazed grip band that stays cool in the hand.',
    },
    vi: {
      name: 'Bình pha cà phê Kuro-Yū',
      material: 'Sứ nung khử · 450 ml',
      desc: 'Miệng rót sắc gọn không nhỏ giọt kết hợp đai đất mộc chống nóng khi cầm trực tiếp.',
    },
  },
];

const COPY = {
  en: {
    kicker: 'KYOTO · HANDCRAFTED OBJECTS & ARCHITECTURAL PRINT',
    heroTitle: 'Objects shaped by kiln, grain, and daylight.',
    heroSub:
      'Small-batch stoneware and thread-sewn monographs. Switch to Tiếng Việt at top right to inspect diacritics, line-height, and text-expansion resilience.',
    add: 'Add to bag',
    bag: 'Order summary',
    emptyBag: 'Your bag is empty. Add an object from the catalog to test checkout recovery.',
    total: 'Estimated total',
    checkoutTitle: 'Shipping & reservation',
    nameLabel: 'Full name',
    emailLabel: 'Email address',
    emailHint: 'Try submitting an invalid email to verify preserved input and accessible error focus.',
    submit: 'Review order (no live charge)',
    errName: 'Enter your full name so we can label the parcel. Your other fields were kept.',
    errEmail: 'Enter a valid email address (for example, linh@studio.vn). Your input was kept.',
    okMsg: 'Order details validated (demo stopping point — no live payment was submitted).',
  },
  vi: {
    kicker: 'KYOTO · GỐM THỦ CÔNG & ẤN PHẨM KIẾN TRÚC',
    heroTitle: 'Những vật thể định hình từ lò củi, thớ đất và ánh sáng.',
    heroSub:
      'Gốm nung mẻ nhỏ và sách chuyên khảo khâu chỉ. Thử thêm sản phẩm vào giỏ và gửi form lỗi để kiểm tra cơ chế giữ dữ liệu và hiển thị dấu tiếng Việt.',
    add: 'Thêm vào giỏ',
    bag: 'Tóm tắt đơn hàng',
    emptyBag: 'Giỏ hàng đang trống. Chọn một sản phẩm bên trái để thử luồng kiểm tra đơn.',
    total: 'Tạm tính',
    checkoutTitle: 'Thông tin giao nhận',
    nameLabel: 'Họ và tên',
    emailLabel: 'Địa chỉ email',
    emailHint: 'Thử nhập email sai định dạng để kiểm tra báo lỗi chuẩn accessibility và không mất dữ liệu.',
    submit: 'Kiểm tra đơn (không trừ tiền thật)',
    errName: 'Vui lòng nhập họ và tên người nhận. Các thông tin khác của bạn vẫn được giữ nguyên.',
    errEmail: 'Nhập email đúng định dạng (ví dụ: linh@studio.vn). Dữ liệu bạn đã gõ vẫn được giữ nguyên.',
    okMsg: 'Đã kiểm tra hợp lệ (dừng trước bước thanh toán thật theo quy tắc an toàn Pixelcraft).',
  },
};

export default function AtelierKyotoDemo() {
  const [locale, setLocale] = useState<Locale>('en');
  const [cart, setCart] = useState<Record<string, number>>({ 'vessel-01': 1 });
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const t = COPY[locale];

  const updateQty = (id: string, delta: number) => {
    setCart((prev) => {
      const next = (prev[id] || 0) + delta;
      const copy = { ...prev };
      if (next <= 0) delete copy[id];
      else copy[id] = next;
      return copy;
    });
    setConfirmed(false);
  };

  const cartItems = PRODUCTS.filter((p) => (cart[p.id] || 0) > 0);
  const total = cartItems.reduce((sum, p) => sum + p.priceUsd * (cart[p.id] || 0), 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setConfirmed(false);
    if (fullName.trim().length < 2) {
      setError(t.errName);
      document.getElementById('kobo-name')?.focus();
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError(t.errEmail);
      document.getElementById('kobo-email')?.focus();
      return;
    }
    setError(null);
    setConfirmed(true);
  };

  return (
    <div lang={locale} className="min-h-screen bg-[#f7f5f0] text-[#141413]">
      <header className="sticky top-0 z-30 border-b border-stone-300 bg-[#f7f5f0]/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[1360px] items-center justify-between px-5 sm:px-10">
          <div className="flex items-center gap-4">
            <Link
              href="/gallery"
              className="inline-flex items-center gap-1.5 rounded-full border border-stone-400 px-3 py-1 font-mono text-[11px] text-stone-700 no-underline hover:border-[#141413] hover:text-[#141413]"
            >
              <ArrowLeft className="h-3 w-3" aria-hidden="true" />
              Gallery
            </Link>
            <span className="font-serif text-lg font-bold tracking-tight text-[#141413]">KŌBŌ</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                setLocale((l) => (l === 'en' ? 'vi' : 'en'));
                setError(null);
              }}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#1d4ed8]/40 bg-white px-3.5 py-1.5 font-mono text-xs font-semibold text-[#1d4ed8] cursor-pointer hover:border-[#1d4ed8]"
            >
              <Globe className="h-3.5 w-3.5" aria-hidden="true" />
              {locale === 'en' ? 'Tiếng Việt' : 'English'}
            </button>
            <span className="inline-flex items-center gap-1.5 font-mono text-xs text-stone-700">
              <ShoppingBag className="h-4 w-4" aria-hidden="true" />
              {Object.values(cart).reduce((a, b) => a + b, 0)}
            </span>
          </div>
        </div>
      </header>

      <main id="main-content" className="mx-auto max-w-[1360px] px-5 py-12 sm:px-10 sm:py-16">
        <section className="max-w-3xl border-b border-stone-300 pb-10">
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-[#1d4ed8]">{t.kicker}</p>
          <h1 className="mt-3 font-serif text-4xl font-bold leading-[1.12] tracking-tight text-[#141413] sm:text-6xl">
            {t.heroTitle}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-stone-700">{t.heroSub}</p>
        </section>

        <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-12">
          {/* Editorial Catalog */}
          <section className="space-y-6 lg:col-span-7" aria-label="Product catalog">
            {PRODUCTS.map((product) => {
              const info = product[locale];
              return (
                <article
                  key={product.id}
                  className="grid grid-cols-1 gap-5 border-b border-stone-300 pb-6 sm:grid-cols-12"
                >
                  <div
                    className="flex h-40 flex-col justify-between rounded-sm border border-stone-300 p-4 sm:col-span-5"
                    style={{ backgroundColor: product.tone }}
                  >
                    <span className="font-mono text-[11px] text-stone-700">{product.code}</span>
                    <span className="font-mono text-xs font-semibold text-[#141413]">
                      {info.material}
                    </span>
                  </div>
                  <div className="flex flex-col justify-between sm:col-span-7">
                    <div>
                      <div className="flex items-baseline justify-between gap-3">
                        <h2 className="font-serif text-xl font-bold leading-snug text-[#141413]">
                          {info.name}
                        </h2>
                        <span className="font-mono text-base font-semibold tabular-nums text-[#141413]">
                          ${product.priceUsd}
                        </span>
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-stone-700">{info.desc}</p>
                    </div>
                    <div className="mt-4">
                      <button
                        type="button"
                        onClick={() => updateQty(product.id, 1)}
                        className="inline-flex h-10 items-center gap-2 rounded-sm bg-[#141413] px-4 font-mono text-xs font-semibold text-white cursor-pointer transition-colors hover:bg-[#1d4ed8]"
                      >
                        <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                        {t.add}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>

          {/* Accessible Cart & Checkout Recovery Panel */}
          <aside className="lg:col-span-5">
            <div className="rounded-sm border border-stone-300 bg-white p-6">
              <h2 className="font-serif text-xl font-bold text-[#141413]">{t.bag}</h2>

              {cartItems.length === 0 ? (
                <p className="mt-4 text-sm text-stone-600">{t.emptyBag}</p>
              ) : (
                <ul className="mt-4 m-0 list-none divide-y divide-stone-200 p-0">
                  {cartItems.map((item) => (
                    <li key={item.id} className="flex items-center justify-between gap-3 py-3">
                      <div>
                        <p className="text-sm font-semibold text-[#141413]">{item[locale].name}</p>
                        <p className="font-mono text-xs text-stone-600">${item.priceUsd}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => updateQty(item.id, -1)}
                          aria-label={`Decrease quantity of ${item[locale].name}`}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-sm border border-stone-300 text-[#141413] cursor-pointer hover:border-[#141413]"
                        >
                          <Minus className="h-3.5 w-3.5" aria-hidden="true" />
                        </button>
                        <span className="w-6 text-center font-mono text-xs font-semibold tabular-nums">
                          {cart[item.id]}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQty(item.id, 1)}
                          aria-label={`Increase quantity of ${item[locale].name}`}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-sm border border-stone-300 text-[#141413] cursor-pointer hover:border-[#141413]"
                        >
                          <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              <div className="mt-4 flex items-baseline justify-between border-t border-stone-300 pt-4">
                <span className="font-mono text-xs uppercase text-stone-600">{t.total}</span>
                <span className="font-mono text-xl font-bold tabular-nums text-[#141413]">
                  ${total}
                </span>
              </div>

              <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4 border-t border-stone-300 pt-6">
                <h3 className="font-serif text-base font-bold text-[#141413]">{t.checkoutTitle}</h3>

                <div>
                  <label htmlFor="kobo-name" className="block text-sm font-semibold text-[#141413]">
                    {t.nameLabel}
                  </label>
                  <input
                    id="kobo-name"
                    type="text"
                    autoComplete="name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="mt-1.5 h-10 w-full rounded-sm border border-stone-400 bg-[#faf9f6] px-3 text-sm text-[#141413]"
                  />
                </div>

                <div>
                  <label htmlFor="kobo-email" className="block text-sm font-semibold text-[#141413]">
                    {t.emailLabel}
                  </label>
                  <input
                    id="kobo-email"
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    aria-describedby="kobo-email-hint"
                    className="mt-1.5 h-10 w-full rounded-sm border border-stone-400 bg-[#faf9f6] px-3 text-sm text-[#141413]"
                  />
                  <p id="kobo-email-hint" className="mt-1 text-xs leading-5 text-stone-600">
                    {t.emailHint}
                  </p>
                </div>

                {error && (
                  <p
                    role="alert"
                    className="rounded-sm border border-red-300 bg-red-50 px-3 py-2 text-xs font-semibold leading-5 text-red-800"
                  >
                    {error}
                  </p>
                )}

                {confirmed && (
                  <p
                    role="status"
                    className="flex items-start gap-2 rounded-sm border border-emerald-300 bg-emerald-50 px-3 py-2 text-xs font-semibold leading-5 text-emerald-900"
                  >
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                    {t.okMsg}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={cartItems.length === 0}
                  className="h-11 w-full rounded-sm bg-[#1d4ed8] px-4 font-mono text-xs font-semibold uppercase tracking-wider text-white cursor-pointer transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {t.submit}
                </button>
              </form>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
