export function uploadFiles(files) {
  files = files.filter(file => file["filename"] != "index.js")

  let promises = files.map(file => {
    fetch(`/${file["filename"]}`, {
      method: 'POST',
      headers: {},
      body: file["code"]
    })
  })

  return Promise.all(promises)
}
