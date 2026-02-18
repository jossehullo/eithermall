'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { API_BASE_URL } from '@/lib/api';

/* =====================================================
   ALL 47 KENYAN COUNTIES + SAMPLE SUBCOUNTIES
===================================================== */

const countyData: Record<string, string[]> = {
  Mombasa: ['Mvita', 'Nyali', 'Kisauni', 'Likoni', 'Changamwe', 'Jomvu'],
  Kwale: ['Msambweni', 'Lunga Lunga', 'Kinango', 'Samburu'],
  Kilifi: ['Kilifi North', 'Kilifi South', 'Malindi', 'Magarini'],
  TanaRiver: ['Garsen', 'Bura', 'Galole'],
  Lamu: ['Lamu East', 'Lamu West'],
  TaitaTaveta: ['Voi', 'Wundanyi', 'Mwatate', 'Taveta'],
  Garissa: ['Garissa Township', 'Lagdera', 'Balambala'],
  Wajir: ['Wajir East', 'Wajir West', 'Eldas', 'Buna'],
  Mandera: ['Mandera East', 'Mandera West', 'Banisa'],
  Marsabit: ['Saku', 'Laisamis', 'Moyale'],
  Isiolo: ['Isiolo', 'Merti', 'Garbatulla'],
  Meru: ['Imenti North', 'Imenti South', 'Tigania East'],
  TharakaNithi: ['Chuka', 'Maara', 'Tharaka'],
  Embu: ['Manyatta', 'Runyenjes', 'Mbeere South'],
  Kitui: ['Kitui Central', 'Kitui West', 'Kitui East'],
  Machakos: ['Machakos Town', 'Athi River', 'Kangundo'],
  Makueni: ['Makueni', 'Kibwezi East', 'Mbooni'],
  Nyandarua: ['Ol Kalou', 'Kinangop', 'Ndaragwa'],
  Nyeri: ['Nyeri Town', 'Othaya', 'Mathira'],
  Kirinyaga: ['Kirinyaga Central', 'Mwea East'],
  Muranga: ['Kigumo', 'Kandara', 'Kangema'],
  Kiambu: ['Ruiru', 'Thika', 'Kiambu Town'],
  Turkana: ['Turkana Central', 'Loima'],
  WestPokot: ['Kapenguria', 'Pokot South'],
  Samburu: ['Samburu West', 'Samburu East'],
  TransNzoia: ['Kitale East', 'Kiminini'],
  UasinGishu: ['Ainabkoi', 'Turbo', 'Kapseret'],
  ElgeyoMarakwet: ['Keiyo North', 'Keiyo South'],
  Nandi: ['Nandi Hills', 'Aldai'],
  Baringo: ['Baringo Central', 'Mogotio'],
  Laikipia: ['Laikipia East', 'Laikipia West'],
  Nakuru: ['Nakuru Town East', 'Naivasha'],
  Narok: ['Narok North', 'Transmara East'],
  Kajiado: ['Kajiado North', 'Kajiado West'],
  Kericho: ['Ainamoi', 'Belgut'],
  Bomet: ['Bomet Central', 'Konoin'],
  Kakamega: ['Lurambi', 'Mumias East'],
  Vihiga: ['Vihiga', 'Sabatia'],
  Bungoma: ['Kanduyi', 'Tongaren'],
  Busia: ['Teso North', 'Nambale'],
  Siaya: ['Ugenya', 'Gem'],
  Kisumu: ['Kisumu Central', 'Kisumu East'],
  HomaBay: ['Homa Bay Town', 'Suba South'],
  Migori: ['Migori', 'Rongo'],
  Kisii: ['Kitutu Central', 'Bobasi'],
  Nyamira: ['West Mugirango', 'Borabu'],
  Nairobi: ['Westlands', 'Embakasi', 'Langata', 'Dagoretti', 'Kasarani'],
};

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, clearCart } = useCart();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [county, setCounty] = useState('');
  const [subcounty, setSubcounty] = useState('');
  const [area, setArea] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [loading, setLoading] = useState(false);

  const total = cartItems.reduce((sum, item) => sum + item.unitPrice * item.qty, 0);

  const subcounties = useMemo(() => (county ? countyData[county] || [] : []), [county]);

  /* ===============================
     AUTO-FILL NAME & PHONE
  =============================== */
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setName(user.username || '');
      setPhone(user.phone || '');
    }
  }, []);

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied!');
  };

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    if (!name || !phone || !county || !subcounty || !paymentMethod) {
      toast.error('Please complete required fields.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Login required');
      router.push('/login');
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: cartItems,
          customerName: name,
          phone,
          county,
          subcounty,
          area,
          paymentMethod,
          totalAmount: total,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || 'Failed to place order');
        return;
      }

      toast.success('Order placed successfully');
      clearCart();
      router.push('/my-orders');
    } catch {
      toast.error('Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>
      <h1 style={{ fontSize: 32, fontWeight: 800 }}>Checkout</h1>

      {/* ORDER SUMMARY */}
      <div style={{ marginTop: 30 }}>
        <h2>Order Summary</h2>
        {cartItems.map(item => (
          <div key={item._id} style={{ marginBottom: 8 }}>
            {item.name} — {item.unitName} x {item.qty} — KSh {item.unitPrice * item.qty}
          </div>
        ))}
        <h3>Total: KSh {total}</h3>
      </div>

      {/* DELIVERY DETAILS */}
      <div style={{ marginTop: 40 }}>
        <h2>Delivery Details</h2>

        <input
          placeholder="Full Name"
          value={name}
          onChange={e => setName(e.target.value)}
          style={{ width: '100%', padding: 10, marginBottom: 10 }}
        />

        <input
          placeholder="Phone Number"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          style={{ width: '100%', padding: 10, marginBottom: 10 }}
        />

        <select
          value={county}
          onChange={e => {
            setCounty(e.target.value);
            setSubcounty('');
          }}
          style={{ width: '100%', padding: 10, marginBottom: 10 }}
        >
          <option value="">Select County</option>
          {Object.keys(countyData).map(c => (
            <option key={c}>{c}</option>
          ))}
        </select>

        <select
          value={subcounty}
          onChange={e => setSubcounty(e.target.value)}
          disabled={!county}
          style={{ width: '100%', padding: 10, marginBottom: 10 }}
        >
          <option value="">Select Subcounty</option>
          {subcounties.map(sc => (
            <option key={sc}>{sc}</option>
          ))}
        </select>

        <input
          placeholder="Area / Estate / Landmark"
          value={area}
          onChange={e => setArea(e.target.value)}
          style={{ width: '100%', padding: 10 }}
        />
      </div>

      {/* PAYMENT */}
      <div style={{ marginTop: 40 }}>
        <h2>Payment Method</h2>

        <select
          value={paymentMethod}
          onChange={e => setPaymentMethod(e.target.value)}
          style={{ width: '100%', padding: 10, marginBottom: 15 }}
        >
          <option value="">Select Payment</option>
          <option value="equity">Equity Bank</option>
          <option value="kcb">KCB Bank</option>
        </select>

        {paymentMethod === 'equity' && (
          <div>
            Paybill: 247247 <button onClick={() => copy('247247')}>Copy</button>
            <br />
            Account: 0768903777 <button onClick={() => copy('0768903777')}>Copy</button>
          </div>
        )}

        {paymentMethod === 'kcb' && (
          <div>
            Paybill: 522533 <button onClick={() => copy('522533')}>Copy</button>
            <br />
            Account: 7552656 <button onClick={() => copy('7552656')}>Copy</button>
          </div>
        )}
      </div>

      <button
        onClick={handlePlaceOrder}
        disabled={loading || cartItems.length === 0}
        style={{
          marginTop: 30,
          width: '100%',
          padding: 16,
          background: cartItems.length === 0 || loading ? '#ccc' : '#000',
          color: '#fff',
          fontWeight: 700,
          borderRadius: 8,
        }}
      >
        {loading ? 'Placing Order...' : 'Place Order'}
      </button>

      {/* CONFIRMATION NOTE */}
      <div style={{ marginTop: 25, padding: 15, background: '#f5e6b3' }}>
        After payment, WhatsApp, SMS or Call us on <b>0768903777</b> to confirm your
        order.
        <br />
        <a href="https://wa.me/254768903777" target="_blank">
          WhatsApp
        </a>{' '}
        | <a href="sms:0768903777">SMS</a> | <a href="tel:0768903777">Call</a>
      </div>
    </div>
  );
}
