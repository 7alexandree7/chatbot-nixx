const { Client, MessageMedia, LocalAuth } = require("whatsapp-web.js");
const qrcode = require('qrcode-terminal');
const path = require('path');


    const client = new Client({
        authStrategy: new LocalAuth()
    });


client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
});



client.on('ready', () => {
    console.log('Client is ready!');
    console.log('Pronto...')
});



client.on('message', msg => {

    const imagePath  = path.join(__dirname, './ninasuporte.png');
    const media = MessageMedia.fromFilePath(imagePath);
    client.sendMessage(msg.from, media, { sendMediaAsDocument: false });

    console.log(msg.body);
    msg.reply(`👋 Olá! Bem-vindo ao Suporte Nix, eu sou a Nina. Como posso ajudar você hoje?

🤔 Por favor, escolha uma das opções abaixo para que eu possa direcionar sua solicitação:

1. Problemas técnicos ou erros no aplicativo
2. Dúvidas sobre funcionalidades e uso do aplicativo
3. Questões relacionadas a pagamentos e assinaturas
4. Outro assunto

Por favor, responda com o número correspondente à sua consulta. Se preferir, digite "Outro" para falar sobre um assunto não listado.

💬 Estou aqui para ajudar!`);
});


client.initialize();
