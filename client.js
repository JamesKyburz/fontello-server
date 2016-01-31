var $ = window.document.querySelector.bind(window.document)
var body = window.document.body
var baseUrl = `${window.location.protocol}//${window.location.host}`
var copyArea = $('.copy-area')
var download = $('.download')
var hash = $('.hash')
var copyButton = $('.copy')
var Clipboard = window.clipboard
var JSZip = window.jszip
download.onclick = () => {
  if (!hash.value) return
  var xhr = new window.XMLHttpRequest()
  xhr.open('GET', `/${hash.value}/fontello/config.json`)
  xhr.onload = response => {
    if (xhr.status === 200) {
      var a = document.createElement('a')
      a.download = 'config.json'
      a.href = `data:application/json; base64, ${window.btoa(xhr.response)}`
      a.click()
    } else {
      showxhrStatus(xhr)
    }
  }
  xhr.send()
}

window.dragDrop(body, files => {
  var file = files[0]
  if (!file) return
  var reader = new window.FileReader()
  reader.onload = e => {
    var config
    if (file.name.match(/config.*\.json$/)) {
      config = e.target.result
    } else {
      var prefix = file.name.match(/(fontello-[^ .]*)/)
      if (!prefix) return window.alert(`invalid file ${file.name}`)
      var zip = new JSZip(e.target.result)
      config = zip.files[`${prefix[1]}/config.json`].asText()
    }

    var xhr = new window.XMLHttpRequest()
    xhr.open('POST', '/upload/config.json')
    xhr.onload = response => {
      if (xhr.status === 200) {
        copyArea.textContent = ['fontello.css', 'animation.css']
        .map(name => `<link rel="stylesheet" href="${baseUrl}/${xhr.responseText}/fontello/css/${name}" charset="utf-8">`)
        .join('\n')

        hash.value = xhr.responseText
        copyButton.style.display = 'block'

        new Clipboard(copyButton, { text: () => copyArea.textContent })
        .on('success', () => {
          copyButton.textContent = 'Copied!'
          setTimeout(
            () => copyButton.textContent = 'Copy to clipboard',
            1500
          )
        })
      } else {
        showxhrStatus(xhr)
      }
    }
    xhr.send(config)
  }

  reader.readAsArrayBuffer(file)
})

function showxhrStatus (xhr) {
  copyArea.textContent = `error ${xhr.status}`
}
