let globalPage = 1;
let thisPage = 1;
let totalPage = 0;

let allPages = 0;
let pageCount = 0;
let currentPage = 1;

let pagination = document.getElementsByClassName("pagination")[0];
let throttleTimer;

const cardContainer = document.getElementById("card-container");
const cardCountElem = document.getElementById("card-count");
const loader = document.getElementById("loader");

function followUser(e) {
  let id = e.getAttribute("data-id");
  axios.get(`https://rickandmortyapi.com/api/character/${id}`).then((res) => {
    document.getElementsByClassName(
      "passport_Name"
    )[0].textContent = `${res.data.name}`;
    document.getElementsByClassName(
      "passport_Origin"
    )[0].textContent = `${res.data.origin.name}`;
    document.getElementsByClassName(
      "passport_Status"
    )[0].textContent = `${res.data.status}`;
    document.getElementsByClassName(
      "passport_Location"
    )[0].textContent = `${res.data.location.name}`;
    document.getElementsByClassName(
      "passport_Species"
    )[0].textContent = `${res.data.species}`;
    document.getElementsByClassName(
      "passport_Gender"
    )[0].textContent = `${res.data.gender}`;
    document
      .getElementsByClassName("passportImg")[0]
      .childNodes[0].setAttribute("src", `${res.data.image}`);
    document
      .getElementsByClassName("passportImg")[0]
      .childNodes[0].setAttribute("width", "300em");
  });
}

function toggle(checkbox) {
  if (checkbox.checked) {
    localStorage.setItem("checkToggle", true);
    document.getElementsByClassName("pagination")[0].style.display = "flex";
    window.removeEventListener("scroll", handleInfiniteScroll, false);
    window.removeEventListener("scroll", scrollFunction, false);
    document.getElementsByClassName("lds-spinner")[0].style.display = "none";
    document.getElementsByClassName("cards")[0].textContent = "";
    document
      .querySelectorAll(".pagePagination")
      .forEach((elem) => elem.remove());
    document.querySelectorAll("#dot").forEach((elem) => elem.remove());
    paginationConnect(
      "https://rickandmortyapi.com/api/character/?page=",
      thisPage++
    );
  } else {
    localStorage.setItem("checkToggle", false);
    document.getElementsByClassName("cards")[0].textContent = "";
    addCards(1);
    document.getElementsByClassName("pagination")[0].style.display = "none";
    window.addEventListener("scroll", handleInfiniteScroll);
    window.addEventListener("scroll", scrollFunction);
  }
}

function createCard() {
  const card = document.createElement("div");
  cardContainer.appendChild(card);
}

function addCards(pageIndex) {
  currentPage = pageIndex;

  axios
    .get(`https://rickandmortyapi.com/api/character/?page=${pageIndex}`)
    .then((res) => {
      pageCount = res.data.info.pages;
      res.data.results.forEach((element) => {
        let cardsDiv = document.getElementsByClassName("cards")[0];
        let nameCharecter = (document.createElement(
          "span"
        ).textContent = `${element.name}`);
        cardsDiv.insertAdjacentHTML(
          "beforeEnd",
          `<div class="card" data-id=${element.id} onclick="followUser(this); return false;">
                <div class="cardContainer">
                <button type="button" class="btn btn-primary modal-hidden-button" data-bs-toggle="modal" data-bs-target="#exampleModal">
                </button>
                <img src="${element.image}" alt="${nameCharecter}" >
                <div class="characterName">${nameCharecter}</div>
                </div>
                </div>`
        );
      });
    });

  document.getElementsByClassName("lds-spinner")[0].style.display = "none";
}

const throttle = (callback, time) => {
  if (throttleTimer) return;

  throttleTimer = true;

  setTimeout(() => {
    callback();
    throttleTimer = false;
  }, time);
};

const handleInfiniteScroll = () => {
  console.log('event');
  throttle(() => {
    document.getElementsByClassName("lds-spinner")[0].style.display = "block";
    const endOfPage =
      window.innerHeight + window.pageYOffset >= document.body.offsetHeight;

    if (endOfPage) {
      addCards(currentPage + 1);
    }

    if (currentPage === pageCount) {
      document.getElementsByClassName("lds-spinner")[0].style.display = "none";
      removeInfiniteScroll();
    }
  }, 300);
};

const removeInfiniteScroll = () => {
  document.getElementsByClassName("lds-spinner")[0].style.display = "none";
  loader.remove();
  window.removeEventListener("scroll", handleInfiniteScroll);
};

function scrollFunction() {
  if (
    document.body.scrollTop > 300 ||
    document.documentElement.scrollTop > 300
  ) {
    document.getElementById("scroll_top").style.display = "block";
  } else {
    document.getElementById("scroll_top").style.display = "none";
  }
}

$(function () {
  $("#scroll_top").click(function () {
    $("html, body").animate({ scrollTop: 0 }, 600);
    return false;
  });
});

function clearContent() {
  if (document.getElementById("dot") != null) {
    document.getElementById("dot").remove();
  }

  document.querySelectorAll(".pagePagination").forEach((elem) => elem.remove());
  document.getElementsByClassName("cards")[0].innerHTML = "";
}

function linkRedirect(elem) {
  let linkPage = elem.textContent;
  clearContent();
  paginationConnect(
    "https://rickandmortyapi.com/api/character/?page=",
    linkPage
  );
}

function paginationPages(xPage) {
  axios
    .get(`https://rickandmortyapi.com/api/character/?page=${xPage}`)
    .then((res) => {
      thisPage = `${xPage}`;
      let counter = 0;

      for (let i = res.data.info.pages; i != 0; i--) {
        if (
          (Number(thisPage) + 5 > i && thisPage - 1 < i) ||
          res.data.info.pages - 5 < i
        ) {
          counter++;
          if (counter <= 10) {
            document
              .getElementById("prev")
              .insertAdjacentHTML(
                "afterend",
                `<span onclick="linkRedirect(this)" class="pagePagination">${i}</span>`
              );
          }
          if (thisPage == i) {
            document
              .getElementsByClassName("pagePagination")[0]
              .classList.add("activePage");
          }
        } else {
          continue;
        }
      }

      if (counter == 10 && thisPage != allPages - 9) {
        document
          .getElementsByClassName("pagePagination")
          [
            document.getElementsByClassName("pagePagination").length / 2 - 1
          ].insertAdjacentHTML("afterend", "<span id='dot'>...</span>");
      }

      if (thisPage >= 1 && thisPage < res.data.info.pages) {
        document.getElementById("next").style.display = "block";
      } else document.getElementById("next").style.display = "none";

      if (thisPage == 1) {
        document.getElementById("prev").style.display = "none";
      } else document.getElementById("prev").style.display = "block";

      if (res.data.info.prev != null && thisPage > 0) {
        document.getElementById("prev").onclick = function () {
          paginationConnect(res.data.info.prev, `${--xPage}`);
          clearContent();
        };
      }

      if (res.data.info.next != null && thisPage < res.data.info.pages) {
        document.getElementById("next").onclick = function () {
          paginationConnect(res.data.info.next, `${++xPage}`);
          clearContent();
        };
      }
    })
    .catch(function (error) {
      alert(error);
    });
}

function paginationConnect(connect, page) {
  axios
    .get(`https://rickandmortyapi.com/api/character/?page=${page}`)
    .then((res) => {
      allPages = res.data.info.pages;
      res.data.results.forEach((element) => {
        let cardsDiv = document.getElementsByClassName("cards")[0];
        let nameCharecter = (document.createElement(
          "span"
        ).textContent = `${element.name}`);
        cardsDiv.innerHTML += `<div class="card" data-id=${element.id} onclick="followUser(this); return false;">
                    <div class="cardContainer">
                    <button type="button" class="btn btn-primary modal-hidden-button" data-bs-toggle="modal" data-bs-target="#exampleModal">
                    </button>
                    <img src="${element.image}" alt="${nameCharecter}" >
                    <div class="characterName">${nameCharecter}</div>
                    </div>
                    </div>`;
      });

      paginationPages(page);
    });
}

document.addEventListener("DOMContentLoaded", function () {
  if (localStorage.getItem("checkToggle") == "true") {
    document.getElementsByClassName("switch")[0].click();
  }

  document.getElementsByClassName("lds-spinner")[0].style.display = "none";
  addCards(currentPage);
});

window.addEventListener("scroll", scrollFunction);
window.addEventListener("scroll", handleInfiniteScroll);
