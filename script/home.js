// All variables

const allBtn = document.getElementById ("allBtn");
const openBtn = document.getElementById ("openBtn");
const closedBtn = document.getElementById ("closedBtn");
const issueContainer = document.getElementById ("issueContainer");
const issueCount = document.getElementById ("issueCount");

const issueModal = document.getElementById ("issueModal");
const modalContent = document.getElementById ("modalContent");

let allIssues = [];
let currentFilter = "all";

// all issues load here
async function loadIssues() {
  try {
    const response = await fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues");
    const data = await response.json();

    allIssues = data.data || [];
    showIssues(allIssues);
  } catch (error) {
    console.log(error);
    issueContainer.innerHTML = `<p>Failed to load issues</p>`;
  }
}

// view issues 
function showIssues(issues) {
  issueContainer.innerHTML = "";
  issueCount.innerText = issues.length;

  if (issues.length == 0) {
    issueContainer.innerHTML = `<p>No issues found</p>`;
    return;
  }

  // card functions and data

  issues.forEach (function (issue) {
    const div = document.createElement("div");

    div.className = `card bg-base-100 shadow-sm border-t-[5px] ${
      issue.status == "open" ? "border-green-500" : "border-purple-500"
    } rounded-2xl cursor-pointer`;

    div.innerHTML = `
      <div class="card-body gap-5">
        <div class="flex justify-between">
          <img class="min-w-10" src="${ issue.status == "open" ? "./images/Open-Status.png" : "./images/Closed-Status.png"
          }" alt="">

          <div class="btn rounded-3xl ${
            issue.priority == "high" ? "bg-[#feecec] text-[#EF4444]" : issue.priority == "medium" ? "bg-[#fff8db] text-[#D97706]" : "bg-[#F1F5F9] text-[#64748B]"
          } text-[12px] px-9 border-0 shadow-none ">
            ${(issue.priority || "No Priority").toUpperCase()}
          </div>
        </div>

        <h2 class="card-title"> ${issue.title || "No Title"}</h2>
        <p>${issue.description || "No Description"}</p>

        <div class="card-actions justify-start">
          ${ issue.labels && issue.labels[0] ? `<div class="btn rounded-3xl bg-[#feecec] border border-[#EF4444] text-[12px] text-[#EF4444]">
                   <img src="./images/BugDroid.svg" alt=""> ${issue.labels[0].toUpperCase()}
                 </div>`: ""
          }

          ${
            issue.labels && issue.labels[1]
              ? `<div class="btn rounded-3xl bg-[#fff8db] border border-[#D97706] text-[12px] text-[#D97706]">
                   <img src="./images/Lifebuoy.svg" alt="">
                   ${issue.labels[1].toUpperCase()}
                 </div>`
              : ""
          }
        </div>

        <hr class="bg-[#64748B]>

        <div>
          <p class="text-[12px] text-[#64748B]">${issue.author || "No Author"}</p>
          <p class="text-[12px] text-[#64748B]">${formatDate(issue.createdAt)}</p>
        </div>
      </div>
    `;

    div.addEventListener("click", function () {
      openIssueModal(issue);
    });

    issueContainer.appendChild(div);
  });
}

// modal part
function openIssueModal(issue) {
  let labelsHtml = "";

  if (issue.labels && issue.labels.length > 0) {
    issue.labels.forEach(function (label) {
      if (label.toLowerCase() == "bug") {
        labelsHtml += `
          <span class="inline-flex items-center rounded-full border border-[#F5B5B5] bg-[#FFF1F1] px-5 py-2 text-[12px] font-medium text-[#EF4444]">
            <img class="mr-2" src="./images/BugDroid.svg" alt="">
            ${label.toUpperCase()}
          </span>
        `;
      } else if (label.toLowerCase() == "help wanted") {
        labelsHtml += `
          <span class="inline-flex items-center rounded-full border border-[#F4D06F] bg-[#FFF8E6] px-5 py-2 text-[12px] font-medium text-[#D97706]">
            <img class="mr-2" src="./images/Lifebuoy.svg" alt="">
            ${label.toUpperCase()}
          </span>
        `;
      } else {
        labelsHtml += `
          <span class="inline-flex items-center rounded-full border px-5 py-2 text-[18px] font-medium text-[#64748B]">
            ${label}
          </span>
        `;
      }
    });
  }

  modalContent.innerHTML = `
    <div class="max-w-[900px] rounded-[24px] bg-[#F8F8F8] p-[30px] shadow-sm">
      
      <h2 class="text-[24px] font-bold text-[#1F2937]">
        ${issue.title || "No Title"}
      </h2>

      <div class="mt-8 flex flex-wrap items-center gap-2 text-[12px] text-[#64748B]">
        <span class="flex items-center rounded-full ${
          issue.status == "open" ? "bg-[#10B981]" : "bg-[#A855F7]"
        } px-5 py-2 text-[12px] font-medium text-white">
          ${issue.status == "open" ? "Opened" : "Closed"}
        </span>
        <span>•</span>
        <span>Opened by ${issue.author || "No Author"}</span>
        <span>•</span>
        <span>${formatDate(issue.createdAt)}</span>
      </div>

      <div class="mt-10 flex flex-wrap gap-2">
        ${labelsHtml}
      </div>

      <p class="mt-12 max-w-[900px] text-[16px] text-[#64748B]">
        ${issue.description || "No Description"}
      </p>

      <div class="mt-12 rounded-[20px] bg-[#F1F5F9] px-7 py-8">
        <div class="grid grid-cols-1 gap-8 md:grid-cols-2">
          
          <div>
            <p class="text-[16px] text-[#64748B]">Assignee:</p>
            <p class="mt-2 text-[16px] font-semibold text-[#1F2937]">
              ${issue.assignee || "No Assignee"}
            </p>
          </div>

          <div>
            <p class="text-[16px] text-[#64748B]">Priority:</p>
            <div class="mt-3">
              <span class="inline-flex min-w-[94px] justify-center rounded-full ${
                issue.priority == "high"
                  ? "bg-[#EF4444] text-white"
                  : issue.priority == "medium"
                  ? "bg-[#F59E0B] text-white"
                  : "bg-[#CBD5E1] text-[#334155]"
              } px-6 py-2 text-[12px] font-medium">
                ${(issue.priority || "No Priority").toUpperCase()}
              </span>
            </div>
          </div>

        </div>
      </div>

      <div class="mt-10 flex justify-end">
        <button id="closeModalBtn" class="btn border-0 rounded-[10px] bg-[#4F08FF] px-10 text-[16px] font-semibold text-white shadow-none hover:bg-[#4300e6]">
          Close
        </button>
      </div>
    </div>
  `;

  issueModal.classList.remove("hidden");
  issueModal.classList.add("flex");

  document.getElementById("closeModalBtn").addEventListener("click", closeIssueModal);
}

// modal close
function closeIssueModal() {
  issueModal.classList.add("hidden");
  issueModal.classList.remove("flex");
  modalContent.innerHTML = "";
}


// date
function formatDate(dateString) {
  if (!dateString) {
    return "No Date";
  }

  const date = new Date(dateString);
  return date.toLocaleDateString();
}

// filter
function filterIssues(status) {
  currentFilter = status;
  updateButtonStyle(status);

  if (status == "all") {
    showIssues(allIssues);
  } else {
    const filteredIssues = allIssues.filter(function (issue) {
      return issue.status && issue.status.toLowerCase() == status;
    });

    showIssues(filteredIssues);
  }
}

function updateButtonStyle(status) {
  allBtn.classList.remove("bg-blue-600", "text-white");
  openBtn.classList.remove("bg-blue-600", "text-white");
  closedBtn.classList.remove("bg-blue-600", "text-white");

  if (status == "all") {
    allBtn.classList.add("bg-blue-600", "text-white");
  }

  if (status == "open") {
    openBtn.classList.add("bg-blue-600", "text-white");
  }

  if (status == "closed") {
    closedBtn.classList.add("bg-blue-600", "text-white");
  }
}

allBtn.addEventListener("click", function () {
  filterIssues("all");
});

openBtn.addEventListener("click", function () {
  filterIssues("open");
});

closedBtn.addEventListener("click", function () {
  filterIssues("closed");
});

loadIssues();
updateButtonStyle("all");