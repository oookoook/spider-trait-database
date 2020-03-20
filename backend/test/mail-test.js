mail = require('../util/mail')(require('../settings'));

// you can check if the email was sent here: https://www.maildu.de/mail/check?to=spidertraits

mail.send({
    subject: 'Spider Trait Database test',
    text: 'Test message',
    to: 'spidertraits@maildu.de'
});

