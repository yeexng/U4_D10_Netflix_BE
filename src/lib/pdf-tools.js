import PdfPrinter from "pdfmake";
import imageToBase64 from "image-to-base64";

export const mediaToPDFReadableStream = async (media) => {
  const fonts = {
    Helvetica: {
      normal: "Helvetica",
      bold: "Helvetica-Bold",
      italics: "Helvetica-Oblique",
      bolditalics: "Helvetica-BoldOblique",
    },
  };
  const printer = new PdfPrinter(fonts);

  const encodedImage = await imageToBase64(media.poster);

  const docDefinition = {
    content: [
      {
        image: `data:image/jpeg;base64,${encodedImage}`,
        width: 150,
      },
      media.title,
      media.year,
      media.type,
    ],
    defaultStyle: {
      font: "Helvetica",
    },
  };
  const pdfReadableStream = printer.createPdfKitDocument(docDefinition, {});
  pdfReadableStream.end();

  return pdfReadableStream;
};
