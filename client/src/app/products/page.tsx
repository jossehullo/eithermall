import ProductsClient from './ProductsClient';

export default function Page({ searchParams }: any) {
  const page = Number(searchParams?.page) || 1;

  return <ProductsClient page={page} />;
}
