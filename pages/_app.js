import "../styles/globals.css";
import AiAssistant from '../components/AiAssistant';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Component {...pageProps} />
      <AiAssistant />
    </>
  );
}

export default MyApp;
