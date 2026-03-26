let subjectCount = 0;

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
    
   
    // REMOVED: onchange="calculateCGPA()" from the select tags
    row.innerHTML = `
        
        <td>
            <select class="credit">
             <option value="1">1</option>
               <option value="2">2</option>
               <option value="3" selected>3</option>
            </select>
        </td>
        <td>
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
        <td>
            <button class="btn-delete" onclick="removeSubject(this)">Remove</button>
        </td>
    `;
    document.getElementById("subjectTable").appendChild(row);
}

function removeSubject(btn) {
    btn.closest('tr').remove();
    // Optional: If you want the top stats to hide when everything is deleted
    if (document.querySelectorAll("tr.subject-row").length === 0) {
        document.getElementById("result-box").style.display = "none";
    }
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
function addGpaRow() {
    const row = document.createElement("tr");

    row.innerHTML = `
        <td><input type="number" class="marks" placeholder="Enter %" /></td>
        <td class="grade">-</td>
        <td class="point">0.00</td>
        <td><button onclick="this.closest('tr').remove()">Remove</button></td>
    `;

    document.getElementById("gpaTable").appendChild(row);
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
        alert("Add subject first!");
        return;
    }

    let total = 0;

    rows.forEach(row => {
        const marks = parseFloat(row.querySelector(".marks").value);

        if (!isNaN(marks)) {
            const [grade, point] = getGrade(marks);

            row.querySelector(".grade").innerText = grade;
            row.querySelector(".point").innerText = point.toFixed(2);

            total += point;
        }
    });

    const gpa = (total / rows.length).toFixed(2);

    document.getElementById("gpa-value").innerText = gpa;
    document.getElementById("gpa-subjects").innerText = rows.length;
}
window.onload = () => {
    addSubject(); // CGPA
    addGpaRow();  // GPA
};