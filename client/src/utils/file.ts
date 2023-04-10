export async function readAsDataURL(file: File) {
  return new Promise<FileReader['result']>((resolve, reject) => {
    const fileReader = new FileReader()
    fileReader.onload = () => {
      resolve(fileReader.result)
    }
    fileReader.onerror = () => {
      reject()
    }

    fileReader.readAsDataURL(file)
  })
}

/**
 * 디바이스로부터 선택된 이미지 파일들을 base64 인코딩된 dataUrl 형태로 반환합니다.
 * @accept png, jpg, jpeg
 */
export async function selectImageFromDevice() {
  return new Promise<FileReader['result'][]>((resolve, reject) => {
    const $input = document.createElement('input')
    $input.setAttribute('type', 'file')
    $input.setAttribute('accept', 'image/png, image/jpeg, image/jpg')
    $input.setAttribute('multiple', 'true')
    $input.onchange = async () => {
      try {
        const jobs = Array.from($input.files ?? []).map((file) => readAsDataURL(file))
        const dataUrls = await Promise.all(jobs)

        resolve(dataUrls)
      } catch (err) {
        console.error(`🚨 error occur on file reader`, err)
        reject(err)
      }
    }

    $input.click()
  })
}
