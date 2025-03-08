import Link from "next/link";

export default function Home() {
  return (
    <h1 className='text-center mt-5 text-xl'>
      Do you have an account? <Link href='/login'>Log in!</Link>
    </h1>
  );
}
