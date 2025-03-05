require('dotenv').config(); // Charger les variables d'environnement
const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

// Middlewares
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname)); // Sert les fichiers HTML

// Route pour envoyer l'email
app.post('/send', (req, res) => {
    const { message1, message2, message3 } = req.body;

    // Vérifier que les champs ne sont pas vides
    if (!message1 || !message2 || !message3) {
        return res.status(400).json({ error: "Tous les champs sont obligatoires !" });
    }

    // Configurer Nodemailer pour Gmail
    const transporter = nodemailer.createTransport({
        service: 'gmail', 
        auth: {
            user: process.env.EMAIL_USER, // Ton email
            pass: process.env.EMAIL_PASS  // Ton mot de passe d'application
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: 'zk1charafeddin@gmail.com', // Ton email de réception
        subject: '📩 Nouveau message depuis ton site',
        text: `Message 1: ${message1}\nMessage 2: ${message2}\nMessage 3: ${message3}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            return res.status(500).json({ error: "Erreur lors de l'envoi du message." });
        } else {
            console.log('✅ Email envoyé : ' + info.response);
            return res.json({ success: "Message envoyé avec succès !" });
        }
    });
});

// Démarrer le serveur
app.listen(port, () => {
    console.log(`🚀 Serveur en écoute sur http://localhost:${port}`);
});
