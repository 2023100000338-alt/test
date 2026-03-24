let subjectCount = 0;

// Predefined Demo Subjects for Professional Look
const courseSuggestions = [
    "Introduction to Programming",
    "Data Structures",
    "Discrete Mathematics",
    "Business Communication",
    "Microeconomics",
    "Physics I",
    "English Composition"
];

function addSubject() {
    subjectCount++;
    const row = document.createElement("tr");
    
    // Generate Course Options
    const courseOptions = courseSuggestions.map(course => `<option value="${course}">${course}</option>`).join('');

    row.innerHTML = `
        <td>
            <select class="course-name">
                <option value="">-- Choose Course --</option>
                ${courseOptions}
                <option value="Custom">Other (Custom)</option>
            </select>
        </td>
        <td>
            <select class="credit" onchange="calculateCGPA()">
                <option value="1">1</option>
                
                <option value="3" selected>3</option>
        
            </select>
        </td>
        <td>
            <select class="grade" onchange="calculateCGPA()">
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
        <td>
            <button class="btn-delete" onclick="removeSubject(this)">Remove</button>
        </td>
    `;
    document.getElementById("subjectTable").appendChild(row);
    calculateCGPA(); // Initial update
}

function removeSubject(btn) {
    btn.closest('tr').remove();
    calculateCGPA();
}

function calculateCGPA() {
    const credits = document.querySelectorAll(".credit");
    const grades = document.querySelectorAll(".grade");

    let totalCredits = 0;
    let weightedSum = 0;

    credits.forEach((c, i) => {
        const creditValue = parseFloat(c.value);
        const gradeValue = parseFloat(grades[i].value);
        totalCredits += creditValue;
        weightedSum += (creditValue * gradeValue);
    });

    // Update Dashboard Numbers
    document.getElementById("stat-credits").innerText = totalCredits.toFixed(1);
    
    if (totalCredits === 0) {
        document.getElementById("stat-cgpa").innerText = "0.00";
        document.getElementById("result-box").style.display = "none";
        return;
    }

    const cgpa = (weightedSum / totalCredits).toFixed(2);
    document.getElementById("stat-cgpa").innerText = cgpa;

    // Progress Bar Animation
    const resultBox = document.getElementById("result-box");
    const progressBar = document.getElementById("progress-bar");
    resultBox.style.display = "block";
    
    // Scale: 4.0 = 100%, 2.0 = 0% (roughly)
    const percentage = ((cgpa - 2) / 2) * 100;
    progressBar.style.width = Math.max(10, percentage) + "%";
    
    document.getElementById("result-text").innerHTML = `Calculated CGPA: <strong>${cgpa}</strong>`;
}

// Start with 1 row on load
window.onload = addSubject;