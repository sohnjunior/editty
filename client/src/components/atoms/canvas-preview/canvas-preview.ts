import { VComponent } from '@/modules/v-component'
import type { ReflectAttributeParam } from '@/modules/v-component/types'

import { reflectSnapshot } from '@/modules/canvas-engine'

const PREVIEW_CONTENT_SIZE = 100

const template = document.createElement('template')
template.innerHTML = `
  <style>
    :host figure {
      display: flex;
      flex-direction: column;
      align-items: center;
      cursor: pointer;
      margin: 0;
      width: fit-content;
    }

    :host figure.selected .figure-content {
      border: 2px solid var(--color-primary30);
    }

    :host figure > .figure-content {
      position: relative;
      box-sizing: border-box;
      border: 2px solid var(--color-gray);
      border-radius: 13px;
      width: ${PREVIEW_CONTENT_SIZE}px;
      height: ${PREVIEW_CONTENT_SIZE}px;
    }

    :host figure > .figure-content > .canvas-container {
      position: relative;
    }

    :host figure > .figure-content > .canvas-container > canvas {
      position: absolute;
      top: 0;
    }

    :host figure > .figure-content > v-icon {
      position: absolute;
      top: 0px;
      right: 0px;
    }

    :host figcaption {
      margin-top: 8px;
      font-size: 13px;
      font-weight: 500;
    }
  </style>
  <figure>
    <div class="figure-content">
      <div class="canvas-container">
        <canvas id="image-canvas" width="100%" height="100%"></canvas>
        <canvas id="drawing-canvas" width="100%" height="100%"></canvas>  
      </div>
      <v-icon icon="close-circle" size="xlarge"></v-icon>
    </div>
    <figcaption></figcaption>
  </figure>
`

export default class VCanvasPreview extends VComponent {
  static tag = 'v-canvas-preview'

  constructor() {
    super(template)
  }

  static get observedAttributes() {
    return ['caption', 'selected']
  }

  get caption() {
    return this.getAttribute('caption') || ''
  }
  set caption(newValue: string) {
    this.setAttribute('caption', newValue)
  }

  get selected() {
    return this.getAttribute('selected') === 'true'
  }
  set selected(newValue: boolean) {
    this.setAttribute('selected', `${newValue}`)
  }

  private _imageData: { drawing?: ImageData; image?: ImageData } = {}
  get imageData() {
    return this._imageData
  }
  set imageData(newValue: { drawing?: ImageData; image?: ImageData }) {
    this._imageData = newValue
    this.reflectImageData(newValue)
  }

  private async reflectImageData(snapshots: { drawing?: ImageData; image?: ImageData }) {
    const $imageCanvas = this.$root.querySelector<HTMLCanvasElement>('#image-canvas')
    const $drawingCanvas = this.$root.querySelector<HTMLCanvasElement>('#drawing-canvas')
    if (!$imageCanvas || !$drawingCanvas) {
      return
    }

    if (snapshots.image) {
      const resizedImageData = await rescaleImageData(
        snapshots.image,
        PREVIEW_CONTENT_SIZE - 10,
        PREVIEW_CONTENT_SIZE - 10
      )
      reflectSnapshot($imageCanvas, resizedImageData)
    }

    if (snapshots.drawing) {
      const resizedImageData = await rescaleImageData(
        snapshots.drawing,
        PREVIEW_CONTENT_SIZE - 10,
        PREVIEW_CONTENT_SIZE - 10
      )
      reflectSnapshot($drawingCanvas, resizedImageData)
    }
  }

  protected bindEventListener() {
    this.$root
      .querySelector('v-icon[icon="close-circle"]')
      ?.addEventListener('click', this.handleClickCloseIcon.bind(this))
  }

  private handleClickCloseIcon(ev: Event) {
    ev.stopPropagation()
    this.dispatchEvent(new CustomEvent('preview:delete', { bubbles: true, composed: true }))
  }

  protected reflectAttribute({ attribute, value }: ReflectAttributeParam) {
    switch (attribute) {
      case 'caption':
        this.updateFigureCaption(value)
        break
      case 'selected':
        this.updateSelectedProp(value)
        break
    }
  }

  private updateFigureCaption(value: string) {
    const $caption = this.$root.querySelector('figcaption')
    if ($caption) {
      $caption.textContent = value
    }
  }

  private updateSelectedProp(newValue: string) {
    if (newValue === 'true') {
      this.$root.classList.add('selected')
    } else {
      this.$root.classList.remove('selected')
    }
  }
}

/**
 * ImageData 를 _targetWidth_ 와 _targetHeight_ 에 맞도록 리스케일링 합니다.
 * @reference
 *  https://stackoverflow.com/questions/55340888/fast-way-to-resize-imagedata-in-browser
 */
function rescaleImageData(originalImageData: ImageData, targetWidth: number, targetHeight: number) {
  const targetImageData = new ImageData(targetWidth, targetHeight)
  const h1 = originalImageData.height
  const w1 = originalImageData.width
  const h2 = targetImageData.height
  const w2 = targetImageData.width
  const kh = h1 / h2
  const kw = w1 / w2
  const cur_img1pixel_sum = new Int32Array(4)

  for (let i2 = 0; i2 < h2; i2 += 1) {
    for (let j2 = 0; j2 < w2; j2 += 1) {
      for (const i in cur_img1pixel_sum) cur_img1pixel_sum[i] = 0
      let cur_img1pixel_n = 0
      for (let i1 = Math.ceil(i2 * kh); i1 < (i2 + 1) * kh; i1 += 1) {
        for (let j1 = Math.ceil(j2 * kw); j1 < (j2 + 1) * kw; j1 += 1) {
          const cur_p1 = (i1 * w1 + j1) * 4
          for (let k = 0; k < 4; k += 1) {
            cur_img1pixel_sum[k] += originalImageData.data[cur_p1 + k]
          }
          cur_img1pixel_n += 1
        }
      }
      const cur_p2 = (i2 * w2 + j2) * 4
      for (let k = 0; k < 4; k += 1) {
        targetImageData.data[cur_p2 + k] = cur_img1pixel_sum[k] / cur_img1pixel_n
      }
    }
  }
  return targetImageData
}
