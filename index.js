const form = document.getElementById('registrationForm');
const inputs = form.querySelectorAll('input');
const submitBtn = document.getElementById('submitBtn');
const subCountText = document.getElementById('subCount');

// Validation Logic
const patterns = {
    name: /^[a-zA-Z\s]{3,30}$/,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phone: /^\d{10}$/
};

// Real-time validation listeners
inputs.forEach(input => {
    input.addEventListener('input', () => {
        validateInput(input);
        if (input.id === 'password') updateStrength(input.value);
        checkFormValidity();
    });
});

function validateInput(input) {
    const errorSpan = document.getElementById(`${input.id}Error`);
    let message = "";

    if (patterns[input.id] && !patterns[input.id].test(input.value)) {
        message = `Invalid ${input.id} format.`;
    } else if (input.id === 'password' && input.value.length < 8) {
        message = "Password must be at least 8 chars.";
    }

    errorSpan.textContent = message;
    input.style.borderColor = message ? "#ff4d4d" : "#eee";
}

// Strength Meter Logic
function updateStrength(val) {
    const bar = document.getElementById('strengthBar');
    let score = 0;
    if (val.length > 7) score++;
    if (/[A-Z]/.test(val)) score++;
    if (/[0-9]/.test(val)) score++;
    if (/[^A-Za-z0-9]/.test(val)) score++;

    const colors = ['#ff4d4d', '#ffa64d', '#99ff33', '#2eb82e'];
    bar.style.width = (score * 25) + '%';
    bar.style.backgroundColor = colors[score - 1] || '#eee';
}

// Password Visibility Toggle
document.getElementById('togglePassword').addEventListener('click', function() {
    const passInput = document.getElementById('password');
    const isPass = passInput.type === 'password';
    passInput.type = isPass ? 'text' : 'password';
    this.textContent = isPass ? 'Hide' : 'Show';
});

// Submit Button State
function checkFormValidity() {
    const errors = Array.from(document.querySelectorAll('.error')).some(s => s.textContent !== "");
    const empty = Array.from(inputs).some(i => i.value === "");
    submitBtn.disabled = errors || empty;
}

// Handle LocalStorage Submission
form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const newUser = {
        name: form.name.value,
        email: form.email.value,
        phone: form.phone.value,
        date: new Date().toLocaleString()
    };

    const submissions = JSON.parse(localStorage.getItem('submissions') || '[]');
    submissions.push(newUser);
    localStorage.setItem('submissions', JSON.stringify(submissions));

    alert('Success! Data saved to localStorage.');
    form.reset();
    updateStrength('');
    checkFormValidity();
    updateSubCount();
});

function updateSubCount() {
    const count = JSON.parse(localStorage.getItem('submissions') || '[]').length;
    subCountText.textContent = `Submissions: ${count}`;
}

// Initialize count on load
updateSubCount();
