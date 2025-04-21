import Head from "next/head";
import "../styles/globals.css"; // Ensure Tailwind or custom styles are imported

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
        <meta name="theme-color" content="#ffffff" />
        <title>CalcApp</title>
      </Head>
      <Component {...pageProps} />
    </>
  );
}
