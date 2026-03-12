import ProductsClient from './ProductsClient';

export default async function Page({ searchParams }: any) {
  const params = await searchParams;
  const page = Number(params?.page) || 1;

  return <ProductsClient page={page} />;
}
