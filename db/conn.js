require('dotenv').config()
// const usuariodb = process.env.DB_USER
// const senhadb = process.env.DB_PASS
// const nomedb = process.env.DB_NAME
const lugardb = process.env.DB_HOST

const mongoose = require('mongoose')

async function main(){
  await mongoose.connect(lugardb)
  console.log('conectou ao MongoDB')
}

main().catch((erro) => console.log(erro))

module.exports = mongoose