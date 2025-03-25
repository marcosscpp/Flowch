const fs = require("fs");
const path = require("path");
const { optimize } = require("svgo");

const inputDir = path.join(__dirname, "dist/assets");
const outputDir = path.join(__dirname, "dist/assets");

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.readdirSync(inputDir).forEach((file) => {
  if (path.extname(file) === ".svg") {
    const inputFile = path.join(inputDir, file);
    const outputFile = path.join(outputDir, file);

    const svgData = fs.readFileSync(inputFile, "utf-8");
    const optimizedSvg = optimize(svgData, { path: inputFile });

    fs.writeFileSync(outputFile, optimizedSvg.data);
    console.log(`SVG otimizado: ${file}`);
  }
});
