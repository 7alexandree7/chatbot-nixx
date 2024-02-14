const { Client, MessageMedia, LocalAuth } = require("whatsapp-web.js");
const qrcode = require('qrcode-terminal');
const path = require('path');



const client = new Client({
    authStrategy: new LocalAuth()
});




let welcomeSent = {};
let typingTimer;


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
    } else {
        // Se já enviou a mensagem de boas-vindas, trata a resposta do usuário
        handleUserResponse(msg);
    }
});


const handleUserResponse = async (msg) => {
    const response = msg.body;

    if (!isNaN(response)) {

        switch (response) {
            case '1':
                await client.sendMessage(msg.from, 'Você escolheu a opção 1: Problemas técnicos ou erros no aplicativo.');
                await client.sendMessage(msg.from, 'Se sua dúvida não foi resolvida, por favor digite 5 para falar diretamente com o suporte.');
                break;


            case '2':
                await client.sendMessage(msg.from, 'Você escolheu a opção 2: Dúvidas sobre funcionalidades e uso do aplicativo.');
                await client.sendMessage(msg.from, 'Se sua dúvida não foi resolvida, por favor digite 5 para falar diretamente com o suporte.');
                break;


            case '3':
                await client.sendMessage(msg.from, 'Você escolheu a opção 3: Questões relacionadas a pagamentos e assinaturas.');
                await client.sendMessage(msg.from, 'Se sua dúvida não foi resolvida, por favor digite 5 para falar diretamente com o suporte.');
                break;


            case '4':
                await client.sendMessage(msg.from, 'Você escolheu a opção 4: Tutorial sobre o nosso app ');  
                await client.sendMessage(msg.from, 'Olá! 🫶🏻 Para acessar nosso tutorial, siga estas etapas simples: baixe o vídeo que enviamos como documento e assista no conforto do seu celular. ');  
                await client.sendMessage(msg.from, 'É fácil e rápido! Se tiver alguma dúvida, estou à disposição para ajudar');  
                await client.sendMessage(msg.from, 'Se sua dúvida não foi resolvida, por favor digite 5 para falar diretamente com o suporte.');  
                const videoPath = path.join(__dirname, './Foda-se Versão Roblox Meme (360p).mp4');
                const media = MessageMedia.fromFilePath(videoPath);
                await client.sendMessage(msg.from, media, { sendMediaAsDocument: true });
                break;


            case '5':
                await client.sendMessage(msg.from, 'Você escolheu a opção 5: Falar diretamente com o suporte Nix.\nVocê pode começar a conversa agora!');
                await client.sendMessage(msg.from, 'Entendemos sua questão e já estamos cuidando dela com toda a atenção. Fique tranquilo, sua solicitação está em boas mãos e será resolvida o mais breve possível. ');
                await client.sendMessage(msg.from, 'Agradecemos pela sua paciência e confiança em nosso suporte.');
                

                // Lidar com o diálogo do cliente
                client.on('message', async msg => {
                    if (msg.body.toLowerCase() === 'sair') {
                        await client.sendMessage(msg.from, 'A conversa foi encerrada. Obrigado por entrar em contato conosco.');
                        client.removeListener('message', handleUserResponse);
                        clearTimeout(typingTimer); // Cancelar o temporizador se o cliente encerrar a conversa
                    } else {
                        // Aqui você pode lidar com as mensagens enviadas pelo cliente
                        await client.sendMessage(msg.from, 'Você disse: ' + msg.body);
                    }
                    
                });
                
                break;


            default:
                if (typingTimer) clearTimeout(typingTimer); // Limpar o temporizador se houver qualquer entrada
                await client.sendMessage(msg.from, 'Opção inválida. Por favor, responda com um número')
            }
        }
    }

client.initialize();
        