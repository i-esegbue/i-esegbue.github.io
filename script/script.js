
        const menuToggle = document.querySelector(".menu-toggle");
        const primaryNav = document.querySelector("#primary-nav");

        menuToggle.addEventListener("click", () => {
            const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
            menuToggle.setAttribute("aria-expanded", String(!isOpen));
            menuToggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
            primaryNav.classList.toggle("is-open", !isOpen);
        });

        primaryNav.addEventListener("click", (event) => {
            if (event.target.closest("a")) {
                menuToggle.setAttribute("aria-expanded", "false");
                menuToggle.setAttribute("aria-label", "Open navigation");
                primaryNav.classList.remove("is-open");
            }
        });

        document.querySelector("#year").textContent = new Date().getFullYear();

        const heroHeadline = document.querySelector(".hero-headline");
        const heroHeadlineMain = heroHeadline.querySelector(".hero-headline-main");
        const heroHeadlineSubline = heroHeadline.querySelector(".hero-headline-subline");
        const headlinePhrases = [
            { main: "Making sense of", subline: "the signal" },
            { main: "and Turning ", subline: "raw logs" },
            { main: "into clear", subline: " threat narratives." },

            
        ];

        if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            const delay = (duration) => new Promise((resolve) => window.setTimeout(resolve, duration));

            const typeText = async (element, text) => {
                element.classList.add("is-typing");
                for (let length = 1; length <= text.length; length += 1) {
                    element.textContent = text.slice(0, length);
                    await delay(110);
                }
                element.classList.remove("is-typing");
            };

            const eraseText = async (element) => {
                const text = element.textContent;
                element.classList.add("is-typing");
                for (let length = text.length - 1; length >= 0; length -= 1) {
                    element.textContent = text.slice(0, length);
                    await delay(55);
                }
                element.classList.remove("is-typing");
            };

            const animateHeadlines = async () => {
                let activePhrase = 0;
                while (true) {
                    await delay(3000);
                    await eraseText(heroHeadlineSubline);
                    await eraseText(heroHeadlineMain);
                    activePhrase = (activePhrase + 1) % headlinePhrases.length;
                    const phrase = headlinePhrases[activePhrase];
                    await typeText(heroHeadlineMain, phrase.main);
                    if (phrase.animateSubline === false) {
                        heroHeadlineSubline.textContent = phrase.subline;
                    } else {
                        await typeText(heroHeadlineSubline, phrase.subline);
                    }
                }
            };

            animateHeadlines();
        }

        const contactForm = document.querySelector("#contact-form");
        const contactFormStatus = document.querySelector("#contact-form-status");
        const contactSubmitButton = contactForm.querySelector('button[type="submit"]');

        contactForm.addEventListener("submit", async (event) => {
            event.preventDefault();
            contactFormStatus.textContent = "Sending your message...";
            contactFormStatus.classList.remove("is-error", "is-success");
            contactSubmitButton.disabled = true;
            contactSubmitButton.querySelector(".submit-label").textContent = "Sending...";

            try {
                const response = await fetch(contactForm.action, {
                    method: "POST",
                    body: JSON.stringify(Object.fromEntries(new FormData(contactForm))),
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    }
                });
                const result = await response.json();

                if (!response.ok || result.success !== true) {
                    throw new Error(typeof result.message === "string" ? result.message : "The message could not be sent. Please try again.");
                }

                contactForm.reset();
                contactFormStatus.textContent = "Thanks for reaching out. Your message has been sent.";
                contactFormStatus.classList.add("is-success");
            } catch (error) {
                contactFormStatus.textContent = error instanceof Error
                    ? error.message
                    : "Something went wrong. Please try again.";
                contactFormStatus.classList.add("is-error");
            } finally {
                contactSubmitButton.disabled = false;
                contactSubmitButton.querySelector(".submit-label").textContent = "Send message";
            }
        });
   