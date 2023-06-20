import Layout from '@/components/Layout';
import EditProductForm from "@/components/EditProductForm";


interface pageProps {
  params: { id: string }
}

export default function EditProductPage({params} : pageProps) {
  const { id } = params;
  return (
  <Layout>
    <h1 className="text-blue-900 mb-2 text-xl">Edit Product</h1>
    <EditProductForm />
  </Layout>
  )
}


