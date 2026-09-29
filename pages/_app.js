import '../styles/globals.css';

export default function App({ Component, pageProps }) {
  return (
    <>
      <div className="topbar">
        <div className="topbar-inner">
          <span>Dashboard Cursos</span>
        </div>
      </div>
      <Component {...pageProps} />
    </>
  );
}
