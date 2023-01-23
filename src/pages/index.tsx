import Connect from "@/lib/components/Connect";
import Head from "next/head";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Head>
        <title>Cosmic Chicken</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1>Cosmic Chicken</h1>
        <p>
          Need some FIL to become a storage provider? &nbsp;
          <Link href="/storage-provider">Sign up</Link>
        </p>
        <p>
          Want to lend some FIL and get a chicken? &nbsp;
          <Link href="/storage-provider">Learn more</Link>
        </p>
        <p>
          How are the chickens? &nbsp;
          <Link href="/overview">Check it out</Link>
        </p>
        <Connect />
      </main>
    </>
  );
}
