document.addEventListener('DOMContentLoaded', function() {
    const accordions = document.querySelectorAll('.accordion');

    accordions.forEach(accordion => {
        accordion.addEventListener('click', function() {
            this.classList.toggle('active');
            const panel = this.nextElementSibling;
            const arrow = this.querySelector('.custom-arrow');

            // Panelin açılması veya kapanması için animasyon
            if (panel.style.maxHeight) {
                panel.style.maxHeight = null;
                arrow.style.transform = "rotate(0deg)";  // Ok sağa bakacak
            } else {
                panel.style.maxHeight = panel.scrollHeight + "px";
                arrow.style.transform = "rotate(90deg)";  // Ok aşağı bakacak
            }
        });
    });

    const textarea = document.querySelector('.custom-textarea');
    const sendButton = document.querySelector('.send-button');

    // Buton tıklama olayı
    sendButton.addEventListener('click', function() {
        // Eğer buton "Clear" ise, textarea'yı temizle ve butonu "Generate Story" yap
        if (sendButton.textContent === 'Clear') {
            textarea.value = '';  // Metin kutusunu temizle
            textarea.placeholder = 'Variables you want to specify...';  // Varsayılan placeholder'ı geri getir
            sendButton.textContent = 'Generate Story';  // Buton metnini "Generate Story" yap
            return;
        }

        const userMessage = textarea.value.trim();

        if (userMessage === '') {
            alert('Please enter a question.');
            return;
        }

        // Gönder butonuna basıldığında butonu devre dışı bırakıyoruz
        sendButton.disabled = true;
        sendButton.textContent = 'Generating...';

        fetch(`https://nasaspaceapps-6b92.onrender.com/get-ai-response`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: userMessage })
        })
        .then(response => response.json())
        .then(data => {
            if (data.response) {
                textarea.value = data.response;
            } else if (data.error) {
                textarea.value = data.error;
            } else {
                textarea.value = "Bilinmeyen bir hata oluştu.";
            }

            // Yapay zeka cevabı geldikten sonra buton "Clear" olur
            sendButton.disabled = false;
            sendButton.textContent = 'Clear';  // Buton metni "Clear" olur
        })
        .catch(error => {
            console.error('Error:', error);
            textarea.value = "Sunucuya bağlanılamadı.";
            sendButton.disabled = false;
            sendButton.textContent = 'Clear';  // Buton metni "Clear" olur
        });
    });
});
