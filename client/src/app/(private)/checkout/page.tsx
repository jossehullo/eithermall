'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { API_BASE_URL } from '@/lib/api';

/* ---------------------------------------------------
   47 COUNTIES + SUBCOUNTIES (RESTORED)
--------------------------------------------------- */
const countyData: Record<string, string[]> = {
  Mombasa: ['Mvita', 'Nyali', 'Kisauni', 'Likoni', 'Changamwe', 'Jomvu'],
  Kwale: ['Msambweni', 'Lunga Lunga', 'Kinango', 'Samburu'],
  Kilifi: ['Kilifi North', 'Kilifi South', 'Malindi', 'Magarini', 'Kaloleni'],
  TanaRiver: ['Garsen', 'Bura', 'Galole'],
  Lamu: ['Lamu East', 'Lamu West'],
  TaitaTaveta: ['Voi', 'Wundanyi', 'Mwatate', 'Taveta'],
  Garissa: ['Garissa Township', 'Lagdera', 'Balambala', 'Ijara'],
  Wajir: ['Wajir East', 'Wajir West', 'Eldas', 'Buna'],
  Mandera: ['Mandera East', 'Mandera West', 'Banisa', 'Lafey'],
  Marsabit: ['Saku', 'Laisamis', 'Moyale', 'North Horr'],
  Isiolo: ['Isiolo', 'Merti', 'Garbatulla'],
  Meru: ['Imenti North', 'Imenti South', 'Tigania East', 'Tigania West', 'Buuri'],
  TharakaNithi: ['Chuka', 'Maara', 'Tharaka'],
  Embu: ['Manyatta', 'Runyenjes', 'Mbeere South'],
  Kitui: ['Kitui Central', 'Kitui West', 'Kitui East', 'Mwingi North', 'Mwingi West'],
  Machakos: ['Machakos Town', 'Athi River', 'Kangundo', 'Mwala', 'Yatta'],
  Makueni: ['Makueni', 'Kibwezi East', 'Kibwezi West', 'Mbooni'],
  Nyandarua: ['Ol Kalou', 'Kinangop', 'Ndaragwa'],
  Nyeri: ['Nyeri Town', 'Othaya', 'Tetu', 'Mathira'],
  Kirinyaga: ['Kirinyaga Central', 'Mwea East', 'Mwea West'],
  Muranga: ['Kigumo', 'Kandara', 'Kangema', 'Murang’a South'],
  Kiambu: ['Ruiru', 'Thika', 'Limuru', 'Githunguri', 'Kiambu Town'],
  Turkana: ['Turkana Central', 'Loima', 'Turkana South'],
  WestPokot: ['Kapenguria', 'Pokot South', 'West Pokot'],
  Samburu: ['Samburu West', 'Samburu North', 'Samburu East'],
  TransNzoia: ['Kitale East', 'Kitale West', 'Kiminini', 'Endebess'],
  UasinGishu: ['Ainabkoi', 'Turbo', 'Moiben', 'Kapseret'],
  ElgeyoMarakwet: ['Keiyo North', 'Keiyo South', 'Marakwet East'],
  Nandi: ['Nandi Hills', 'Aldai', 'Mosop'],
  Baringo: ['Baringo Central', 'Baringo North', 'Mogotio'],
  Laikipia: ['Laikipia East', 'Laikipia West', 'Laikipia North'],
  Nakuru: ['Nakuru Town East', 'Nakuru Town West', 'Naivasha', 'Gilgil', 'Bahati'],
  Narok: ['Narok North', 'Narok South', 'Transmara East', 'Transmara West'],
  Kajiado: ['Kajiado North', 'Kajiado West', 'Kajiado Central'],
  Kericho: ['Ainamoi', 'Belgut', 'Kipkelion'],
  Bomet: ['Bomet Central', 'Konoin', 'Chepalungu'],
  Kakamega: ['Lurambi', 'Mumias East', 'Malava', 'Lugari'],
  Vihiga: ['Vihiga', 'Sabatia', 'Luanda'],
  Bungoma: ['Kanduyi', 'Tongaren', 'Kimilili'],
  Busia: ['Teso North', 'Nambale', 'Butula'],
  Siaya: ['Ugenya', 'Gem', 'Alego Usonga', 'Bondo'],
  Kisumu: ['Kisumu Central', 'Kisumu East', 'Kisumu West', 'Nyando'],
  HomaBay: ['Homa Bay Town', 'Rachuonyo East', 'Suba South'],
  Migori: ['Migori', 'Rongo', 'Uriri', 'Kuria East', 'Kuria West'],
  Kisii: ['Kitutu Central', 'Bobasi', 'Nyaribari Chache'],
  Nyamira: ['West Mugirango', 'North Mugirango', 'Borabu'],
  Nairobi: ['Westlands', 'Embakasi', 'Langata', 'Dagoretti', 'Kasarani', 'Roysambu'],
};

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, clearCart } = useCart();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [county, setCounty] = useState('');
  const [subcounty, setSubcounty] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setName(user.username || '');
      setPhone(user.phone || '');
    }
  }, []);

  const subcounties = useMemo(() => (county ? countyData[county] || [] : []), [county]);

  const total = cartItems.reduce((sum, item) => sum + item.unitPrice * item.qty, 0);

  async function handlePlaceOrder() {
    if (!name || !phone || !county || !subcounty || !paymentMethod) {
      toast.error('Please complete all fields.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login');
      router.push('/login');
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_BASE_URL}/api/orders`, {
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
          paymentMethod,
          totalAmount: total,
        }),
      });

      if (!res.ok) throw new Error();

      toast.success('Order placed successfully');
      clearCart();
      router.push('/my-orders');
    } catch {
      toast.error('Failed to place order');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 24, maxWidth: 900, margin: '0 auto' }}>
      <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 24 }}>Checkout</h1>

      {/* DELIVERY DETAILS */}
      <div
        style={{
          background: '#fff',
          padding: 20,
          borderRadius: 12,
          marginBottom: 24,
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        }}
      >
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>
          Delivery Details
        </h2>

        <label>Full Name</label>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          style={{ width: '100%', padding: 10, marginBottom: 12 }}
        />

        <label>Phone Number *</label>
        <input
          value={phone}
          onChange={e => setPhone(e.target.value)}
          style={{ width: '100%', padding: 10, marginBottom: 12 }}
        />

        <label>County</label>
        <select
          value={county}
          onChange={e => {
            setCounty(e.target.value);
            setSubcounty('');
          }}
          style={{ width: '100%', padding: 10, marginBottom: 12 }}
        >
          <option value="">Select County</option>
          {Object.keys(countyData).map(c => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <label>Subcounty</label>
        <select
          value={subcounty}
          onChange={e => setSubcounty(e.target.value)}
          disabled={!county}
          style={{ width: '100%', padding: 10 }}
        >
          <option value="">Select Subcounty</option>
          {subcounties.map(sc => (
            <option key={sc} value={sc}>
              {sc}
            </option>
          ))}
        </select>
      </div>

      {/* PAYMENT */}
      <div
        style={{
          background: '#fff',
          padding: 20,
          borderRadius: 12,
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        }}
      >
        <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>
          Payment Method
        </h2>

        <select
          value={paymentMethod}
          onChange={e => setPaymentMethod(e.target.value)}
          style={{ width: '100%', padding: 10 }}
        >
          <option value="">Select Payment Method</option>
          <option value="equity">Equity Paybill (247247)</option>
          <option value="kcb">KCB Paybill (522533)</option>
        </select>
      </div>

      <button
        onClick={handlePlaceOrder}
        disabled={loading}
        style={{
          marginTop: 28,
          width: '100%',
          padding: 18,
          borderRadius: 12,
          border: 'none',
          background: '#111',
          color: '#fff',
          fontSize: 18,
          fontWeight: 800,
          cursor: 'pointer',
        }}
      >
        {loading ? 'Placing Order...' : 'Place Order'}
      </button>
    </div>
  );
}
