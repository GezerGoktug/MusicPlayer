//! DOM ACCESS
const container = document.querySelector(".container");
const image = document.querySelector("#music-image");
const audio = document.querySelector("#audio");
const title = document.querySelector(".title");
const singer = document.querySelector(".singer");
const prev = document.querySelector("#prev");
const play = document.querySelector("#play");
const next = document.querySelector("#next");
const duration = document.querySelector("#duration");
const currentTime = document.querySelector("#current-time");
const progressbar = document.querySelector("#progress-bar");
const volume = document.querySelector("#volume");
const volumebutton = document.querySelector(".volume");
const volumebar = document.querySelector("#volume-bar");
const listbutton = document.querySelector("#list");
const listgroup = document.querySelector(".listgroup");
const listgroupwrapper = document.querySelector(".listgroupwrappers");
//! DOM ACCESS
class music {
  constructor(title, singer, img, musicfile) {
    this.title = title;
    this.singer = singer;
    this.img = img;
    this.musicfile = musicfile;
  }
  getName() {
    return this.title + " - " + this.singer;
  }
}
const musicList = [
  new music("Lost on You", "LP", "lostonyou.jpg", "LPLostOnYou.mp3"),
  new music(
    "Eternal Flame",
    "The Bangles",
    "eternalflames.jpg",
    "TheBanglesEternalFlames.mp3"
  ),
  new music(
    "I don't Mind",
    "Ilkan Gunuc & Osman Altun",
    "dontmind.jpg",
    "Idontmind.mp3"
  ),
  new music(
    "Save me",
    "Mahmut Orhan ft Eneli",
    "saveme.jpg",
    "mahmutorhansaveme.mp3"
  ),
];
class musicPlayer {
  constructor(musiclist) {
    this.musiclist = musiclist;
    this.index = 0;
  }
  getMusic() {
    return this.musiclist[this.index];
  }
  next() {
    if (this.index + 1 != this.musiclist.length) {
      this.index++;
    } else {
      this.index = 0;
    }
  }
  prev() {
    if (this.index == 0) {
      this.index = this.musiclist.length - 1;
    } else {
      this.index--;
    }
  }
}
const player = new musicPlayer(musicList);
let isListClick = false;
let result = "";
let muteState = "unmuted";
class UI {
  //! Müzik resmi, bilgileri ve müzik aynı zamanda ekrana yüklenir ve yazılır
  static display(Music) {
    title.innerHTML = Music.getName();
    singer.innerHTML = Music.singer;
    image.src = "./image/" + Music.img;
    audio.src = "./music/" + Music.musicfile;
  }
  //! Müzik çalındı
  static played() {
    play.classList = "fa-solid fa-pause";
    container.classList.add("playing");
    audio.play();
  }
  //! Müzik duraklatıldı
  static paused() {
    play.classList = "fa-solid fa-play";
    container.classList.remove("playing");
    audio.pause();
  }
  //! Önceki müziği çalar
  static prevMusic() {
    player.prev();
    UI.display(player.getMusic());
    UI.played();
    localStorage.setItem("data", JSON.stringify(player.index));
  }
  //! Sonraki müziği çalar
  static nextMusic() {
    player.next();
    UI.display(player.getMusic());
    UI.played();
    localStorage.setItem("data", JSON.stringify(player.index));
  }
  //! Müziğin ikinci değerini alır ve dakika ve saniyeye çevirir
  static calculateTime(seconds) {
    let minute = Math.floor(seconds / 60);
    let second = Math.floor(seconds % 60);
    let updatedseconds = second < 10 ? `0${second}` : second;
    let result = `${minute}:${updatedseconds}`;
    return result;
  }
  //! Müzik listesinde istenilen müziğe tıklandığında o müziği çalar
  static playedClickSong(event) {
    const songid = event.target.dataset.id;
    player.index = Number(songid);
    UI.display(player.getMusic());
    UI.played();
    localStorage.setItem("data", JSON.stringify(player.index));
  }
  //! Müzik listesini gösterir
  static listShow() {
    isListClick = true;
    listgroup.style.display = "flex";
    player.index = 0;
    musicList.forEach((item) => {
      result += `
            <div data-id="${
              player.index
            }" onclick="UI.playedClickSong(event)" class="listgroupitem">${
        player.index + 1
      }. ${item.getName()}</div>
        </div>`;
      player.next();
    });
    listgroupwrapper.innerHTML = result;
    result = "";
  }
  //! Müzik listesini kaldırır
  static listShowRemove() {
    isListClick = false;
    listgroup.style.display = "none";
  }
}
//! Ekran ilk açıldığında başlangıç müzik bilgisini ekrana yazar. Daha önce herhangi bir müziğe giriş yapmış ve durmuşsanız, bu bilgileri localstorage'dan alıp kaldığınız müzikten devam edebilirsiniz.
window.addEventListener("load", () => {
  const saveddata = JSON.parse(localStorage.getItem("data"));
  if (saveddata) {
    player.index = saveddata;
  }
  UI.display(player.getMusic());
});
//! Oynat düğmesine basıldığında müziği çalar ve tekrar basıldığında durdurur.
play.addEventListener("click", () => {
  const isPlayMusic = container.classList.contains("playing");
  isPlayMusic ? UI.paused() : UI.played();
});
//! Geri düğmesine basıldığında listedeki bir önceki müziğe döner
prev.addEventListener("click", () => {
  UI.prevMusic();
});
//! İleri düğmesine basıldığında listedeki bir sonraki şarkıyı çalar
next.addEventListener("click", () => {
  UI.nextMusic();
});
audio.addEventListener("loadedmetadata", () => {
  duration.textContent = UI.calculateTime(audio.duration);
  progressbar.max = Math.floor(audio.duration);
});
//! Şarkı çalınırken her saniye güncellendiğinde, saniye değerini güncel saniye bölümüne yazarak sürekli güncellenen şarkının ilerleyen saniye değeri olmasını sağlar.
audio.addEventListener("timeupdate", () => {
  progressbar.value = Math.floor(audio.currentTime);
  currentTime.textContent = UI.calculateTime(progressbar.value);
  progressbar.value === progressbar.max ? UI.nextMusic() : "";
});
//! Müzik çubuğunun herhangi bir yerine tıkladığımızda, ilgili yerin müziğe orantılı olarak konumlandırılmasını sağlar
progressbar.addEventListener("input", (e) => {
  currentTime.textContent = UI.calculateTime(progressbar.value);
  audio.currentTime = progressbar.value;
});
//! Ses çubuğunun herhangi bir yerine tıkladığımızda, sesi orantılı olarak azaltır ve arttırır.
volumebar.addEventListener("input", (e) => {
  const volumeValue = e.target.value;
  audio.volume = volumeValue / 100;
  if (volumeValue == 0) {
    audio.muted = true;
    muteState = "muted";
    volume.classList = "fa-solid fa-volume-xmark";
  } else {
    audio.muted = false;
    muteState = "unmuted";
    volume.classList = "fa-solid fa-volume-high";
  }
});
//! Ses düğmesine tıklandığında sesi açar veya kapatır
volumebutton.addEventListener("click", () => {
  if (muteState === "unmuted") {
    audio.muted = true;
    muteState = "muted";
    volume.classList = "fa-solid fa-volume-xmark";
    volumebar.value = 0;
  } else {
    audio.muted = false;
    muteState = "unmuted";
    volume.classList = "fa-solid fa-volume-high";
    volumebar.value = 100;
  }
});
//! List düğmesine tıklandığında liste açılır veya kapanır
listbutton.addEventListener("click", () => {
  isListClick ? UI.listShowRemove() : UI.listShow();
});
