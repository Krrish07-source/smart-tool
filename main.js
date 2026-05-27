/* ==========================================================================
   1. DOM ELEMENTS DECLARATION
   ========================================================================== */
const brandColorInput = document.getElementById("brandColor");
const companyNameInput = document.getElementById("companyName");

// Preview Card Elements
const previewCard = document.querySelector(".preview-card");
const previewName = document.getElementById("previewName");
const previewRole = document.getElementById("previewRole");
const previewCompany = document.getElementById("previewCompany");
const previewLine = document.querySelector(".line");
const previewAvatar = document.querySelector(".avatar");

// Controllers
const templateButtons = document.querySelectorAll(".template-btn");

let activeTemplate = "modern";

/* ==========================================================================
   2. INTERACTIVE EVENT LISTENERS
   ========================================================================== */

/* Dynamic Brand Color Sync (Full Scope Engine) */
brandColorInput.addEventListener("input", (e) => {
    const currentHex = e.target.value;
    
    // 1. Divider line color update
    if (previewLine) previewLine.style.background = currentHex;
    
    // 2. Name heading color dynamically shifts with brand matching
    if (previewName) previewName.style.color = currentHex;
    
    // 3. Status badge border sync (Optional visual sugar)
    const statusBox = document.querySelector(".status");
    if (statusBox) statusBox.style.borderColor = currentHex + "4D"; // Adding transparency hex
});

/* Live Company Name Rendering */
companyNameInput.addEventListener("input", (e) => {
    if (previewCompany) {
        previewCompany.innerText = e.target.value.trim() !== "" ? e.target.value : "SignifyPro Enterprise";
    }
});

/* Template Switch Management */
templateButtons.forEach((button) => {
    button.addEventListener("click", () => {
        // Active button state styling management
        templateButtons.forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");

        // Core compilation trigger
        activeTemplate = button.dataset.template;
        applyTemplateLayout(activeTemplate);
    });
});

/* ==========================================================================
   3. ENTERPRISE LAYOUT SWITCH ENGINE
   ========================================================================== */
function applyTemplateLayout(template) {
    if (!previewCard) return;

    // Fetch the active color to maintain state persistence across switches
    const currentColor = brandColorInput.value;

    switch (template) {
        case "modern":
            // Premium Floating UI Design Setup
            previewCard.style.background = "#111827";
            previewCard.style.borderRadius = "26px";
            previewCard.style.padding = "35px";
            previewCard.style.flexDirection = "row";
            previewCard.style.textAlign = "left";
            previewCard.style.boxShadow = `0 20px 40px rgba(0, 0, 0, 0.4), 0 0 30px ${currentColor}1A`;
            
            if (previewAvatar) {
                previewAvatar.style.borderRadius = "50%";
                previewAvatar.style.border = `2px solid ${currentColor}`;
            }
            if (previewLine) previewLine.style.display = "block";
            break;

        case "minimal":
            // Clean, Flat Corporate Document Setup
            previewCard.style.background = "#0f172a";
            previewCard.style.borderRadius = "8px";
            previewCard.style.padding = "25px";
            previewCard.style.flexDirection = "row";
            previewCard.style.textAlign = "left";
            previewCard.style.boxShadow = "none";
            previewCard.style.border = "1px solid rgba(255, 255, 255, 0.1)";
            
            if (previewAvatar) {
                previewAvatar.style.borderRadius = "12px"; // Sleek rounded square edges
                previewAvatar.style.border = "none";
            }
            if (previewLine) previewLine.style.display = "block";
            break;

        case "corporate":
            // Center Stacked High-Profile Visual Branding Layout
            previewCard.style.background = "#1e293b";
            previewCard.style.borderRadius = "18px";
            previewCard.style.padding = "40px";
            previewCard.style.flexDirection = "column"; // Full structure stack swap
            previewCard.style.alignItems = "center";
            previewCard.style.textAlign = "center";
            previewCard.style.boxShadow = "0 25px 50px -12px rgba(0, 0, 0, 0.5)";
            
            if (previewAvatar) {
                previewAvatar.style.borderRadius = "50%";
                previewAvatar.style.border = `3px double ${currentColor}`;
            }
            // Hiding layout line to favor grid centering blocks
            if (previewLine) previewLine.style.display = "block";
            break;
            
        default:
            console.warn(`SignifyPro: Unknown layout configuration signature requested -> ${template}`);
    }
}