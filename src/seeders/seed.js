require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const bcrypt = require('bcryptjs');
const { sequelize, Gato, User } = require('../models');

const gatos = [
  {
    nome: 'Mingau',
    sexo: 'M',
    idade: 24,
    status_fiv_felv: false,
    status_adocao: 'Disponível',
    foto_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Cat_November_2010-1a.jpg/320px-Cat_November_2010-1a.jpg',
  },
  {
    nome: 'Mel',
    sexo: 'F',
    idade: 12,
    status_fiv_felv: false,
    status_adocao: 'Disponível',
    foto_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/bb/Kittyply_edit1.jpg/320px-Kittyply_edit1.jpg',
  },
  {
    nome: 'Pipoca',
    sexo: 'F',
    idade: 6,
    status_fiv_felv: true,
    status_adocao: 'Disponível',
    foto_url: null,
  },
  {
    nome: 'Thor',
    sexo: 'M',
    idade: 36,
    status_fiv_felv: false,
    status_adocao: 'Disponível',
    foto_url: null,
  },
  {
    nome: 'Luna',
    sexo: 'F',
    idade: 8,
    status_fiv_felv: false,
    status_adocao: 'Disponível',
    foto_url: null,
  },
];

async function seed() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });

    console.log('Iniciando seed...');

    // Cria gatos (ignora duplicatas pelo nome)
    for (const gatoData of gatos) {
      const [gato, created] = await Gato.findOrCreate({
        where: { nome: gatoData.nome },
        defaults: gatoData,
      });
      console.log(`Gato "${gato.nome}": ${created ? 'criado' : 'já existia'}`);
    }

    // Cria usuário padrão
    const email = 'admin@adocao.com';
    const senhaPlana = 'senha123';
    const senha_hash = await bcrypt.hash(senhaPlana, 10);

    const [user, created] = await User.scope('withPassword').findOrCreate({
      where: { email },
      defaults: { nome: 'Administrador', email, senha_hash },
    });

    console.log(`Usuário "${user.nome}" (${email}): ${created ? 'criado' : 'já existia'}`);
    console.log(`  Senha padrão: ${senhaPlana}`);

    console.log('\nSeed concluído com sucesso!');
    console.log('Use as credenciais abaixo para testar:');
    console.log(`  E-mail: ${email}`);
    console.log(`  Senha:  ${senhaPlana}`);

    process.exit(0);
  } catch (error) {
    console.error('Erro durante o seed:', error);
    process.exit(1);
  }
}

seed();
