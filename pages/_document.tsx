import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
} from "next/document";

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    // locale is in ctx.locale

    return { ...initialProps, locale: ctx?.locale };
  }

  render = () => (
    <Html
      dir={this.props.locale === "en" ? "ltr" : "rtl"}
      lang={this.props.locale}
    >
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

export default MyDocument;

// export default function Document() {

//   return (
//     <Html>
//       <Head />
//       <body
//       className='ar'
//       >
//         <Main />
//         <NextScript />
//       </body>
//     </Html>
//   )
// }
