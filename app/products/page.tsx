import Layout from "@/components/Layout";
import Link from "next/link";

export default function Products() {
  return (
    <Layout>
      <Link className="btn-primary bg-blue-900 text-white" href={'/products/new'}>Add new product</Link>
    </Layout>
  );
}