import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const PORT = 3000;
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

function obterAlunos(){

    const dados = fs.readFileSync(path.join(__dirname, 'alunos.json'));
    const alunos = JSON.parse(dados)

    alunos.forEach(aluno => {

        aluno.media = ((aluno.nota1 + aluno.nota2 + aluno.trabalho) / 3).toFixed(1);

        const mediaFloat = parseFloat(aluno.media);

        if(mediaFloat >= 7){
            aluno.status = 'aprovado'

        }else if(mediaFloat >= 5){
            aluno.status = 'recuperacao'

        }else{
            aluno.status = 'reprovado'

        }
    });

    return alunos;
};

app.get('/', (req, res)=>{

    const alunos = obterAlunos();

    //ESTATISTICA
    const total = alunos.length;
    const aprovados = alunos.filter(a => a.status === 'aprovado').length;
    const recuperacao = alunos.filter(a => a.status === 'recuperacao').length;
    const reprovados = total - (aprovados + recuperacao);

    //RANKING
    const ranking = [...alunos].sort((a, b) => b.media - a.media).slice(0,3);

    //ALUNO DESTAQUE ALEATORIO
    const numeroSorteado = Math.floor(Math.random() * alunos.length);
    const destaque = alunos[numeroSorteado].nome;

    res.render('index', {alunos, total, aprovados, recuperacao, reprovados, ranking, destaque});
});

//ROTA DO SOBRE
app.get('/sobre', (req, res)=>{
    res.render('sobre');
})

app.listen(PORT,()=>{
    console.log(`Servidor rodando em http://localhost:${PORT}`);
})