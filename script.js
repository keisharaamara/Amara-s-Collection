// Amara's Collection — Simple Storefront with Cart
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Products data
const products = [
  // Casing
  {id:'c1', name:'Casing Aesthetic Daisy', price:45000, category:'casing', img:'phone'},
  {id:'c2', name:'Casing Aesthetic Hearts', price:49000, category:'casing', img:'phone'},
  {id:'c3', name:'Casing Glitter Pink', price:52000, category:'casing', img:'phone'},
  // Scrapbook
  {id:'s1', name:'Scrapbook Mini Yellow', price:38000, category:'scrapbook', img:'book'},
  {id:'s2', name:'Scrapbook Pastel', price:42000, category:'scrapbook', img:'book'},
  // Kalung
  {id:'k1', name:'Kalung Butterfly', price:55000, category:'kalung', img:'necklace'},
  {id:'k2', name:'Kalung Heart Lock', price:59000, category:'kalung', img:'necklace'},
  // Gelang
  {id:'g1', name:'Gelang Charm Pink', price:35000, category:'gelang', img:'bracelet'},
  {id:'g2', name:'Gelang Manik Pastel', price:33000, category:'gelang', img:'bracelet'},
  // Diary
  {id:'d1', name:'Diary Book Kuning', price:48000, category:'diary', img:'notebook'},
  {id:'d2', name:'Diary Book Floral', price:52000, category:'diary', img:'notebook'},
  // Lainnya
  {id:'l1', name:'Sticker Set Aesthetic', price:15000, category:'lainnya', img:'sticker'},
  {id:'l2', name:'Keychain Acryl Gemes', price:25000, category:'lainnya', img:'keychain'}
];

// SVG generator (simple icons)
function icon(type){
  const base = {
    phone: '<rect x="15" y="8" rx="10" width="70" height="110" fill="#fff"/><rect x="25" y="20" rx="8" width="50" height="80" fill="#FFDEE2"/><circle cx="50" cy="105" r="5" fill="#FFD166"/>',
    book: '<rect x="12" y="20" rx="8" width="76" height="80" fill="#fff"/><rect x="12" y="20" rx="8" width="36" height="80" fill="#FFE08A"/><line x1="48" y1="20" x2="48" y2="100" stroke="#ffd6e1" stroke-width="2"/>',
    necklace: '<circle cx="50" cy="50" r="28" fill="none" stroke="#FF9AA2" stroke-width="6"/><circle cx="50" cy="80" r="8" fill="#FFD166"/>',
    bracelet: '<circle cx="50" cy="60" r="24" fill="none" stroke="#FF9AA2" stroke-width="8"/><circle cx="50" cy="60" r="6" fill="#FFE08A"/>',
    notebook: '<rect x="18" y="18" rx="8" width="64" height="84" fill="#fff"/><rect x="18" y="18" rx="8" width="24" height="84" fill="#FFDEE2"/><rect x="42" y="30" width="30" height="8" rx="4" fill="#FFE08A"/><rect x="42" y="46" width="30" height="8" rx="4" fill="#FFE08A"/>',
    sticker: '<rect x="22" y="22" rx="10" width="56" height="56" fill="#FFE08A"/><circle cx="70" cy="70" r="18" fill="#FFB3C1"/>',
    keychain: '<circle cx="50" cy="30" r="10" fill="none" stroke="#FF9AA2" stroke-width="4"/><rect x="40" y="40" width="20" height="30" rx="6" fill="#FFE08A"/>'
  };
  return `<svg viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${base[type]||''}</svg>`;
}

// DOM elements
const grid = document.getElementById('productGrid');
const chips = document.querySelectorAll('.chip');
const searchInput = document.getElementById('searchInput');
const sortSelect = document.getElementById('sortSelect');

function formatIDR(n){ return new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',maximumFractionDigits:0}).format(n) }

let state = {
  filter:'semua',
  search:'',
  sort:'terbaru'
};

function renderProducts(){
  const q = state.search.toLowerCase();
  let data = products
    .filter(p => state.filter==='semua' ? true : p.category===state.filter)
    .filter(p => p.name.toLowerCase().includes(q));

  switch(state.sort){
    case 'termurah': data = data.sort((a,b)=>a.price-b.price); break;
    case 'termahal': data = data.sort((a,b)=>b.price-a.price); break;
    case 'a-z': data = data.sort((a,b)=>a.name.localeCompare(b.name)); break;
    default: data = data.slice().reverse(); // terbaru
  }

  grid.innerHTML = data.map(p => `
    <article class="card" data-id="${p.id}">
      <div class="card-media">${icon(p.img)}</div>
      <div class="card-body">
        <div class="card-title">${p.name}</div>
        <div class="card-price">${formatIDR(p.price)}</div>
        <div class="card-actions">
          <div class="qty" data-id="${p.id}">
            <button class="dec" aria-label="Kurangi">-</button>
            <span class="val">1</span>
            <button class="inc" aria-label="Tambah">+</button>
          </div>
          <button class="btn btn-primary add" data-id="${p.id}">Tambah ke Keranjang</button>
        </div>
      </div>
    </article>
  `).join('');

  // attach qty events
  grid.querySelectorAll('.qty').forEach(qty => {
    const span = qty.querySelector('.val');
    qty.querySelector('.inc').addEventListener('click',()=>{
      span.textContent = String(parseInt(span.textContent)+1);
    });
    qty.querySelector('.dec').addEventListener('click',()=>{
      const v = Math.max(1, parseInt(span.textContent)-1);
      span.textContent = String(v);
    });
  });

  grid.querySelectorAll('.add').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const id = btn.dataset.id;
      const qty = parseInt(btn.closest('.card').querySelector('.qty .val').textContent);
      addToCart(id, qty);
      openCart();
    });
  });
}

// Filter chips
chips.forEach(chip => chip.addEventListener('click', () => {
  chips.forEach(c=>c.classList.remove('is-active'));
  chip.classList.add('is-active');
  state.filter = chip.dataset.filter;
  renderProducts();
}));

searchInput.addEventListener('input', e => { state.search = e.target.value; renderProducts(); });
sortSelect.addEventListener('change', e => { state.sort = e.target.value; renderProducts(); });

// ---- Cart logic ----
const openCartBtn = document.getElementById('openCart');
const closeCartBtn = document.getElementById('closeCart');
const cartDrawer = document.getElementById('cartDrawer');
const backdrop = document.getElementById('backdrop');
const cartItemsEl = document.getElementById('cartItems');
const cartCountEl = document.getElementById('cartCount');
const cartSubtotalEl = document.getElementById('cartSubtotal');
const checkoutBtn = document.getElementById('checkoutBtn');
const checkoutTop = document.getElementById('checkoutTop');

const STORAGE_KEY = 'amaras_cart_v1';

function getCart(){
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
  catch(e){ return []; }
}

function saveCart(items){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  renderCart();
}

function addToCart(id, qty=1){
  const items = getCart();
  const idx = items.findIndex(it=>it.id===id);
  if (idx>-1){ items[idx].qty += qty; } else { items.push({id, qty}); }
  saveCart(items);
}

function removeFromCart(id){
  const items = getCart().filter(it=>it.id!==id);
  saveCart(items);
}

function updateQty(id, qty){
  const items = getCart().map(it=> it.id===id ? {...it, qty: Math.max(1, qty)} : it);
  saveCart(items);
}

function renderCart(){
  const items = getCart();
  let subtotal = 0;
  cartItemsEl.innerHTML = items.map(it => {
    const p = products.find(x=>x.id===it.id);
    const line = p.price * it.qty;
    subtotal += line;
    return `
      <div class="cart-item">
        <div class="thumb">${icon(p.img)}</div>
        <div>
          <div class="title">${p.name}</div>
          <div class="muted">${formatIDR(p.price)} × 
            <input type="number" min="1" value="${it.qty}" data-id="${it.id}" class="qty-input" style="width:64px;border:1px solid #ffd6e1;border-radius:8px;padding:.2rem .3rem;margin-left:.3rem"/>
          </div>
        </div>
        <div style="display:flex;flex-direction:column;align-items:end;gap:.3rem">
          <strong>${formatIDR(line)}</strong>
          <button class="remove" data-id="${it.id}">Hapus</button>
        </div>
      </div>
    `;
  }).join(items.length? '' : '<p>Keranjang masih kosong. Ayo belanja dulu 💖</p>');

  cartCountEl.textContent = items.reduce((a,b)=>a+b.qty,0);
  cartSubtotalEl.textContent = formatIDR(subtotal);

  // Attach cart events
  cartItemsEl.querySelectorAll('.remove').forEach(btn=>btn.addEventListener('click',()=>removeFromCart(btn.dataset.id)));
  cartItemsEl.querySelectorAll('.qty-input').forEach(inp=>inp.addEventListener('change',()=>{
    const id = inp.dataset.id;
    const val = parseInt(inp.value) || 1;
    updateQty(id, val);
  }));
}

function openCart(){
  cartDrawer.classList.add('is-open');
  backdrop.classList.add('is-show');
  cartDrawer.setAttribute('aria-hidden','false');
}
function closeCart(){
  cartDrawer.classList.remove('is-open');
  backdrop.classList.remove('is-show');
  cartDrawer.setAttribute('aria-hidden','true');
}
openCartBtn.addEventListener('click', openCart);
closeCartBtn.addEventListener('click', closeCart);
backdrop.addEventListener('click', closeCart);

// Checkout
const checkoutModal = document.getElementById('checkoutModal');
const buyerName = document.getElementById('buyerName');
const buyerPhone = document.getElementById('buyerPhone');
const buyerAddress = document.getElementById('buyerAddress');
const checkoutSummary = document.getElementById('checkoutSummary');
const checkoutTotal = document.getElementById('checkoutTotal');
const submitOrder = document.getElementById('submitOrder');

function openCheckout(){
  const items = getCart();
  if (!items.length){ alert('Keranjang masih kosong. Tambah produk dulu ya!'); return; }
  // fill summary
  checkoutSummary.innerHTML = items.map(it=>{
    const p = products.find(x=>x.id===it.id);
    return `<li>${p.name} — ${it.qty} x ${formatIDR(p.price)}</li>`;
  }).join('');
  const total = items.reduce((sum,it)=>{
    const p = products.find(x=>x.id===it.id);
    return sum + (p.price*it.qty);
  },0);
  checkoutTotal.textContent = formatIDR(total);
  if (typeof checkoutModal.showModal === 'function') {
    checkoutModal.showModal();
  } else {
    // fallback for browsers w/o dialog
    alert('Ringkasan Order:\n' + checkoutSummary.textContent + '\nTotal: ' + checkoutTotal.textContent);
  }
}

document.getElementById('checkoutBtn').addEventListener('click', openCheckout);
document.getElementById('checkoutTop').addEventListener('click', openCheckout);

// fake submit
submitOrder.addEventListener('click', (e)=>{
  e.preventDefault();
  const name = buyerName.value.trim();
  const phone = buyerPhone.value.trim();
  const address = buyerAddress.value.trim();
  if (!name || !phone || !address){ alert('Mohon lengkapi data.'); return; }

  const order = {
    name, phone, address,
    time: new Date().toLocaleString('id-ID'),
    items: getCart().map(it=> ({...it, ...products.find(p=>p.id===it.id)})),
  };
  // Create a text invoice
  const lines = [
    'Amara\'s Collection — Bukti Pemesanan',
    '===================================',
    `Tanggal: ${order.time}`,
    `Nama   : ${order.name}`,
    `Telp   : ${order.phone}`,
    `Alamat : ${order.address}`,
    '',
    'Item:',
    ...order.items.map(x=>`- ${x.name} x ${x.qty} = ${formatIDR(x.price*x.qty)}`),
    '',
    `Total: ${formatIDR(order.items.reduce((a,b)=>a+b.price*b.qty,0))}`,
    '',
    'Terima kasih sudah berbelanja! 💖'
  ].join('\n');

  const blob = new Blob([lines], {type:'text/plain'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'pesanan-amaras.txt';
  document.body.appendChild(a);
  a.click();
  a.remove();

  // clear cart
  localStorage.removeItem(STORAGE_KEY);
  renderCart();
  checkoutModal.close();
  alert('Pesanan dibuat! File ringkasan telah diunduh.');
});

// Init
renderProducts();
renderCart();
