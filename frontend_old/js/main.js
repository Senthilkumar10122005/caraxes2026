document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Particles.js Background
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            "particles": {
                "number": { "value": 80, "density": { "enable": true, "value_area": 800 } },
                "color": { "value": ["#00f2fe", "#4facfe", "#ffffff"] },
                "shape": { "type": "circle" },
                "opacity": { "value": 0.5, "random": true },
                "size": { "value": 3, "random": true },
                "line_linked": { "enable": true, "distance": 150, "color": "#00f2fe", "opacity": 0.4, "width": 1 },
                "move": { "enable": true, "speed": 2, "direction": "none", "random": false, "straight": false, "out_mode": "out", "bounce": false }
            },
            "interactivity": {
                "detect_on": "canvas",
                "events": { "onhover": { "enable": true, "mode": "grab" }, "onclick": { "enable": true, "mode": "push" }, "resize": true },
                "modes": { "grab": { "distance": 140, "line_linked": { "opacity": 1 } }, "push": { "particles_nb": 4 } }
            },
            "retina_detect": true
        });
    }

    // 2. Mobile Menu Toggle
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileBtn) {
        mobileBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = mobileBtn.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // Close mobile menu on link click
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                navLinks.classList.remove('active');
                mobileBtn.querySelector('i').classList.remove('fa-times');
                mobileBtn.querySelector('i').classList.add('fa-bars');
            }
        });
    });

    // 3. Countdown Timer
    const countdownDate = new Date("March 15, 2026 09:00:00").getTime();

    const timerInterval = setInterval(() => {
        const now = new Date().getTime();
        const distance = countdownDate - now;

        if (distance < 0) {
            clearInterval(timerInterval);
            document.getElementById("countdown").innerHTML = "<h2>THE EVENT HAS STARTED!</h2>";
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById("days").innerText = days.toString().padStart(2, '0');
        document.getElementById("hours").innerText = hours.toString().padStart(2, '0');
        document.getElementById("minutes").innerText = minutes.toString().padStart(2, '0');
        document.getElementById("seconds").innerText = seconds.toString().padStart(2, '0');
    }, 1000);

    // 4. Events Data
    const techEvents = [
        {
            id: 't1', title: 'Code Clash', type: 'Programming Contest', icon: 'fa-code', desc: 'Test your logical thinking and coding skills. Solve complex algorithmic problems within the time limit to emerge victorious.', team: 'Individual or Max 2', duration: '2 Hours', venue: 'Lab 1 & 2', prize: 'Trophy + Certificate',
            rules: [
                'Language allowed: C, C++, Java, Python',
                'No internet access during the competition; mobile phones must be submitted.',
                'Plagiarism or copying code from other participants leads to immediate disqualification.',
                'The event consists of 2 rounds: Prelims (MCQs/Basic Coding) and Finals (Advanced Algorithmic Challenges).',
                'Tie-breakers will be decided based on execution time and code optimization.',
                'Participants must report 15 minutes before the technical start time.'
            ]
        },
        {
            id: 't2', title: 'Hackathon', type: 'Innovation Challenge', icon: 'fa-laptop-code', desc: 'Build innovative real-world solutions under pressure. Bring your ideas to life and impress the judges.', team: '2 to 4 Members', duration: '24 Hours', venue: 'Innovation Lab', prize: 'Tech Gadgets + Trophy',
            rules: [
                'Problem statements will be provided on the spot.',
                'Participants must bring their own laptops and hardware components (if any needed).',
                'A working prototype is mandatory for final evaluation.',
                'Teams will be evaluated on Innovation, Feasibility, Technical Complexity, and Presentation.',
                'Intermediate evaluations will happen at the 12th and 18th hours.',
                'Internet access is provided via college Wi-Fi.'
            ]
        },
        {
            id: 't3', title: 'Paper Presentation', type: 'Research Ideas', icon: 'fa-file-alt', desc: 'Showcase your research and technical communication skills. Present on cutting-edge technologies.', team: 'Max 2 Members', duration: '15 Mins Presentation', venue: 'Seminar Hall', prize: 'Trophy + Certificate',
            rules: [
                'Abstract must be submitted via email 2 days prior to the event.',
                'The paper should strictly follow IEEE standard format.',
                'Time limit is 7 minutes for presentation + 3 minutes for Q&A.',
                'Teams should bring their presentations on a clean pen drive.',
                'Topics should revolve around emerging technologies (AI, Blockchain, IoT, CyberSecurity, etc).',
                'Judges decision will be final.'
            ]
        },
        {
            id: 't4', title: 'Debugging Battle', type: 'Error Finding', icon: 'fa-bug', desc: 'Find and fix the hidden bugs in the provided source code. Speed and accuracy are the keys to winning.', team: 'Individual', duration: '1 Hour', venue: 'Lab 3', prize: 'Certificate + Medals',
            rules: [
                'Source code will contain syntax, logical, and runtime bugs.',
                'The first participant to compile, run, and produce the exact required output wins.',
                'No external help, IDE plugins (like Copilot/Tabnine), or internet access allowed.',
                'Code snippets will be in C, C++, or Java (Participant\'s choice prior to start).',
                'Only 3 submission attempts allowed per problem.'
            ]
        },
        {
            id: 't5', title: 'Web Design Challenge', type: 'UI Building', icon: 'fa-paint-brush', desc: 'Design a responsive, beautiful UI from scratch based on a theme using HTML, CSS, and JS.', team: 'Max 2 Members', duration: '2.5 Hours', venue: 'Lab 4', prize: 'Certificate + Swag',
            rules: [
                'Usage of frameworks (Bootstrap, Tailwind, React) is strictly prohibited (Vanilla HTML/CSS/JS only).',
                'Internet access is allowed strictly for downloading free stock assets/fonts/icons.',
                'The design must be fully responsive across mobile, tablet, and desktop views.',
                'Evaluation is based on Aesthetics, Responsiveness, Code structure, and Accessibility.',
                'The theme will be revealed precisely at the start of the event.'
            ]
        }
    ];

    const nonTechEvents = [
        {
            id: 'nt1', title: 'Treasure Hunt', type: 'Outdoor Event', icon: 'fa-map-marked-alt', desc: 'Follow the clues, solve the riddles, and race across the campus to find the hidden treasure.', team: '3 to 5 Members', duration: '2 Hours', venue: 'Campus Wide', prize: 'Surprise Gift',
            rules: [
                'Teams must stay within the designated campus limits; leaving campus is immediate disqualification.',
                'Damaging college property or interfering with classes will lead to disqualification.',
                'The first team to find the final clue and return to the starting point wins.',
                'Clues are sequential; you must present clue N to receive clue N+1 from volunteers.',
                'Teams cannot use bikes or cars inside the campus.'
            ]
        },
        {
            id: 'nt2', title: 'Quiz Mania', type: 'Trivia & General Knowledge', icon: 'fa-question-circle', desc: 'Test your knowledge across various domains including tech, pop culture, and sports.', team: '2 Members', duration: '1.5 Hours', venue: 'Mini Auditorium', prize: 'Trophy + Medals',
            rules: [
                'Event consists of a Prelims round (Written) and a Finals round (On-stage).',
                'The judge and quizmaster\'s decision is final and binding.',
                'No mobile phones or smartwatches allowed during the quiz.',
                'Finals will include buzzer rounds; negative marking applies for incorrect buzzing.',
                'Ties will be broken by sudden-death questions.'
            ]
        },
        {
            id: 'nt3', title: 'Connections', type: 'Visual Puzzles', icon: 'fa-link', desc: 'Connect the visual clues on the screen to find the underlying word or phrase.', team: '2 Members', duration: '1 Hour', venue: 'Seminar Hall 2', prize: 'Gift Vouchers',
            rules: [
                'Finals are conducted as a buzzer round.',
                'Negative marking applies for guessing before all clues are revealed (in specific rounds).',
                'Prompting from the audience will lead to disqualification of the prompted team.',
                'Themes will range from Movies to Tech concepts.',
                'The quizmaster\'s decision is final.'
            ]
        },
        {
            id: 'nt4', title: 'Photography Contest', type: 'Creative Event', icon: 'fa-camera', desc: 'Capture the spirit of Caraxes 2026. Submit your best shots based on the given theme.', team: 'Individual', duration: 'All Day', venue: 'Campus', prize: 'Trophy + Feature on Website',
            rules: [
                'Only DSLR, Mirrorless, or high-end Mobile cameras allowed.',
                'No heavy editing or photo manipulation (basic color correction is allowed).',
                'Participants must submit both RAW and JPEG/Edited files for verification.',
                'Metadata (EXIF) must remain intact to verify the photo was taken during the event.',
                'Maximum 3 submissions per individual.'
            ]
        },
        {
            id: 'nt5', title: 'Fun Games Arena', type: 'Various mini-games', icon: 'fa-gamepad', desc: 'Relax and have fun! Participate in minute-to-win-it games, VR setup, and more.', team: 'Individual/Team', duration: 'Ongoing', venue: 'Ground Floor Lobby', prize: 'Goodies',
            rules: [
                'On-the-spot registration is allowed.',
                'Games operate on a first-come, first-served basis.',
                'Win a game, win a quick goodie. Participate in multiple games!',
                'Maintain discipline and wait your turn in line.',
                'Have fun!'
            ]
        }
    ];

    const techContainer = document.getElementById('tech-events');
    const nonTechContainer = document.getElementById('non-tech-events');

    function createEventCard(event) {
        return `
            <div class="event-card" onclick="openModal('${event.id}')">
                <i class="fas ${event.icon} event-icon"></i>
                <h3>${event.title}</h3>
                <p><strong>${event.type}</strong></p>
                <div class="card-footer mt-5">
                    <span class="btn-outline">View Details</span>
                </div>
            </div>
        `;
    }

    if (techContainer) techContainer.innerHTML = techEvents.map(createEventCard).join('');
    if (nonTechContainer) nonTechContainer.innerHTML = nonTechEvents.map(createEventCard).join('');

    // Combine for easy lookup
    const allEvents = [...techEvents, ...nonTechEvents];

    // 5. Modal Logic
    const modal = document.getElementById("eventModal");
    const closeBtn = document.querySelector(".close-modal");

    window.openModal = function (id) {
        const event = allEvents.find(e => e.id === id);
        if (!event) return;

        document.getElementById('modalTitle').innerText = event.title;
        document.getElementById('modalDesc').innerText = event.desc;
        document.getElementById('modalTeam').innerText = event.team;
        document.getElementById('modalDuration').innerText = event.duration;
        document.getElementById('modalVenue').innerText = event.venue;
        document.getElementById('modalPrize').innerText = event.prize;

        const rulesList = document.getElementById('modalRules');
        rulesList.innerHTML = event.rules.map(rule => `<li>${rule}</li>`).join('');

        // Pre-select the event in the registration form dropdown
        const eventSelect = document.getElementById('event_name');
        if (eventSelect) {
            eventSelect.innerHTML = `<option value="${event.title}" selected>${event.title}</option>`;
            // Trigger change event to toggle team fields automatically
            eventSelect.dispatchEvent(new Event('change'));
        }

        modal.style.display = "block";
        document.body.style.overflow = "hidden"; // Prevent background scrolling
    }

    if (closeBtn) {
        closeBtn.onclick = function () {
            modal.style.display = "none";
            document.body.style.overflow = "auto";
        }
    }

    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
            document.body.style.overflow = "auto";
        }
    }

    window.closeModalAndScroll = function () {
        modal.style.display = "none";
        document.body.style.overflow = "auto";
        // smooth scroll happens via href="#register" natively, but we ensure modal is closed
    }

    // Toggle Rules Display Logic
    const toggleRulesBtn = document.getElementById('btnDownloadRules');
    const rulesList = document.getElementById('modalRules');
    let rulesVisible = true;

    if (toggleRulesBtn && rulesList) {
        toggleRulesBtn.addEventListener('click', (e) => {
            e.preventDefault();
            rulesVisible = !rulesVisible;
            if (rulesVisible) {
                rulesList.style.display = 'block';
                toggleRulesBtn.innerHTML = '<i class="fas fa-eye-slash"></i> Hide Rules';
            } else {
                rulesList.style.display = 'none';
                toggleRulesBtn.innerHTML = '<i class="fas fa-eye"></i> Show Rules Detail';
            }
        });
    }

    // Modify window.openModal to ensure rules are visible initially
    const originalOpenModal = window.openModal;
    window.openModal = function (id) {
        originalOpenModal(id);
        if (rulesList && toggleRulesBtn) {
            rulesList.style.display = 'block';
            rulesVisible = true;
            toggleRulesBtn.innerHTML = '<i class="fas fa-eye-slash"></i> Hide Rules';
        }
    };

    // Toggle Team Fields based on selected event
    const eventSelect = document.getElementById('event_name');
    const teamFields = document.getElementById('teamFields');

    if (eventSelect && teamFields) {
        eventSelect.addEventListener('change', (e) => {
            const val = e.target.value;
            const ev = allEvents.find(event => event.title === val);
            if (ev && ev.team.toLowerCase().includes('team') || ev && /\d/.test(ev.team) && !ev.team.toLowerCase().includes('individual only')) {
                teamFields.classList.remove('hidden');
            } else {
                teamFields.classList.add('hidden');
            }
        });
    }

    // 6. Registration Form Submission
    const regForm = document.getElementById('registrationForm');
    const submitBtn = document.getElementById('submitBtn');
    const successMsg = document.getElementById('successMsg');
    const errorMsg = document.getElementById('errorMsg');

    if (regForm) {
        regForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            successMsg.classList.add('hidden');
            errorMsg.classList.add('hidden');

            const originalBtnText = submitBtn.innerText;
            submitBtn.innerText = 'Registering...';
            submitBtn.disabled = true;

            const formData = new FormData(regForm);
            const data = Object.fromEntries(formData.entries());

            try {
                // Determine API URL (Use absolute if running on different port, else relative)
                // Assuming backend runs on 3000 locally
                const apiUrl = window.location.hostname === 'localhost'
                    ? 'http://localhost:3000/api/register'
                    : '/api/register';

                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });

                const result = await response.json();

                if (response.ok && result.success) {
                    successMsg.innerText = result.message;
                    successMsg.classList.remove('hidden');
                    regForm.reset();
                    teamFields.classList.add('hidden');
                } else {
                    errorMsg.innerText = result.message || 'Registration failed. Please try again.';
                    errorMsg.classList.remove('hidden');
                }
            } catch (err) {
                console.error("Registration error:", err);
                errorMsg.innerText = 'Network Error. Ensure the backend server is running.';
                errorMsg.classList.remove('hidden');
            } finally {
                submitBtn.innerText = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }
});
