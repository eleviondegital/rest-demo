const WHATSAPP_NUMBER = "";

const menuItems = [
  {
    id: "koshari",
    name: "كشري سفرة",
    category: "أكلات مصرية",
    description: "رز وعدس ومكرونة، مع صلصة الدقة والبصل المقرمش.",
    price: 75,
    rating: "٤٫٩",
    badge: "الأكثر طلبًا",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: "molokhia",
    name: "ملوخية بالفراخ",
    category: "أكلات مصرية",
    description: "ملوخية خضرا بتقلية توم، مع فراخ ورز أبيض.",
    price: 145,
    rating: "٤٫٨",
    badge: "طعم البيت",
    image: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: "mahshi",
    name: "محشي مشكّل",
    category: "أكلات مصرية",
    description: "كوسة وورق عنب وفلفل، بحشوة رز متبّلة.",
    price: 130,
    rating: "٤٫٩",
    badge: "على أصوله",
    image: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=700&q=80&sat=-22",
  },
  {
    id: "hawawshi",
    name: "حواوشي بلدي",
    category: "من الفرن",
    description: "عيش بلدي محمّر محشي لحمة متبّلة وفلفل.",
    price: 95,
    rating: "٤٫٧",
    badge: "",
    image: "https://images.unsplash.com/photo-1565299507177-b0ac66763828?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: "chicken",
    name: "فراخ مشوية",
    category: "أطباق رئيسية",
    description: "نص فرخة بتتبيلة البيت، مع رز وسلطة طحينة.",
    price: 180,
    rating: "٤٫٩",
    badge: "وجبة كاملة",
    image: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: "kofta",
    name: "كفتة مشوية",
    category: "أطباق رئيسية",
    description: "كفتة على الفحم، عيش بلدي وسلطة طحينة.",
    price: 195,
    rating: "٤٫٨",
    badge: "",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: "basbousa",
    name: "بسبوسة بالقشطة",
    category: "حلويات",
    description: "بسبوسة طرية بالسمنة البلدي وقشطة طازة.",
    price: 55,
    rating: "٤٫٩",
    badge: "حلوة اللمة",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=700&q=80",
  },
  {
    id: "rice-pudding",
    name: "رز بلبن فرن",
    category: "حلويات",
    description: "رز بلبن كريمي بوش فرن دهبي وقرفة.",
    price: 45,
    rating: "٤٫٨",
    badge: "",
    image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=700&q=80",
  },
];

const categories = ["الكل", ...new Set(menuItems.map((item) => item.category))];
const cart = new Map();
let activeCategory = "الكل";

const menuGrid = document.querySelector("#menu-grid");
const categoryList = document.querySelector("#category-list");
const menuSearch = document.querySelector("#menu-search");
const emptyState = document.querySelector("#empty-state");
const cartBar = document.querySelector("#cart-bar");
const cartCount = document.querySelector("#cart-count");
const cartBarTotal = document.querySelector("#cart-bar-total");
const orderDialog = document.querySelector("#order-dialog");
const orderSummary = document.querySelector("#order-summary");
const orderTotal = document.querySelector("#order-total");
const checkoutForm = document.querySelector("#checkout-form");
const addressField = document.querySelector("#address-field");
const addressInput = document.querySelector("#customer-address");
const whatsappHint = document.querySelector("#whatsapp-hint");

function formatPrice(amount) {
  return `${new Intl.NumberFormat("ar-EG").format(amount)} ج.م`;
}

function renderCategories() {
  categoryList.innerHTML = categories.map((category) => `
    <button class="category-button${category === activeCategory ? " active" : ""}" type="button" data-category="${category}" aria-pressed="${category === activeCategory}">
      ${category}
    </button>
  `).join("");
}

function renderMenu() {
  const query = menuSearch.value.trim().toLocaleLowerCase("ar");
  const filteredItems = menuItems.filter((item) => {
    const matchesCategory = activeCategory === "الكل" || item.category === activeCategory;
    const matchesSearch = `${item.name} ${item.description} ${item.category}`.toLocaleLowerCase("ar").includes(query);
    return matchesCategory && matchesSearch;
  });

  menuGrid.innerHTML = filteredItems.map((item) => `
    <article class="menu-card">
      <div class="menu-card-image">
        <img src="${item.image}" alt="${item.name}" loading="lazy">
        ${item.badge ? `<span class="menu-badge">${item.badge}</span>` : ""}
      </div>
      <div class="menu-card-body">
        <div class="menu-card-top"><h3>${item.name}</h3><span class="menu-rating"><span aria-hidden="true">★</span> ${item.rating}</span></div>
        <p>${item.description}</p>
        <div class="menu-card-bottom">
          <span class="menu-price">${new Intl.NumberFormat("ar-EG").format(item.price)} <small>ج.م</small></span>
          <button class="add-button" type="button" data-add="${item.id}" aria-label="أضف ${item.name} إلى الطلب">+</button>
        </div>
      </div>
    </article>
  `).join("");
  emptyState.hidden = filteredItems.length > 0;
}

function getCartDetails() {
  const items = [...cart.entries()].map(([id, quantity]) => ({
    ...menuItems.find((item) => item.id === id),
    quantity,
  }));
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = subtotal === 0 || subtotal >= 250 ? 0 : 25;
  return { items, subtotal, deliveryFee, total: subtotal + deliveryFee };
}

function renderCart() {
  const { items, subtotal, deliveryFee, total } = getCartDetails();
  const quantity = items.reduce((sum, item) => sum + item.quantity, 0);
  cartBar.hidden = quantity === 0;
  cartCount.textContent = new Intl.NumberFormat("ar-EG").format(quantity);
  cartBarTotal.textContent = formatPrice(total);
  orderSummary.innerHTML = items.map((item) => `
    <div class="summary-row">
      <span>${item.name} × ${new Intl.NumberFormat("ar-EG").format(item.quantity)}</span>
      <strong>${formatPrice(item.price * item.quantity)}</strong>
    </div>
  `).join("") + `
    <div class="summary-row"><span>المجموع الفرعي</span><strong>${formatPrice(subtotal)}</strong></div>
    <div class="summary-row"><span>التوصيل${subtotal >= 250 ? " (مجاني)" : ""}</span><strong>${deliveryFee ? formatPrice(deliveryFee) : "مجانًا"}</strong></div>
  `;
  orderTotal.textContent = formatPrice(total);
}

categoryList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-category]");
  if (!button) return;
  activeCategory = button.dataset.category;
  renderCategories();
  renderMenu();
});

menuSearch.addEventListener("input", renderMenu);

menuGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-add]");
  if (!button) return;
  const id = button.dataset.add;
  cart.set(id, (cart.get(id) || 0) + 1);
  renderCart();
  button.textContent = "✓";
  window.setTimeout(() => {
    if (button.isConnected) button.textContent = "+";
  }, 750);
});

document.querySelector("#open-cart").addEventListener("click", () => {
  renderCart();
  orderDialog.showModal();
});

document.querySelector("#close-dialog").addEventListener("click", () => orderDialog.close());
orderDialog.addEventListener("click", (event) => {
  if (event.target === orderDialog) orderDialog.close();
});

checkoutForm.addEventListener("change", (event) => {
  if (event.target.name !== "fulfillment") return;
  const deliverySelected = event.target.value === "توصيل للعنوان";
  addressField.hidden = !deliverySelected;
  addressInput.required = deliverySelected;
});

checkoutForm.addEventListener("submit", (event) => {
  event.preventDefault();
  whatsappHint.hidden = true;
  whatsappHint.textContent = "";

  if (cart.size === 0) {
    whatsappHint.textContent = "أضف صنفًا واحدًا على الأقل قبل إرسال الطلب.";
    whatsappHint.hidden = false;
    return;
  }

  if (!/^\d{8,15}$/.test(WHATSAPP_NUMBER)) {
    whatsappHint.textContent = "لتفعيل استقبال الطلبات، أضف رقم واتساب المطعم الدولي في متغير WHATSAPP_NUMBER أعلى ملف app.js (من غير + أو مسافات).";
    whatsappHint.hidden = false;
    return;
  }

  const formData = new FormData(checkoutForm);
  const { items, subtotal, deliveryFee, total } = getCartDetails();
  const orderLines = items.map((item) => `• ${item.name} × ${item.quantity} — ${item.price * item.quantity} ج.م`);
  const message = [
    "أهلًا سفرة ولمة! عايز أأكد الطلب ده:",
    "",
    ...orderLines,
    "",
    `المجموع: ${subtotal} ج.م`,
    `التوصيل: ${deliveryFee ? `${deliveryFee} ج.م` : "مجانًا"}`,
    `الإجمالي: ${total} ج.م`,
    "",
    `الاسم: ${formData.get("name")}`,
    `رقم الموبايل: ${formData.get("phone")}`,
    `طريقة الاستلام: ${formData.get("fulfillment")}`,
    ...(formData.get("address") ? [`العنوان: ${formData.get("address")}`] : []),
    ...(formData.get("notes") ? [`ملاحظات: ${formData.get("notes")}`] : []),
  ].join("\n");

  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
});

const footerWhatsApp = document.querySelector("#footer-whatsapp");
if (WHATSAPP_NUMBER) {
  footerWhatsApp.href = `https://wa.me/${WHATSAPP_NUMBER}`;
} else {
  footerWhatsApp.hidden = true;
}
document.querySelector("#current-year").textContent = new Intl.NumberFormat("ar-EG").format(new Date().getFullYear());
renderCategories();
renderMenu();
renderCart();
