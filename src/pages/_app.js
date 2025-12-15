import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  :root {
      --primary-color: #B0E0E6; /* Màu xanh dương nhạt (Powder Blue) */
      --dark-blue: #007bff;
      --background-color: #f4f7f6;
      --shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 20px;
    background-color: var(--background-color);
    color: #333;
    text-align: center;
  }
`;

function MyApp({ Component, pageProps }) {
  return (
    <>
      <GlobalStyle />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
