console.log("Welcome to Github Repo View");

default_user = "CODEatlasind";
default_repos_per_pages = 10;
currentPage = 1;

var reposPerPage = default_repos_per_pages;
var username = default_user;

//Initial render of default user with default number of pages
getUserInfo(username);
getUserRepos(username, currentPage, reposPerPage);

// When the render button is pressed the current user is replaced by the new user(Refresh of User as well as the repos list)
$("#user-search").on("click", function refreshUI() {
  refreshUser();
  refreshRepos();
  username = $("#username").val();
  currentPage = 1;
  getUserInfo(username);
  getUserRepos(username, currentPage, reposPerPage);
});

// Pagenation for next and previous pages
function nextPage() {
  refreshRepos();
  currentPage++;
  $("#currentPage").val = currentPage;
  getUserRepos(username, currentPage, reposPerPage);
}
function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    refreshRepos();
    $("#currentPage").val = currentPage;
    getUserRepos(username, currentPage, reposPerPage);
  } else {
    console.log("Can't go backwards");
  }
}

//restructure the number of listings on the DOM to number specified by the user within the range of 1000
$("#rep-re-structure").on("click", function refreshRepoStructure() {
  refreshRepos();
  reposPerPage = $("#repos-per-pages").val;
  currentPage = 1;
  getUserRepos(username, currentPage, reposPerPage);
});

//Search A repo in the list
$("#repo-search").on("click", function searchRepositories() {
  refreshRepos();
  searchQuery = $('#search-bar').val();
  console.log(typeof(searchQuery));
  getUserReposForSearch(username,searchQuery.toLowerCase());
        
});

//Looks up for the user in through the Github API
function getUserInfo(username) {
  const userContainer = document.getElementById("user-description");

  fetch(`https://api.github.com/users/${username}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    }) //Display the contents of the user using markup-injection
    .then((userDetail) => {
      const userDescription = document.createElement("div");
      userDescription.className = "user-container";
      userDescription.innerHTML = `
              <img src="${userDetail.avatar_url
        }" alt="User Avatar" class="avatar">
              <div class="user-info">
                  <h4>${userDetail.login}</h4>
                  <h1>${userDetail.name || "No name available"}</h1>
                  <p>${userDetail.bio || "No bio available"}</p>
                  <p>Github: <a href="${userDetail.html_url}" target="_blank"><img src="assets/Logo/link-45deg.svg" alt="link-logo"> ${userDetail.html_url
        }</a></p>
                  <p>Twitter: <a href="https://twitter.com/${userDetail.twitter_username
        }" target="_blank">${userDetail.twitter_username || "Twitter Unavailable"
        }</a></p>
              </div>
          `;
      userContainer.appendChild(userDescription);
    })
    .catch((error) => {
      console.error("Error fetching user information:", error);
    });
}

//Lists out the user's repositories using specified endpoints attached to the original API
function getUserRepos(username, page, perPage) {
  const reposList = document.getElementById("repo-list");
  const currentPageElement = document.getElementById("currentPage");

  const apiUrl = `https://api.github.com/users/${username}/repos?page=${page}&per_page=${perPage}`;

  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    }) //Display the contents of the user using markup-injection but with pagination
    .then((repos) => {
      if (repos.length === 0) {
        const noReposMessage = document.createElement("h1");
        noReposMessage.classList.add("text-center");
        noReposMessage.textContent = "No more repositories found!!";
        reposList.appendChild(noReposMessage);
      } else {
        repos.forEach((repo) => {
          const repoItem = document.createElement("div");
          repoItem.className = "repo-element";
          repoItem.innerHTML = `
                  <h2 class="repo-head">${repo.name}</h2>
                  <p class="repo-description">Description: ${repo.description || "No description available"
            }</p>
                  <div class="repo-language">
                <p>Languages:</p>
                <ul class="language-collection">
                  ${repo.language
              ? `<li class="language-element">${repo.language}</li>`
              : "Not Specified"
            }
                </ul>
              `;
          reposList.appendChild(repoItem);
        });

        currentPageElement.textContent = currentPage;
      }
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });
}
function getUserReposForSearch(username, searchQuery) {
  const reposList = document.getElementById("repo-list");
  // const currentPageElement = document.getElementById("currentPage");

  const apiUrl = `https://api.github.com/users/${username}/repos`;

  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    }) //Display the contents of the user using markup-injection but with pagination
    .then((repos) => {
      const filteredRepos = repos.filter(repo =>
        repo.name.toLowerCase().includes(searchQuery)
        // console.log(repo.name+":"+searchQuery)
      );
      displayUserReposForSearch(filteredRepos);
    })
    .catch((error) => {
      console.error("There was a problem with the fetch operation:", error);
    });
}

function displayUserReposForSearch(filteredRepos){
  const reposList = document.getElementById("repo-list");
  filteredRepos.forEach(repo => {
    const repoItem = document.createElement("div");
    repoItem.className = "repo-element";
    repoItem.innerHTML = `
    <h2 class="repo-head">${repo.name}</h2>
    <p class="repo-description">Description: ${repo.description || "description Unavailable"
            }</p>
            <div class="repo-language">
                <p>Languages:</p>
                <ul class="language-collection">
                  ${repo.language
              ? `<li class="language-element">${repo.language}</li>`
              : "Not Specified"
            }
                </ul>
              `;
          reposList.appendChild(repoItem);
            });
}

// Clears up the repo list DOM
function refreshUser() {
  $(".user-container").remove();
}
// Clears up the users DOM
function refreshRepos() {
  $(".repo-element").remove();
}
