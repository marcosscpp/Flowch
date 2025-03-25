import { exec } from "child_process";

const file = process.argv[2];

if (!file) {
  console.error("Uso: yarn sass <nome-do-arquivo-sem-extensão>");
  process.exit(1);
}

const input = `./styles/sass/${file}.scss`;
const output = `./styles/${file}.css`;
const command = `sass --watch ${input}:${output} --style compressed`;

console.log(`Rodando: ${command}`);

exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error(`Erro: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`SASS Erro: ${stderr}`);
    return;
  }
  console.log(stdout);
});
