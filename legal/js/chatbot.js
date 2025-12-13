// EAW v2 - chatbot.js
// Purpose: shared chatbot UI + logic (single source of truth)

(function () {
  const EAW_FLOW = {
    start: {
      type: "message",
      text: "Hi, I’m the Elevated AI Works assistant. Choose a quick start and I’ll point you in the right direction.",
      options: [
        { label: "I need a website", next: "need_website" },
        { label: "I want branding", next: "need_branding" },
        { label: "I need something smarter (AI/tools)", next: "need_ai" },
        { label: "I’m not sure yet", next: "need_unsure" }
      ]
    },

    need_website: {
      type: "message",
      text: "Great choice. We build conversion-ready sites that stay on-brand and feel effortless on mobile. Best next steps:",
      options: [
        { label: "View Services", next: "open_services" },
        { label: "See portfolio examples", next: "open_portfolio" },
        { label: "Contact directly", next: "open_contact" },
        { label: "Talk through it", next: "quote_intro" }
      ]
    },

    need_branding: {
      type: "message",
      text: "Branding keeps everything consistent—from logos to social posts. I can show you the services page or examples.",
      options: [
        { label: "Branding services", next: "open_services" },
        { label: "See finished work", next: "open_portfolio" },
        { label: "Contact directly", next: "open_contact" },
        { label: "Start a quick scope", next: "quote_intro" }
      ]
    },

    need_ai: {
      type: "message",
      text: "You want something smarter. We ship assistants, workflows, and light automation without the hype.",
      options: [
        { label: "AI & automation overview", next: "open_services" },
        { label: "Show portfolio", next: "open_portfolio" },
        { label: "Contact about AI", next: "open_contact" },
        { label: "Start a project conversation", next: "quote_intro" }
      ]
    },

    need_unsure: {
      type: "message",
      text: "No worries. Give me a little context and I’ll align you with the right service.",
      options: [
        { label: "Send a quick note", next: "quote_description_only" },
        { label: "Browse services", next: "services_overview" },
        { label: "Open contact page", next: "open_contact" }
      ]
    },

    choose_service: {
      type: "message",
      text: "Awesome, let’s figure out what you need.\nWhat describes you best right now?",
      options: [
        { label: "🧱 I need a brand or logo", next: "service_branding" },
        { label: "🌐 I need a website or refresh", next: "service_web" },
        { label: "🤖 I want AI workflows/automation", next: "service_ai" },
        { label: "🤷 I’m not sure yet", next: "service_unsure" }
      ]
    },

    service_branding: {
      type: "message",
      text: "Perfect — that sounds like Branding & Visual Identity.\nWe help with logo design, color palettes, typography, and brand guidelines so everything feels consistent online and offline.\n\nWhat would you like to do next?",
      options: [
        { label: "📋 More about branding", next: "services_overview" },
        { label: "💬 Start a quote", next: "quote_intro" },
        { label: "🔙 Back to main menu", next: "start" }
      ]
    },

    service_web: {
      type: "message",
      text: "Got it — that falls under Branding & Web Design.\nWe create modern, responsive websites that are aligned with your brand and easy to use.\n\nWhat would you like to do next?",
      options: [
        { label: "🌐 More about web design", next: "services_overview" },
        { label: "💬 Start a quote", next: "quote_intro" },
        { label: "🔙 Back to main menu", next: "start" }
      ]
    },

    service_ai: {
      type: "message",
      text: "Nice. You’re looking for AI Solutions & Automation.\nWe help with things like content workflows, customer support assistants, and internal process automation.\n\nWhat would you like to do next?",
      options: [
        { label: "🤖 AI services overview", next: "services_overview" },
        { label: "💬 Start a quote", next: "quote_intro" },
        { label: "🔙 Back to main menu", next: "start" }
      ]
    },

    service_unsure: {
      type: "message",
      text: "No worries — that’s what I’m here for.\nA quick way to start is to describe what isn’t working right now: website, branding, content, or processes.\n\nWant to send a short description and let Elevated AI Works review it?",
      options: [
        { label: "✍️ Yes, I’ll describe my situation", next: "quote_description_only" },
        { label: "🔙 Back to main menu", next: "start" }
      ]
    },

    services_overview: {
      type: "message",
      text:
        "Here’s a quick overview of what Elevated AI Works offers:\n\n" +
        "🎨 Branding & Visual Identity\nLogos, color palettes, typography, and brand guidelines.\n\n" +
        "🌐 Branding & Web Design\nClean, modern websites that align with your brand.\n\n" +
        "🤖 AI Solutions & Automation\nCustom AI tools and workflows to streamline your work.\n\nWhat would you like to do next?",
      options: [
        { label: "💬 Get a quote", next: "quote_intro" },
        { label: "❓ FAQs", next: "faqs" },
        { label: "🔙 Back to main menu", next: "start" }
      ]
    },

    faqs: {
      type: "message",
      text: "I’ve got answers to some common questions.\nWhat would you like to know?",
      options: [
        { label: "💲 How does pricing work?", next: "faq_pricing" },
        { label: "⏱ How long do projects take?", next: "faq_timing" },
        { label: "📁 What do I need to get started?", next: "faq_requirements" },
        { label: "🤝 Do you work with small businesses/startups?", next: "faq_smallbiz" },
        { label: "📬 How do I contact you directly?", next: "faq_contact" },
        { label: "🔙 Back to main menu", next: "start" }
      ]
    },

    faq_pricing: {
      type: "message",
      text:
        "Pricing depends on the scope.\n• Branding & logos → usually project-based packages\n" +
        "• Websites → based on page count, features, and integrations\n" +
        "• AI solutions → based on complexity and tools required\n\n" +
        "If you’d like a ballpark range, I can ask a few questions and send your details to Elevated AI Works.",
      options: [
        { label: "💬 Start a quote", next: "quote_intro" },
        { label: "🔙 Back to FAQs", next: "faqs" }
      ]
    },

    faq_timing: {
      type: "message",
      text:
        "Project timelines vary:\n• Branding: usually a few weeks\n" +
        "• Websites: a few weeks to a couple of months, depending on features and revisions\n" +
        "• AI solutions: depends on complexity\n\nYour timeline will always be discussed before we start.",
      options: [{ label: "🔙 Back to FAQs", next: "faqs" }]
    },

    faq_requirements: {
      type: "message",
      text:
        "To get started, it helps to have:\n" +
        "• A short description of your business\n" +
        "• Any existing logos/branding\n" +
        "• Examples of websites or brands you like\n" +
        "• A rough budget and timeline\n\nIf you don’t have it all yet, that’s okay — we’ll figure it out together.",
      options: [
        { label: "💬 Start a quote", next: "quote_intro" },
        { label: "🔙 Back to FAQs", next: "faqs" }
      ]
    },

    faq_smallbiz: {
      type: "message",
      text:
        "Absolutely. Elevated AI Works is built for small businesses, creators, and entrepreneurs.\n" +
        "We can start small and scale alongside you.",
      options: [{ label: "🔙 Back to FAQs", next: "faqs" }]
    },

    faq_contact: {
      type: "message",
      text:
        "You can reach out anytime via the contact form on the site or by email.\n\n" +
        "Or, if you’d like, you can start a quick quote here in chat.",
      options: [
        { label: "📬 Open contact page", next: "open_contact" },
        { label: "💬 Start a quote here", next: "quote_intro" },
        { label: "🔙 Back to FAQs", next: "faqs" }
      ]
    },

    quote_intro: {
      type: "message",
      text:
        "Let’s grab a few quick details and I’ll pass them along to Elevated AI Works for a personalized response.\n\nWhat are you mainly interested in?",
      options: [
        { label: "🎨 Branding / logo", next: "quote_interest_branding" },
        { label: "🌐 Website", next: "quote_interest_web" },
        { label: "🤖 AI / automation", next: "quote_interest_ai" },
        { label: "🧩 Combination / not sure", next: "quote_interest_combo" }
      ]
    },

    quote_interest_branding: { type: "input", text: "Got it — branding.\nWhat’s your name?", key: "name", next: "quote_email" },
    quote_interest_web:     { type: "input", text: "Got it — website.\nWhat’s your name?", key: "name", next: "quote_email" },
    quote_interest_ai:      { type: "input", text: "Got it — AI / automation.\nWhat’s your name?", key: "name", next: "quote_email" },
    quote_interest_combo:   { type: "input", text: "No problem — a mix is common.\nWhat’s your name?", key: "name", next: "quote_email" },

    quote_email: { type: "input", text: "Thanks, {{name}}. What’s the best email to reach you?", key: "email", next: "quote_description" },

    quote_description: {
      type: "input",
      text: "Great. In 2–3 sentences, tell us what you’re hoping to achieve or what problem you’d like Elevated AI Works to help solve.",
      key: "description",
      next: "quote_budget"
    },

    quote_budget: {
      type: "message",
      text: "If you’re comfortable sharing, which range best fits your budget?",
      options: [
        { label: "💵 Under $1,000", next: "quote_done_under" },
        { label: "💵 $1,000–$2,500", next: "quote_done_mid" },
        { label: "💵 $2,500–$5,000", next: "quote_done_high" },
        { label: "💵 $5,000+", next: "quote_done_premium" },
        { label: "🙈 Not sure yet", next: "quote_done_unsure" }
      ]
    },

    quote_done_under:   { type: "final", text: "Thanks, {{name}}! 🎉\nYou selected a budget under $1,000." },
    quote_done_mid:     { type: "final", text: "Thanks, {{name}}! 🎉\nYou selected a budget of $1,000–$2,500." },
    quote_done_high:    { type: "final", text: "Thanks, {{name}}! 🎉\nYou selected a budget of $2,500–$5,000." },
    quote_done_premium: { type: "final", text: "Thanks, {{name}}! 🎉\nYou selected a budget of $5,000+." },
    quote_done_unsure:  { type: "final", text: "Thanks, {{name}}! 🎉\nNo worries if you’re not sure on budget yet." },

    quote_description_only: {
      type: "input",
      text: "Go ahead and describe your situation in a few sentences and Elevated AI Works will review it.",
      key: "description",
      next: "quote_done_simple"
    },

    quote_done_simple: { type: "final", text: "Thanks for sharing! Elevated AI Works will review your message and follow up if you left contact info elsewhere on the site." },

    about: {
      type: "message",
      text:
        "Elevated AI Works blends thoughtful design with practical AI solutions.\n\n" +
        "Our goal is to make advanced tools feel approachable, human, and useful for small businesses and creators.\n\nWhat would you like to explore next?",
      options: [
        { label: "📋 See all services", next: "services_overview" },
        { label: "💬 Get a quote", next: "quote_intro" },
        { label: "🔙 Back to main menu", next: "start" }
      ]
    },

    open_services: { type: "action", action: "openServices" },
    open_portfolio: { type: "action", action: "openPortfolio" },
    open_contact: { type: "action", action: "openContact" }
  };

  function $(id) { return document.getElementById(id); }

  function initChatbot() {
    const chatbot = $("eaw-chatbot");
    const toggleBtn = $("eaw-chat-toggle");
    const closeBtn = $("eaw-chat-close");
    const messagesEl = $("eaw-chat-messages");
    const optionsEl = $("eaw-chat-options");
    const inputWrapper = $("eaw-chat-input-wrapper");
    const inputField = $("eaw-chat-input");
    const sendBtn = $("eaw-chat-send");

    if (!chatbot || !toggleBtn || !closeBtn || !messagesEl || !optionsEl || !inputWrapper || !inputField || !sendBtn) {
      if (window?.console?.warn) {
        console.warn("EAW chatbot init aborted: missing nodes", {
          chatbot: Boolean(chatbot),
          toggleBtn: Boolean(toggleBtn),
          closeBtn: Boolean(closeBtn),
          messagesEl: Boolean(messagesEl),
          optionsEl: Boolean(optionsEl),
          inputWrapper: Boolean(inputWrapper),
          inputField: Boolean(inputField),
          sendBtn: Boolean(sendBtn)
        });
      }
      return;
    }

    const moveToBody = (node) => {
      if (node && node.parentElement !== document.body) {
        document.body.appendChild(node);
      }
    };

    moveToBody(chatbot);
    moveToBody(toggleBtn);

    let pendingKey = null;
    let pendingNext = null;
    const userData = {};
    let lastFocusedElement = null;
    let lastPointerToggle = 0;

    function renderText(text) {
      return String(text).replace(/{{(\w+)}}/g, (_, key) => userData[key] || "");
    }

    function appendMessage(text, from = "bot") {
      const div = document.createElement("div");
      div.className = "eaw-msg " + from;
      div.textContent = renderText(text);
      messagesEl.appendChild(div);
      requestAnimationFrame(() => { messagesEl.scrollTop = messagesEl.scrollHeight; });
    }

    function clearOptions() { optionsEl.innerHTML = ""; }

    function resetConversation() {
      messagesEl.innerHTML = "";
      clearOptions();
      for (const k in userData) delete userData[k];
      inputWrapper.style.display = "none";
      pendingKey = null;
      pendingNext = null;
    }

    chatbot.setAttribute("aria-hidden", "true");
    toggleBtn.setAttribute("aria-expanded", "false");
    toggleBtn.setAttribute("aria-controls", "eaw-chatbot");
    toggleBtn.setAttribute("type", "button");
    chatbot.setAttribute("role", "dialog");
    chatbot.setAttribute("aria-label", "Elevated AI Works assistant");
    chatbot.setAttribute("tabindex", "-1");
    closeBtn.setAttribute("data-chat-focus", "true");

    function toggleChat(show) {
      const shouldOpen = show === true ? true : show === false ? false : !chatbot.classList.contains("open");

      try {
        if (shouldOpen) {
          lastFocusedElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;
        }

        chatbot.classList.toggle("open", shouldOpen);
        toggleBtn.classList.toggle("is-open", shouldOpen);
        toggleBtn.setAttribute("aria-expanded", String(shouldOpen));
        toggleBtn.setAttribute("aria-label", shouldOpen ? "Close assistant" : "Open assistant");
        chatbot.setAttribute("aria-hidden", shouldOpen ? "false" : "true");

        if (shouldOpen && messagesEl.childElementCount === 0) {
          showNode("start");
        }

        if (shouldOpen) {
          const focusTarget = chatbot.querySelector("[data-chat-focus]") || chatbot;
          requestAnimationFrame(() => focusTarget.focus({ preventScroll: true }));
        } else if (lastFocusedElement) {
          requestAnimationFrame(() => lastFocusedElement.focus({ preventScroll: true }));
        }
      } catch (err) {
        if (window?.console?.warn) console.warn("EAW chatbot toggle failed", err);
      }

      return shouldOpen;
    }

    function handleActionNode(node) {
      const basePath = window.location.pathname.includes("/legal/") ? "../" : "";

      if (node.action === "openContact") {
        window.location.href = basePath + "contact.html";
        return;
      }

      if (node.action === "openServices") {
        window.location.href = basePath + "services.html";
        return;
      }

      if (node.action === "openPortfolio") {
        window.location.href = basePath + "portfolio.html";
      }
    }

    function showFinal(finalText) {
      appendMessage(finalText, "bot");

      const summary =
        "New inquiry from EAW Assistant:\n\n" +
        "Name: " + (userData.name || "(not provided)") + "\n" +
        "Email: " + (userData.email || "(not provided)") + "\n\n" +
        "Description:\n" + (userData.description || "(not provided)") + "\n";

      const mailtoHref =
        "mailto:hello@elevatedaiworks.com" +
        "?subject=" + encodeURIComponent("New Elevated AI Works inquiry") +
        "&body=" + encodeURIComponent(summary);

      clearOptions();

      const btnEmail = document.createElement("button");
      btnEmail.textContent = "📨 Send details to Elevated AI Works";
      btnEmail.addEventListener("click", () => { window.location.href = mailtoHref; });

      const btnRestart = document.createElement("button");
      btnRestart.textContent = "🔁 Start over";
      btnRestart.addEventListener("click", () => { resetConversation(); showNode("start"); });

      optionsEl.appendChild(btnEmail);
      optionsEl.appendChild(btnRestart);
    }

    function showNode(id) {
      const node = EAW_FLOW[id];
      if (!node) return;

      clearOptions();
      inputWrapper.style.display = "none";
      pendingKey = null;
      pendingNext = null;

      if (node.type === "action") return handleActionNode(node);
      if (node.type === "final") return showFinal(node.text);

      appendMessage(node.text, "bot");

      if (node.type === "message") {
        (node.options || []).forEach(opt => {
          const btn = document.createElement("button");
          btn.textContent = opt.label;
          btn.addEventListener("click", () => {
            appendMessage(opt.label, "user");
            const nextNode = EAW_FLOW[opt.next];
            if (!nextNode) return;
            if (nextNode.type === "action") handleActionNode(nextNode);
            else showNode(opt.next);
          });
          optionsEl.appendChild(btn);
        });
      } else if (node.type === "input") {
        pendingKey = node.key;
        pendingNext = node.next;
        inputWrapper.style.display = "flex";
        inputField.value = "";
        inputField.focus();
      }
    }

    function handleInputSubmit() {
      const value = inputField.value.trim();
      if (!value || !pendingKey || !pendingNext) return;

      appendMessage(value, "user");
      userData[pendingKey] = value;

      inputField.value = "";
      inputWrapper.style.display = "none";

      showNode(pendingNext);
    }

    const handlePointerToggle = () => {
      lastPointerToggle = Date.now();
      toggleChat();
    };

    const handleClickToggle = () => {
      if (Date.now() - lastPointerToggle < 300) return;
      toggleChat();
    };

    toggleBtn.addEventListener("pointerup", handlePointerToggle);
    toggleBtn.addEventListener("click", handleClickToggle);
    closeBtn.addEventListener("click", () => toggleChat(false));
    sendBtn.addEventListener("click", handleInputSubmit);
    inputField.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleInputSubmit();
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && chatbot.classList.contains("open")) {
        e.preventDefault();
        toggleChat(false);
      }
    });

    document.addEventListener("pointerdown", (e) => {
      if (!chatbot.classList.contains("open")) return;
      const target = e.target;
      if (!chatbot.contains(target) && !toggleBtn.contains(target)) {
        toggleChat(false);
      }
    });
  }

  document.addEventListener("DOMContentLoaded", initChatbot);
})();
