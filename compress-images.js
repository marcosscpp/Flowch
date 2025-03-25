const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const inputDir = path.join(__dirname, "dist/assets");
const outputDir = path.join(__dirname, "dist/assets");

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const sizes = [480, 768, 1024];

fs.readdirSync(inputDir).forEach((file) => {
  const inputFile = path.join(inputDir, file);
  const ext = path.extname(file);

  // sizes.forEach((size) => {
  //   const outputFile = path.join(outputDir, file.replace(ext, `-${size}.webp`));
  //   sharp(inputFile)
  //     .resize(size)
  //     .webp({ quality: 80 })
  //     .toFile(outputFile)
  //     .then((info) => console.log(`Imagem gerada: ${outputFile}`, info))
  //     .catch((err) =>
  //       console.error(`Erro ao gerar imagem: ${outputFile}`, err)
  //     );
  // });

  const originalOutputFile = path.join(outputDir, file.replace(ext, `.webp`));
  sharp(inputFile)
    .webp({ quality: 80 })
    .toFile(originalOutputFile)
    .then((info) => console.log(`Imagem original gerada: ${originalOutputFile}`, info))
    .catch((err) =>
      console.error(`Erro ao gerar imagem original: ${originalOutputFile}`, err)
    );
});
