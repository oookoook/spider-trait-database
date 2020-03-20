const nodemailer = require('nodemailer');

var transporter = null;
var sender = null;
var admins = null;
var baseUrl = null;
var disabled = false;

const send = async function (message) {
    if (disabled) {
        console.log('Mailing disabled');
        console.dir(message);
        return;
    }
    message.from = `"Spider Trait Database" <${sender}>`;
    if(!message.to) {
        message.to = admins;
    }
    message = message.replace('{BASEURL}', baseUrl);
    try {
        await transporter.sendMail(message);
    } catch(err) {
        console.log('Unable to send mail message');
        console.log(err);
    }
}

module.exports = (settings) => {
    disabled = !settings.mail || settings.mail.enabled;
    if (disabled) {
        return;
    }
    sender = settings.mail.sender;
    admins = settings.mail.admins;
    baseUrl = settings.baseUrl;
    transporter = nodemailer.createTransport({
        host: settings.mail.host,
        port: settings.mail.port,
        secure: settings.mail.secure,
        auth: {
            user: settings.mail.user, // generated ethereal user
            pass: settings.mail.pass // generated ethereal password
        }
    });
    transporter.verify(function (error, success) {
        if (error) {
            console.log('Unable to connect to SMTP server');
            console.log(error);
        } else {
            console.log('Mail server configuration verified');
        }
    });

    return {
        send
    }
}