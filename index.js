const { Client, MessageMedia, LocalAuth } = require("whatsapp-web.js");
const qrcode = require('qrcode-terminal');
const path = require('path');


const client = new Client({
    authStrategy: new LocalAuth()
});



let welcomeSent = {}; // Objeto para rastrear se a mensagem de boas-vindas já foi enviada para cada número


client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
});



client.on('ready', () => {
    console.log('Client is ready!');
    console.log('Pronto...');
});



client.on('message', async msg => {

    if (!welcomeSent[msg.from]) {
        welcomeSent[msg.from] = true;
        const imagePath = path.join(__dirname, './ninasuporte.png');
        const media = MessageMedia.fromFilePath(imagePath);

        await client.sendMessage(msg.from, media, { sendMediaAsDocument: false });
        await client.sendMessage(msg.from, `
👋 Olá! Bem-vindo ao Suporte Nix, eu sou a Nina. Como posso te ajudar hoje?

🤔 Por favor, escolha uma das opções abaixo para que eu possa direcionar sua solicitação:

1. Problemas técnicos ou erros no aplicativo
2. Dúvidas sobre funcionalidades e uso do aplicativo
3. Questões relacionadas a pagamentos e assinaturas
4. Tutorial sobre o nosso app
5. Falar diretamente com o suporte Nix 🧡

Por favor, responda com o número correspondente à sua consulta. Se preferir, digite "Outro" para falar sobre um assunto não listado.

💬 Estou aqui para ajudar!
        `);
    }
});

const handleUserResponse = async (msg) => {

    const response = msg.body;
    if (!welcomeSent[msg.from]) {
        return;
    }

    if (!isNaN(response)) {

        switch (response) {
            case '1':
                await client.sendMessage(msg.from, 'Você escolheu a opção 1: Problemas técnicos ou erros no aplicativo.');
                break;

            case '2':
                await client.sendMessage(msg.from, 'Você escolheu a opção 2: Dúvidas sobre funcionalidades e uso do aplicativo.');
                break;

            case '3':
                await client.sendMessage(msg.from, 'Você escolheu a opção 3: Questões relacionadas a pagamentos e assinaturas.');
                break;

            case '4':
                await client.sendMessage(msg.from, 'Você escolheu a opção 4: Tutorial sobre o nosso app.');
                break;

            case '5':
                await client.sendMessage(msg.from, 'Você escolheu a opção 5: Falar diretamente com o suporte Nix.\nVocê pode começar a conversa agora!');
                await client.sendMessage(msg.from, 'Entendemos sua questão e já estamos cuidando dela com toda a atenção. Fique tranquilo, sua solicitação está em boas mãos e será resolvida o mais breve possível. ');
                await client.sendMessage(msg.from, 'Agradecemos pela sua paciência e confiança em nosso suporte.');
                // Removendo o ouvinte de mensagem temporariamente para permitir a interação direta com o suporte
                client.off('message', handleUserResponse);
                break;
                
            default:
                await client.sendMessage(msg.from, 'Opção inválida. Por favor, responda com um número de 1 a 5.');
                break;
        }
    } else {
        await client.sendMessage(msg.from, 'Opção inválida. Por favor, responda com um número de 1 a 5.');
    }
};


client.on('message', handleUserResponse);

client.initialize();
