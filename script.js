let subjectCount = 0;

function addSubject() {
    subjectCount++;

    const row = document.createElement("tr");

    row.innerHTML = `
        <td>Subject ${subjectCount}</td>

        <td>
            <select class="credit">
                <option value="">Select</option>
                <option value="1">1</option>
                <option value="3">3</option>
            </select>
        </td>

        <td>
            <select class="grade">
                <option value="">Select</option>
                <option value="2.00">2.00</option>
                <option value="2.25">2.25</option>
                <option value="2.50">2.50</option>
                <option value="2.75">2.75</option>
                <option value="3.00">3.00</option>
                <option value="3.25">3.25</option>
                <option value="3.50">3.50</option>
                <option value="3.75">3.75</option>
                <option value="4.00">4.00</option>
            </select>
        </td>

        <td>
            <button onclick="removeSubject(this)">❌</button>
        </td>
    `;

    document.getElementById("subjectTable").appendChild(row);
}

function removeSubject(btn) {
    btn.parentElement.parentElement.remove();
}

function calculateCGPA() {
    const credits = document.querySelectorAll(".credit");
    const grades = document.querySelectorAll(".grade");

    let totalCredits = 0;
    let weightedSum = 0;

    for (let i = 0; i < credits.length; i++) {
        const credit = parseFloat(credits[i].value);
        const grade = parseFloat(grades[i].value);

        if (isNaN(credit) || isNaN(grade)) {
            alert("Please select credit and grade for all subjects");
            return;
        }

        totalCredits += credit;
        weightedSum += credit * grade;
    }

    const cgpa = (weightedSum / totalCredits).toFixed(2);

    document.getElementById("result").innerText =
        `Your CGPA is: ${cgpa}`;
}
