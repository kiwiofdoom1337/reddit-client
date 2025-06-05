let winCont = document.getElementById("winCont");
let showAddWinBtn = document.getElementById("showAddWinBtn");
let addWin = document.getElementById("addWin");
let addWinBtn = document.getElementById("addWinBtn");
let addWinInput = document.getElementById("addWindowInput");
let windowCount = 0;

showAddWinBtn.addEventListener("click", () => {
  addWin.classList.remove("hidden");
});

addWinBtn.addEventListener("click", () => {
  addWinBtn.style.pointerEvents = "none";
  document.body.style.cursor = "wait";
  fetch(`https://www.reddit.com/r/${addWinInput.value}.json`)
    .then((result) => {
      if (!result.ok) {
        throw new Error("Couldn't fetch data");
      }
      return result.json();
    })
    .then((json) => {
      console.log(json);
      let newDiv = document.createElement("div");
      newDiv.classList.add("example-window");
      let newWinTitle = document.createElement("div");
      newWinTitle.classList.add("new-win-title");
      let subredditName = document.createElement("div");
      subredditName.innerHTML = `/r/${json.data.children[0].data.subreddit}`;

      addWinInput.value = "";

      let subListSettings = document.createElement("img");
      subListSettings.classList.add("sublist-settings-btn");
      subListSettings.src = "./three-dots-vertical-svgrepo-com.svg";
      subListSettings.style.width = "16px";

      let newList = document.createElement("div");
      newList.classList.add("list");

      winCont.prepend(newDiv);
      newDiv.prepend(newWinTitle);
      newDiv.append(newList);
      newWinTitle.prepend(subListSettings);
      newWinTitle.prepend(subredditName);
      windowCount += 1;

      for (
        let i = 0, arrayLength = json.data.children.length;
        i < arrayLength;
        i++
      ) {
        let newListItem = document.createElement("div");
        newListItem.classList.add("list-item");
        let upvotes = document.createElement("div");
        upvotes.classList.add("upvotes");
        let upvotesIco = document.createElement("div");
        upvotesIco.classList.add("upvotes-icon");
        upvotesIco.innerHTML = "^";
        let upvotesCount = document.createElement("div");
        upvotesCount.classList.add("upvotes-count");
        let author = document.createElement("div");
        author.classList.add("author");

        newListItem.innerHTML = json.data.children[i].data.title;
        upvotesCount.innerHTML = json.data.children[i].data.ups;
        author.innerHTML = `u/${json.data.children[i].data.author}`;

        upvotes.append(upvotesIco);
        upvotes.append(upvotesCount);

        newListItem.prepend(upvotes);
        newListItem.prepend(author);

        newList.append(newListItem);
      }
      addWinBtn.style.pointerEvents = "auto";
      document.body.style.cursor = "default";

      localStorage.setItem(`${json.data.children[0].data.subreddit}`, `open`);
      let order = JSON.parse(localStorage.getItem("keyOrder") || "[]");
      if (!order.includes(`${json.data.children[0].data.subreddit}`)) {
        order.push(`${json.data.children[0].data.subreddit}`);
      }
      localStorage.setItem("keyOrder", JSON.stringify(order));

      subListSettings.addEventListener("click", () => {
        const existingSettings = newWinTitle.querySelector(".settings-window");

        if (existingSettings) {
          existingSettings.remove();
          return;
        }

        let settings = document.createElement("div");
        settings.classList.add("settings-window");

        let refreshBtn = document.createElement("div");
        refreshBtn.innerHTML = "Refresh";
        refreshBtn.addEventListener("click", () => {
          refreshBtn.style.pointerEvents = "none";
          document.body.style.cursor = "wait";
          fetch(
            `https://www.reddit.com/r/${json.data.children[0].data.subreddit}.json`
          )
            .then((result) => {
              if (!result.ok) {
                throw new Error("Couldn't fetch data");
              }
              return result.json();
            })

            .then((json) => {
              console.log("refresh");
              subredditName.innerHTML = `/r/${json.data.children[0].data.subreddit}`;
              const existingSettings =
                newWinTitle.querySelector(".settings-window");
              existingSettings.remove();
              newList.innerHTML = "";

              for (
                let i = 0, arrayLength = json.data.children.length;
                i < arrayLength;
                i++
              ) {
                let newListItem = document.createElement("div");
                newListItem.classList.add("list-item");
                let upvotes = document.createElement("div");
                upvotes.classList.add("upvotes");
                let upvotesIco = document.createElement("div");
                upvotesIco.classList.add("upvotes-icon");
                upvotesIco.innerHTML = "^";
                let upvotesCount = document.createElement("div");
                upvotesCount.classList.add("upvotes-count");
                let author = document.createElement("div");
                author.classList.add("author");

                newListItem.innerHTML = json.data.children[i].data.title;
                upvotesCount.innerHTML = json.data.children[i].data.ups;
                author.innerHTML = `u/${json.data.children[i].data.author}`;

                upvotes.append(upvotesIco);
                upvotes.append(upvotesCount);

                newListItem.prepend(upvotes);
                newListItem.prepend(author);

                newList.append(newListItem);
              }
              refreshBtn.style.pointerEvents = "auto";
              document.body.style.cursor = "default";
            });
        });

        let deleteBtn = document.createElement("div");
        deleteBtn.innerHTML = "Delete";
        deleteBtn.addEventListener("click", () => {
          let exaWin = deleteBtn.closest(".example-window");
          if (exaWin) {
            exaWin.remove();
            localStorage.removeItem(`${json.data.children[0].data.subreddit}`);
          }
        });

        newWinTitle.prepend(settings);
        settings.prepend(deleteBtn);
        settings.prepend(refreshBtn);
      });

      if (windowCount === 6) {
        addWinBtn.style.opacity = 0.7;
        addWinBtn.style.cursor = "not-allowed";
        addWinBtn.disabled = true;
      }
    })
    .catch((error) => {
      console.error(error);
      addWinBtn.style.pointerEvents = "auto";
      document.body.style.cursor = "default";
    });
});

window.addEventListener("load", () => {
  let subArray = JSON.parse(localStorage.getItem("keyOrder")) || [];
  console.log(JSON.parse(localStorage.getItem("keyOrder")));

  if (subArray.length === 0) return;

  let fetchPromises = subArray.map((subreddit) =>
    fetch(`https://www.reddit.com/r/${subreddit}.json`)
      .then((result) => {
        if (!result.ok) throw new Error(`Couldn't fetch data for ${subreddit}`);
        return result.json();
      })
      .catch((error) => {
        console.error(err);
        return null;
      })
  );

  Promise.all(fetchPromises).then((results) => {
    results.forEach((json) => {
      if (!json) return;

      let newDiv = document.createElement("div");
      newDiv.classList.add("example-window");
      let newWinTitle = document.createElement("div");
      newWinTitle.classList.add("new-win-title");
      let subredditName = document.createElement("div");
      subredditName.innerHTML = `/r/${json.data.children[0].data.subreddit}`;

      addWinInput.value = "";

      let subListSettings = document.createElement("img");
      subListSettings.classList.add("sublist-settings-btn");
      subListSettings.src = "./three-dots-vertical-svgrepo-com.svg";
      subListSettings.style.width = "16px";

      let newList = document.createElement("div");
      newList.classList.add("list");

      winCont.prepend(newDiv);
      newDiv.prepend(newWinTitle);
      newDiv.append(newList);
      newWinTitle.prepend(subListSettings);
      newWinTitle.prepend(subredditName);
      windowCount += 1;
      if (windowCount === 6) {
        addWinBtn.style.opacity = 0.7;
        addWinBtn.style.cursor = "not-allowed";
        addWinBtn.disabled = true;
      }

      for (
        let i = 0, arrayLength = json.data.children.length;
        i < arrayLength;
        i++
      ) {
        let newListItem = document.createElement("div");
        newListItem.classList.add("list-item");
        let upvotes = document.createElement("div");
        upvotes.classList.add("upvotes");
        let upvotesIco = document.createElement("div");
        upvotesIco.classList.add("upvotes-icon");
        upvotesIco.innerHTML = "^";
        let upvotesCount = document.createElement("div");
        upvotesCount.classList.add("upvotes-count");
        let author = document.createElement("div");
        author.classList.add("author");

        newListItem.innerHTML = json.data.children[i].data.title;
        upvotesCount.innerHTML = json.data.children[i].data.ups;
        author.innerHTML = `u/${json.data.children[i].data.author}`;

        upvotes.append(upvotesIco);
        upvotes.append(upvotesCount);

        newListItem.prepend(upvotes);
        newListItem.prepend(author);

        newList.append(newListItem);
      }

      subListSettings.addEventListener("click", () => {
        const existingSettings = newWinTitle.querySelector(".settings-window");

        if (existingSettings) {
          existingSettings.remove();
          return;
        }

        let settings = document.createElement("div");
        settings.classList.add("settings-window");

        let refreshBtn = document.createElement("div");
        refreshBtn.innerHTML = "Refresh";
        refreshBtn.addEventListener("click", () => {
          refreshBtn.style.pointerEvents = "none";
          document.body.style.cursor = "wait";
          fetch(
            `https://www.reddit.com/r/${json.data.children[0].data.subreddit}.json`
          )
            .then((result) => {
              if (!result.ok) {
                throw new Error("Couldn't fetch data");
              }
              return result.json();
            })

            .then((json) => {
              console.log("refresh");
              subredditName.innerHTML = `/r/${json.data.children[0].data.subreddit}`;
              const existingSettings =
                newWinTitle.querySelector(".settings-window");
              existingSettings.remove();
              newList.innerHTML = "";

              for (
                let i = 0, arrayLength = json.data.children.length;
                i < arrayLength;
                i++
              ) {
                let newListItem = document.createElement("div");
                newListItem.classList.add("list-item");
                let upvotes = document.createElement("div");
                upvotes.classList.add("upvotes");
                let upvotesIco = document.createElement("div");
                upvotesIco.classList.add("upvotes-icon");
                upvotesIco.innerHTML = "^";
                let upvotesCount = document.createElement("div");
                upvotesCount.classList.add("upvotes-count");
                let author = document.createElement("div");
                author.classList.add("author");

                newListItem.innerHTML = json.data.children[i].data.title;
                upvotesCount.innerHTML = json.data.children[i].data.ups;
                author.innerHTML = `u/${json.data.children[i].data.author}`;

                upvotes.append(upvotesIco);
                upvotes.append(upvotesCount);

                newListItem.prepend(upvotes);
                newListItem.prepend(author);

                newList.append(newListItem);
              }
              refreshBtn.style.pointerEvents = "auto";
              document.body.style.cursor = "default";
            })
            .catch((error) => {
              console.log(error);
              addWinBtn.style.pointerEvents = "auto";
              document.body.style.cursor = "default";
            });
        });

        let deleteBtn = document.createElement("div");
        deleteBtn.innerHTML = "Delete";
        deleteBtn.addEventListener("click", () => {
          let exaWin = deleteBtn.closest(".example-window");
          if (exaWin) {
            exaWin.remove();
            localStorage.removeItem(`${json.data.children[0].data.subreddit}`);
          }
          windowCount--;

          if (windowCount < 6) {
            addWinBtn.style.opacity = 1;
            addWinBtn.style.cursor = "pointer";
            addWinBtn.disabled = false;
            addWinBtn.style.pointerEvents = "auto";
          }
        });

        newWinTitle.prepend(settings);
        settings.prepend(deleteBtn);
        settings.prepend(refreshBtn);
      });
    });
  });
});
