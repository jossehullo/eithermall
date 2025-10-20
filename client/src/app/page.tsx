export default async function Home() {
  const res = await fetch('http://localhost:5000/api/products', {
    cache: 'no-store',
  });

  if (!res.ok) {
    return (
      <div style={{ padding: '20px', fontFamily: 'Arial' }}>
        <h1 style={{ color: 'red' }}>Failed to load products</h1>
      </div>
    );
  }

  const products = await res.json();

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1 style={{ color: '#333' }}>Eithermall Products</h1>

      {products.length > 0 ? (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {products.map((product: any) => (
            <li
              key={product._id}
              style={{
                marginBottom: '15px',
                border: '1px solid #ddd',
                padding: '10px',
                borderRadius: '5px',
              }}
            >
              <h2 style={{ margin: 0 }}>{product.name}</h2>
              <p>{product.description}</p>
              <p>Price: ${product.price.toFixed(2)}</p>
              <p>Category: {product.category}</p>
              <p>Stock: {product.stock}</p>
              <p>Image: {product.image}</p>
              <p>Added: {new Date(product.createdAt).toLocaleDateString()}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No products available.</p>
      )}
    </div>
  );
}
