import Layout from "@/components/Layout"
import NewProductForm from "@/components/NewProductForm";

export default function NewProduct() {
  return (
    <Layout>
      <h1 className="text-blue-900 mb-2 text-xl">New Product</h1>
      <NewProductForm />
    </Layout>
  )
}
