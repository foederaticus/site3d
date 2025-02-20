document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const formResponse = document.getElementById('formResponse');

    contactForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const formData = new FormData(contactForm);
        const name = formData.get('name');
        const email = formData.get('email');
        const message = formData.get('message');

        const emailsSent = JSON.parse(localStorage.getItem('emailsSent')) || [];
        const oneHourAgo = Date.now() - (60 * 60 * 1000);
        const recentEmails = emailsSent.filter(timestamp => timestamp > oneHourAgo);

        if (recentEmails.length >= 5) {
            formResponse.textContent = 'Vous avez atteint la limite d\'envoi de 5 emails par heure. Veuillez réessayer plus tard.';
            return;
        }

        fetch('https://api.emailjs.com/api/v1.0/email/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                service_id: 'your_service_id',
                template_id: 'your_template_id',
                user_id: 'your_user_id',
                template_params: {
                    'name': name,
                    'email': email,
                    'message': message
                }
            })
        })
        .then(response => response.json())
        .then(data => {
            recentEmails.push(Date.now());
            localStorage.setItem('emailsSent', JSON.stringify(recentEmails));
            formResponse.textContent = 'Merci pour votre message ! Nous vous répondrons dès que possible.';
            contactForm.reset();
        })
        .catch(error => {
            formResponse.textContent = 'Une erreur s\'est produite. Veuillez réessayer plus tard.';
            console.error('Erreur:', error);
        });
    });
});