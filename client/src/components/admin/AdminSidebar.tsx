'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { name: 'Dashboard', href: '/admin' },
  { name: 'Products', href: '/admin/products' },
  { name: 'Orders', href: '/admin/orders' },
  { name: 'Users', href: '/admin/users' },
];

export default function AdminSidebar() {
  const path = usePathname();

  return (
    <aside className="admin-sidebar">
      <h2 className="logo">Admin</h2>
      <nav>
        {links.map(link => (
          <Link
            key={link.href}
            href={link.href}
            className={path === link.href ? 'active' : ''}
          >
            {link.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
