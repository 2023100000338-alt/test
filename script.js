let subjectCount = 0;

// Function to update the course count and total credits in real-time
function updateDashboard() {
    const rows = document.querySelectorAll("#subjectTable tr");
    const credits = document.querySelectorAll(".credit");
    
    // Update Total Course Count
    document.getElementById("stat-total-courses").innerText = rows.length;

    // Update Live Total Credits
    let totalCredits = 0;
    credits.forEach(c => {
        totalCredits += parseFloat(c.value) || 0;
    });
    document.getElementById("stat-credits").innerText = totalCredits.toFixed(1);
}

function addSubject() {
    subjectCount++;
    const row = document.createElement("tr");
    
    row.innerHTML = `
        <td data-label="Course">Course ${subjectCount}</td>
        <td data-label="Credits">
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
                <option value="0.00">F (0.00)</option>
            </select>
        </td>
        <td data-label="Action">
            <button class="btn-delete" onclick="removeSubject(this)">Remove</button>
        </td>
    `;
    document.getElementById("subjectTable").appendChild(row);
    updateDashboard();
}

function removeSubject(btn) {
    btn.closest('tr').remove();
    updateDashboard();
    
    // Renumber courses
    const rows = document.querySelectorAll("#subjectTable tr");
    rows.forEach((row, index) => {
        row.cells[0].innerText = `Course ${index + 1}`;
    });
}

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

    // Show Result Box
    const resultBox = document.getElementById("result-box");
    const progressBar = document.getElementById("progress-bar");
    
    resultBox.style.display = "block";
    
    // Animate Progress Bar (CGPA out of 4.0)
    const percentage = (parseFloat(cgpa) / 4.0) * 100;
    progressBar.style.width = Math.min(percentage, 100) + "%";
    
    let resultMessage = "";
    let cgpaNum = parseFloat(cgpa);
    if (cgpaNum >= 3.5) resultMessage = "🌟 Excellent! Outstanding performance!";
    else if (cgpaNum >= 3.0) resultMessage = "👍 Good! Keep it up!";
    else if (cgpaNum >= 2.5) resultMessage = "📚 Satisfactory. You can do better!";
    else if (cgpaNum >= 2.0) resultMessage = "⚠️ Needs improvement. Stay focused!";
    else resultMessage = "❌ Low CGPA. Seek academic support.";
    
    document.getElementById("result-text").innerHTML = `🎯 Calculated CGPA: <strong>${cgpa}</strong><br><small>${resultMessage}</small>`;
    
    // Smooth scroll to result on mobile
    resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// GPA Functions
function addGpaRow() {
    const row = document.createElement("tr");
    row.innerHTML = `
        <td data-label="Marks (%)"><input type="number" class="marks" placeholder="Enter % (0-100)" oninput="calculateGPA()" /></td>
        <td data-label="Grade" class="grade">-</td>
        <td data-label="Point" class="point">0.00</td>
        <td data-label="Action">
            <button class="btn-delete" onclick="removeGpaRow(this)">Remove</button>
        </td>
    `;
    document.getElementById("gpaTable").appendChild(row);
}

function removeGpaRow(btn) {
    btn.closest('tr').remove();
    calculateGPA();
}

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
        document.getElementById("gpa-value").innerText = "0.00";
        document.getElementById("gpa-subjects").innerText = "0";
        return;
    }

    let total = 0;
    let validSubjectCount = 0;

    rows.forEach(row => {
        const marksInput = row.querySelector(".marks");
        const marks = parseFloat(marksInput.value);

        if (!isNaN(marks) && marks >= 0 && marks <= 100) {
            const [grade, point] = getGrade(marks);
            row.querySelector(".grade").innerText = grade;
            row.querySelector(".point").innerText = point.toFixed(2);
            marksInput.style.borderColor = "";
            total += point;
            validSubjectCount++;
        } else if (marksInput.value !== "") {
            row.querySelector(".grade").innerText = "Invalid";
            row.querySelector(".point").innerText = "0.00";
            marksInput.style.borderColor = "var(--danger)";
        } else {
            row.querySelector(".grade").innerText = "-";
            row.querySelector(".point").innerText = "0.00";
            marksInput.style.borderColor = "";
        }
    });

    if (validSubjectCount > 0) {
        const gpa = (total / validSubjectCount).toFixed(2);
        document.getElementById("gpa-value").innerText = gpa;
        document.getElementById("gpa-subjects").innerText = validSubjectCount;
    } else {
        document.getElementById("gpa-value").innerText = "0.00";
        document.getElementById("gpa-subjects").innerText = "0";
    }
}

// Mode Switching
function showCGPA() {
    document.getElementById("cgpa-section").style.display = "block";
    document.getElementById("gpa-section").style.display = "none";
    document.getElementById("cgpaModeBtn").classList.add("btn-primary");
    document.getElementById("cgpaModeBtn").classList.remove("btn-secondary");
    document.getElementById("gpaModeBtn").classList.add("btn-secondary");
    document.getElementById("gpaModeBtn").classList.remove("btn-primary");
}

function showGPA() {
    document.getElementById("cgpa-section").style.display = "none";
    document.getElementById("gpa-section").style.display = "block";
    document.getElementById("gpaModeBtn").classList.add("btn-primary");
    document.getElementById("gpaModeBtn").classList.remove("btn-secondary");
    document.getElementById("cgpaModeBtn").classList.add("btn-secondary");
    document.getElementById("cgpaModeBtn").classList.remove("btn-primary");
}

// Theme Functions
const DEFAULT_PRIMARY = "#2563eb";
const DEFAULT_BG = "#ffffff";

function updateTheme() {
    const primaryPicker = document.getElementById('primaryColorPicker');
    const bgPicker = document.getElementById('bgPicker');
    const root = document.documentElement;

    const primaryColor = primaryPicker.value;
    const bgColor = bgPicker.value;

    root.style.setProperty('--primary', primaryColor);
    root.style.setProperty('--bg-main', bgColor);
    root.style.setProperty('--surface', bgColor === '#1e293b' ? '#1e293b' : '#ffffff');
    root.style.setProperty('--surface-alt', bgColor === '#1e293b' ? '#0f172a' : '#f8fafc');

    const darkShade = adjustColor(primaryColor, -20);
    root.style.setProperty('--primary-dark', darkShade);

    if (isDark(bgColor)) {
        document.body.classList.add('dark-theme-text');
        root.setAttribute('data-theme', 'dark');
    } else {
        document.body.classList.remove('dark-theme-text');
        root.setAttribute('data-theme', 'light');
    }

    localStorage.setItem('user_theme_primary', primaryColor);
    localStorage.setItem('user_theme_bg', bgColor);
}

function resetTheme() {
    localStorage.removeItem('user_theme_primary');
    localStorage.removeItem('user_theme_bg');
    
    document.getElementById('primaryColorPicker').value = DEFAULT_PRIMARY;
    document.getElementById('bgPicker').value = DEFAULT_BG;
    
    updateTheme();
}

function adjustColor(hex, percent) {
    let num = parseInt(hex.replace("#", ""), 16);
    let amt = Math.round(2.55 * percent);
    let R = (num >> 16) + amt;
    let G = ((num >> 8) & 0x00FF) + amt;
    let B = (num & 0x0000FF) + amt;
    R = Math.min(255, Math.max(0, R));
    G = Math.min(255, Math.max(0, G));
    B = Math.min(255, Math.max(0, B));
    return "#" + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
}

function isDark(color) {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return brightness < 128;
}

// Initialize on page load
window.onload = () => {
    addSubject();
    addGpaRow();

    const savedPrimary = localStorage.getItem('user_theme_primary');
    const savedBg = localStorage.getItem('user_theme_bg');

    if (savedPrimary && savedBg) {
        document.getElementById('primaryColorPicker').value = savedPrimary;
        document.getElementById('bgPicker').value = savedBg;
    } else {
        document.getElementById('primaryColorPicker').value = DEFAULT_PRIMARY;
        document.getElementById('bgPicker').value = DEFAULT_BG;
    }

    updateTheme();
    showCGPA();
};