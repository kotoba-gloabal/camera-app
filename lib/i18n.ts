export const LOCALES = [
  "en",
  "zh-CN",
  "zh-TW",
  "th",
  "ja",
  "es",
  "ko",
  "ms",
] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";

export const LOCALE_STORAGE_KEY = "camera-app-locale";

export const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  "zh-CN": "简体中文",
  "zh-TW": "繁體中文",
  th: "ไทย",
  ja: "日本語",
  es: "Español",
  ko: "한국어",
  ms: "Bahasa Melayu",
};

export type MessageKey =
  | "siteTitle"
  | "siteTagline"
  | "navProducts"
  | "navLogin"
  | "languageLabel"
  | "homeBadge"
  | "homeTitle"
  | "homeSubtitle"
  | "viewProducts"
  | "loginBtn"
  | "feature1Title"
  | "feature1Desc"
  | "feature2Title"
  | "feature2Desc"
  | "feature3Title"
  | "feature3Desc"
  | "wholesaleAccess"
  | "buyerLogin"
  | "loginSubtitle"
  | "loginIdLabel"
  | "passwordLabel"
  | "loginFailed"
  | "networkError"
  | "signingIn"
  | "signIn"
  | "backToHome"
  | "inventoryBadge"
  | "productsTitle"
  | "productsSubtitle"
  | "loadingInventory"
  | "pleaseSignIn"
  | "buyerAccount"
  | "itemsCount"
  | "pageOf"
  | "searchLabel"
  | "searchPlaceholder"
  | "searchButton"
  | "soldItemsLabel"
  | "includeSoldOut"
  | "excludeSoldOut"
  | "onlySoldOut"
  | "sortByLabel"
  | "sortIdAsc"
  | "sortIdDesc"
  | "sortNameAsc"
  | "sortNameDesc"
  | "sortPriceAsc"
  | "sortPriceDesc"
  | "noMatchingProducts"
  | "noMatchingHint"
  | "noImage"
  | "soldOut"
  | "viewDetails"
  | "previous"
  | "next"
  | "backToProducts"
  | "loadingProduct"
  | "pleaseSignInDetail"
  | "productNotFound"
  | "productNotFoundHint"
  | "backToInventory"
  | "productPhotos"
  | "noImagesAvailable"
  | "pricingLabel"
  | "buyerLabel"
  | "enlargeImage"
  | "closeLightbox"
  | "loadFailed"
  | "viewProductPhoto";

export type Messages = Record<MessageKey, string>;

const en: Messages = {
  siteTitle: "Used Camera B2B Catalog",
  siteTagline: "Japanese Inspected Cameras",
  navProducts: "Products",
  navLogin: "Login",
  languageLabel: "Language",
  homeBadge: "B2B Wholesale Catalog",
  homeTitle: "Japanese Used Cameras for Global Wholesale Buyers",
  homeSubtitle:
    "Carefully sourced and organized used cameras from Japan, prepared for overseas B2B buyers.",
  viewProducts: "View Products",
  loginBtn: "Login",
  feature1Title: "Japan-sourced inventory",
  feature1Desc:
    "Carefully selected used cameras from the Japanese market, prepared for overseas wholesale buyers.",
  feature2Title: "Organized product photos",
  feature2Desc:
    "Each item is documented with clear, consistent photography to support confident purchasing decisions.",
  feature3Title: "Country-based wholesale pricing",
  feature3Desc: "View pricing tailored to your region after secure buyer login.",
  wholesaleAccess: "Wholesale Access",
  buyerLogin: "Buyer Login",
  loginSubtitle: "Access wholesale camera inventory and country-specific pricing.",
  loginIdLabel: "Login ID",
  passwordLabel: "Password",
  loginFailed: "Login failed. Please check your credentials.",
  networkError: "Network error. Please try again.",
  signingIn: "Signing in…",
  signIn: "Sign in",
  backToHome: "Back to home",
  inventoryBadge: "Inventory",
  productsTitle: "Camera Inventory",
  productsSubtitle: "Browse available Japanese used cameras with buyer-specific pricing.",
  loadingInventory: "Loading inventory…",
  pleaseSignIn: "Please sign in to view the catalog.",
  buyerAccount: "Buyer account",
  itemsCount: "{count} items",
  pageOf: "Page {page} of {total}",
  searchLabel: "Search",
  searchPlaceholder: "Search by ID or product name",
  searchButton: "Search",
  soldItemsLabel: "Sold items",
  includeSoldOut: "Include sold items",
  excludeSoldOut: "Exclude sold items",
  onlySoldOut: "Sold items only",
  sortByLabel: "Sort by",
  sortIdAsc: "Product ID (A–Z)",
  sortIdDesc: "Product ID (Z–A)",
  sortNameAsc: "Product Name (A–Z)",
  sortNameDesc: "Product Name (Z–A)",
  sortPriceAsc: "Price (Low to High)",
  sortPriceDesc: "Price (High to Low)",
  noMatchingProducts: "No matching products",
  noMatchingHint: "Try adjusting your search or filter criteria.",
  noImage: "No Image",
  soldOut: "Sold Out",
  viewDetails: "View details →",
  previous: "Previous",
  next: "Next",
  backToProducts: "← Back to products",
  loadingProduct: "Loading product…",
  pleaseSignInDetail: "Please sign in to view this product.",
  productNotFound: "Product not found",
  productNotFoundHint: "This item may be unavailable or no longer listed.",
  backToInventory: "Back to inventory",
  productPhotos: "Product photos",
  noImagesAvailable: "No images available for this product.",
  pricingLabel: "Pricing",
  buyerLabel: "Buyer",
  enlargeImage: "Enlarge image",
  closeLightbox: "Close",
  loadFailed: "Failed to load data.",
  viewProductPhoto: "View product details",
};

const ja: Messages = {
  ...en,
  siteTagline: "日本検品済みカメラ",
  navProducts: "商品一覧",
  navLogin: "ログイン",
  languageLabel: "言語",
  homeBadge: "B2B卸売カタログ",
  homeTitle: "海外卸売向け 日本の中古カメラ",
  homeSubtitle: "日本で厳選・整理された中古カメラを、海外B2Bバイヤー向けにご提供します。",
  viewProducts: "商品を見る",
  loginBtn: "ログイン",
  feature1Title: "日本仕入れ在庫",
  feature1Desc: "日本市場から厳選した中古カメラを、海外卸売向けにご用意しています。",
  feature2Title: "整理された商品写真",
  feature2Desc: "各商品を明確で一貫した写真で記録し、安心してご検討いただけます。",
  feature3Title: "国別卸売価格",
  feature3Desc: "ログイン後、お客様の地域に応じた価格をご確認いただけます。",
  wholesaleAccess: "卸売アクセス",
  buyerLogin: "バイヤーログイン",
  loginSubtitle: "卸売カメラ在庫と国別価格にアクセスします。",
  loginIdLabel: "ログインID",
  passwordLabel: "パスワード",
  loginFailed: "ログインに失敗しました。認証情報をご確認ください。",
  networkError: "通信エラーが発生しました。もう一度お試しください。",
  signingIn: "ログイン中…",
  signIn: "ログイン",
  backToHome: "トップへ戻る",
  inventoryBadge: "在庫",
  productsTitle: "カメラ在庫",
  productsSubtitle: "バイヤー向け価格で、日本の中古カメラをご覧いただけます。",
  loadingInventory: "在庫を読み込み中…",
  pleaseSignIn: "カタログを表示するにはログインしてください。",
  buyerAccount: "バイヤーアカウント",
  itemsCount: "{count} 件",
  pageOf: "{page} / {total} ページ",
  searchLabel: "検索",
  searchPlaceholder: "ID・商品名で検索",
  searchButton: "検索",
  soldItemsLabel: "売約済み",
  includeSoldOut: "売約済みも表示",
  excludeSoldOut: "売約済みを除外",
  onlySoldOut: "売約済みのみ",
  sortByLabel: "並べ替え",
  sortIdAsc: "商品ID（昇順）",
  sortIdDesc: "商品ID（降順）",
  sortNameAsc: "商品名（昇順）",
  sortNameDesc: "商品名（降順）",
  sortPriceAsc: "価格（安い順）",
  sortPriceDesc: "価格（高い順）",
  noMatchingProducts: "該当する商品がありません",
  noMatchingHint: "検索条件やフィルターを変更してお試しください。",
  noImage: "画像なし",
  soldOut: "売約済み",
  viewDetails: "詳細を見る →",
  previous: "前へ",
  next: "次へ",
  backToProducts: "← 商品一覧へ",
  loadingProduct: "商品を読み込み中…",
  pleaseSignInDetail: "この商品を表示するにはログインしてください。",
  productNotFound: "商品が見つかりません",
  productNotFoundHint: "この商品は非掲載または存在しない可能性があります。",
  backToInventory: "在庫一覧へ",
  productPhotos: "商品写真",
  noImagesAvailable: "この商品の画像はありません。",
  pricingLabel: "価格",
  buyerLabel: "バイヤー",
  enlargeImage: "画像を拡大",
  closeLightbox: "閉じる",
  loadFailed: "データの読み込みに失敗しました。",
  viewProductPhoto: "商品詳細を見る",
};

const zhCN: Messages = {
  ...en,
  siteTagline: "日本检验相机",
  navProducts: "产品",
  navLogin: "登录",
  languageLabel: "语言",
  homeTitle: "面向全球批发买家的日本二手相机",
  homeSubtitle: "来自日本的精选二手相机，为海外B2B买家精心准备。",
  viewProducts: "查看产品",
  loginBtn: "登录",
  feature1Title: "日本货源库存",
  feature1Desc: "精选日本市场二手相机，为海外批发买家准备。",
  feature2Title: "整理好的产品照片",
  feature2Desc: "每件商品配有清晰一致的照片，便于采购决策。",
  feature3Title: "按国家定价",
  feature3Desc: "登录后可查看针对您所在地区的价格。",
  buyerLogin: "买家登录",
  loginSubtitle: "访问批发相机库存和按国家定价。",
  loginIdLabel: "登录ID",
  passwordLabel: "密码",
  loginFailed: "登录失败，请检查您的凭据。",
  networkError: "网络错误，请重试。",
  signingIn: "登录中…",
  signIn: "登录",
  backToHome: "返回首页",
  productsTitle: "相机库存",
  productsSubtitle: "浏览日本二手相机及买家专属价格。",
  loadingInventory: "正在加载库存…",
  pleaseSignIn: "请登录后查看目录。",
  buyerAccount: "买家账户",
  itemsCount: "{count} 件",
  pageOf: "第 {page} 页，共 {total} 页",
  searchPlaceholder: "按ID或产品名称搜索",
  searchButton: "搜索",
  soldItemsLabel: "已售商品",
  includeSoldOut: "包含已售",
  excludeSoldOut: "排除已售",
  onlySoldOut: "仅已售",
  sortByLabel: "排序",
  noMatchingProducts: "没有匹配的产品",
  noMatchingHint: "请尝试调整搜索或筛选条件。",
  noImage: "无图片",
  soldOut: "已售出",
  viewDetails: "查看详情 →",
  previous: "上一页",
  next: "下一页",
  backToProducts: "← 返回产品列表",
  productNotFound: "未找到产品",
  productNotFoundHint: "该产品可能已下架或不存在。",
  viewProductPhoto: "查看产品详情",
};

const zhTW: Messages = {
  ...zhCN,
  siteTagline: "日本檢驗相機",
  navProducts: "產品",
  navLogin: "登入",
  languageLabel: "語言",
  homeTitle: "面向全球批發買家的日本二手相機",
  homeSubtitle: "來自日本的精選二手相機，為海外B2B買家精心準備。",
  viewProducts: "查看產品",
  loginBtn: "登入",
  feature1Title: "日本貨源庫存",
  feature2Title: "整理好的產品照片",
  feature3Title: "按國家定價",
  buyerLogin: "買家登入",
  loginIdLabel: "登入ID",
  passwordLabel: "密碼",
  loginFailed: "登入失敗，請檢查您的憑證。",
  networkError: "網路錯誤，請重試。",
  signingIn: "登入中…",
  signIn: "登入",
  backToHome: "返回首頁",
  productsTitle: "相機庫存",
  productsSubtitle: "瀏覽日本二手相機及買家專屬價格。",
  pleaseSignIn: "請登入後查看目錄。",
  itemsCount: "{count} 件",
  pageOf: "第 {page} 頁，共 {total} 頁",
  searchPlaceholder: "按ID或產品名稱搜尋",
  soldOut: "已售出",
  previous: "上一頁",
  next: "下一頁",
  backToProducts: "← 返回產品列表",
  productNotFound: "找不到產品",
};

const th: Messages = {
  ...en,
  navProducts: "สินค้า",
  navLogin: "เข้าสู่ระบบ",
  languageLabel: "ภาษา",
  homeTitle: "กล้องมือสองจากญี่ปุ่นสำหรับผู้ซื้อขายส่งทั่วโลก",
  homeSubtitle: "กล้องมือสองจากญี่ปุ่นที่คัดสรรและจัดระเบียบสำหรับผู้ซื้อ B2B ต่างประเทศ",
  viewProducts: "ดูสินค้า",
  loginBtn: "เข้าสู่ระบบ",
  buyerLogin: "เข้าสู่ระบบผู้ซื้อ",
  loginIdLabel: "รหัสเข้าสู่ระบบ",
  passwordLabel: "รหัสผ่าน",
  loginFailed: "เข้าสู่ระบบไม่สำเร็จ กรุณาตรวจสอบข้อมูล",
  networkError: "เกิดข้อผิดพลาดเครือข่าย กรุณาลองอีกครั้ง",
  signingIn: "กำลังเข้าสู่ระบบ…",
  signIn: "เข้าสู่ระบบ",
  productsTitle: "รายการกล้อง",
  productsSubtitle: "เรียกดูกล้องมือสองจากญี่ปุ่นพร้อมราคาสำหรับผู้ซื้อ",
  loadingInventory: "กำลังโหลดสินค้า…",
  pleaseSignIn: "กรุณาเข้าสู่ระบบเพื่อดูแคตตาล็อก",
  soldOut: "ขายแล้ว",
  viewDetails: "ดูรายละเอียด →",
  previous: "ก่อนหน้า",
  next: "ถัดไป",
  backToProducts: "← กลับไปรายการสินค้า",
  noMatchingProducts: "ไม่พบสินค้าที่ตรงกัน",
  viewProductPhoto: "ดูรายละเอียดสินค้า",
};

const es: Messages = {
  ...en,
  navProducts: "Productos",
  navLogin: "Iniciar sesión",
  languageLabel: "Idioma",
  homeTitle: "Cámaras usadas japonesas para compradores mayoristas globales",
  homeSubtitle:
    "Cámaras usadas de Japón, cuidadosamente seleccionadas y organizadas para compradores B2B internacionales.",
  viewProducts: "Ver productos",
  loginBtn: "Iniciar sesión",
  buyerLogin: "Acceso de comprador",
  loginIdLabel: "ID de acceso",
  passwordLabel: "Contraseña",
  loginFailed: "Error de inicio de sesión. Verifique sus credenciales.",
  networkError: "Error de red. Inténtelo de nuevo.",
  signingIn: "Iniciando sesión…",
  signIn: "Iniciar sesión",
  productsTitle: "Inventario de cámaras",
  productsSubtitle: "Explore cámaras usadas japonesas con precios por comprador.",
  loadingInventory: "Cargando inventario…",
  pleaseSignIn: "Inicie sesión para ver el catálogo.",
  soldOut: "Vendido",
  viewDetails: "Ver detalles →",
  previous: "Anterior",
  next: "Siguiente",
  backToProducts: "← Volver a productos",
  noMatchingProducts: "No hay productos coincidentes",
  viewProductPhoto: "Ver detalles del producto",
};

const ko: Messages = {
  ...en,
  navProducts: "제품",
  navLogin: "로그인",
  languageLabel: "언어",
  homeTitle: "글로벌 도매 구매자를 위한 일본 중고 카메라",
  homeSubtitle: "일본에서 엄선·정리된 중고 카메라를 해외 B2B 구매자에게 제공합니다.",
  viewProducts: "제품 보기",
  loginBtn: "로그인",
  buyerLogin: "구매자 로그인",
  loginIdLabel: "로그인 ID",
  passwordLabel: "비밀번호",
  loginFailed: "로그인에 실패했습니다. 자격 증명을 확인하세요.",
  networkError: "네트워크 오류입니다. 다시 시도하세요.",
  signingIn: "로그인 중…",
  signIn: "로그인",
  productsTitle: "카메라 재고",
  productsSubtitle: "구매자별 가격으로 일본 중고 카메라를 둘러보세요.",
  loadingInventory: "재고 불러오는 중…",
  pleaseSignIn: "카탈로그를 보려면 로그인하세요.",
  soldOut: "판매 완료",
  viewDetails: "상세 보기 →",
  previous: "이전",
  next: "다음",
  backToProducts: "← 제품 목록으로",
  noMatchingProducts: "일치하는 제품이 없습니다",
  viewProductPhoto: "제품 상세 보기",
};

const ms: Messages = {
  ...en,
  navProducts: "Produk",
  navLogin: "Log masuk",
  languageLabel: "Bahasa",
  homeTitle: "Kamera Terpakai Jepun untuk Pembeli Borong Global",
  homeSubtitle:
    "Kamera terpakai dari Jepun, dipilih dan disusun dengan teliti untuk pembeli B2B luar negara.",
  viewProducts: "Lihat produk",
  loginBtn: "Log masuk",
  buyerLogin: "Log masuk pembeli",
  loginIdLabel: "ID log masuk",
  passwordLabel: "Kata laluan",
  loginFailed: "Log masuk gagal. Sila semak maklumat anda.",
  networkError: "Ralat rangkaian. Sila cuba lagi.",
  signingIn: "Sedang log masuk…",
  signIn: "Log masuk",
  productsTitle: "Inventori Kamera",
  productsSubtitle: "Layari kamera terpakai Jepun dengan harga khusus pembeli.",
  loadingInventory: "Memuatkan inventori…",
  pleaseSignIn: "Sila log masuk untuk melihat katalog.",
  soldOut: "Terjual",
  viewDetails: "Lihat butiran →",
  previous: "Sebelum",
  next: "Seterusnya",
  backToProducts: "← Kembali ke produk",
  noMatchingProducts: "Tiada produk sepadan",
  viewProductPhoto: "Lihat butiran produk",
};

export const messages: Record<Locale, Messages> = {
  en,
  "zh-CN": zhCN,
  "zh-TW": zhTW,
  th,
  ja,
  es,
  ko,
  ms,
};

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

export function formatMessage(template: string, vars?: Record<string, string | number>): string {
  if (!vars) return template;
  return Object.entries(vars).reduce(
    (result, [key, value]) => result.replaceAll(`{${key}}`, String(value)),
    template
  );
}

export function translate(locale: Locale, key: MessageKey, vars?: Record<string, string | number>): string {
  const table = messages[locale] ?? messages.en;
  const fallback = messages.en[key];
  const template = table[key] ?? fallback;
  return formatMessage(template, vars);
}
