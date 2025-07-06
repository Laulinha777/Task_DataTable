const express = require('express');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use(cors());

let alunos = [];

try {
  const data = fs.readFileSync('download.json', 'utf8');
  alunos = JSON.parse(data);
} catch (err) {
  console.error('Erro ao ler arquivo download.json:', err);
}

app.get('/api/alunos', (req, res) => {
  const dadosBasicos = alunos.map(a => ({
    id: a.id,
    nome: a.nome,
    email: a.email,
    curso: a.curso,
    ano_graduacao: a.ano_graduacao,
    cpf: a.cpf,
    telefone: a.telefone,
    cidade: a.cidade,
    pais: a.pais,
    etnia: a.etnia,
  }));
  res.json(dadosBasicos);
});

// Endpoint para retornar os detalhes completos de um aluno por id
app.get('/api/aluno', (req, res) => {
  const id = Number(req.query.id);
  const aluno = alunos.find(a => a.id === id);
  if (aluno) {
    res.json(aluno);
  } else {
    res.status(404).json({ error: 'Aluno não encontrado' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
