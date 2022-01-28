// DOM Elements
const modal = document.getElementById('modal')
const modalShow = document.getElementById('show-modal')
const modalClose = document.getElementById('close-modal')
const bookmarkForm = document.getElementById('bookmark-form')
const websiteNameEl = document.getElementById('website-name')
const websiteUrlEl = document.getElementById('website-url')
const bookmarksContainer = document.getElementById('bookmarks-container')
const saveBtn = document.querySelector('button')

let bookmarks = []


// Helpers
function openModal() {
  modal.classList.add('show-modal')
  websiteNameEl.focus()
}

function closeModal() {
  modal.classList.remove('show-modal')
}

function isValidForm({url, name}) {
  if (url === '' || name === '') {
    alert('Please, write both fields!')
    return false
  }

  const pattern = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/

  if (pattern.test(url)) {
      return true
  } else {
    alert("Url is not valid!")
    return false
  }
}

function storeNewBookmark(e) {
  e.preventDefault()
  const websiteNameValue = websiteNameEl.value
  let websiteUrlValue = websiteUrlEl.value

  if (!websiteUrlValue.includes('https://') && !websiteUrlValue.includes('http://')) {
    websiteUrlValue = `https://${websiteUrlValue}`;
  }

  if (isValidForm({url: websiteUrlValue, name: websiteNameValue})) {
    // add in local storage data
    const bookmark = {
      url: websiteUrlValue,
      name: websiteNameValue,
    }

    bookmarks.push(bookmark)

    window.localStorage.setItem('bookmarks', JSON.stringify(bookmarks))

    buildBookmarksDOM()

    websiteNameEl.value = ''
    websiteUrlEl.value = ''
    closeModal()
  }
}

function deleteBookmark(url) {
  bookmarks.forEach((bookmark, idx) => {
    if (bookmark.url === url) {
      bookmarks.splice(idx, 1)
    }
  })

  window.localStorage.setItem('bookmarks', JSON.stringify(bookmarks))
  fetchBookmarks()
}

function buildBookmarksDOM() {
  bookmarksContainer.replaceChildren()
  bookmarks.forEach(bookmark => {
    const {name, url} = bookmark

    const item = document.createElement('div')
    item.classList.add('item')

    const closeIcon = document.createElement('i')
    closeIcon.classList.add('fas', 'fa-times')
    closeIcon.setAttribute('title', 'Delete bookmark')
    closeIcon.setAttribute('onclick', `deleteBookmark('${url}')`)

    const linkInfo = document.createElement('div')
    linkInfo.classList.add('name')

    const favicon = document.createElement('img')
    favicon.setAttribute('src', `https://s2.googleusercontent.com/s2/favicons?domain=${url}`)
    favicon.setAttribute('alt', 'Favicon')

    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('target', '_blank')
    link.textContent = name

    linkInfo.append(favicon, link)
    item.append(closeIcon, linkInfo)
    bookmarksContainer.appendChild(item)
  })
}

function fetchBookmarks() {
  if (window.localStorage.getItem('bookmarks')) {
    const parsed = JSON.parse(window.localStorage.getItem('bookmarks'))
    bookmarks = [...parsed]
  } else {
    const basicBookmarks = [
      {
        url: 'https://www.google.com',
        name: 'Google',
      }
    ]

    bookmarks = [...basicBookmarks]
    window.localStorage.setItem('bookmarks', JSON.stringify(bookmarks))
  }

  buildBookmarksDOM()

  console.log(bookmarks)
}


// Event Listeners
modalShow.addEventListener('click', openModal)
modalClose.addEventListener('click', closeModal)
window.addEventListener('click', (e) => e.target === modal && closeModal())

saveBtn.addEventListener('click', storeNewBookmark)

fetchBookmarks()