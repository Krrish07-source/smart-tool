/* ==========================================================================
   1. GLOBAL SELECTORS & VARIABLES
   ========================================================================== */
const dropZone = document.getElementById("dropZone");
const csvInput = document.getElementById("csvFile");
const generateBtn = document.getElementById("generateBtn");
const logoInput = document.getElementById("logoInput");

let employeeData = [];
let logoBase64 = "";

/* ==========================================================================
   2. DRAG & DROP + CLICK EVENT HANDLERS
   ========================================================================== */

/* Open File Browser on Click */
dropZone.addEventListener("click", () => {
    csvInput.click();
});

/* Drag Effects */
dropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropZone.style.borderColor = "#00e5ff";
});

dropZone.addEventListener("dragleave", () => {
    dropZone.style.borderColor = "rgba(255,255,255,0.2)";
});

dropZone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropZone.style.borderColor = "rgba(255,255,255,0.2)";
    const file = e.dataTransfer.files[0];
    if (file) processCSV(file);
});

/* Native File Input Picker */
csvInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) processCSV(file);
});

/* ==========================================================================
   3. COMPANY LOGO UPLOAD & LIVE VIEW SYNC
   ========================================================================== */
logoInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(event){
        logoBase64 = event.target.result;
        
        // BUG FIX: Update the live dashboard preview card avatar instantly!
        const liveAvatar = document.querySelector(".avatar");
        if (liveAvatar) {
            liveAvatar.src = logoBase64;
        }
    };
    reader.readAsDataURL(file);
});

/* ==========================================================================
   4. PapaParse CSV PROCESSING ENGINE
   ========================================================================== */
function processCSV(file){
    Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: function(results){
            employeeData = results.data;
            
            // Sync status on the top bar
            const statusDiv = document.querySelector(".status");
            if (statusDiv) {
                statusDiv.innerText = `${employeeData.length} Loaded`;
                statusDiv.style.color = "#00ff88";
                statusDiv.style.borderColor = "#00ff884D";
            }
            
            alert(`${employeeData.length} employees imported successfully!`);
            console.log("SignifyPro Loaded Data Target:", employeeData);
        }
    });
}

/* ==========================================================================
   5. BULK EXPORT ZIP ARCHIVE GENERATOR
   ========================================================================== */
generateBtn.addEventListener("click", async () => {
    if(employeeData.length === 0){
        alert("Upload CSV file first!");
        return;
    }

    const zip = new JSZip();
    const company = document.getElementById("companyName").value || "SignifyPro Enterprise";
    const color = document.getElementById("brandColor").value;

    employeeData.forEach((employee, index) => {
        // Generate raw responsive email markup
        const html = generateSignature(employee, company, color);
        
        // BUG FIX: Sanitize filename to prevent breaking paths or crashing Windows explorer
        const rawName = employee.name || `employee-${index}`;
        const safeFilename = rawName.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase() + ".html";

        zip.file(safeFilename, html);
    });

    // Process asynchronous compression
    const content = await zip.generateAsync({ type: "blob" });
    
    // Smooth Anchor download workflow
    const link = document.createElement("a");
    link.href = URL.createObjectURL(content);
    
    const safeCompanyName = company.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase();
    link.download = `${safeCompanyName}-signatures.zip`;
    link.click();
});

/* ==========================================================================
   6. ENTERPRISE EMAIL SIGNATURE RAW TEMPLATE
   ========================================================================== */
function generateSignature(employee, company, color){
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
</head>
<body style="margin:0; padding:0;">
    <table cellpadding="0" cellspacing="0" style="font-family: Arial, sans-serif; width: 600px; border-collapse: collapse; background: #ffffff; border-radius: 14px; overflow: hidden; margin: 15px auto;">
        <tr>
            <td style="padding: 25px; width: 110px; background: #f8fafc; text-align: center; vertical-align: middle;">
                <img src="${logoBase64 || 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png'}" 
                     style="width: 90px; height: 90px; border-radius: 50%; object-fit: cover; display: block; border: 3px solid ${color}; margin: 0 auto;"
                />
            </td>
            <td style="padding: 25px; vertical-align: middle;">
                <h2 style="margin: 0; color: ${color}; font-size: 24px; font-weight: 700;">
                    ${employee.name || 'Employee Name'}
                </h2>
                <p style="margin: 4px 0 0 0; color: #64748b; font-size: 14px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px;">
                    ${employee.role || 'Team Member'}
                </p>
                
                <div style="width: 100%; height: 2px; background: ${color}; margin: 14px 0; border-radius: 10px;"></div>
                
                <table cellpadding="0" cellspacing="0" style="font-size: 13px; color: #334155; line-height: 22px;">
                    ${employee.email ? `<tr><td><strong>Email:</strong> ${employee.email}</td></tr>` : ''}
                    ${employee.phone ? `<tr><td><strong>Phone:</strong> ${employee.phone}</td></tr>` : ''}
                    <tr><td><strong>Company:</strong> ${company}</td></tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
`;
}