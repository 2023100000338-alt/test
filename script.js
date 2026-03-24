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
                <option value="1.5">1.5</option>
                <option value="2" selected>2</option>
                <option value="3" selected>3</option>
                <option value="4">4</option>
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