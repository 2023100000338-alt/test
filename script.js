let subjectCount = 0;



// Function to update the course count and total credits in real-time
function updateDashboard() {
    const rows = document.querySelectorAll("#subjectTable tr");
    const credits = document.querySelectorAll(".credit");
    
    // Update Total Course Count
    document.getElementById("stat-total-courses").innerText = rows.length;

    // Update Live Total Credits (Optional but professional)
    let totalCredits = 0;
    credits.forEach(c => {
        totalCredits += parseFloat(c.value);
    });
    document.getElementById("stat-credits").innerText = totalCredits.toFixed(1);
}

function addSubject() {
    subjectCount++;
    const row = document.createElement("tr");
    
    row.innerHTML = `
        <td data-label="Course">${subjectCount}</td> <td data-label="Credits">
            <select class="credit" onchange="updateDashboard()">
                <option value="1">1</option>
                <option value="1.5">1.5</option>
                <option value="2">2</option>
                <option value="3" selected>3</option>
            </select>
        </td>
        <td data-label="Grade">
            <select class="grade">
                <option value="4.00">A+ (4.00)</option>
                <option value="3.75">A (3.75)</option>
                <option value="3.50">A- (3.50)</option>
                <option value="3.25">B+ (3.25)</option>
                <option value="3.00">B (3.00)</option>
                <option value="2.75">B- (2.75)</option>
                <option value="2.50">C+ (2.50)</option>
                <option value="2.25">C (2.25)</option>
                <option value="2.00">D (2.00)</option>
            </select>
        </td>
        <td data-label="Action">
            <button class="btn-delete" onclick="removeSubject(this)">Remove</button>
        </td>
    `;
    document.getElementById("subjectTable").appendChild(row);
    updateDashboard(); // Update count when adding
}

function removeSubject(btn) {
    btn.closest('tr').remove();
    updateDashboard(); // Update count when removing
    
    // Also recalculate the row numbers (1, 2, 3...)
    const rows = document.querySelectorAll("#subjectTable tr");
    rows.forEach((row, index) => {
        row.cells[0].innerText = index + 1;
    });
    
}
function addGpaRow() {
    const row = document.createElement("tr");

    // CRITICAL: Each <td> MUST have data-label for mobile view to show text
    row.innerHTML = `
        <td data-label="Marks (%)"><input type="number" class="marks" placeholder="Enter %" oninput="calculateGPA()" /></td>
        <td data-label="Grade" class="grade">-</td>
        <td data-label="Point" class="point">0.00</td>
        <td data-label="Action">
            <button class="btn-delete" onclick="removeSubject(this)">Remove</button>
        </td>
    `;

    document.getElementById("gpaTable").appendChild(row);
}

// function removeSubject(btn) {
//     btn.closest('tr').remove();
//     // Optional: If you want the top stats to hide when everything is deleted
//     if (document.querySelectorAll("tr.subject-row").length === 0) {
//         document.getElementById("result-box").style.display = "none";
//     }
// }

function calculateCGPA() {
    const credits = document.querySelectorAll(".credit");
    const grades = document.querySelectorAll(".grade");

    let totalCredits = 0;
    let weightedSum = 0;

    if (credits.length === 0) {
        alert("Please add at least one subject first.");
        return;
    }

    credits.forEach((c, i) => {
        const creditValue = parseFloat(c.value);
        const gradeValue = parseFloat(grades[i].value);
        totalCredits += creditValue;
        weightedSum += (creditValue * gradeValue);
    });

    // Update Dashboard Numbers
    document.getElementById("stat-credits").innerText = totalCredits.toFixed(1);
    
    const cgpa = (weightedSum / totalCredits).toFixed(2);
    document.getElementById("stat-cgpa").innerText = cgpa;

    // Show Result Box ONLY NOW (on button click)
    const resultBox = document.getElementById("result-box");
    const progressBar = document.getElementById("progress-bar");
    
    resultBox.style.display = "block";
    
    // Animate Progress Bar
    const percentage = ((cgpa - 2) / 2) * 100; 
    progressBar.style.width = Math.max(10, Math.min(percentage, 100)) + "%";
    
    document.getElementById("result-text").innerHTML = `Calculated CGPA: <strong>${cgpa}</strong>`;
    
    // Smooth scroll to result on mobile
    resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    
}

window.onload = addSubject;

function showCGPA() {
    document.getElementById("cgpa-section").style.display = "block";
    document.getElementById("gpa-section").style.display = "none";
}

function showGPA() {
    document.getElementById("cgpa-section").style.display = "none";
    document.getElementById("gpa-section").style.display = "block";
}
// function addGpaRow() {
//     const row = document.createElement("tr");

//     row.innerHTML = `
//         <td><input type="number" class="marks" placeholder="Enter %" /></td>
//         <td class="grade">-</td>
//         <td class="point">0.00</td>
//         <td>
//     <button class="btn-delete" onclick="removeSubject(this)">
//         <span style="font-size: 1.1rem; line-height: 0;"></span> Remove
//     </button>
//      </td>
//     `;

//     document.getElementById("gpaTable").appendChild(row);
// }
function getGrade(mark) {
    if (mark >= 80) return ["A+", 4.00];
    if (mark >= 75) return ["A", 3.75];
    if (mark >= 70) return ["A-", 3.50];
    if (mark >= 65) return ["B+", 3.25];
    if (mark >= 60) return ["B", 3.00];
    if (mark >= 55) return ["B-", 2.75];
    if (mark >= 50) return ["C+", 2.50];
    if (mark >= 45) return ["C", 2.25];
    if (mark >= 40) return ["D", 2.00];
    return ["F", 0.00];
}
function calculateGPA() {
    const rows = document.querySelectorAll("#gpaTable tr");

    if (rows.length === 0) {
        alert("Add subject first!");
        return;
    }

    let total = 0;
    let validSubjectCount = 0;

    rows.forEach(row => {
        const marksInput = row.querySelector(".marks");
        const marks = parseFloat(marksInput.value);

        // 1. Logic Check: Must be a number AND between 0 and 100
        if (!isNaN(marks) && marks >= 0 && marks <= 100) {
            const [grade, point] = getGrade(marks);

            row.querySelector(".grade").innerText = grade;
            row.querySelector(".point").innerText = point.toFixed(2);
            
            // Remove any error styling if it was there
            marksInput.style.borderColor = ""; 

            total += point;
            validSubjectCount++;
        } else {
            // 2. Handle Invalid Input (Optional: highlight the box red)
            row.querySelector(".grade").innerText = "Invalid";
            row.querySelector(".point").innerText = "0.00";
            marksInput.style.borderColor = "var(--danger)"; 
        }
    });

    // 3. Final Calculation Logic
    if (validSubjectCount > 0) {
        const gpa = (total / validSubjectCount).toFixed(2);
        document.getElementById("gpa-value").innerText = gpa;
        document.getElementById("gpa-subjects").innerText = validSubjectCount;
    } else {
        document.getElementById("gpa-value").innerText = "0.00";
        document.getElementById("gpa-subjects").innerText = "0";
    }
}
window.onload = () => {
    addSubject(); // CGPA
    addGpaRow();  // GPA
};

// These match your original CSS perfectly
const DEFAULT_PRIMARY = "#2563eb"; // Modern Professional Blue
const DEFAULT_BG = "#ffffff";     // Clean Pure White
function updateTheme() {
    const primaryPicker = document.getElementById('primaryColorPicker');
    const bgPicker = document.getElementById('bgPicker');
    const root = document.documentElement;

    // Get values from pickers
    const primaryColor = primaryPicker.value;
    const bgColor = bgPicker.value;

    // 1. Apply Brand Color
    root.style.setProperty('--primary', primaryColor);
    
    // 2. Apply Background Color
    root.style.setProperty('--bg-main', bgColor);
    
    // 3. Create the Gradient (Light to Dark version of the picked color)
    const darkShade = adjustColor(primaryColor, -20);
    root.style.setProperty('--gradient-primary', `linear-gradient(135deg, ${primaryColor} 0%, ${darkShade} 100%)`);

    // 4. Check for Dark Mode Contrast
    if (isDark(bgColor)) {
        document.body.classList.add('dark-theme-text');
    } else {
        document.body.classList.remove('dark-theme-text');
    }

    // 5. Save choices to browser memory
    localStorage.setItem('user_theme_primary', primaryColor);
    localStorage.setItem('user_theme_bg', bgColor);
}

// Function to go back to your original design
function resetTheme() {
    localStorage.removeItem('user_theme_primary');
    localStorage.removeItem('user_theme_bg');
    
    document.getElementById('primaryColorPicker').value = DEFAULT_PRIMARY;
    document.getElementById('bgPicker').value = DEFAULT_BG;
    
    updateTheme();
}

// Initializing the page
window.onload = () => {
    // Add the starting rows for the calculators
    addSubject(); 
    addGpaRow();

    // Check if user has a preference saved
    const savedPrimary = localStorage.getItem('user_theme_primary');
    const savedBg = localStorage.getItem('user_theme_bg');

    if (savedPrimary && savedBg) {
        // If they saved a color before, load it
        document.getElementById('primaryColorPicker').value = savedPrimary;
        document.getElementById('bgPicker').value = savedBg;
    } else {
        // Otherwise, make sure the pickers show the DEFAULT colors
        document.getElementById('primaryColorPicker').value = DEFAULT_PRIMARY;
        document.getElementById('bgPicker').value = DEFAULT_BG;
    }

    // Apply the theme (either saved or default)
    updateTheme();
};

// --- Keep your adjustColor and isDark functions below this ---
function adjustColor(hex, percent) {
    var num = parseInt(hex.replace("#",""),16), amt = Math.round(2.55 * percent), R = (num >> 16) + amt, G = (num >> 8 & 0x00FF) + amt, B = (num & 0x0000FF) + amt;
    return "#" + (0x1000000 + (R<255?R<1?0:R:255)*0x10000 + (G<255?G<1?0:G:255)*0x100 + (B<255?B<1?0:B:255)).toString(16).slice(1);
}

function isDark(color) {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return brightness < 128;
}