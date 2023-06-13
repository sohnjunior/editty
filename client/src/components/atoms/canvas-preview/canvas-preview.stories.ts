import { html } from 'lit-html'
import VCanvasPreview from './canvas-preview'

export default {
  title: 'Elements / Canvas Preview',
}

interface Props {
  caption: string
  selected: boolean
}

export const Basic = (
  { caption, selected }: Props,
  { loaded: { imageData } }: { loaded: { imageData: ImageData | undefined } }
) => {
  const lazyLoadImageData = () => {
    setTimeout(() => {
      const $preview = document.querySelector<VCanvasPreview>('v-canvas-preview')
      if ($preview) {
        $preview.imageData = { image: imageData }
      }
    }, 0)
  }

  lazyLoadImageData()

  return html`<v-canvas-preview caption="${caption}" selected="${selected}"></v-canvas-preview>`
}
Basic.args = {
  caption: '프리뷰 설명',
  selected: true,
}
Basic.loaders = [
  async () => ({
    imageData: await getImageData(),
  }),
]

async function getImageData(): Promise<ImageData | undefined> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    canvas.width = 1000
    canvas.height = 1000

    const image = new Image()
    image.src = 'assets/sample/robot.png'
    image.addEventListener('load', () => {
      const ctx = canvas.getContext('2d')
      ctx?.drawImage(image, 0, 0, 900, 900)

      const imageData = ctx?.getImageData(0, 0, 900, 900)
      if (imageData) {
        resolve(imageData)
      } else {
        reject()
      }
    })
  })
}
